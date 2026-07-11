import type { Question, StudySession, Topic } from "./types";

export type OrchestrationInput = {
  topics: Topic[];
  questions: Question[];
  startDate: string;
};

function isDue(topic: Topic, today: string): boolean {
  return Boolean(topic.nextReviewAt) && topic.nextReviewAt <= today;
}

export function rankStudyTopics(topics: Topic[], today: string): Topic[] {
  return [...topics].sort((left, right) => {
    const dueCompare = Number(isDue(right, today)) - Number(isDue(left, today));
    if (dueCompare !== 0) return dueCompare;
    if (left.confidence !== right.confidence) return left.confidence - right.confidence;
    const statusCompare = Number(left.status !== "not_started") - Number(right.status !== "not_started");
    if (statusCompare !== 0) return statusCompare;
    const blockCompare = left.block.localeCompare(right.block);
    return blockCompare !== 0 ? blockCompare : Number(left.officialNumber) - Number(right.officialNumber);
  });
}

function dateForOffset(startDate: string, offset: number): string {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function createSession(
  date: string,
  topic: Topic,
  questionIds: string[],
  index: number,
  sessionType: StudySession["sessionType"],
  start: string,
  end: string,
  duration: number,
): StudySession {
  return {
    id: `orchestrated-${date}-${index}`,
    name: sessionType === "deep_topic" ? `Estudio: ${topic.normalizedTitle}` : sessionType === "questions" ? `Preguntas: ${topic.normalizedTitle}` : `Repaso: ${topic.normalizedTitle}`,
    sessionType,
    objective: sessionType === "questions" ? "Resolver preguntas vinculadas y registrar errores." : sessionType === "review" ? "Repasar conceptos pendientes y fijar próxima revisión." : "Completar una sesión de estudio profundo con un resultado verificable.",
    topicIds: [topic.id],
    questionIds,
    plannedDate: date,
    plannedStartTime: start,
    plannedEndTime: end,
    plannedDurationMinutes: duration,
    status: "scheduled",
    timerStatus: "idle",
    completed: false,
    reviewState: "not_needed",
    notesCreated: false,
    questionsSolved: 0,
    flashcardsCreated: 0,
    mistakesLogged: 0,
    confidenceAfter: null,
    nextReviewAt: "",
    notes: "",
    isTemplate: false,
    isPersisted: false,
  };
}

export function orchestrateStudyWeek(input: OrchestrationInput): StudySession[] {
  const rankedTopics = rankStudyTopics(input.topics, input.startDate);
  if (rankedTopics.length === 0) return [];

  return Array.from({ length: 5 }, (_, dayIndex) => {
    const topic = rankedTopics[dayIndex % rankedTopics.length]!;
    const date = dateForOffset(input.startDate, dayIndex);
    const questionIds = input.questions.filter((question) => question.topicIds.includes(topic.id)).map((question) => question.id);
    const offset = dayIndex * 3;
    return [
      createSession(date, topic, questionIds, offset, "deep_topic", "07:30", "09:00", 90),
      createSession(date, topic, questionIds, offset + 1, "questions", "09:10", "10:10", 60),
      createSession(date, topic, questionIds, offset + 2, "review", "10:20", "11:00", 40),
    ];
  }).flat();
}
