import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  SERVICE_IDS,
  TESTIMONIAL_LIMITS,
  TESTIMONIAL_NOTICE_VERSION,
  validateTestimonialSubmission,
  type FieldError,
  type TestimonialSubmission,
} from './testimonialSubmission.ts';

const valid = (): TestimonialSubmission => ({
  name: 'M. González',
  email: '  Visitor@Example.com ',
  serviceId: 'planning',
  text: 'La orientación fue clara y me ayudó a organizar mis decisiones financieras.',
  noticeVersion: TESTIMONIAL_NOTICE_VERSION,
  language: 'es',
  honeypot: '',
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
    assert.equal(result.value.email, 'visitor@example.com');
    assert.equal(result.value.text, 'Línea uno\n' + 'x'.repeat(30));
    assert.equal(result.value.serviceId, 'planning');
    assert.equal(result.value.language, 'es');
  }
});

test('requires every visible field', () => {
  const result = validateTestimonialSubmission({ noticeVersion: TESTIMONIAL_NOTICE_VERSION, language: 'en' });
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

test('rejects an outdated notice version or unsupported language', () => {
  assert.deepEqual(errorsFor({ noticeVersion: '2000-01-01' }), [{ field: 'form', code: 'notice' }]);
  assert.deepEqual(errorsFor({ language: 'fr' }), [{ field: 'form', code: 'invalid' }]);
});

test('flags a filled honeypot', () => {
  const result = validateTestimonialSubmission({ ...valid(), honeypot: 'bot' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.honeypot, true);
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
    'testimonials.form.unavailable',
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
    ['form', ['notice', 'invalid']],
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
