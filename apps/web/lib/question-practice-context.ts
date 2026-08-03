import "server-only";

import { loadCanonicalQuestionsSource, type CanonicalQuestionsSource } from "./canonical-questions-source";
import { getHiddenQuestionIds } from "./hidden-questions-repository";
import { applyQuestionProgress } from "./question-progress-persistence";
import { getQuestionProgress } from "./question-progress-repository";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "./supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "./supabase-server";
import type { Question } from "./types";

type QuestionProgressRepositoryClient = Parameters<typeof getQuestionProgress>[0];
type HiddenQuestionsRepositoryClient = Parameters<typeof getHiddenQuestionIds>[0];

export type QuestionPracticeContext = {
  questions: Question[];
  questionSource: CanonicalQuestionsSource;
  canPersist: boolean;
  progressMessage: string;
};

/** Loads the same official-only pool for the bank and focused practice sessions. */
export async function loadQuestionPracticeContext(): Promise<QuestionPracticeContext> {
  const questionSource = await loadCanonicalQuestionsSource();
  let questions = questionSource.questions;
  let canPersist = false;
  let progressMessage = "Inicia sesión para guardar progreso de preguntas.";

  try {
    getSupabaseBrowserConfig();
    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      const progress = await getQuestionProgress(
        client as QuestionProgressRepositoryClient,
        userId,
      );
      const hiddenQuestionIds = await getHiddenQuestionIds(
        client as HiddenQuestionsRepositoryClient,
        userId,
      );
      questions = applyQuestionProgress(questions, progress)
        .filter((question) => !hiddenQuestionIds.includes(question.id));
      canPersist = true;
      progressMessage = "Progreso de preguntas cargado desde Supabase.";
    }
  } catch (error) {
    progressMessage =
      error instanceof SupabaseConfigError
        ? "El progreso de preguntas en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudo cargar el progreso guardado de preguntas. Mostrando estado fuente.";
  }

  return { questions, questionSource, canPersist, progressMessage };
}
