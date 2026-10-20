import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  SERVICE_IDS,
  TESTIMONIAL_LIMITS,
  TESTIMONIAL_RECIPIENT,
  buildTestimonialMailto,
  buildTestimonialMessage,
  validateTestimonialSubmission,
  type FieldError,
  type TestimonialSubmission,
} from './testimonialSubmission.ts';

const valid = (): TestimonialSubmission => ({
  name: 'M. González',
  email: '  Visitor@Example.com ',
  serviceId: 'planning',
  text: 'La orientación fue clara y me ayudó a organizar mis decisiones financieras.',
});

const errorsFor = (overrides: Partial<TestimonialSubmission>): FieldError[] => {
  const result = validateTestimonialSubmission({ ...valid(), ...overrides });
  return result.ok ? [] : result.errors;
};

test('accepts a complete submission and normalizes its fields', () => {
  const result = validateTestimonialSubmission({ ...valid(), name: '  M.   González ', text: 'Línea uno\r\n' + 'x'.repeat(30) });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.name, 'M. González');
    // The email is kept as typed; only surrounding spaces are removed.
    assert.equal(result.value.email, 'Visitor@Example.com');
    assert.equal(result.value.text, 'Línea uno\n' + 'x'.repeat(30));
    assert.equal(result.value.serviceId, 'planning');
    assert.deepEqual(Object.keys(result.value).sort(), ['email', 'name', 'serviceId', 'text']);
  }
});

test('requires every visible field', () => {
  const result = validateTestimonialSubmission({});
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.deepEqual(result.errors, [
      { field: 'name', code: 'required' },
      { field: 'email', code: 'required' },
      { field: 'serviceId', code: 'required' },
      { field: 'text', code: 'required' },
    ]);
  }
  assert.deepEqual(errorsFor({ name: '   ' }), [{ field: 'name', code: 'required' }]);
});

test('enforces name rules', () => {
  assert.deepEqual(errorsFor({ name: 'A' }), [{ field: 'name', code: 'too_short' }]);
  assert.deepEqual(errorsFor({ name: 'a'.repeat(TESTIMONIAL_LIMITS.nameMax + 1) }), [{ field: 'name', code: 'too_long' }]);
  assert.deepEqual(errorsFor({ name: '<b>Ana</b>' }), [{ field: 'name', code: 'invalid' }]);
  assert.deepEqual(errorsFor({ name: 'Ana 123' }), [{ field: 'name', code: 'invalid' }]);
  assert.deepEqual(errorsFor({ name: 'J.-L. O’Neill' }), []);
});

test('enforces email rules', () => {
  assert.deepEqual(errorsFor({ email: 'not-an-email' }), [{ field: 'email', code: 'invalid' }]);
  assert.deepEqual(errorsFor({ email: 'a@b' }), [{ field: 'email', code: 'invalid' }]);
  assert.deepEqual(errorsFor({ email: 'a b@example.com' }), [{ field: 'email', code: 'invalid' }]);
  assert.deepEqual(
    errorsFor({ email: `${'a'.repeat(64)}@${'b'.repeat(TESTIMONIAL_LIMITS.emailMax)}.com` }),
    [{ field: 'email', code: 'too_long' }],
  );
});

test('accepts only the agreed service options', () => {
  for (const serviceId of SERVICE_IDS) assert.deepEqual(errorsFor({ serviceId }), [], serviceId);
  assert.deepEqual(errorsFor({ serviceId: 'unknown' }), [{ field: 'serviceId', code: 'invalid' }]);
});

test('enforces testimonial text rules', () => {
  assert.deepEqual(errorsFor({ text: 'Muy breve' }), [{ field: 'text', code: 'too_short' }]);
  // Length is counted in characters, not UTF-16 code units.
  assert.deepEqual(errorsFor({ text: 'á'.repeat(TESTIMONIAL_LIMITS.textMax) }), []);
  assert.deepEqual(errorsFor({ text: 'á'.repeat(TESTIMONIAL_LIMITS.textMax + 1) }), [{ field: 'text', code: 'too_long' }]);
  assert.deepEqual(errorsFor({ text: `${'x'.repeat(40)}\u0007` }), [{ field: 'text', code: 'invalid' }]);
});


// Fictitious recipient (reserved .example domain); the real one is configured in TESTIMONIAL_RECIPIENT.
const FAKE_RECIPIENT = 'testimonials@recipient.example';

test('recipient stays empty until the final address is confirmed, and no mailto is built without one', () => {
  assert.equal(TESTIMONIAL_RECIPIENT, '');
  const result = validateTestimonialSubmission(valid());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const message = buildTestimonialMessage(result.value, 'es', 'Planeación financiera');
  assert.equal(buildTestimonialMailto(message), null);
  assert.equal(buildTestimonialMailto(message, ''), null);
  assert.equal(buildTestimonialMailto(message, '   '), null);
});

// Disabled state: the component must keep both actions off while the switch is off or the recipient is empty.
const componentSource = readFileSync(new URL('../components/Testimonials.tsx', import.meta.url), 'utf8');

test('submission actions are switched off and guarded by the recipient', () => {
  assert.match(componentSource, /const SUBMISSIONS_ENABLED = false;/);
  assert.match(componentSource, /const ACTIONS_ENABLED = SUBMISSIONS_ENABLED && TESTIMONIAL_RECIPIENT\.trim\(\) !== '';/);
  assert.equal((componentSource.match(/if \(!ACTIONS_ENABLED\) return;/g) ?? []).length, 2);
  assert.equal((componentSource.match(/disabled=\{!ACTIONS_ENABLED\}/g) ?? []).length, 2);
});

