import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { officialPastExamSubsetSource } from "../lib/official-past-exam-subset";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
}

async function main() {
const client = createClient(url!, key!, { auth: { persistSession: false } });

const questions = officialPastExamSubsetSource.map((question) => ({
  id: `aemet-a1-acceso-libre-primer-ejercicio-${question.sourceYear}-${question.questionNumber}`,
  name: `${question.sourceExam} ${question.sourceYear} · Pregunta ${question.questionNumber}`,
  type: "multiple_choice",
  source_year: question.sourceYear,
  source_exam: question.sourceExam,
  source_url: question.sourceUrl,
  retrieved_at: question.retrievedAt,
  verification_status: question.verificationStatus,
  question_number: question.questionNumber,
  statement: question.statement,
  options: question.options,
  correct_answer: question.correctAnswer,
  answer_source_status: question.answerSourceStatus,
  answer_source_url: question.answerSourceUrl,
  answer_retrieved_at: question.answerRetrievedAt,
  explanation: "",
  topic_ids: question.topicIds,
  difficulty: question.difficulty,
}));

const { error: questionError } = await client.from("questions").upsert(questions, { onConflict: "id" });
if (questionError) throw questionError;

const sources = questions.map((question) => ({
  question_id: question.id,
  source_url: question.source_url,
  content_hash: createHash("sha256").update(JSON.stringify(question)).digest("hex"),
  retrieved_at: question.retrieved_at,
  verification_status: question.verification_status,
}));

const { error: sourceError } = await client.from("question_sources").upsert(sources, { onConflict: "question_id,source_url,content_hash" });
if (sourceError) throw sourceError;

console.log(`Seeded ${questions.length} verified canonical questions.`);
}

void main();
