import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import "./load-env";

type CsvRecord = Record<string, string>;

type ImportQuestion = {
  id: string;
  name: string;
  type: "multiple_choice";
  source_year: number;
  oep_year: number;
  exam_part: "first_exercise_part_1";
  source_exam: string;
  source_url: string;
  retrieved_at: string;
  verification_status: "verified" | "needs_review";
  question_number: string;
  statement: string;
  options: string[];
  raw_statement: string;
  raw_options: string[];
  content_format: "plain_text";
  reviewed_at: string | null;
  correct_answer: string;
  answer_source_status: "official";
  answer_source_url: string;
  answer_retrieved_at: string;
  origin: "official_historic";
  editorial_status: "official";
  selection_instruction: "as_written";
  explanation: string;
  question_role: "ordinary";
  reserve_disposition: "not_applicable";
  disposition: "available" | "quarantined";
  answer_format: "single_choice";
  statement_reviewed_at: string | null;
  options_reviewed_at: string | null;
  answer_reviewed_at: string | null;
  topic_ids: string[];
  difficulty: 3;
};

const csvPath = resolve(process.argv[2] ?? "../../aemet-a1-acceso-libre-2026-program.csv");
const dryRun = process.argv.includes("--dry-run");
const retrievedAt = "2026-07-17";
const rejectedPath = resolve("../../aemet-a1-acceso-libre-2026-program-import-rejected.csv");

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (field || row.length) rows.push([...row, field]);
  return rows;
}

function csvRecords(text: string): CsvRecord[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) throw new Error("CSV header is missing");
  return rows.filter((row) => row.length > 1).map((row) =>
    Object.fromEntries(header.map((name, index) => [name, row[index] ?? ""])),
  );
}

function csv(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function required(record: CsvRecord, field: string): string {
  const value = record[field]?.trim();
  if (!value) throw new Error(`Question ${record.year}-${record.question_number}: ${field} is required`);
  return value;
}

function toImportQuestion(record: CsvRecord): ImportQuestion {
  const sourceYear = Number(required(record, "year"));
  const questionNumber = required(record, "question_number");
  const statement = required(record, "statement");
  const options = ["option_a", "option_b", "option_c", "option_d"].map((field) => required(record, field));
  const correctAnswer = required(record, "correct_option");

  if (!Number.isInteger(sourceYear)) throw new Error(`Question ${record.year}-${questionNumber}: invalid year`);
  if (!/^[A-D]$/.test(correctAnswer)) throw new Error(`Question ${sourceYear}-${questionNumber}: correct option must be A–D`);
  if (record.answer_key_status !== "official") throw new Error(`Question ${sourceYear}-${questionNumber}: official answer key is required`);

  const visualReviewConfirmed = record.visual_review_status === "verified";
  const visualReviewedAt = visualReviewConfirmed ? required(record, "visual_reviewed_at") : null;
  const verificationStatus = visualReviewConfirmed ? "verified" : "needs_review";
  const sourceExam = required(record, "exam");
  const id = `aemet-a1-acceso-libre-primer-ejercicio-${sourceYear}-${questionNumber}`;

  return {
    id,
    name: `${sourceExam} ${sourceYear} · Pregunta ${questionNumber}`,
    type: "multiple_choice",
    source_year: sourceYear,
    oep_year: sourceYear,
    exam_part: "first_exercise_part_1",
    source_exam: sourceExam,
    source_url: required(record, "question_source_url"),
    retrieved_at: retrievedAt,
    verification_status: verificationStatus,
    question_number: questionNumber,
    statement,
    options,
    raw_statement: statement,
    raw_options: options,
    content_format: "plain_text",
    reviewed_at: visualReviewedAt,
    correct_answer: correctAnswer,
    answer_source_status: "official",
    answer_source_url: required(record, "answer_key_source_url"),
    answer_retrieved_at: retrievedAt,
    origin: "official_historic",
    editorial_status: "official",
    selection_instruction: "as_written",
    explanation: "",
    question_role: "ordinary",
    reserve_disposition: "not_applicable",
    disposition: visualReviewConfirmed ? "available" : "quarantined",
    answer_format: "single_choice",
    statement_reviewed_at: visualReviewedAt,
    options_reviewed_at: visualReviewedAt,
    answer_reviewed_at: visualReviewedAt,
    topic_ids: [],
    difficulty: 3,
  };
}

function chunks<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  );
}

