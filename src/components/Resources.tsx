import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, PlayCircle, BookOpen, TrendingUp } from 'lucide-react';
import styles from './Resources.module.css';

// Resource type definition for future extensibility
// Each resource can become: YouTube video, Educational article, Downloadable guide, Resource page
interface Resource {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  color: 'blue' | 'green' | 'purple';
  futureType?: 'video' | 'article' | 'guide' | 'page'; // For future content expansion
}

const Resources = () => {
  const { t } = useLanguage();

  // Clean reusable data structure - easy to expand in the future
  const resources: Resource[] = [
    {
      id: 'financial-education-families',
      icon: <BookOpen size={28} />,
      titleKey: 'resources.card1Title',
      descKey: 'resources.card1Desc',
      color: 'blue',
      futureType: 'video', // Can become YouTube video or article
    },
    {
      id: 'building-financial-resilience',
      icon: <TrendingUp size={28} />,
      titleKey: 'resources.card2Title',
      descKey: 'resources.card2Desc',
      color: 'green',
      futureType: 'guide', // Can become downloadable guide
    },
    {
      id: 'financial-independence',
      icon: <PlayCircle size={28} />,
      titleKey: 'resources.card3Title',
      descKey: 'resources.card3Desc',
      color: 'purple',
      futureType: 'article', // Can become educational article
    },
  ];

  return (
    <section id="resources" className={`section ${styles.resources}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge badge--gold">{t('resources.badge')}</span>
          <h2 className="section__title">{t('resources.title')}</h2>
          <p className="section__subtitle">{t('resources.subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {resources.map((resource) => (
            <div key={resource.id} className={`${styles.card} ${styles[`card--${resource.color}`]}`}>
              <div className={styles.cardImage}>
                <div className={`${styles.imagePlaceholder} ${styles[`placeholder--${resource.color}`]}`}>
                  {resource.icon}
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{t(resource.titleKey)}</h3>
                <p className={styles.cardDescription}>{t(resource.descKey)}</p>
                <button className={styles.cardButton} disabled aria-label={`${t(resource.titleKey)} - ${t('resources.learnMore')}`}>
                  <span>{t('resources.learnMore')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.note}>
          <p>{t('resources.note')}</p>
        </div>
      </div>
    </section>
  );
};

export default Resources;