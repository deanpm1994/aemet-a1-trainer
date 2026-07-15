import type { Question, Topic } from "./types";

function topicScope(topic: Topic): string {
  return topic.officialTitle.split(".")[0]?.trim() || topic.officialTitle;
}

function questionId(topic: Topic, variant: number): string {
  return `didactic-reviewed-${topic.id}-${variant}`;
}

export function buildDidacticQuestions(topics: Topic[]): Question[] {
  const verifiedTopics = topics.filter((topic) => topic.verificationStatus === "verified");

  return verifiedTopics.flatMap((topic, topicIndex) => {
    const correctAnswer = topicScope(topic);
    const otherScopes = verifiedTopics
      .filter((candidate) => candidate.id !== topic.id)
      .map(topicScope)
      .filter((scope, scopeIndex, values) => values.indexOf(scope) === scopeIndex)
      .slice(0, 3);
    const options = [
      correctAnswer,
      ...otherScopes,
      "Ninguna de las anteriores",
    ].slice(0, 4);

    const prompts = [
      `Según el programa oficial, ¿qué contenido pertenece al tema ${topic.officialNumber} de ${topic.block}?`,
      `¿Qué alcance de estudio identifica el tema ${topic.officialNumber} de ${topic.block}?`,
      `Para planificar el repaso del tema ${topic.officialNumber}, ¿qué bloque temático corresponde al título oficial?`,
    ];

    return prompts.map((statement, variant) => ({
      id: questionId(topic, variant + 1),
      name: `Práctica didáctica revisada · ${topic.block} ${topic.officialNumber}`,
      type: "multiple_choice" as const,
      sourceYear: 0,
      sourceExam: "Material didáctico no oficial (revisado)",
      sourceUrl: topic.sourceUrl,
      retrievedAt: topic.retrievedAt,
      verificationStatus: "verified" as const,
      origin: "didactic_reviewed" as const,
      editorialStatus: "reviewed" as const,
      questionNumber: String(topicIndex * 3 + variant + 1),
      statement,
      options,
      correctAnswer,
      answerSourceStatus: "inferred" as const,
      explanation: "Pregunta didáctica no oficial. La respuesta se apoya en el título del programa oficial enlazado; no procede de un examen ni de una plantilla oficial.",
      topicIds: [topic.id],
      difficulty: 1 as const,
      attemptsCount: 0,
      lastAttemptAt: "",
      nextReviewAt: "",
      mistakeTypes: ["none"] as const,
    }));
  });
}
