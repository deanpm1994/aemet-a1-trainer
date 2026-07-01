import type { MistakeType } from "./types";
import type { QuestionProgressUpdate } from "./question-progress-persistence";

export type QuestionAttemptRow = {
  id: string;
  user_id: string;
  question_id: string;
  attempted_at: string;
  selected_answer: string;
  is_correct: boolean;
  mistake_types: string[];
  confidence_after: number;
  notes: string;
  created_at: string;
};

export type QuestionAttemptRowInput = Omit<
  QuestionAttemptRow,
  "id" | "created_at"
>;

export type QuestionAttempt = {
  id: string;
  userId: string;
  questionId: string;
  attemptedAt: string;
  selectedAnswer: string;
  isCorrect: boolean;
  mistakeTypes: MistakeType[];
  confidenceAfter: number;
  notes: string;
};

export type QuestionAttemptInput = Omit<QuestionAttempt, "id" | "userId">;

export function mapRowToQuestionAttempt(row: QuestionAttemptRow): QuestionAttempt {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    attemptedAt: row.attempted_at,
    selectedAnswer: row.selected_answer,
    isCorrect: row.is_correct,
    mistakeTypes: row.mistake_types as MistakeType[],
    confidenceAfter: row.confidence_after,
    notes: row.notes,
  };
}

export function mapQuestionAttemptInputToRowInput(
  userId: string,
  input: QuestionAttemptInput,
): QuestionAttemptRowInput {
  return {
    user_id: userId,
    question_id: input.questionId,
    attempted_at: input.attemptedAt,
    selected_answer: input.selectedAnswer,
    is_correct: input.isCorrect,
    mistake_types: input.mistakeTypes,
    confidence_after: input.confidenceAfter,
    notes: input.notes,
  };
}

export function buildQuestionProgressFromAttempts(
  questionId: string,
  attempts: QuestionAttempt[],
): QuestionProgressUpdate {
  const sortedAttempts = [...attempts].sort((left, right) =>
    left.attemptedAt.localeCompare(right.attemptedAt),
  );
  const latestAttempt = sortedAttempts.at(-1);

  if (!latestAttempt) {
    return {
      questionId,
      attemptsCount: 0,
      lastAttemptAt: "",
      nextReviewAt: "",
      mistakeTypes: ["none"],
    };
  }

  return {
    questionId,
    attemptsCount: sortedAttempts.length,
    lastAttemptAt: latestAttempt.attemptedAt,
    nextReviewAt: addDays(
      latestAttempt.attemptedAt,
      getReviewIntervalDays(latestAttempt),
    ),
    mistakeTypes: latestAttempt.mistakeTypes.includes("none")
      ? ["none"]
      : latestAttempt.mistakeTypes,
  };
}

function getReviewIntervalDays(attempt: QuestionAttempt): number {
  if (!attempt.isCorrect) {
    return 2;
  }

  return attempt.confidenceAfter >= 4 ? 14 : 7;
}

function addDays(date: string, days: number): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}
