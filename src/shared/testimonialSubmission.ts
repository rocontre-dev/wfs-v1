export const TESTIMONIAL_NOTICE_VERSION = '2026-10-17';

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
  honeypotMax: 200,
} as const;

export type TestimonialField = 'name' | 'email' | 'serviceId' | 'text' | 'form';

export interface TestimonialSubmission {
  name: string;
  email: string;
  serviceId: string;
  text: string;
  noticeVersion: string;
  language: string;
  honeypot: string;
}

export interface FieldError {
  field: TestimonialField;
  code: 'required' | 'too_short' | 'too_long' | 'invalid' | 'honeypot' | 'notice';
}

export interface ValidatedTestimonial {
  name: string;
  email: string;
  serviceId: ServiceId;
  text: string;
  noticeVersion: typeof TESTIMONIAL_NOTICE_VERSION;
  language: TestimonialLanguage;
}

export type ValidationResult =
  | { ok: true; value: ValidatedTestimonial }
  | { ok: false; errors: FieldError[]; honeypot: boolean };

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
  const honeypot = typeof source.honeypot === 'string' ? source.honeypot : '';

  if (honeypot !== '') push(errors, 'form', 'honeypot');
  if (honeypot.length > TESTIMONIAL_LIMITS.honeypotMax) push(errors, 'form', 'too_long');

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

  const email =
    typeof source.email === 'string' ? source.email.normalize('NFC').trim().toLowerCase() : '';
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

  if (source.noticeVersion !== TESTIMONIAL_NOTICE_VERSION) push(errors, 'form', 'notice');

  const language = source.language === 'es' || source.language === 'en' ? source.language : '';
  if (!language) push(errors, 'form', 'invalid');

  if (errors.length > 0) return { ok: false, errors, honeypot: honeypot !== '' };

  return {
    ok: true,
    value: {
      name,
      email,
      serviceId: serviceId as ServiceId,
      text,
      noticeVersion: TESTIMONIAL_NOTICE_VERSION,
      language: language as TestimonialLanguage,
    },
  };
}
