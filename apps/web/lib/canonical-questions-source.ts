import "server-only";

import { getCanonicalQuestions } from "./canonical-questions-repository";
import { loadOfficialPastExamSubset } from "./official-past-exam-subset";
import { createSupabaseServerClient } from "./supabase-server";
import type { Question } from "./types";

export type CanonicalQuestionsSource = {
  questions: Question[];
  inventoryQuestions: Question[];
  sourceState: "live" | "fallback_error";
  message: string;
};

export function filterPracticeQuestions(questions: Question[]): Question[] {
  return questions.filter((question) =>
    question.verificationStatus === "verified" &&
    (question.disposition ?? "available") === "available" &&
    (question.origin === "official_historic" ||
      (question.origin === "didactic_reviewed" && question.editorialStatus === "reviewed")),
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
  const fallbackInventory = fallback.ok ? fallback.questions : [];
  const fallbackQuestions = filterPracticeQuestions(fallbackInventory);
  const createClient = options.createClient ?? createSupabaseServerClient;
  const loadQuestions = options.loadQuestions ?? ((client) =>
    getCanonicalQuestions(client as never));

  try {
    const client = await createClient();
    const inventoryQuestions = await loadQuestions(client);
    const questions = filterPracticeQuestions(inventoryQuestions);

    if (questions.length > 0) {
      return { questions, inventoryQuestions, sourceState: "live", message: "Preguntas de práctica cargadas desde Supabase." };
    }
  } catch {
    // Checked-in verified source keeps private practice available during migration incidents.
  }

  return { questions: fallbackQuestions, inventoryQuestions: fallbackInventory, sourceState: "fallback_error", message: "Supabase no devolvió preguntas verificadas. Mostrando subconjunto oficial local." };
}
