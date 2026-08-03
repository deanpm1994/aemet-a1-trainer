import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import { validateSourceManifest, type SourceManifest } from "../lib/question-bank-validation";
import "./load-env";

async function main() {
  const path = resolve("../../data/official-question-source-manifest.json");
  const manifest = JSON.parse(readFileSync(path, "utf8")) as SourceManifest;
  const issues = validateSourceManifest(manifest);
  if (issues.length > 0) throw new Error(issues.join("\n"));

  const rows = manifest.documents.map((document) => ({
    id: document.id,
    source_url: document.sourceUrl,
    document_sha256: document.sha256,
    retrieved_at: document.retrievedAt,
    oep_year: document.oepYear,
    exam_date: document.examDate,
    exam_part: document.examPart,
    document_role: document.documentRole,
    verification_status: document.verificationStatus,
    notes: document.notes,
  }));

  if (process.argv.includes("--dry-run")) {
    console.log(`Validated ${rows.length} official source documents; no database writes performed.`);
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await client.from("official_source_documents").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  console.log(`Upserted ${rows.length} official source documents.`);
}

void main();
