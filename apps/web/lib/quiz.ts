import type { Question } from "./types";

export type QuizFeedback = {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
};

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
  return {
    correct: selectedAnswer === question.correctAnswer,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
}
