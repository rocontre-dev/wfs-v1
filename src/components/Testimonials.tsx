import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  SERVICE_IDS,
  TESTIMONIAL_LIMITS,
  TESTIMONIAL_NOTICE,
  TESTIMONIAL_NOTICE_VERSION,
  validateTestimonialSubmission,
  type FieldError,
  type ServiceId,
  type TestimonialField,
  type TestimonialSubmission,
} from '../shared/testimonialSubmission';
import styles from './Testimonials.module.css';

// Stays false until a server endpoint exists and the form sends a real request to it.
const SUBMISSION_ENABLED = false;

const FORM_PANEL_ID = 'testimonial-form-panel';
const FIELD_ORDER: TestimonialField[] = ['name', 'email', 'serviceId', 'text'];

type TestimonialDraft = Omit<TestimonialSubmission, 'noticeVersion' | 'language'>;
type DraftField = keyof TestimonialDraft;

const EMPTY_DRAFT: TestimonialDraft = { name: '', email: '', serviceId: '', text: '', honeypot: '' };

const serviceLabelKey = (id: ServiceId): string =>
  id === 'other' || id === 'unspecified' ? `testimonials.form.service.${id}` : `services.${id}`;

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t('testimonials.t1Name'),
      role: t('testimonials.t1Role'),
      content: t('testimonials.t1Content'),
    },
    {
      name: t('testimonials.t2Name'),
      role: t('testimonials.t2Role'),
      content: t('testimonials.t2Content'),
    },
    {
      name: t('testimonials.t3Name'),
      role: t('testimonials.t3Role'),
      content: t('testimonials.t3Content'),
    },
  ];

  // The draft lives here, so closing, reopening, or switching language keeps what was typed.
  const [draft, setDraft] = useState<TestimonialDraft>(EMPTY_DRAFT);
  const [formOpen, setFormOpen] = useState(false);
  const pendingFocus = useRef<'form' | 'trigger' | null>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);

  // Runs after the form mounts or unmounts, so the target element exists before focus moves.
  useEffect(() => {
    if (pendingFocus.current === 'form' && formOpen) {
      formPanelRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
        block: 'start',
      });
      formHeadingRef.current?.focus({ preventScroll: true });
    } else if (pendingFocus.current === 'trigger' && !formOpen) {
      openButtonRef.current?.focus();
    }
    pendingFocus.current = null;
  }, [formOpen]);

  const openForm = () => {
    pendingFocus.current = 'form';
    setFormOpen(true);
  };

  const closeForm = () => {
    pendingFocus.current = 'trigger';
    setFormOpen(false);
  };

  return (
    <section id="testimonials" className={`section section--dark ${styles.testimonials}`}>
      <div className={styles.testimonialsBg}>
        <div className={styles.testimonialsGradient} />
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <span className="badge badge--dark">{t('header.testimonials')}</span>
          <h2 className="section__title" style={{ color: 'var(--color-white)' }}>
            {t('testimonials.title')}
          </h2>
          <p className="section__subtitle" style={{ color: 'var(--color-primary-200)' }}>
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <Quote size={24} className={styles.quoteIcon} />
              </div>

              <p className={styles.content}>{testimonial.content}</p>

              <div className={styles.footer}>
                <div className={styles.avatar}>
                  <span>{testimonial.name.charAt(0)}</span>
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{testimonial.name}</span>
                  <span className={styles.role}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.shareWrapper}>
          <button
            ref={openButtonRef}
            type="button"
            className="btn btn--outline-light btn--large"
            aria-expanded={formOpen}
            aria-controls={formOpen ? FORM_PANEL_ID : undefined}
            onClick={openForm}
          >
            {t('testimonials.share')}
          </button>
        </div>

        {formOpen && (
          <TestimonialForm
            panelRef={formPanelRef}
            headingRef={formHeadingRef}
            draft={draft}
            setDraft={setDraft}
            onClose={closeForm}
          />
        )}
      </div>
    </section>
  );
};

interface TestimonialFormProps {
  panelRef: RefObject<HTMLDivElement | null>;
  headingRef: RefObject<HTMLHeadingElement | null>;
  draft: TestimonialDraft;
  setDraft: (update: (current: TestimonialDraft) => TestimonialDraft) => void;
  onClose: () => void;
}

