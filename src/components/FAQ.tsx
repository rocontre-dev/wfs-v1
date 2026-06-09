import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
    { question: t('faq.q7'), answer: t('faq.a7') },
    { question: t('faq.q8'), answer: t('faq.a8') },
    { question: t('faq.q9'), answer: t('faq.a9') },
    { question: t('faq.q10'), answer: t('faq.a10') },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={`section ${styles.faq}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge badge--gold">{t('header.faq')}</span>
        </div>

        <div className={styles.grid}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.item} ${openIndex === index ? styles.itemOpen : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className={styles.questionNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.questionText}>{faq.question}</span>
                <ChevronDown size={20} className={styles.chevron} />
              </button>
              
              <div className={styles.answerWrapper}>
                <p className={styles.answer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <p className={styles.ctaText}>{t('faq.ctaText')}</p>
          <a href="#contact" className="btn btn--primary btn--large">
            {t('hero.cta')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;