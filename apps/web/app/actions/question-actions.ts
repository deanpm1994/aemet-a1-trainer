"use server";

import { buildQuestionProgressFromAttempts } from "@/lib/question-attempts";
import { getQuestionAttempts, saveQuestionAttempt } from "@/lib/question-attempts-repository";
import { hideQuestion } from "@/lib/hidden-questions-repository";
import { saveQuestionProgress } from "@/lib/question-progress-repository";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import type { MistakeType } from "@/lib/types";

type QuestionProgressRepositoryClient = Parameters<typeof saveQuestionProgress>[0];
type QuestionAttemptRepositoryClient = Parameters<typeof getQuestionAttempts>[0];
type HiddenQuestionsRepositoryClient = Parameters<typeof hideQuestion>[0];

const allowedMistakeTypes: MistakeType[] = [
  "concept",
  "formula",
  "units",
  "reading",
  "legal_wording",
  "time_management",
  "none",
];

function parseMistakeTypes(values: FormDataEntryValue[]): MistakeType[] {
  const parsed = values
    .map((value) => String(value))
    .filter((value): value is MistakeType => allowedMistakeTypes.includes(value as MistakeType));
  return parsed.length === 0 || parsed.includes("none") ? ["none"] : parsed;
}

function parseConfidenceAfter(value: FormDataEntryValue | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.min(5, Math.max(1, parsed)) : 3;
}

export async function saveQuestionAttemptAction(formData: FormData) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: "Inicia sesión para sincronizar intentos de preguntas con Supabase." };

  const questionId = String(formData.get("questionId") ?? "");
  if (!questionId) return { ok: false, message: "Falta el id de la pregunta. Recarga antes de reintentar." };

  try {
    const client = await createSupabaseServerClient();
    await saveQuestionAttempt(client as QuestionAttemptRepositoryClient, userId, {
      questionId,
      attemptedAt: String(formData.get("attemptedAt") ?? ""),
      selectedAnswer: String(formData.get("selectedAnswer") ?? ""),
      isCorrect: formData.get("isCorrect") === "true",
      mistakeTypes: parseMistakeTypes(formData.getAll("mistakeTypes")),
      confidenceAfter: parseConfidenceAfter(formData.get("confidenceAfter")),
      notes: String(formData.get("notes") ?? ""),
    });
    const attempts = await getQuestionAttempts(client as QuestionAttemptRepositoryClient, userId, questionId);
    await saveQuestionProgress(
      client as QuestionProgressRepositoryClient,
      userId,
      questionId,
      buildQuestionProgressFromAttempts(questionId, attempts),
    );
    return { ok: true, message: "Intento de pregunta guardado y progreso de revisión actualizado." };
  } catch {
    return { ok: false, message: "No se pudo guardar el intento. Los valores quedan en el formulario." };
  }
}

export async function hideQuestionAction(formData: FormData) {
  const userId = await getAuthenticatedUserId();
  const questionId = String(formData.get("questionId") ?? "");
  if (!userId || !questionId) return { ok: false, message: "Inicia sesión para ocultar preguntas en tus futuras sesiones." };
  try {
    const client = await createSupabaseServerClient();
    await hideQuestion(client as HiddenQuestionsRepositoryClient, userId, questionId);
    return { ok: true, message: "Pregunta oculta de tus próximas sesiones." };
  } catch {
    return { ok: false, message: "No se pudo ocultar la pregunta." };
  }
}
