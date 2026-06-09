import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Header.module.css';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { key: 'header.home', href: '#hero' },
    { key: 'header.about', href: '#about' },
    { key: 'header.services', href: '#services' },
    { key: 'header.process', href: '#process' },
    { key: 'header.resources', href: '#resources' },
    { key: 'header.contact', href: '#contact' },
  ];

  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : ''}`}>
      <div className={`container ${styles.container}`}>
        <a href="#hero" className={styles.logo}>
          <span className={styles.logoIcon}>GL</span>
          <span className={styles.logoText}>
            <span className={styles.logoName}>Gregorio Leñero</span>
            <span className={styles.logoTitle}>{t('header.logoTitle')}</span>
          </span>
        </a>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.key} className={styles.navItem}>
                <a
                  href={item.href}
                  className={styles.navLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            onClick={toggleLanguage}
            className={styles.langButton}
            aria-label="Toggle language"
          >
            <span className={styles.langText}>{language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className={styles.themeButton}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href="#contact" className={`${styles.ctaButton} btn btn--primary`}>
            {t('header.cta')}
          </a>

          <button
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;