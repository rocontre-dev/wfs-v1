export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María González",
    role: "Empresaria",
    content: "Gracias a su asesoría, logré organizar mis finanzas personales y de mi negocio. Ahora tengo claridad sobre mi futuro financiero y me siento tranquila sabiendo que estoy bien protegida."
  },
  {
    id: 2,
    name: "Carlos Ramírez",
    role: "Profesional Independiente",
    content: "Llevaba años posponiendo mi planificación de retiro. Ellos me ayudaron a crear un plan realista y alcanzable. Por primera vez en mi vida, veo mi retiro con optimismo y seguridad."
  },
  {
    id: 3,
    name: "Ana Luisa Mendoza",
    role: "Madre de Familia",
    content: "Lo que más valoro es la paciencia y claridad con la que explican todo. No solo me dieron recomendaciones, me educaron para tomar mejores decisiones financieras para mi familia."
  },
  {
    id: 4,
    name: "Roberto Díaz",
    role: "Ejecutivo Senior",
    content: "Su enfoque integral es excepcional. No solo gestionan mis inversiones, también me ayudaron a estructurar mi patrimonio para proteger a mi familia. Son verdaderos profesionales de confianza."
  }
];