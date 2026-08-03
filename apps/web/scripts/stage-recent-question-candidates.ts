import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import "./load-env";

type MultipleChoiceCandidate = {
  id: string;
  oepYear: number;
  examDate: string;
  questionNumber: string;
  rawStatement: string;
  rawOptions: string[];
  definitiveAnswer: string;
  questionRole: "ordinary" | "reserve";
  reserveDisposition: "not_applicable" | "activated" | "unused";
  disposition: "annulled" | "quarantined";
  questionSourceUrl: string;
  answerSourceUrl: string;
  retrievedAt: string;
};

type PracticalCandidate = {
  id: string;
  oepYear: number;
  examDate: string;
  caseGroup: "A" | "B";
  exerciseNumber: string;
  rawStatement: string;
  sourceUrl: string;
  retrievedAt: string;
};

function records<T>(file: string): T[] {
  return (JSON.parse(readFileSync(resolve(`../../data/${file}`), "utf8")) as { records: T[] }).records;
}

function chunks<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  );
}

async function main() {
  const multipleChoice = records<MultipleChoiceCandidate>("recent-official-question-candidates.json");
  const practical = records<PracticalCandidate>("recent-official-practical-candidates.json");
  const rows = [
    ...multipleChoice.map((candidate) => ({
      id: candidate.id,
      name: `AEMET A1 OEP ${candidate.oepYear} · Pregunta ${candidate.questionNumber}`,
      type: "multiple_choice",
      source_year: Number(candidate.examDate.slice(0, 4)),
      oep_year: candidate.oepYear,
      exam_date: candidate.examDate,
      exam_part: "first_exercise_part_1",
      source_exam: `AEMET A1 OEP ${candidate.oepYear} · Primer ejercicio parte 1`,
      source_url: candidate.questionSourceUrl,
      retrieved_at: candidate.retrievedAt,
      verification_status: "needs_review",
      question_number: candidate.questionNumber,
      statement: candidate.rawStatement,
      options: candidate.rawOptions,
      raw_statement: candidate.rawStatement,
      raw_options: candidate.rawOptions,
      content_format: "plain_text",
      correct_answer: candidate.definitiveAnswer,
      answer_source_status: "official",
      answer_source_url: candidate.answerSourceUrl,
      answer_retrieved_at: candidate.retrievedAt,
      origin: "official_historic",
      editorial_status: "official",
      selection_instruction: "as_written",
      explanation: "",
      question_role: candidate.questionRole,
      reserve_disposition: candidate.reserveDisposition,
      disposition: candidate.disposition,
      answer_format: "single_choice",
      topic_ids: [] as string[],
      difficulty: 3,
    })),
    ...practical.map((candidate) => ({
      id: candidate.id,
      name: `AEMET A1 OEP ${candidate.oepYear} · Supuesto ${candidate.caseGroup}${candidate.exerciseNumber}`,
      type: "practical_case",
      source_year: Number(candidate.examDate.slice(0, 4)),
      oep_year: candidate.oepYear,
      exam_date: candidate.examDate,
      exam_part: "first_exercise_part_2",
      source_exam: `AEMET A1 OEP ${candidate.oepYear} · Primer ejercicio parte 2`,
      source_url: candidate.sourceUrl,
      retrieved_at: candidate.retrievedAt,
      verification_status: "needs_review",
      question_number: `${candidate.caseGroup}${candidate.exerciseNumber}`,
      statement: candidate.rawStatement,
      options: [] as string[],
      raw_statement: candidate.rawStatement,
      raw_options: [] as string[],
      content_format: "plain_text",
      correct_answer: "",
      answer_source_status: "inferred",
      answer_source_url: null,
      answer_retrieved_at: null,
      origin: "official_historic",
      editorial_status: "official",
      selection_instruction: "as_written",
      explanation: "",
      question_role: "ordinary",
      reserve_disposition: "not_applicable",
      disposition: "quarantined",
      case_group: candidate.caseGroup,
      model_answer: null,
      answer_format: "developed_response",
      grading_rubric: null,
      topic_ids: [] as string[],
      difficulty: 4,
    })),
  ];
  if (multipleChoice.length !== 230 || practical.length !== 32) {
    throw new Error("Candidate counts do not match the reviewed source inventory");
  }
  console.log(`Validated ${rows.length} stable candidate rows: 230 multiple-choice and 32 practical.`);
  if (!process.argv.includes("--apply")) {
    console.log("Dry run only. Pass --apply after reviewing the reconciliation and applying the migration.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const existingTopics = new Map<string, string[]>();
  for (const batch of chunks(rows.map((row) => row.id), 100)) {
    const { data, error } = await client.from("questions").select("id,topic_ids").in("id", batch);
    if (error) throw error;
    for (const row of data ?? []) if (row.topic_ids?.length) existingTopics.set(row.id, row.topic_ids);
  }
  const stableRows = rows.map((row) => ({ ...row, topic_ids: existingTopics.get(row.id) ?? row.topic_ids }));
  for (const batch of chunks(stableRows, 100)) {
    const { error } = await client.from("questions").upsert(batch, { onConflict: "id" });
    if (error) throw error;
  }
  const sources = stableRows.map((row) => ({
    question_id: row.id,
    source_url: row.source_url,
    content_hash: createHash("sha256").update(JSON.stringify(row)).digest("hex"),
    retrieved_at: row.retrieved_at,
    verification_status: "needs_review",
  }));
  for (const batch of chunks(sources, 100)) {
    const { error } = await client.from("question_sources").upsert(batch, {
      onConflict: "question_id,source_url,content_hash",
    });
    if (error) throw error;
  }
  console.log(`Staged ${stableRows.length} quarantined candidates without deleting progress.`);
}

void main();
