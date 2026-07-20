import { getCorrectOption } from "./question-options";
import type { Question } from "./types";

export type QuestionValidationIssue = {
  questionId: string;
  field: string;
  message: string;
};

export type SourceManifestDocument = {
  id: string;
  sourceUrl: string;
  sha256: string;
  retrievedAt: string;
  oepYear: number;
  examDate: string | null;
  examPart: "first_exercise_part_1" | "first_exercise_part_2";
  documentRole:
    | "questionnaire"
    | "definitive_answer_key"
    | "practical_paper"
    | "authoritative_support";
  verificationStatus: "verified" | "unverified" | "needs_review" | "deprecated";
  notes: string;
};

export type SourceManifest = {
  schemaVersion: number;
  documents: SourceManifestDocument[];
};

const pageFurniturePattern =
  /Tribunal Calificador|PRIMER EJERCICIO \(las respuestas|INFORME DE FIRMA|DIRECCI[ÓO]N DE VALIDACI[ÓO]N|_{10,}/i;
const suspiciousScriptPattern = /[\u0590-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/u;

export function validateSourceManifest(manifest: SourceManifest): string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const document of manifest.documents) {
    if (ids.has(document.id)) issues.push(`duplicate document id: ${document.id}`);
    ids.add(document.id);
    if (!/^https:\/\/.+/.test(document.sourceUrl)) issues.push(`${document.id}: invalid source URL`);
    if (!/^[0-9a-f]{64}$/.test(document.sha256)) issues.push(`${document.id}: invalid SHA-256`);
    if (!isIsoDate(document.retrievedAt)) issues.push(`${document.id}: invalid retrieval date`);
    if (document.examDate !== null && !isIsoDate(document.examDate)) {
      issues.push(`${document.id}: invalid exam date`);
    }
  }
  return issues;
}

export function validateQuestionForPublication(question: Question): QuestionValidationIssue[] {
  const issues: QuestionValidationIssue[] = [];
  const add = (field: string, message: string) =>
    issues.push({ questionId: question.id, field, message });
  const visibleText = [question.statement, ...question.options].join(" ");

  if (question.verificationStatus !== "verified") add("verificationStatus", "learner-visible questions must be verified");
  if ((question.disposition ?? "available") !== "available") add("disposition", "learner-visible questions must be available");
  if (pageFurniturePattern.test(visibleText)) add("content", "PDF header or footer text is embedded");
  if (suspiciousScriptPattern.test(visibleText)) add("content", "unexpected character script detected");
  if (question.contentFormat === "latex" && !hasValidLatexDelimiters(visibleText)) {
    add("contentFormat", "unbalanced LaTeX delimiters or braces");
  }

  if (question.type === "multiple_choice") {
    if (![3, 4].includes(question.options.length)) add("options", "multiple-choice questions require three or four options");
    if (new Set(question.options.map(normalizeText)).size !== question.options.length) {
      add("options", "multiple-choice options must be distinct");
    }
    if (!getCorrectOption(question)) add("correctAnswer", "answer key does not resolve by option position");
  }

  if (question.type === "practical_case") {
    if (question.answerFormat !== "developed_response") add("answerFormat", "practical exercises require developed_response");
    if (!question.modelAnswer?.trim()) add("modelAnswer", "reviewed non-official model answer is required");
    if (!question.gradingRubric?.trim()) add("gradingRubric", "self-assessment rubric is required");
    if (question.answerSourceStatus !== "inferred") add("answerSourceStatus", "practical model answers must be explicitly non-official");
    if (!(question.answerSupports?.length)) add("answerSupports", "practical model answers require authoritative support");
  }

  if (question.questionRole === "reserve" && question.reserveDisposition === "not_applicable") {
    add("reserveDisposition", "reserve questions must be activated or unused");
  }
  if (question.questionRole !== "reserve" && question.reserveDisposition && question.reserveDisposition !== "not_applicable") {
    add("reserveDisposition", "ordinary questions cannot carry a reserve disposition");
  }

  return issues;
}

