import { useLanguage } from '../context/LanguageContext';
import { Mail } from 'lucide-react';
import type { SVGProps } from 'react';
import styles from './Footer.module.css';

// Brand glyphs drawn inline (no extra dependency). They use currentColor so they follow the footer styles.
type IconProps = SVGProps<SVGSVGElement>;

const iconDefaults: IconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
};

// Instagram's glyph is an outline: rounded square, lens and flash dot.
const InstagramIcon = () => (
  <svg {...iconDefaults} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5.5" />
    <circle cx="12" cy="12" r="4.25" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

// Facebook's solid circle with the "f" cut out.
const FacebookIcon = () => (
  <svg {...iconDefaults} fill="currentColor">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
  </svg>
);

// TikTok's solid musical-note glyph.
const TikTokIcon = () => (
  <svg {...iconDefaults} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  // Profiles confirmed by Goyo. Keep the Facebook share URL exactly as provided.
  const socialLinks = [
    { name: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/goyolenero/' },
    { name: 'Facebook', Icon: FacebookIcon, href: 'https://www.facebook.com/share/1B9mvaCTMc/' },
    { name: 'TikTok', Icon: TikTokIcon, href: 'https://www.tiktok.com/@goyolenero' },
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
              {socialLinks.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  className={styles.socialLink}
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>

            <a href="mailto:goyo.lenero1@gmail.com" className={styles.emailLink}>
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