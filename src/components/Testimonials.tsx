import { useLanguage } from '../context/LanguageContext';
import { Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t('testimonials.t1Name'),
      role: t('testimonials.t1Role'),
      content: t('testimonials.t1Content'),
      rating: 5,
    },
    {
      name: t('testimonials.t2Name'),
      role: t('testimonials.t2Role'),
      content: t('testimonials.t2Content'),
      rating: 5,
    },
    {
      name: t('testimonials.t3Name'),
      role: t('testimonials.t3Role'),
      content: t('testimonials.t3Content'),
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className={`section section--dark ${styles.testimonials}`}>
      <div className={styles.testimonialsBg}>
        <div className={styles.testimonialsGradient} />
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <span className="badge badge--dark">{t('header.testimonials')}</span>
          <h2 className="section__title" style={{ color: 'var(--color-white)' }}>
            {t('testimonials.title')}
          </h2>
          <p className="section__subtitle" style={{ color: 'var(--color-primary-200)' }}>
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <Quote size={24} className={styles.quoteIcon} />
                <div className={styles.rating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-gold-400)" color="var(--color-gold-400)" />
                  ))}
                </div>
              </div>
              
              <p className={styles.content}>{testimonial.content}</p>
              
              <div className={styles.footer}>
                <div className={styles.avatar}>
                  <span>{testimonial.name.charAt(0)}</span>
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{testimonial.name}</span>
                  <span className={styles.role}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;