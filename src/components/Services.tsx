import { useLanguage } from '../context/LanguageContext';
import { 
  Shield, 
  TrendingUp, 
  PiggyBank, 
  FileText, 
  Lock, 
  Users 
} from 'lucide-react';
import styles from './Services.module.css';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Shield size={32} />,
      title: t('services.insurance'),
      description: t('services.insurance.desc'),
    },
    {
      icon: <TrendingUp size={32} />,
      title: t('services.investments'),
      description: t('services.investments.desc'),
    },
    {
      icon: <PiggyBank size={32} />,
      title: t('services.retirement'),
      description: t('services.retirement.desc'),
    },
    {
      icon: <FileText size={32} />,
      title: t('services.planning'),
      description: t('services.planning.desc'),
    },
    {
      icon: <Lock size={32} />,
      title: t('services.protection'),
      description: t('services.protection.desc'),
    },
    {
      icon: <Users size={32} />,
      title: t('services.family'),
      description: t('services.family.desc'),
    },
  ];

  return (
    <section id="services" className={`section section--gray ${styles.services}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge badge--gold">{t('header.services')}</span>
          <p className="section__subtitle">{t('services.subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardIcon}>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <a href="#contact" className="btn btn--primary btn--large">
            {t('hero.cta')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;