async function main() {
  const records = csvRecords(readFileSync(csvPath, "utf8"));
  const questions: ImportQuestion[] = [];
  const rejected: Array<{ year: string; questionNumber: string; reason: string }> = [];
  for (const record of records) {
    try {
      questions.push(toImportQuestion(record));
    } catch (error) {
      rejected.push({
        year: record.year ?? "",
        questionNumber: record.question_number ?? "",
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  writeFileSync(
    rejectedPath,
    `${["year,question_number,rejection_reason", ...rejected.map((record) =>
      [record.year, record.questionNumber, record.reason].map(csv).join(","),
    )].join("\n")}\n`,
  );
  const uniqueIds = new Set(questions.map((question) => question.id));
  if (questions.length !== uniqueIds.size) throw new Error("CSV has duplicate stable question IDs");

  const verified = questions.filter((question) => question.verification_status === "verified").length;
  const needsReview = questions.length - verified;
  console.log(`Validated ${questions.length} questions (${verified} verified, ${needsReview} needs_review); rejected ${rejected.length} incomplete rows.`);
  if (dryRun) return;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  const client = createClient(url, key, { auth: { persistSession: false } });

  const existingTopicIds = new Map<string, string[]>();
  for (const ids of chunks(questions.map((question) => question.id), 100)) {
    const { data, error } = await client.from("questions").select("id, topic_ids").in("id", ids);
    if (error) throw error;
    for (const row of data ?? []) {
      if (Array.isArray(row.topic_ids) && row.topic_ids.length > 0) existingTopicIds.set(row.id, row.topic_ids);
    }
  }

  const mappedQuestions = questions.map((question) => ({
    ...question,
    topic_ids: existingTopicIds.get(question.id) ?? question.topic_ids,
  }));

  for (const batch of chunks(mappedQuestions, 100)) {
    const { error } = await client.from("questions").upsert(batch, { onConflict: "id" });
    if (error) throw error;
  }

  const sources = mappedQuestions.map((question) => ({
    question_id: question.id,
    source_url: question.source_url,
    content_hash: createHash("sha256").update(JSON.stringify(question)).digest("hex"),
    retrieved_at: question.retrieved_at,
    verification_status: question.verification_status,
  }));
  for (const batch of chunks(sources, 100)) {
    const { error } = await client.from("question_sources").upsert(batch, {
      onConflict: "question_id,source_url,content_hash",
    });
    if (error) throw error;
  }

  console.log(`Imported ${mappedQuestions.length} canonical questions; preserved ${existingTopicIds.size} existing topic mappings.`);

  const [totalResult, verifiedResult, needsReviewResult] = await Promise.all([
    client.from("questions").select("id", { count: "exact", head: true })
      .eq("origin", "official_historic")
      .gte("source_year", 2014)
      .lte("source_year", 2018),
    client.from("questions").select("id", { count: "exact", head: true })
      .eq("origin", "official_historic")
      .eq("verification_status", "verified")
      .gte("source_year", 2014)
      .lte("source_year", 2018),
    client.from("questions").select("id", { count: "exact", head: true })
      .eq("origin", "official_historic")
      .eq("verification_status", "needs_review")
      .gte("source_year", 2014)
      .lte("source_year", 2018),
  ]);
  for (const result of [totalResult, verifiedResult, needsReviewResult]) {
    if (result.error) throw result.error;
  }
  console.log(`Verified persisted counts: ${totalResult.count ?? 0} total, ${verifiedResult.count ?? 0} verified, ${needsReviewResult.count ?? 0} needs_review.`);
  if ((totalResult.count ?? 0) > mappedQuestions.length) {
    const { data, error } = await client.from("questions").select("id")
      .eq("origin", "official_historic")
      .gte("source_year", 2014)
      .lte("source_year", 2018);
    if (error) throw error;
    const importedIds = new Set(mappedQuestions.map((question) => question.id));
    const retainedIds = (data ?? []).map((row) => row.id).filter((id) => !importedIds.has(id));
    console.log(`Retained ${retainedIds.length} previously vetted record not replaced from incomplete CSV OCR: ${retainedIds.join(", ")}.`);
  }
}

void main();
