import type { Question } from "./types";
import { getCorrectOption, gradeQuestionAnswer } from "./question-options";

export type QuizFeedback = {
  correct: boolean;
  selectedAnswerLabel: string;
  correctOptionText: string;
  explanation: string;
  sourceUrl: string;
};

export type PracticeSessionMode = "random" | "topic";
export type PracticeSessionSize = 20 | 50 | "survival";

export function getSessionQuestions(
  questions: Question[],
  size: PracticeSessionSize,
  seed: number,
): Question[] {
  return selectRandomQuestions(questions, size === "survival" ? questions.length : size, seed);
}

export function getCoverageMessage(available: number, requested: PracticeSessionSize): string | null {
  if (requested !== "survival" && available < requested) {
    return `Cobertura limitada: hay ${available} preguntas elegibles; no se repetirán durante esta sesión.`;
  }
  return null;
}

export function selectTopicQuestions(questions: Question[], topicId: string): Question[] {
  return questions.filter(
    (question) => question.correctAnswer && question.topicIds.includes(topicId),
  );
}

function nextSeed(seed: number): number {
  return (seed * 1664525 + 1013904223) >>> 0;
}

export function selectRandomQuestions(
  questions: Question[],
  count: number,
  seed: number,
): Question[] {
  const pool = questions.filter((question) => question.correctAnswer);
  const shuffled = [...pool];
  let currentSeed = seed >>> 0;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    currentSeed = nextSeed(currentSeed);
    const swapIndex = currentSeed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!];
  }

  return shuffled.slice(0, Math.max(0, count));
}

export function evaluateQuizAnswer(
  question: Question,
  selectedAnswer: string,
): QuizFeedback {
  const correctOption = getCorrectOption(question);
  return {
    correct: gradeQuestionAnswer(question, selectedAnswer),
    selectedAnswerLabel: correctOption?.key ?? question.correctAnswer,
    correctOptionText: correctOption?.text ?? question.correctAnswer,
    explanation: question.explanation,
    sourceUrl: question.answerSourceUrl ?? question.sourceUrl,
  };
}
