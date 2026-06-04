import { useLanguage } from '../context/LanguageContext';
import { Award, Users, Heart, Target, BadgeCheck, BookOpen } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <Award size={28} />,
      key: 'about.certification',
      descKey: 'about.certificationDesc',
    },
    {
      icon: <Target size={28} />,
      key: 'about.experience',
      descKey: 'about.experienceDesc',
    },
    {
      icon: <Users size={28} />,
      key: 'about.families',
      descKey: 'about.familiesDesc',
    },
    {
      icon: <Heart size={28} />,
      key: 'about.approach',
      descKey: 'about.approachDesc',
    },
  ];

  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className="badge badge--gold">{t('about.badge')}</span>
            <h2 className="section__title section__title--left">
              {t('about.title')}
            </h2>
            <div className={styles.subtitleBlock}>
              <p className={`section__subtitle section__subtitle--left ${styles.subtitle}`}>
                {t('about.subtitle')}
              </p>
              <p className={`${styles.subtitleDesc} section__subtitle--left`}>
                {t('about.subtitleDesc')}
              </p>
            </div>
          </div>

          <div className={styles.introSection}>
            <p className={styles.intro}>
              {t('about.intro')}
            </p>
            <p className={styles.bio}>
              {t('about.bio')}
            </p>
          </div>

          {/* Mi Enfoque subsection */}
          <div className={styles.approachCard}>
            <div className={styles.approachHeader}>
              <BookOpen size={24} className={styles.approachIcon} />
              <h3 className={styles.approachTitle}>{t('about.approachTitle')}</h3>
            </div>
            <p className={styles.approachText}>
              {t('about.approachText')}
            </p>
          </div>

          {/* Certifications block */}
          <div className={styles.certificationsCard}>
            <div className={styles.certificationsHeader}>
              <BadgeCheck size={24} className={styles.certificationsIcon} />
              <h3 className={styles.certificationsTitle}>{t('about.certificationsTitle')}</h3>
            </div>
            <p className={styles.certificationsText}>
              {t('about.certificationsText')}
            </p>
          </div>

          <div className={styles.signature}>
            <div className={styles.signatureLine} />
            <span className={styles.signatureName}>Gregorio Leñero</span>
            <span className={styles.signatureTitle}>Asesor Financiero Certificado</span>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.imageContainer}>
            <div className={styles.imagePlaceholder}>
              <span>GL</span>
            </div>
            <div className={styles.imageAccent} />
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statContent}>
                  <span className={styles.statKey}>{t(stat.key)}</span>
                  <span className={styles.statDesc}>{t(stat.descKey)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;