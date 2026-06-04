export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Seguros",
    description: "Te ayudamos a proteger lo que más quieres con soluciones de seguros de vida, gastos médicos y patrimonio. Evaluamos tus necesidades reales para ofrecerte la cobertura adecuada.",
    icon: "Shield"
  },
  {
    id: 2,
    title: "Inversiones",
    description: "Administramos tu portafolio de inversiones con un enfoque profesional y diversificado. Buscamos maximizar rendimientos minimizando riesgos, siempre alineados a tus objetivos.",
    icon: "TrendingUp"
  },
  {
    id: 3,
    title: "Retiro",
    description: "Diseñamos estrategias personalizadas para que disfrutes de tu retiro con tranquilidad financiera. Analizamos tu situación actual y proyectamos el capital necesario.",
    icon: "Sun"
  },
  {
    id: 4,
    title: "Planeación financiera",
    description: "Te brindamos las herramientas y conocimientos para que tomes decisiones financieras informadas. Desde conceptos básicos hasta estrategias avanzadas de inversión.",
    icon: "BookOpen"
  },
  {
    id: 5,
    title: "Protección patrimonial",
    description: "Protegemos tu patrimonio mediante estrategias legales y financieras. Incluye planificación sucesoria, fideicomisos y estructuras que salvaguarden tus bienes.",
    icon: "Lock"
  },
  {
    id: 6,
    title: "Asesoría familiar",
    description: "Trabajamos con familias para alinear objetivos financieros, educar a las nuevas generaciones y crear un legado financiero sólido que perdure en el tiempo.",
    icon: "Users"
  }
];