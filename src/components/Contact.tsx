import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    primaryInterest: '',
    location: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', primaryInterest: '', location: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  // Contact cards with Mexico and Canada numbers - improved separation
  const contactCards = [
    {
      icon: <MessageCircle size={24} />,
      country: 'MÉXICO',
      label: t('contact.mexico'),
      phone: '+52 55 1234 5678',
      whatsappNumber: '525512345678',
      methods: ['WhatsApp', 'Llamadas'],
    },
    {
      icon: <Phone size={24} />,
      country: 'CANADÁ',
      label: t('contact.canada'),
      phone: '+1 250-608-8218',
      whatsappNumber: '12506088218',
      methods: ['Llamadas', 'Mensajes de texto'],
    },
  ];

  const otherContactInfo = [
    {
      icon: <Mail size={24} />,
      label: t('footer.email'),
      value: t('footer.email'),
      href: 'mailto:contacto@gregorolenro.com',
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
                    <span className={styles.contactCardLabel}>{card.label}</span>
                    <a href={`tel:${card.phone.replace(/[^0-9+]/g, '')}`} className={styles.contactCardPhoneLink}>
                      <span className={styles.contactCardPhone}>{card.phone}</span>
                    </a>
                    <div className={styles.contactMethods}>
                      {card.methods.map((method, i) => (
                        <span key={i} className={styles.contactMethod}>{method}</span>
                      ))}
                    </div>
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
            {submitted ? (
              <div className={styles.successMessage}>
                <p>{t('contact.successMessage')}</p>
              </div>
            ) : (
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

                  <button type="submit" className="btn btn--primary btn--large btn--full">
                    {t('contact.submit')}
                    <Send size={20} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button with improved message */}
      <a
        href={`https://wa.me/525512345678?text=${encodeURIComponent(t('contact.whatsappMessage'))}`}
        className={styles.floatingWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('contact.floatingWhatsapp')}
      >
        <MessageCircle size={28} />
        <span className={styles.floatingWhatsappText}>{t('contact.floatingWhatsapp')}</span>
      </a>
    </section>
  );
};

export default Contact;