export const TESTIMONIAL_NOTICE = {
  es: 'Al enviar tu testimonio, autorizas su posible publicación en este sitio. Podremos editarlo ligeramente para mayor claridad, sin cambiar su significado. Tu correo no se publicará. El envío no garantiza su publicación.',
  en: 'By submitting your testimonial, you authorize its possible publication on this site. We may lightly edit it for clarity without changing its meaning. Your email will not be published. Submission does not guarantee publication.',
} as const;

export const SERVICE_IDS = [
  'insurance',
  'investments',
  'retirement',
  'business',
  'planning',
  'protection',
  'family',
  'other',
  'unspecified',
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];
export type TestimonialLanguage = keyof typeof TESTIMONIAL_NOTICE;

export const TESTIMONIAL_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  textMin: 30,
  textMax: 1500,
} as const;

export type TestimonialField = 'name' | 'email' | 'serviceId' | 'text';

export interface TestimonialSubmission {
  name: string;
  email: string;
  serviceId: string;
  text: string;
}

export interface FieldError {
  field: TestimonialField;
  code: 'required' | 'too_short' | 'too_long' | 'invalid';
}

export interface ValidatedTestimonial {
  name: string;
  email: string;
  serviceId: ServiceId;
  text: string;
}

export type ValidationResult =
  | { ok: true; value: ValidatedTestimonial }
  | { ok: false; errors: FieldError[] };

function hasDisallowedControl(value: string): boolean {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    const isControl = (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
    if (isControl) return true;
  }
  return false;
}
const NAME_CHARS = /^[\p{L}\p{M}][\p{L}\p{M} .''’-]*[\p{L}\p{M}.]$/u;
const EMAIL_RE =
  /^[^\s@]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

function normalizeSpaces(value: string): string {
  return value.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function isServiceId(value: string): value is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(value);
}

function push(errors: FieldError[], field: TestimonialField, code: FieldError['code']): void {
  if (!errors.some((error) => error.field === field && error.code === code)) {
    errors.push({ field, code });
  }
}

export function validateTestimonialSubmission(
  input: Partial<TestimonialSubmission> | null | undefined,
): ValidationResult {
  const errors: FieldError[] = [];
  const source = input ?? {};

  const name = typeof source.name === 'string' ? normalizeSpaces(source.name) : '';
  if (!name) {
    push(errors, 'name', 'required');
  } else if ([...name].length < TESTIMONIAL_LIMITS.nameMin) {
    push(errors, 'name', 'too_short');
  } else if ([...name].length > TESTIMONIAL_LIMITS.nameMax) {
    push(errors, 'name', 'too_long');
  } else if (hasDisallowedControl(name) || !NAME_CHARS.test(name)) {
    push(errors, 'name', 'invalid');
  }

  // Kept exactly as typed, apart from leading and trailing spaces.
  const email = typeof source.email === 'string' ? source.email.trim() : '';
  if (!email) {
    push(errors, 'email', 'required');
  } else if ([...email].length > TESTIMONIAL_LIMITS.emailMax) {
    push(errors, 'email', 'too_long');
  } else if (hasDisallowedControl(email) || !EMAIL_RE.test(email)) {
    push(errors, 'email', 'invalid');
  }

  const serviceId = typeof source.serviceId === 'string' ? source.serviceId.trim() : '';
  if (!serviceId) push(errors, 'serviceId', 'required');
  else if (!isServiceId(serviceId)) push(errors, 'serviceId', 'invalid');

  const text =
    typeof source.text === 'string' ? source.text.normalize('NFC').replace(/\r\n?/g, '\n').trim() : '';
  const textLength = [...text].length;
  if (!text) {
    push(errors, 'text', 'required');
  } else if (textLength < TESTIMONIAL_LIMITS.textMin) {
    push(errors, 'text', 'too_short');
  } else if (textLength > TESTIMONIAL_LIMITS.textMax) {
    push(errors, 'text', 'too_long');
  } else if (hasDisallowedControl(text)) {
    push(errors, 'text', 'invalid');
  }

  if (errors.length > 0) return { ok: false, errors };

  return { ok: true, value: { name, email, serviceId: serviceId as ServiceId, text } };
}

// Recipient of the prepared email (Goyo's final address). It is visible in the page source (mailto is
// public). If it is ever left empty, the form cannot open mailto or copy the message.
// See docs/testimonial-email.md.
export const TESTIMONIAL_RECIPIENT: string = 'goyo.lenero1@gmail.com';

const MAIL_TEXT = {
  es: {
    subject: 'Testimonio para el sitio web',
    name: 'Nombre público o iniciales',
    email: 'Correo de contacto',
    service: 'Servicio contratado',
    text: 'Testimonio',
    consent: 'Autorizo la posible publicación de este testimonio en el sitio. Puede editarse ligeramente para mayor claridad, sin cambiar su significado. Mi correo no se publicará.',
  },
  en: {
    subject: 'Testimonial for the website',
    name: 'Public name or initials',
    email: 'Contact email',
    service: 'Contracted service',
    text: 'Testimonial',
    consent: 'I authorize the possible publication of this testimonial on the site. It may be lightly edited for clarity without changing its meaning. My email will not be published.',
  },
} as const;

// Prepared message, used both for the mailto link and for "Copy message". The email typed in the form is
// only contact information inside the message; the visitor's mail app decides which account sends it.
export function buildTestimonialMessage(
  value: ValidatedTestimonial,
  language: TestimonialLanguage,
  serviceLabel: string,
): { subject: string; body: string } {
  const text = MAIL_TEXT[language];
  return {
    subject: `${text.subject}: ${value.name}`,
    body: [
      `${text.name}: ${value.name}`,
      `${text.email}: ${value.email}`,
      `${text.service}: ${serviceLabel}`,
      '',
      `${text.text}:`,
      value.text,
      '',
      text.consent,
    ].join('\n'),
  };
}

// Subject and body are encoded separately so accents, line breaks and characters such as & ? # survive.
// mailto bodies use CRLF line breaks (RFC 6068). Returns null without a recipient, so no link to an
// empty address can be built.
export function buildTestimonialMailto(
  { subject, body }: { subject: string; body: string },
  recipient: string = TESTIMONIAL_RECIPIENT,
): string | null {
  if (recipient.trim() === '') return null;
  return `mailto:${recipient.trim()}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;
}
