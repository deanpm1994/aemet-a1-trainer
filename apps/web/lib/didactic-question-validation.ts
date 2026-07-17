import type { Question, QuestionSelectionInstruction } from "./types";

export type DidacticQuestionValidationIssue = {
  field: string;
  message: string;
};

const didacticInstructions: QuestionSelectionInstruction[] = [
  "choose_correct",
  "choose_incorrect",
];

const syllabusMetadataPatterns = [
  /seg[uú]n\s+(?:el\s+)?programa\s+oficial/i,
  /(?:qu[eé]|cu[aá]l)\s+(?:tema|bloque)\s+(?:corresponde|pertenece|incluye)/i,
  /tema\s+\d+\s+(?:de|del)\s+(?:programa|temario)/i,
  /(?:n[uú]mero|nº)\s+de\s+tema/i,
];

/**
 * Keeps authored practice material separate from source-owned historic exams.
 * A syllabus title is deliberately not accepted as factual support.
 */
export function validateDidacticQuestion(question: Question): DidacticQuestionValidationIssue[] {
  const issues: DidacticQuestionValidationIssue[] = [];
  const optionKeys = question.options.map((option) => option.trim().toLocaleLowerCase("es"));

  if (question.origin !== "didactic_reviewed") {
    issues.push({ field: "origin", message: "didactic questions must use didactic_reviewed origin" });
  }
  if (question.editorialStatus !== "reviewed") {
    issues.push({ field: "editorialStatus", message: "didactic questions must be reviewed before publication" });
  }
  if (!didacticInstructions.includes(question.selectionInstruction ?? "as_written")) {
    issues.push({ field: "selectionInstruction", message: "choose_correct or choose_incorrect is required" });
  }
  if (question.options.length !== 4 || new Set(optionKeys).size !== 4 || optionKeys.some((option) => !option)) {
    issues.push({ field: "options", message: "exactly four distinct non-empty options are required" });
  }
  if (!question.options.includes(question.correctAnswer)) {
    issues.push({ field: "correctAnswer", message: "the keyed answer must be one of the four options" });
  }
  if (question.topicIds.length !== 1 || !question.topicIds[0]) {
    issues.push({ field: "topicIds", message: "exactly one verified syllabus topic is required" });
  }
  if (!question.statement.trim() || !question.explanation.trim()) {
    issues.push({ field: "content", message: "statement and explanation are required" });
  }
  if (syllabusMetadataPatterns.some((pattern) => pattern.test(question.statement))) {
    issues.push({
      field: "statement",
      message: "questions must test subject knowledge, not syllabus structure or topic numbering",
    });
  }
  if (!isHttpUrl(question.sourceUrl) || !isIsoDate(question.retrievedAt)) {
    issues.push({ field: "source", message: "an authoritative source URL and retrieval date are required" });
  }

  return issues;
}

export function validateDidacticTopicCoverage(
  questions: Question[],
  verifiedTopicIds: string[],
): DidacticQuestionValidationIssue[] {
  const issues = questions.flatMap(validateDidacticQuestion);
  const counts = new Map<string, number>();
  for (const question of questions) {
    for (const topicId of question.topicIds) counts.set(topicId, (counts.get(topicId) ?? 0) + 1);
  }

  for (const topicId of verifiedTopicIds) {
    if (counts.get(topicId) !== 1) {
      issues.push({ field: "topicIds", message: `expected exactly one didactic question for ${topicId}` });
    }
  }

  return issues;
}

function isHttpUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
