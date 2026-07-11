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
    richNotes: RICH_NOTE_BLOCKS.has(topic.block)
      ? [
          "Divide el título oficial en conceptos y relaciones antes de memorizar.",
          "Anota una definición, un procedimiento y una aplicación para cada concepto.",
        ]
      : [],
  };
}

export function buildTopicStudyCards(topics: Topic[]): TopicStudyCard[] {
  return topics.map(getTopicStudyCard);
}
