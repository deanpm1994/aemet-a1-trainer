import type { Topic } from "./types";

export type TopicStudyCard = {
  topicId: string;
  label: "Material didáctico no oficial";
  objectives: string[];
  checklist: string[];
  reviewPrompts: string[];
  richNotes: string[];
};

const RICH_NOTE_BLOCKS = new Set(["Mathematics", "Meteorology and Climatology"]);

const RICH_NOTES_BY_TOPIC_ID: Record<string, string[]> = {
  "physics-1": ["Separa cinemática, fuerzas y energía.", "Dibuja ejes y diagrama de fuerzas antes de plantear ecuaciones.", "Comprueba unidades, signo y caso límite."],
  "physics-2": ["Distingue centro de masas y movimiento relativo interno.", "Aplica conservación de momento, energía y momento angular por separado.", "Relaciona el resultado con el sólido rígido y su momento de inercia."],
  "physics-3": ["Relaciona fuerza, campo, potencial y energía gravitatoria.", "Traza líneas de campo y usa simetría antes de integrar.", "Contrasta órbita ligada, escape y campo terrestre."],
  "physics-4": ["Compara descripción euleriana y lagrangiana.", "Identifica tensor, balance y volumen de control usado.", "Verifica cada término de conservación con sus unidades."],
  "physics-5": ["Separa estática, cinemática y rotación del fluido.", "Dibuja líneas de corriente, trayectorias y vorticidad en casos simples.", "Explica cuándo aplicar Pascal, Arquímedes o Kelvin."],
  "physics-6": ["Parte de conservación de masa y cantidad de movimiento.", "Indica hipótesis: viscosidad, compresibilidad y régimen de flujo.", "Usa Reynolds para justificar aproximación laminar o turbulenta."],
  "physics-7": ["Relaciona posición, velocidad, aceleración y fase.", "Compara oscilación libre, amortiguada y forzada.", "Explica resonancia desde transferencia y disipación de energía."],
  "physics-8": ["Distingue propagación, superposición y condición de contorno.", "Deriva relaciones entre frecuencia, longitud de onda y velocidad.", "Representa nodos, vientres y cambio Doppler con un esquema."],
  "physics-9": ["Relaciona carga, fuerza, campo, potencial y energía.", "Elige Coulomb o Gauss según la simetría.", "Diferencia conductor, dieléctrico y vacío en el modelo."],
  "physics-10": ["Relaciona carga en movimiento, corriente y campo magnético.", "Dibuja orientación con regla de la mano y flujo magnético.", "Separa Biot-Savart, Ampère y Ohm por condiciones de uso."],
  "physics-11": ["Explica inducción como cambio de flujo y sentido de Lenz.", "Conecta Maxwell con conservación y propagación de energía.", "Interpreta el vector de Poynting en un ejemplo físico."],
  "physics-12": ["Relaciona ecuación de ondas, espectro y tipo de frente.", "Distingue velocidad de fase y de grupo.", "Comprueba dirección de energía y momento de la radiación."],
  "physics-13": ["Separa condiciones de interferencia y régimen de difracción.", "Dibuja diferencia de camino y patrón observado.", "Compara límites de Fraunhofer y caso de interferencia ideal."],
  "physics-14": ["Define sistema, estado, proceso y convención de signos.", "Escribe primer principio antes de sustituir ecuaciones de estado.", "Clasifica transformación y revisa trabajo, calor y energía interna."],
  "physics-15": ["Distingue reversibilidad, rendimiento y producción de entropía.", "Representa ciclo de Carnot y sus focos térmicos.", "Explica por qué Clausius limita conversión de calor en trabajo."],
  "physics-16": ["Relaciona variables naturales con cada potencial termodinámico.", "Usa diferencial fundamental para deducir condición de equilibrio.", "Separa estabilidad local, equilibrio y representación elegida."],
  "physics-17": ["Diferencia orden de transición y discontinuidad relevante.", "Relaciona pendiente de coexistencia con Clausius-Clapeyron.", "Interpreta diagrama de fases antes de usar una ecuación."],
  "physics-18": ["Separa mecanismos de interacción radiación-materia.", "Relaciona ley de Kirchhoff, Planck, Stefan-Boltzmann y Wien.", "Comprueba unidades espectrales y límites de cuerpo negro."],
};

function firstSentence(value: string): string {
  return value.split(".")[0]?.trim() || value;
}

export function getTopicStudyCard(topic: Topic): TopicStudyCard {
  const subject = firstSentence(topic.officialTitle);

  return {
    topicId: topic.id,
    label: "Material didáctico no oficial",
    objectives: [`Explicar con precisión: ${subject}.`],
    checklist: [
      "Leer el título oficial completo.",
      "Definir los conceptos principales con tus propias palabras.",
      "Resolver una pregunta ligada al tema.",
    ],
    reviewPrompts: ["¿Qué parte del título oficial no puedes explicar todavía?"],
    richNotes: RICH_NOTES_BY_TOPIC_ID[topic.id] ?? (RICH_NOTE_BLOCKS.has(topic.block)
      ? [
          "Divide el título oficial en conceptos y relaciones antes de memorizar.",
          "Anota una definición, un procedimiento y una aplicación para cada concepto.",
        ]
      : []),
  };
}

export function buildTopicStudyCards(topics: Topic[]): TopicStudyCard[] {
  return topics.map(getTopicStudyCard);
}
