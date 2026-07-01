import type { MistakeType, Question } from "./types";

export type QuestionProgressRow = {
  user_id: string;
  question_id: string;
  attempts_count: number;
  last_attempt_at: string;
  next_review_at: string;
  mistake_types: string[];
  created_at: string;
  updated_at: string;
};

export type QuestionProgressRowInput = Omit<
  QuestionProgressRow,
  "created_at" | "updated_at"
>;

export type QuestionProgressUpdate = Pick<
  Question,
  "attemptsCount" | "lastAttemptAt" | "nextReviewAt" | "mistakeTypes"
> & {
  questionId: string;
};

export type QuestionProgressFormUpdate = Omit<
  QuestionProgressUpdate,
  "questionId"
>;

export function mapRowToQuestionProgressUpdate(
  row: QuestionProgressRow,
): QuestionProgressUpdate {
  return {
    questionId: row.question_id,
    attemptsCount: row.attempts_count,
    lastAttemptAt: row.last_attempt_at,
    nextReviewAt: row.next_review_at,
    mistakeTypes: row.mistake_types as MistakeType[],
  };
}

export function mapQuestionProgressUpdateToRowInput(
  userId: string,
  questionId: string,
  update: QuestionProgressFormUpdate,
): QuestionProgressRowInput {
  return {
    user_id: userId,
    question_id: questionId,
    attempts_count: update.attemptsCount,
    last_attempt_at: update.lastAttemptAt,
    next_review_at: update.nextReviewAt,
    mistake_types: update.mistakeTypes,
  };
}

export function applyQuestionProgress(
  questions: Question[],
  updates: QuestionProgressUpdate[],
): Question[] {
  const updatesByQuestionId = new Map(
    updates.map((update) => [update.questionId, update]),
  );

  return questions.map((question) => {
    const update = updatesByQuestionId.get(question.id);

    if (!update) {
      return question;
    }

    return {
      ...question,
      attemptsCount: update.attemptsCount,
      lastAttemptAt: update.lastAttemptAt,
      nextReviewAt: update.nextReviewAt,
      mistakeTypes: update.mistakeTypes,
    };
  });
}
