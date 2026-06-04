import { useLanguage } from '../context/LanguageContext';
import { Play, Headphones, Mic, ArrowRight, Sparkles } from 'lucide-react';
import styles from './Podcast.module.css';

const Podcast = () => {
  const { t } = useLanguage();

  const episodes = [
    {
      number: '001',
      title: '¿Por qué la mayoría no logra libertad financiera?',
      duration: '45 min',
    },
    {
      number: '002',
      title: 'Los 5 errores que destruyen tu patrimonio',
      duration: '38 min',
    },
    {
      number: '003',
      title: 'Cómo empezar a invertir con poco dinero',
      duration: '42 min',
    },
  ];

  const platforms = [
    { name: 'Apple Podcasts', icon: '🎧' },
    { name: 'Spotify', icon: '🎵' },
    { name: 'YouTube', icon: '📺' },
  ];

  return (
    <section id="podcast" className={`section ${styles.podcast}`}>
      <div className={styles.podcastBg}>
        <div className={styles.podcastGradient} />
        <div className={styles.podcastPattern} />
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={`badge badge--dark ${styles.badge}`}>
              <Sparkles size={14} />
              {t('podcast.badge')}
            </span>
            <h2 className={styles.title}>{t('podcast.title')}</h2>
            <p className={styles.subtitle}>{t('podcast.subtitle')}</p>
            <p className={styles.description}>{t('podcast.description')}</p>
          </div>

          <div className={styles.episodesSection}>
            <h3 className={styles.episodesTitle}>{t('podcast.episodes')}</h3>
            
            <div className={styles.episodesList}>
              {episodes.map((episode, index) => (
                <div key={index} className={styles.episodeCard}>
                  <div className={styles.episodeNumber}>{episode.number}</div>
                  <div className={styles.episodeInfo}>
                    <h4 className={styles.episodeTitle}>{episode.title}</h4>
                    <span className={styles.episodeDuration}>{episode.duration}</span>
                  </div>
                  <button className={styles.playButton} aria-label="Play episode">
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>

            <a href="#podcast-all" className={styles.viewAllLink}>
              {t('podcast.viewAll')}
              <ArrowRight size={18} />
            </a>
          </div>

          <div className={styles.platforms}>
            <span className={styles.platformsLabel}>{t('podcast.listen')}</span>
            <div className={styles.platformsList}>
              {platforms.map((platform, index) => (
                <a
                  key={index}
                  href="#podcast-platform"
                  className={styles.platformLink}
                >
                  <span className={styles.platformIcon}>{platform.icon}</span>
                  <span className={styles.platformName}>{platform.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualCard}>
            <div className={styles.visualContent}>
              <div className={styles.micIcon}>
                <Mic size={48} />
              </div>
              <div className={styles.soundWaves}>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
              </div>
              <span className={styles.visualText}>Educa Tu Dinero</span>
              <span className={styles.visualSubtext}>El Podcast</span>
            </div>
          </div>

          <div className={styles.floatingElement}>
            <Headphones size={24} />
            <span>10K+ Oyentes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;