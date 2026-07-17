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

export function filterPracticeQuestions(questions: Question[]): Question[] {
  return questions.filter((question) =>
    question.origin === "official_historic" ||
    (question.origin === "didactic_reviewed" && question.editorialStatus === "reviewed"),
  );
}

type CanonicalQuestionsSourceOptions = {
  createClient?: () => Promise<unknown>;
  loadQuestions?: (client: unknown) => Promise<Question[]>;
};

export async function loadCanonicalQuestionsSource(
  options: CanonicalQuestionsSourceOptions = {},
): Promise<CanonicalQuestionsSource> {
  const fallback = loadOfficialPastExamSubset();
  const fallbackQuestions = fallback.ok ? filterPracticeQuestions(fallback.questions) : [];
  const createClient = options.createClient ?? createSupabaseServerClient;
  const loadQuestions = options.loadQuestions ?? ((client) =>
    getVerifiedCanonicalQuestions(client as never));

  try {
    const client = await createClient();
    const questions = filterPracticeQuestions(await loadQuestions(client));

    if (questions.length > 0) {
      return { questions, sourceState: "live", message: "Preguntas de práctica cargadas desde Supabase." };
    }
  } catch {
    // Checked-in verified source keeps private practice available during migration incidents.
  }

  return { questions: fallbackQuestions, sourceState: "fallback_error", message: "Supabase no devolvió preguntas verificadas. Mostrando subconjunto oficial local." };
}