function TestimonialForm({ panelRef, headingRef, draft, setDraft, onClose }: TestimonialFormProps) {
  const { t, language } = useLanguage();
  const [errors, setErrors] = useState<FieldError[]>([]);

  const errorFor = (field: TestimonialField) => errors.find((error) => error.field === field);
  const formError = errorFor('form');

  const update = (field: DraftField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => current.filter((error) => error.field !== field && error.field !== 'form'));
  };

  const errorText = (error: FieldError): string => {
    const limits: Partial<Record<TestimonialField, [number, number]>> = {
      name: [TESTIMONIAL_LIMITS.nameMin, TESTIMONIAL_LIMITS.nameMax],
      email: [TESTIMONIAL_LIMITS.emailMax, TESTIMONIAL_LIMITS.emailMax],
      text: [TESTIMONIAL_LIMITS.textMin, TESTIMONIAL_LIMITS.textMax],
    };
    const [min, max] = limits[error.field] ?? [0, 0];
    const limit = error.code === 'too_short' ? min : max;
    return t(`testimonials.form.error.${error.field}.${error.code}`).replace('{limit}', String(limit));
  };

  const describedBy = (field: TestimonialField, hintId?: string): string | undefined =>
    [hintId, errorFor(field) ? `${field}-error` : ''].filter(Boolean).join(' ') || undefined;

  const fieldError = (field: TestimonialField) => {
    const error = errorFor(field);
    return error ? <p id={`${field}-error`} className={styles.fieldError} role="alert">{errorText(error)}</p> : null;
  };

  // The submit button is disabled while SUBMISSION_ENABLED is false, so nothing is validated or sent
  // yet. When the endpoint is connected, send result.value and report success only after the server
  // confirms that the mail provider accepted the message.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!SUBMISSION_ENABLED) return;

    const result = validateTestimonialSubmission({ ...draft, noticeVersion: TESTIMONIAL_NOTICE_VERSION, language });
    if (!result.ok) {
      const visibleErrors = result.honeypot ? [] : result.errors;
      setErrors(visibleErrors);
      const firstField = FIELD_ORDER.find((field) => visibleErrors.some((error) => error.field === field));
      if (firstField) document.getElementById(`testimonial-${firstField}`)?.focus();
    }
  };

  return (
    <div id={FORM_PANEL_ID} ref={panelRef} className={styles.formPanel} role="region"
      aria-labelledby="testimonial-form-title">
      <div className={styles.formHeader}>
        <h3 id="testimonial-form-title" ref={headingRef} className={styles.formTitle} tabIndex={-1}>
          {t('testimonials.form.title')}
        </h3>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          {t('testimonials.form.close')}
        </button>
      </div>
      <p className={styles.formIntro}>{t('testimonials.form.intro')}</p>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="testimonial-company">Company</label>
          <input id="testimonial-company" name="company" type="text" value={draft.honeypot}
            onChange={(event) => update('honeypot', event.target.value)}
            tabIndex={-1} autoComplete="off" inputMode="none" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="testimonial-name">{t('testimonials.form.name')}</label>
          <input id="testimonial-name" className={styles.input} name="name" type="text" value={draft.name}
            maxLength={TESTIMONIAL_LIMITS.nameMax} autoComplete="name"
            aria-invalid={Boolean(errorFor('name'))} aria-describedby={describedBy('name', 'name-hint')}
            onChange={(event) => update('name', event.target.value)} />
          <p id="name-hint" className={styles.hint}>{t('testimonials.form.nameHint')}</p>
          {fieldError('name')}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="testimonial-email">{t('testimonials.form.email')}</label>
          <input id="testimonial-email" className={styles.input} name="email" type="email" value={draft.email}
            maxLength={TESTIMONIAL_LIMITS.emailMax} autoComplete="email" inputMode="email" spellCheck={false}
            aria-invalid={Boolean(errorFor('email'))} aria-describedby={describedBy('email')}
            onChange={(event) => update('email', event.target.value)} />
          {fieldError('email')}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="testimonial-serviceId">{t('testimonials.form.service')}</label>
          <select id="testimonial-serviceId" className={styles.input} name="serviceId" value={draft.serviceId}
            aria-invalid={Boolean(errorFor('serviceId'))} aria-describedby={describedBy('serviceId')}
            onChange={(event) => update('serviceId', event.target.value)}>
            <option value="">{t('testimonials.form.servicePlaceholder')}</option>
            {SERVICE_IDS.map((id) => (
              <option key={id} value={id}>{t(serviceLabelKey(id))}</option>
            ))}
          </select>
          {fieldError('serviceId')}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="testimonial-text">{t('testimonials.form.text')}</label>
          <textarea id="testimonial-text" className={`${styles.input} ${styles.textarea}`} name="text"
            value={draft.text} maxLength={TESTIMONIAL_LIMITS.textMax} rows={6}
            aria-invalid={Boolean(errorFor('text'))} aria-describedby={describedBy('text', 'text-hint')}
            onChange={(event) => update('text', event.target.value)} />
          <p id="text-hint" className={styles.hint}>
            {t('testimonials.form.textCount')
              .replace('{count}', String([...draft.text].length))
              .replace('{max}', String(TESTIMONIAL_LIMITS.textMax))}
          </p>
          {fieldError('text')}
        </div>
        <p className={styles.notice} id="testimonial-notice">{TESTIMONIAL_NOTICE[language]}</p>
        {formError && <p className={styles.formError} role="alert">{errorText(formError)}</p>}
        <p id="submit-status" className={styles.submitStatus}>{t('testimonials.form.unavailable')}</p>
        <button className={styles.submit} type="submit" disabled={!SUBMISSION_ENABLED}
          aria-describedby="testimonial-notice submit-status">{t('testimonials.form.submit')}</button>
      </form>
    </div>
  );
}

export default Testimonials;

