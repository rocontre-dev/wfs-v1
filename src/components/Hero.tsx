import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Users, Award, Heart } from 'lucide-react';
import styles from './Hero.module.css';

const Hero = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <Users size={24} />,
      value: '500+',
      label: t('hero.clients'),
    },
    {
      icon: <Award size={24} />,
      value: 'Canadá y EE. UU.',
      label: t('hero.experience'),
    },
    {
      icon: <Heart size={24} />,
      value: '100%',
      label: t('hero.commitment'),
    },
  ];

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroBg}>
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid} />
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <div className={styles.badgeWrapper}>
            <span className="badge badge--gold">
              {t('hero.badge')}
            </span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleLine1}>{t('hero.title1')}</span>
            <span className={styles.titleHighlight}>{t('hero.highlight')}</span>
            <span className={styles.titleLine2}>{t('hero.title2')}</span>
          </h1>

          <p className={styles.description}>
            {t('hero.description')}
          </p>

          <div className={styles.actions}>
            <a href="#contact" className="btn btn--primary btn--large">
              {t('hero.cta')}
              <ArrowRight size={20} />
            </a>
            <a
              href="#services"
              className="btn btn--secondary btn--large"
            >
              {t('hero.services')}
            </a>
          </div>

          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.stat}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualCard}>
            <div className={styles.visualImage}>
              <div className={styles.imagePlaceholder}>
                <span>GL</span>
              </div>
            </div>
            <div className={styles.visualInfo}>
              <span className={styles.visualName}>{t('hero.visualName')}</span>
              <span className={styles.visualTitle}>{t('hero.visualTitle')}</span>
            </div>
            <div className={styles.visualBadge}>
              <Award size={16} />
              <span>{t('hero.visualBadge')}</span>
            </div>
          </div>

          <div className={styles.floatingCards}>
            <div className={`${styles.floatCard} ${styles.floatCard1}`}>
              <div className={styles.floatCardIcon}>📈</div>
              <span>{t('hero.floatCard1')}</span>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCard2}`}>
              <div className={styles.floatCardIcon}>🛡️</div>
              <span>{t('hero.floatCard2')}</span>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCard3}`}>
              <div className={styles.floatCardIcon}>🎯</div>
              <span>{t('hero.floatCard3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;