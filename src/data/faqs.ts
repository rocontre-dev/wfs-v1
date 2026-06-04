export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "¿Qué servicios financieros ofrecen?",
    answer: "Ofrecemos una gama completa de servicios financieros incluyendo planificación de retiro, gestión de inversiones, seguros de vida, educación financiera y asesoría patrimonial. Cada servicio está diseñado para adaptarse a tus necesidades específicas y etapa de vida."
  },
  {
    id: 2,
    question: "¿Cómo comienza el proceso de asesoría?",
    answer: "El proceso inicia con una consulta inicial gratuita donde conocemos tu situación financiera actual, tus metas y preocupaciones. A partir de ahí, diseñamos un plan personalizado y te acompañamos en cada paso de la implementación."
  },
  {
    id: 3,
    question: "¿Los servicios son solo para personas con alto patrimonio?",
    answer: "No. Creemos que toda persona merece acceso a asesoría financiera de calidad. Trabajamos con clientes en diferentes etapas de su vida financiera, desde quienes están comenzando a ahorrar hasta quienes buscan preservar y hacer crecer patrimonios consolidados."
  },
  {
    id: 4,
    question: "¿Qué me diferencia de recibir asesoría gratuita en mi banco?",
    answer: "Nuestra asesoría es 100% independiente y está centrada en tus intereses, no en vender productos específicos. Analizamos el mercado completo para recomendarte las mejores opciones, no solo las de una institución. Además, te brindamos educación financiera para que entiendas y controles tus decisiones."
  },
  {
    id: 5,
    question: "¿Con qué frecuencia debo revisar mi plan financiero?",
    answer: "Recomendamos revisiones trimestrales para ajustar estrategias según el comportamiento del mercado, y una revisión anual profunda para evaluar cambios en tu vida personal, metas y situación patrimonial. Estamos disponibles cuando necesites asesoría adicional."
  },
  {
    id: 6,
    question: "¿Ofrecen servicios de educación financiera?",
    answer: "Sí, la educación financiera es parte fundamental de nuestro enfoque. Ofrecemos talleres grupales, sesiones individuales y material educativo para ayudarte a tomar decisiones informadas y desarrollar hábitos financieros saludables."
  }
];