const mailtoParts = (link: string) => {
  const [address, query] = link.slice('mailto:'.length).split('?');
  const params = Object.fromEntries(query.split('&').map((pair) => {
    const [key, value] = pair.split('=');
    return [key, decodeURIComponent(value)];
  }));
  return { address, query, subject: params.subject, body: params.body };
};

test('builds a mailto link with encoded subject and body', () => {
  const result = validateTestimonialSubmission({
    ...valid(),
    name: 'José Pérez',
    text: 'Línea uno & más?\nLínea dos #1 con 100% de confianza, ¡gracias!',
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const link = buildTestimonialMailto(buildTestimonialMessage(result.value, 'es', 'Planeación financiera'), FAKE_RECIPIENT);
  assert.ok(link);
  const { address, query, subject, body } = mailtoParts(link);
  assert.equal(address, FAKE_RECIPIENT);
  // Only the two parameters; special characters are percent-encoded inside them.
  assert.deepEqual(query.split('&').map((pair) => pair.split('=')[0]), ['subject', 'body']);
  assert.ok(!/[\s&?#%](?![0-9A-F]{2})/.test(query.replace(/^subject=|&body=/g, '')));
  assert.equal(subject, 'Testimonio para el sitio web: José Pérez');
  assert.equal(body, [
    'Nombre público o iniciales: José Pérez',
    'Correo de contacto: Visitor@Example.com',
    'Servicio contratado: Planeación financiera',
    '',
    'Testimonio:',
    'Línea uno & más?',
    'Línea dos #1 con 100% de confianza, ¡gracias!',
    '',
    'Autorizo la posible publicación de este testimonio en el sitio. Puede editarse ligeramente para mayor claridad, sin cambiar su significado. Mi correo no se publicará.',
  ].join('\r\n'));
});

test('uses the English template for English submissions', () => {
  const result = validateTestimonialSubmission(valid());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const link = buildTestimonialMailto(buildTestimonialMessage(result.value, 'en', 'Financial Planning'), FAKE_RECIPIENT);
  assert.ok(link);
  const { subject, body } = mailtoParts(link);
  assert.equal(subject, 'Testimonial for the website: M. González');
  assert.ok(body.startsWith('Public name or initials: M. González\r\nContact email: Visitor@Example.com\r\nContracted service: Financial Planning'));
  assert.ok(body.endsWith('My email will not be published.'));
});

test('"Copy message" text is the prepared body with plain line breaks', () => {
  const result = validateTestimonialSubmission(valid());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const { body } = buildTestimonialMessage(result.value, 'es', 'Planeación financiera');
  assert.ok(!body.includes('\r'));
  assert.ok(body.includes('Correo de contacto: Visitor@Example.com\nServicio contratado: Planeación financiera'));
  assert.ok(body.includes(result.value.text));
});


// Translation parity: reads both dictionaries from LanguageContext.tsx.
const languageSource = readFileSync(new URL('../context/LanguageContext.tsx', import.meta.url), 'utf8');

const dictionary = (language: 'es' | 'en'): Map<string, string> => {
  const start = languageSource.indexOf(`    ${language}: {`);
  assert.notEqual(start, -1, `missing ${language} dictionary`);
  const block = languageSource.slice(start, languageSource.indexOf('\n    },', start));
  const entries = new Map<string, string>();
  for (const match of block.matchAll(/'([^']+)':\s*'((?:[^'\\]|\\.)*)'/g)) entries.set(match[1], match[2]);
  return entries;
};

test('ES and EN define the same non-empty testimonial and form texts', () => {
  const es = dictionary('es');
  const en = dictionary('en');
  const keysOf = (entries: Map<string, string>) =>
    [...entries.keys()].filter((key) => key.startsWith('testimonials.')).sort();
  assert.deepEqual(keysOf(es), keysOf(en));

  const required = [
    'testimonials.share',
    'testimonials.form.close',
    'testimonials.form.submit',
    'testimonials.form.mailHint',
    'testimonials.form.unavailable',
    'testimonials.form.copy',
    'testimonials.form.copied',
    'testimonials.form.copyFailed',
    ...[1, 2, 3].flatMap((n) => ['Name', 'Role', 'Content'].map((field) => `testimonials.t${n}${field}`)),
    ...SERVICE_IDS.map((id) =>
      id === 'other' || id === 'unspecified' ? `testimonials.form.service.${id}` : `services.${id}`),
  ];
  for (const [language, entries] of [['es', es], ['en', en]] as const) {
    for (const key of required) assert.ok(entries.get(key)?.trim(), `${language} is missing ${key}`);
  }
});

test('every validation error the form can show has an ES and EN message', () => {
  const codes: Array<[string, string[]]> = [
    ['name', ['required', 'too_short', 'too_long', 'invalid']],
    ['email', ['required', 'too_long', 'invalid']],
    ['serviceId', ['required', 'invalid']],
    ['text', ['required', 'too_short', 'too_long', 'invalid']],
  ];
  for (const language of ['es', 'en'] as const) {
    const entries = dictionary(language);
    for (const [field, fieldCodes] of codes) {
      for (const code of fieldCodes) {
        const key = `testimonials.form.error.${field}.${code}`;
        assert.ok(entries.get(key)?.trim(), `${language} is missing ${key}`);
      }
    }
  }
});
