import { readFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

import "./load-env";

type ReviewPayload = {
  statement: string;
  options: string[];
  correctAnswer?: string;
  contentFormat?: "plain_text" | "latex";
  visualReviewConfirmed: boolean;
};

function argument(name: string): string {
  const index = process.argv.indexOf(name);
  const result = index >= 0 ? process.argv[index + 1] : undefined;
  if (!result || result.startsWith("--")) throw new Error(`Missing ${name}`);
  return result;
}

function parsePayload(path: string): ReviewPayload {
  const payload = JSON.parse(readFileSync(path, "utf8")) as ReviewPayload;
  if (!payload.statement?.trim()) throw new Error("Review payload requires a statement");
  if (!Array.isArray(payload.options) || payload.options.some((option) => !option.trim())) {
    throw new Error("Review payload requires non-empty options");
  }
  if (payload.contentFormat && payload.contentFormat !== "plain_text" && payload.contentFormat !== "latex") {
    throw new Error("contentFormat must be plain_text or latex");
  }
  if (payload.visualReviewConfirmed !== true) {
    throw new Error("visualReviewConfirmed must be true after comparing the rendered official page");
  }
  return payload;
}

async function main() {
  const questionId = argument("--question-id");
  const payload = parsePayload(argument("--review-file"));
  const dryRun = process.argv.includes("--dry-run");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  const client = createClient(url, secretKey, { auth: { persistSession: false } });
  const { data: question, error: questionError } = await client.from("questions")
    .select("id,type,answer_source_url")
    .eq("id", questionId)
    .single();
  if (questionError || !question) throw new Error(`Question not found: ${questionId}`);
  if (question.type === "multiple_choice" && ![3, 4].includes(payload.options.length)) {
    throw new Error("A multiple-choice review requires exactly three or four options");
  }
  if (question.type === "multiple_choice" && !payload.correctAnswer?.match(/^[A-D]$/)) {
    throw new Error("A multiple-choice review requires the visually checked official answer letter");
  }
  if (question.type === "multiple_choice" && !question.answer_source_url) {
    throw new Error("An official answer-source URL is required before review");
  }
  const { count, error: assetError } = await client.from("question_source_assets")
    .select("id", { count: "exact", head: true })
    .eq("question_id", questionId)
    .eq("verification_status", "verified");
  if (assetError) throw assetError;
  if ((count ?? 0) === 0) throw new Error("Create and verify an official source crop before applying a review");
  const reviewedAt = new Date().toISOString();
  const update = {
    statement: payload.statement.trim(),
    options: payload.options.map((option) => option.trim()),
    ...(payload.correctAnswer ? { correct_answer: payload.correctAnswer } : {}),
    content_format: payload.contentFormat ?? "plain_text",
    verification_status: "verified",
    disposition: "available",
    reviewed_at: reviewedAt,
    statement_reviewed_at: reviewedAt,
    options_reviewed_at: reviewedAt,
    answer_reviewed_at: reviewedAt,
  };
  if (dryRun) {
    console.log(JSON.stringify({ questionId, update }, null, 2));
    return;
  }
  const { error: updateError } = await client.from("questions").update(update).eq("id", questionId);
  if (updateError) throw updateError;
  console.log(`Marked ${questionId} verified with a source-backed reviewed transcription.`);
}

void main();
