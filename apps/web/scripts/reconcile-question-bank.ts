import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import "./load-env";

type CsvRecord = Record<string, string>;
type ExistingRow = {
  id: string;
  correct_answer: string;
  disposition?: string | null;
  verification_status: string;
};

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

function records(text: string): CsvRecord[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) throw new Error("CSV header is missing");
  return rows.filter((row) => row.length > 1).map((row) =>
    Object.fromEntries(header.map((name, index) => [name, row[index] ?? ""])),
  );
}

function csv(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function stableId(record: CsvRecord): string {
  return `aemet-a1-acceso-libre-primer-ejercicio-${record.year}-${record.question_number}`;
}

function chunks<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  );
}

async function loadExisting(ids: string[]): Promise<Map<string, ExistingRow>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return new Map();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const existing = new Map<string, ExistingRow>();
  for (const batch of chunks(ids, 100)) {
    const currentResult = await client.from("questions")
      .select("id,correct_answer,disposition,verification_status")
      .in("id", batch);
    let data = currentResult.data as ExistingRow[] | null;
    let error = currentResult.error;
    if (error && /disposition/i.test(error.message ?? "")) {
      const legacyResult = await client.from("questions")
        .select("id,correct_answer,verification_status")
        .in("id", batch);
      data = legacyResult.data as ExistingRow[] | null;
      error = legacyResult.error;
    }
    if (error) throw error;
    for (const row of data ?? []) existing.set(row.id, row);
  }
  return existing;
}

async function main() {
  const input = resolve(process.argv[2] ?? "../../aemet-a1-acceso-libre-2026-program.csv");
  const output = resolve("../../aemet-a1-question-bank-reconciliation.csv");
  const sourceRecords = records(readFileSync(input, "utf8"));
  const existing = await loadExisting(sourceRecords.map(stableId));
  const header = [
    "stable_id",
    "existing_row",
    "source_question",
    "final_answer",
    "disposition",
    "review_status",
    "intended_mutation",
    "source_url",
  ];
  const rows = sourceRecords.map((record) => {
    const id = stableId(record);
    const current = existing.get(id);
    const complete = ["statement", "option_a", "option_b", "option_c", "option_d", "correct_option"]
      .every((field) => record[field]?.trim());
    const reviewed = record.visual_review_status === "verified" && Boolean(record.visual_reviewed_at);
    const disposition = complete && reviewed ? "available" : "quarantined";
    const reviewStatus = reviewed ? "verified" : complete ? "needs_visual_review" : "incomplete_extraction";
    const intendedMutation = reviewed
      ? current ? "update_reviewed_stable_id" : "insert_reviewed_stable_id"
      : current ? "quarantine_existing_stable_id" : "insert_quarantined_stable_id";
    return [
      id,
      current ? `${current.verification_status}:${current.correct_answer}:${current.disposition ?? "legacy"}` : "absent_or_offline",
      `${record.year}-${record.question_number}`,
      record.correct_option || "TODO_VERIFY_OFFICIAL_SOURCE",
      disposition,
      reviewStatus,
      intendedMutation,
      record.question_source_url ?? "",
    ];
  });
  writeFileSync(output, `${[header, ...rows].map((row) => row.map(csv).join(",")).join("\n")}\n`);
  console.log(`Wrote dry-run reconciliation for ${rows.length} source questions to ${output}. No database writes performed.`);
}

void main();
