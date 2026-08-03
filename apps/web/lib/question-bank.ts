import type {
  MistakeType,
  Question,
  QuestionFilters,
  QuestionType,
  VerificationStatus,
} from "./types";

type QuestionCountsByType = Record<QuestionType, number>;
type QuestionCountsByVerification = Record<VerificationStatus, number>;
type QuestionCountsByMistakeType = Record<MistakeType, number>;

export type QuestionStats = {
  total: number;
  byType: QuestionCountsByType;
  byVerificationStatus: QuestionCountsByVerification;
  byMistakeType: QuestionCountsByMistakeType;
};

export type PracticePainPoint = {
  id: string;
  label: string;
  attemptsCount: number;
  mistakeTypes: MistakeType[];
};

export function getDefaultQuestionFilters(): QuestionFilters {
  return {
    type: "all",
    verificationStatus: "all",
    difficulty: "all",
    mistakeType: "all",
  };
}

export function matchesQuestionFilters(
  question: Question,
  filters: QuestionFilters,
): boolean {
  const matchesType = filters.type === "all" || question.type === filters.type;
  const matchesVerification =
    filters.verificationStatus === "all" ||
    question.verificationStatus === filters.verificationStatus;
  const matchesDifficulty =
    filters.difficulty === "all" || question.difficulty === filters.difficulty;
  const matchesMistakeType =
    filters.mistakeType === "all" || question.mistakeTypes.includes(filters.mistakeType);

  return matchesType && matchesVerification && matchesDifficulty && matchesMistakeType;
}

export function buildQuestionStats(questions: Question[]): QuestionStats {
  const stats: QuestionStats = {
    total: questions.length,
    byType: {
      multiple_choice: 0,
      practical_case: 0,
      formula: 0,
      flashcard: 0,
      legal_short_answer: 0,
    },
    byVerificationStatus: {
      verified: 0,
      unverified: 0,
      needs_review: 0,
      deprecated: 0,
    },
    byMistakeType: {
      concept: 0,
      formula: 0,
      units: 0,
      reading: 0,
      legal_wording: 0,
      time_management: 0,
      none: 0,
    },
  };

  for (const question of questions) {
    stats.byType[question.type] += 1;
    stats.byVerificationStatus[question.verificationStatus] += 1;

    for (const mistakeType of question.mistakeTypes) {
      stats.byMistakeType[mistakeType] += 1;
    }
  }

  return stats;
}

export function getOverdueQuestions(questions: Question[], today: string): Question[] {
  return questions
    .filter((question) => question.nextReviewAt !== "" && question.nextReviewAt < today)
    .sort((left, right) => left.nextReviewAt.localeCompare(right.nextReviewAt));
}

export function getPracticePainPoints(questions: Question[]): PracticePainPoint[] {
  return [...questions]
    .filter((question) => !question.mistakeTypes.includes("none"))
    .sort((left, right) => {
      if (right.attemptsCount !== left.attemptsCount) {
        return right.attemptsCount - left.attemptsCount;
      }

      return right.mistakeTypes.length - left.mistakeTypes.length;
    })
    .slice(0, 3)
    .map((question) => ({
      id: question.id,
      label: `${question.type}: ${question.name}`,
      attemptsCount: question.attemptsCount,
      mistakeTypes: question.mistakeTypes,
    }));
}
