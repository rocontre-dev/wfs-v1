import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { buildTestimonialMailto } from '../shared/testimonialSubmission';
import styles from './Contact.module.css';

// Recipient of the contact form (Goyo's address). With mailto it is public (visible in the page source
// and the visitor's mail app). Testimonials, contact links and the footer use the same address.
const CONTACT_FORM_RECIPIENT: string = 'goyo.lenero1@gmail.com';

// Translation keys of the visible option labels, so the email shows the text the visitor selected.
const INTEREST_LABEL_KEYS: Record<string, string> = {
  protection: 'contact.interest.protection',
  investments: 'contact.interest.investments',
  retirement: 'contact.interest.retirement',
  education: 'contact.interest.education',
  wealth: 'contact.interest.wealth',
  other: 'contact.location.other',
};

const LOCATION_LABEL_KEYS: Record<string, string> = {
  canada: 'contact.location.canada',
  usa: 'contact.location.usa',
  mexico: 'contact.location.mexico',
  other: 'contact.location.other',
};

// WhatsApp number for the floating button (digits only, with country code). Empty until a number with
// WhatsApp is confirmed; while empty the button is not shown.
const FLOATING_WHATSAPP_NUMBER: string = '';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  primaryInterest: '',
  location: '',
  message: '',
};

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // The browser validates the fields (required, email format) before this runs. The full message is built
  // first, then the visitor's mail app is opened with it and the form is reset to its initial state. The
  // visitor sends the email from that app, so the page never claims the message was sent.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = (text: string) => text.trim() || '—';
    const optionLabel = (keys: Record<string, string>, selected: string) =>
      keys[selected] ? t(keys[selected]) : '—';
    const name = formData.name.trim();
    const body = [
      `${t('contact.name')}: ${name}`,
      `${t('contact.email')}: ${formData.email.trim()}`,
      `${t('contact.phone')}: ${value(formData.phone)}`,
      `${t('contact.primaryInterest')}: ${optionLabel(INTEREST_LABEL_KEYS, formData.primaryInterest)}`,
      `${t('contact.location')}: ${optionLabel(LOCATION_LABEL_KEYS, formData.location)}`,
      '',
      `${t('contact.message')}:`,
      value(formData.message),
    ].join('\n');
    const link = buildTestimonialMailto({ subject: `${t('contact.mailSubject')}: ${name}`, body }, CONTACT_FORM_RECIPIENT);
    if (!link) return;
    window.location.href = link;
    setFormData(EMPTY_FORM);
  };

  // Contact cards. A card is shown only when it has a phone number.
  const contactCards = [
    {
      // Mexico: calls confirmed by Goyo. WhatsApp and SMS are not confirmed yet; fill in whatsappNumber
      // (digits only) or set sms to true only once they are.
      icon: <Phone size={24} />,
      country: t('contact.countryMexico'),
      label: '',
      phone: '+52 333 559 8672',
      whatsappNumber: '',
      sms: false,
      methods: [] as string[],
    },
    {
      // Canada: calls and SMS only (this number has no WhatsApp).
      icon: <Phone size={24} />,
      country: t('contact.countryCanada'),
      label: '',
      phone: '+1 250-608-8218',
      whatsappNumber: '',
      sms: true,
      methods: [] as string[],
    },
  ].filter((card) => card.phone !== '');

  const otherContactInfo = [
    {
      icon: <Mail size={24} />,
      label: t('footer.email'),
      value: t('footer.email'),
      href: 'mailto:goyo.lenero1@gmail.com',
    },
    {
      icon: <MapPin size={24} />,
      label: t('contact.office'),
      value: t('contact.officeValue'),
    },
    {
      icon: <Clock size={24} />,
      label: t('contact.hours'),
      value: t('contact.hoursValue'),
    },
  ];

  // Handle WhatsApp click with improved message including form data
  const handleWhatsAppClick = (whatsappNumber: string) => {
    const message = encodeURIComponent(t('contact.whatsappMessage'));
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  // Handle phone call click
  const handleCallClick = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  // Handle SMS click
  const handleSmsClick = (phone: string) => {
    window.location.href = `sms:${phone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <section id="contact" className={`section section--gray ${styles.contact}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge badge--gold">{t('header.contact')}</span>
          <h2 className="section__title">{t('contact.title')}</h2>
          <p className="section__subtitle">{t('contact.subtitle')}</p>
        </div>

        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.infoHeader}>
              <h3 className={styles.infoTitle}>{t('contact.infoTitle')}</h3>
              <p className={styles.infoDesc}>{t('contact.infoDesc')}</p>
            </div>

            {/* Contact Cards - Mexico and Canada with improved layout */}
            <div className={styles.contactCards}>
              {contactCards.map((card, index) => (
                <div key={index} className={styles.contactCard}>
                  <div className={styles.contactCardHeader}>
                    <span className={styles.contactCardCountry}>{card.country}</span>
                    <div className={styles.contactCardIcon}>{card.icon}</div>
                  </div>
                  <div className={styles.contactCardContent}>
                    {card.label && <span className={styles.contactCardLabel}>{card.label}</span>}
                    <a href={`tel:${card.phone.replace(/[^0-9+]/g, '')}`} className={styles.contactCardPhoneLink}>
                      <span className={styles.contactCardPhone}>{card.phone}</span>
                    </a>
                    {card.methods.length > 0 && (
                      <div className={styles.contactMethods}>
                        {card.methods.map((method, i) => (
                          <span key={i} className={styles.contactMethod}>{method}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.contactCardActions}>
                    {card.whatsappNumber && (
                      <button
                        className={styles.whatsappBtn}
                        onClick={() => handleWhatsAppClick(card.whatsappNumber)}
                        aria-label={`${t('contact.whatsapp')} - ${card.phone}`}
                      >
                        <MessageCircle size={18} />
                        <span>{t('contact.whatsapp')}</span>
                      </button>
                    )}
                    <button
                      className={styles.callBtn}
                      onClick={() => handleCallClick(card.phone)}
                      aria-label={`${t('contact.call')} - ${card.phone}`}
                    >
                      <Phone size={18} />
                      <span>{t('contact.call')}</span>
                    </button>
                    {card.sms && (
                      <button
                        className={styles.callBtn}
                        onClick={() => handleSmsClick(card.phone)}
                        aria-label={`${t('contact.sms')} - ${card.phone}`}
                      >
                        <MessageCircle size={18} />
                        <span>{t('contact.sms')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Other Contact Info */}
            <div className={styles.infoList}>
              {otherContactInfo.map((item, index) => (
                <div key={index} className={styles.infoItem}>
                  <div className={styles.infoIcon}>{item.icon}</div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className={styles.infoValueLink}>
                        <span className={styles.infoValue}>{item.value}</span>
                      </a>
                    ) : (
                      <span className={styles.infoValue}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formWrapper}>
            <>
                <p className={styles.formIntro}>{t('contact.formIntro')}</p>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        {t('contact.name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder={t('contact.namePlaceholder')}
                        value={formData.name}
                        onChange={handleChange}
                        pattern=".*\S.*"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        {t('contact.email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder={t('contact.emailPlaceholder')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">
                        {t('contact.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-input"
                        placeholder={t('contact.phonePlaceholder')}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="primaryInterest">
                        {t('contact.primaryInterest')}
                      </label>
                      <select
                        id="primaryInterest"
                        name="primaryInterest"
                        className="form-select"
                        value={formData.primaryInterest}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{t('contact.primaryInterestSelect')}</option>
                        <option value="protection">{t('contact.interest.protection')}</option>
                        <option value="investments">{t('contact.interest.investments')}</option>
                        <option value="retirement">{t('contact.interest.retirement')}</option>
                        <option value="education">{t('contact.interest.education')}</option>
                        <option value="wealth">{t('contact.interest.wealth')}</option>
                        <option value="other">{t('contact.location.other')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="location">
                      {t('contact.location')}
                    </label>
                    <select
                      id="location"
                      name="location"
                      className="form-select"
                      value={formData.location}
                      onChange={handleChange}
                    >
                      <option value="">{t('contact.locationSelect')}</option>
                      <option value="canada">{t('contact.location.canada')}</option>
                      <option value="usa">{t('contact.location.usa')}</option>
                      <option value="mexico">{t('contact.location.mexico')}</option>
                      <option value="other">{t('contact.location.other')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      {t('contact.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder={t('contact.messagePlaceholder')}
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>

                  <p id="contact-mail-hint" className={styles.mailHint}>{t('contact.mailHint')}</p>

                  <button type="submit" className="btn btn--primary btn--large btn--full"
                    aria-describedby="contact-mail-hint">
                    {t('contact.submit')}
                    <Send size={20} />
                  </button>
                </form>
            </>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button: hidden while FLOATING_WHATSAPP_NUMBER is empty */}
      {FLOATING_WHATSAPP_NUMBER && (
        <a
          href={`https://wa.me/${FLOATING_WHATSAPP_NUMBER}?text=${encodeURIComponent(t('contact.whatsappMessage'))}`}
          className={styles.floatingWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('contact.floatingWhatsapp')}
        >
          <MessageCircle size={28} />
          <span className={styles.floatingWhatsappText}>{t('contact.floatingWhatsapp')}</span>
        </a>
      )}
    </section>
  );
};

export default Contact;