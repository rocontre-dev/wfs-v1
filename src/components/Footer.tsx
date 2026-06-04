import { useLanguage } from '../context/LanguageContext';
import { Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'LinkedIn', icon: '🔗', href: '#linkedin' },
    { name: 'Twitter', icon: '🐦', href: '#twitter' },
    { name: 'Instagram', icon: '📷', href: '#instagram' },
    { name: 'YouTube', icon: '▶️', href: '#youtube' },
  ];

  const serviceLinks = [
    { label: t('services.insurance'), href: '#services' },
    { label: t('services.investments'), href: '#services' },
    { label: t('services.retirement'), href: '#services' },
    { label: t('services.planning'), href: '#services' },
    { label: t('services.protection'), href: '#services' },
  ];

  const legalLinks = [
    { label: t('footer.privacy'), href: '#privacy' },
    { label: t('footer.terms'), href: '#terms' },
    { label: t('footer.cookies'), href: '#cookies' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>GL</span>
              <span className={styles.logoText}>
                <span className={styles.logoName}>Gregorio Leñero</span>
                <span className={styles.logoTitle}>{t('hero.visualTitle')}</span>
              </span>
            </div>
            <p className={styles.description}>{t('footer.description')}</p>
            
            <div className={styles.social}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <a href="mailto:contacto@gregorolenro.com" className={styles.emailLink}>
              <Mail size={16} />
              <span>{t('footer.email')}</span>
            </a>
          </div>

          <div className={styles.links}>
            <div className={styles.linkColumn}>
              <h4 className={styles.linkTitle}>{t('footer.services')}</h4>
              <ul className={styles.linkList}>
                {serviceLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.linkLabel}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.linkTitle}>{t('footer.company')}</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="#about" className={styles.linkLabel}>
                    {t('header.about')}
                  </a>
                </li>
                <li>
                  <a href="#services" className={styles.linkLabel}>
                    {t('header.services')}
                  </a>
                </li>
                <li>
                  <a href="#process" className={styles.linkLabel}>
                    {t('header.process')}
                  </a>
                </li>
                <li>
                  <a href="#contact" className={styles.linkLabel}>
                    {t('header.contact')}
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.linkTitle}>{t('footer.legal')}</h4>
              <ul className={styles.linkList}>
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.linkLabel}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Gregorio Leñero. {t('footer.rights')}
          </p>
          <p className={styles.disclaimer}>
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;