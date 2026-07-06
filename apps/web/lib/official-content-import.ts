import type { AnswerSourceStatus, Topic, VerificationStatus } from "./types";

type ImportIssue = {
  field: string;
  message: string;
};

type ValidationResult<T> =
  | { ok: true; record: T }
  | { ok: false; issues: ImportIssue[] };

export type ImportedSyllabusTopicRecord = {
  id: string;
  block: string;
  officialNumber: string;
  officialTitle: string;
  normalizedTitle: string;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: "verified" | "needs_review";
};

export type ImportedPastExamQuestionRecord = {
  id: string;
  sourceExam: string;
  sourceYear: number;
  questionNumber: string;
  statement: string;
  options: string[];
  correctAnswer: string;
  answerSourceStatus: AnswerSourceStatus;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: "verified" | "needs_review";
};

type ImportVerificationStatus = ImportedSyllabusTopicRecord["verificationStatus"];

type RawSyllabusTopicRecord = {
  block: string;
  officialNumber: string;
  officialTitle: string;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
};

type RawPastExamQuestionRecord = {
  sourceExam: string;
  sourceYear: number;
  questionNumber: string;
  statement: string;
  options: string[];
  correctAnswer: string;
  answerSourceStatus: AnswerSourceStatus;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
};

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeAsciiTitle(value: string): string {
  return normalizeWhitespace(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getImportVerificationStatus(
  value: VerificationStatus,
): ImportVerificationStatus | null {
  if (value === "verified" || value === "needs_review") {
    return value;
  }

  return null;
}

export function parseOfficialSyllabusTopicRecord(
  input: RawSyllabusTopicRecord,
): ValidationResult<ImportedSyllabusTopicRecord> {
  const issues: ImportIssue[] = [];
  const verificationStatus = getImportVerificationStatus(input.verificationStatus);

  if (!normalizeWhitespace(input.sourceUrl)) {
    issues.push({
      field: "sourceUrl",
      message: "sourceUrl is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.retrievedAt)) {
    issues.push({
      field: "retrievedAt",
      message: "retrievedAt is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.officialTitle)) {
    issues.push({
      field: "officialTitle",
      message: "officialTitle is required for official imports",
    });
  }

  if (!verificationStatus) {
    issues.push({
      field: "verificationStatus",
      message: "verificationStatus must be verified or needs_review",
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  if (!verificationStatus) {
    throw new Error("verificationStatus should be validated before record creation");
  }

  return {
    ok: true,
    record: {
      id: toSlug(`${input.block}-${input.officialNumber}`),
      block: normalizeWhitespace(input.block),
      officialNumber: normalizeWhitespace(input.officialNumber),
      officialTitle: normalizeWhitespace(input.officialTitle),
      normalizedTitle: normalizeAsciiTitle(input.officialTitle),
      sourceName: normalizeWhitespace(input.sourceName),
      sourceUrl: normalizeWhitespace(input.sourceUrl),
      retrievedAt: normalizeWhitespace(input.retrievedAt),
      verificationStatus,
    },
  };
}

export function mapImportedSyllabusTopicToTopic(
  record: ImportedSyllabusTopicRecord,
): Topic {
  return {
    id: record.id,
    block: record.block,
    officialNumber: record.officialNumber,
    officialTitle: record.officialTitle,
    normalizedTitle: record.normalizedTitle,
    status: "not_started",
    confidence: 0,
    priority: "medium",
    nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    verificationStatus: record.verificationStatus,
    sourceUrl: record.sourceUrl,
    retrievedAt: record.retrievedAt,
    notesStatus: "source_imported",
  };
}

export function validateOfficialPastExamQuestionRecord(
  input: RawPastExamQuestionRecord,
): ValidationResult<ImportedPastExamQuestionRecord> {
  const issues: ImportIssue[] = [];
  const verificationStatus = getImportVerificationStatus(input.verificationStatus);

  if (!normalizeWhitespace(input.sourceUrl)) {
    issues.push({
      field: "sourceUrl",
      message: "sourceUrl is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.retrievedAt)) {
    issues.push({
      field: "retrievedAt",
      message: "retrievedAt is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.statement)) {
    issues.push({
      field: "statement",
      message: "statement is required for official imports",
    });
  }

  if (!Array.isArray(input.options) || input.options.length === 0) {
    issues.push({
      field: "options",
      message: "options must contain at least one source option",
    });
  }

  if (!verificationStatus) {
    issues.push({
      field: "verificationStatus",
      message: "verificationStatus must be verified or needs_review",
    });
  }

  if (
    verificationStatus === "verified" &&
    (input.answerSourceStatus === "unknown" || input.answerSourceStatus === "user")
  ) {
    issues.push({
      field: "answerSourceStatus",
      message:
        "verified official question imports cannot use unknown or user answer sources",
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  if (!verificationStatus) {
    throw new Error("verificationStatus should be validated before record creation");
  }

  return {
    ok: true,
    record: {
      id: toSlug(`${input.sourceExam}-${input.sourceYear}-${input.questionNumber}`),
      sourceExam: normalizeWhitespace(input.sourceExam),
      sourceYear: input.sourceYear,
      questionNumber: normalizeWhitespace(input.questionNumber),
      statement: normalizeWhitespace(input.statement),
      options: input.options.map((option) => normalizeWhitespace(option)),
      correctAnswer: normalizeWhitespace(input.correctAnswer),
      answerSourceStatus: input.answerSourceStatus,
      sourceName: normalizeWhitespace(input.sourceName),
      sourceUrl: normalizeWhitespace(input.sourceUrl),
      retrievedAt: normalizeWhitespace(input.retrievedAt),
      verificationStatus,
    },
  };
}