export function validateQuestionBank(questions: Question[]): QuestionValidationIssue[] {
  const issues = questions.flatMap(validateQuestionForPublication);
  const normalized = new Map<string, Question>();
  for (const question of questions) {
    const key = normalizeText(question.statement);
    const duplicate = normalized.get(key);
    if (duplicate) {
      issues.push({
        questionId: question.id,
        field: "statement",
        message: `duplicate statement also used by ${duplicate.id}`,
      });
    } else {
      normalized.set(key, question);
    }
  }

  const official = questions.filter((question) => question.origin === "official_historic");
  const didactic = questions.filter((question) => question.origin === "didactic_reviewed");
  for (const authored of didactic) {
    for (const sourceQuestion of official) {
      if (jaccardSimilarity(authored.statement, sourceQuestion.statement) >= 0.9) {
        issues.push({
          questionId: authored.id,
          field: "statement",
          message: `near-copy of official question ${sourceQuestion.id}`,
        });
      }
    }
  }
  return issues;
}

export function validateRecentDefinitiveDecisions(questions: Question[]): QuestionValidationIssue[] {
  const issues: QuestionValidationIssue[] = [];
  const expectations = [
    { oepYear: 2024, annulled: ["5", "7", "13", "52", "74"], activated: ["101", "102", "103", "104", "105"], usable: 100 },
    { oepYear: 2025, annulled: ["41", "62"], activated: ["121", "122"], usable: 123 },
  ];

  for (const expectation of expectations) {
    const set = questions.filter((question) => question.oepYear === expectation.oepYear);
    for (const number of expectation.annulled) {
      const question = set.find((candidate) => candidate.questionNumber === number);
      if (!question || question.disposition !== "annulled") {
        issues.push({
          questionId: question?.id ?? `oep-${expectation.oepYear}-${number}`,
          field: "disposition",
          message: "definitively annulled question must be retained only as an annulled audit record",
        });
      }
    }
    for (const number of expectation.activated) {
      const question = set.find((candidate) => candidate.questionNumber === number);
      if (!question || question.questionRole !== "reserve" || question.reserveDisposition !== "activated") {
        issues.push({
          questionId: question?.id ?? `oep-${expectation.oepYear}-${number}`,
          field: "reserveDisposition",
          message: "definitively activated reserve is not represented correctly",
        });
      }
    }
    const usable = set.filter((question) => question.disposition === "available").length;
    if (usable !== expectation.usable) {
      issues.push({
        questionId: `oep-${expectation.oepYear}`,
        field: "count",
        message: `expected ${expectation.usable} usable questions, received ${usable}`,
      });
    }
  }

  for (const [number, answer] of [["37", "B"], ["96", "B"]] as const) {
    const question = questions.find((candidate) => candidate.oepYear === 2025 && candidate.questionNumber === number);
    if (!question || question.correctAnswer !== answer) {
      issues.push({
        questionId: question?.id ?? `oep-2025-${number}`,
        field: "correctAnswer",
        message: `definitive OEP 2025 answer must be ${answer}`,
      });
    }
  }
  return issues;
}

function hasValidLatexDelimiters(value: string): boolean {
  const inline = value.match(/\\\(/g)?.length ?? 0;
  const inlineClose = value.match(/\\\)/g)?.length ?? 0;
  const block = value.match(/\\\[/g)?.length ?? 0;
  const blockClose = value.match(/\\\]/g)?.length ?? 0;
  let braces = 0;
  for (const character of value) {
    if (character === "{") braces += 1;
    if (character === "}") braces -= 1;
    if (braces < 0) return false;
  }
  return inline === inlineClose && block === blockClose && braces === 0;
}

function jaccardSimilarity(left: string, right: string): number {
  const leftTokens = new Set(normalizeText(left).split(" ").filter(Boolean));
  const rightTokens = new Set(normalizeText(right).split(" ").filter(Boolean));
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union === 0 ? 1 : intersection / union;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
