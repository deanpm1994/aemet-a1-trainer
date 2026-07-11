import type { Question, Topic } from "./types";

function topicScope(topic: Topic): string {
  return topic.officialTitle.split(".")[0]?.trim() || topic.officialTitle;
}

function questionId(topic: Topic): string {
  return `didactic-${topic.id}`;
}

export function buildDidacticQuestions(topics: Topic[]): Question[] {
  const verifiedTopics = topics.filter((topic) => topic.verificationStatus === "verified");

  return verifiedTopics.map((topic, index) => {
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

    return {
      id: questionId(topic),
      name: `Práctica de alcance · ${topic.block} ${topic.officialNumber}`,
      type: "multiple_choice",
      sourceYear: 0,
      sourceExam: "Material didáctico no oficial",
      sourceUrl: topic.sourceUrl,
      retrievedAt: topic.retrievedAt,
      verificationStatus: "unverified",
      questionNumber: String(index + 1),
      statement: `Según el programa oficial, ¿qué contenido pertenece al tema ${topic.officialNumber} de ${topic.block}?`,
      options,
      correctAnswer,
      answerSourceStatus: "inferred",
      explanation:
        "La respuesta se basa en el alcance del título oficial enlazado; no es una pregunta de examen oficial.",
      topicIds: [topic.id],
      difficulty: 1,
      attemptsCount: 0,
      lastAttemptAt: "",
      nextReviewAt: "",
      mistakeTypes: ["none"],
    };
  });
}
