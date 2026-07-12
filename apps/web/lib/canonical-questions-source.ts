import "server-only";

import { getVerifiedCanonicalQuestions } from "./canonical-questions-repository";
import { loadOfficialPastExamSubset } from "./official-past-exam-subset";
import { createSupabaseServerClient } from "./supabase-server";
import type { Question } from "./types";

export type CanonicalQuestionsSource = {
  questions: Question[];
  sourceState: "live" | "fallback_error";
  message: string;
};

export async function loadCanonicalQuestionsSource(): Promise<CanonicalQuestionsSource> {
  const fallback = loadOfficialPastExamSubset();
  const fallbackQuestions = fallback.ok ? fallback.questions : [];

  try {
    const client = await createSupabaseServerClient();
    const questions = await getVerifiedCanonicalQuestions(client as never);

    if (questions.length > 0) {
      return { questions, sourceState: "live", message: "Preguntas verificadas cargadas desde Supabase." };
    }
  } catch {
    // Checked-in verified source keeps private practice available during migration incidents.
  }

  return { questions: fallbackQuestions, sourceState: "fallback_error", message: "Supabase no devolvió preguntas verificadas. Mostrando subconjunto oficial local." };
}
