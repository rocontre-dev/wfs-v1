import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Target, FileCheck, Lightbulb, Rocket, RefreshCw } from 'lucide-react';
import styles from './Process.module.css';

const Process = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <MessageCircle size={28} />,
      title: t('process.step1'),
      description: t('process.step1.desc'),
    },
    {
      icon: <Target size={28} />,
      title: t('process.step2'),
      description: t('process.step2.desc'),
    },
    {
      icon: <FileCheck size={28} />,
      title: t('process.step3'),
      description: t('process.step3.desc'),
    },
    {
      icon: <Lightbulb size={28} />,
      title: t('process.step4'),
      description: t('process.step4.desc'),
    },
    {
      icon: <Rocket size={28} />,
      title: t('process.step5'),
      description: t('process.step5.desc'),
    },
    {
      icon: <RefreshCw size={28} />,
      title: t('process.step6'),
      description: t('process.step6.desc'),
    },
  ];

  return (
    <section id="process" className={`section ${styles.process}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge badge--gold">{t('header.process')}</span>
          <h2 className="section__title">{t('process.title')}</h2>
          <p className="section__subtitle">{t('process.subtitle')}</p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</div>
              
              <div className={styles.stepConnector}>
                <div className={styles.connectorLine} />
              </div>
              
              <div className={styles.stepContent}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
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

export default Process;