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

export function filterOfficialHistoricQuestions(questions: Question[]): Question[] {
  return questions.filter((question) => question.origin === "official_historic");
}

type CanonicalQuestionsSourceOptions = {
  createClient?: () => Promise<unknown>;
  loadQuestions?: (client: unknown) => Promise<Question[]>;
};

export async function loadCanonicalQuestionsSource(
  options: CanonicalQuestionsSourceOptions = {},
): Promise<CanonicalQuestionsSource> {
  const fallback = loadOfficialPastExamSubset();
  const fallbackQuestions = fallback.ok ? filterOfficialHistoricQuestions(fallback.questions) : [];
  const createClient = options.createClient ?? createSupabaseServerClient;
  const loadQuestions = options.loadQuestions ?? ((client) =>
    getVerifiedCanonicalQuestions(client as never));

  try {
    const client = await createClient();
    const questions = filterOfficialHistoricQuestions(await loadQuestions(client));

    if (questions.length > 0) {
      return { questions, sourceState: "live", message: "Preguntas verificadas cargadas desde Supabase." };
    }
  } catch {
    // Checked-in verified source keeps private practice available during migration incidents.
  }

  return { questions: fallbackQuestions, sourceState: "fallback_error", message: "Supabase no devolvió preguntas verificadas. Mostrando subconjunto oficial local." };
}
