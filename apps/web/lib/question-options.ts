import type { Question, QuestionOption } from "./types";

const optionPrefix = /^\s*([A-Z])\s*[\).:]\s*/i;

export function getQuestionOptions(question: Pick<Question, "options">): QuestionOption[] {
  return question.options.map((value, index) => ({
    key: optionKeyForIndex(index),
    text: value.replace(optionPrefix, "").trim(),
    value,
  }));
}

export function optionKeyForIndex(index: number): string {
  return String.fromCharCode("A".charCodeAt(0) + index);
}

export function getCorrectOption(question: Pick<Question, "options" | "correctAnswer">): QuestionOption | null {
  const options = getQuestionOptions(question);
  const index = resolveOptionIndex(question, question.correctAnswer);
  return index === null ? null : options[index] ?? null;
}

export function gradeQuestionAnswer(
  question: Pick<Question, "options" | "correctAnswer">,
  selectedAnswer: string,
): boolean {
  const selectedIndex = resolveOptionIndex(question, selectedAnswer);
  const correctIndex = resolveOptionIndex(question, question.correctAnswer);
  return selectedIndex !== null && correctIndex !== null && selectedIndex === correctIndex;
}

export function resolveOptionIndex(
  question: Pick<Question, "options">,
  answer: string,
): number | null {
  const normalizedAnswer = answer.trim();
  if (!normalizedAnswer) return null;

  const exactIndex = question.options.findIndex(
    (option) => option.trim() === normalizedAnswer,
  );
  if (exactIndex >= 0) return exactIndex;

  const labelled = optionPrefix.exec(normalizedAnswer);
  const key = labelled?.[1] ?? (/^[A-Z]$/i.test(normalizedAnswer) ? normalizedAnswer : null);
  if (!key) return null;

  const index = key.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return index >= 0 && index < question.options.length ? index : null;
}
