import { CalendarPlanner } from "@/components/calendar-planner";
import { loadCanonicalQuestionsSource } from "@/lib/canonical-questions-source";
import { loadTopicsSource } from "@/lib/notion-topics";
import { orchestrateStudyWeek } from "@/lib/study-orchestrator";
import { PageHeader } from "@/components/page-header";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import {
  ensureStudySessions,
  replaceStudySessionsWithRecommendedWeek,
  saveStudySessionPlan,
} from "@/lib/study-sessions-repository";
import type { StudySession } from "@/lib/types";

type StudySessionsRepositoryClient = Parameters<typeof ensureStudySessions>[0];

export default async function CalendarPage() {
  const [topicSource, questionSource] = await Promise.all([
    loadTopicsSource(),
    loadCanonicalQuestionsSource(),
  ]);
  const questions = questionSource.questions;
  const recommendedSessions = orchestrateStudyWeek({
    topics: topicSource.topics,
    questions,
    startDate: new Date().toISOString().slice(0, 10),
  });
  let canPersist = false;
  let initialSessions = recommendedSessions;
  let statusMessage = "Los cambios del planificador son locales hasta iniciar sesión.";

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      initialSessions = await ensureStudySessions(
        client as StudySessionsRepositoryClient,
        userId,
        recommendedSessions,
      );
      canPersist = true;
      statusMessage = "Sesiones de calendario cargadas desde Supabase.";
    }
  } catch (error) {
    statusMessage =
      error instanceof SupabaseConfigError
        ? "La persistencia de sesiones en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudieron cargar las sesiones guardadas. Mostrando el planificador local.";
  }

  async function saveSessionAction(session: StudySession) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Inicia sesión para sincronizar cambios del calendario con Supabase.",
      };
    }

    try {
      const client = await createSupabaseServerClient();
      await saveStudySessionPlan(
        client as StudySessionsRepositoryClient,
        userId,
        session,
      );

      return {
        ok: true,
        message: "Sesión de calendario guardada.",
      };
    } catch {
      return {
        ok: false,
        message: "No se pudo guardar este cambio de calendario. Reintenta antes de salir.",
      };
    }
  }

  async function resetSessionsAction() {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Inicia sesión para sincronizar cambios del calendario con Supabase.",
      };
    }

    try {
      const client = await createSupabaseServerClient();
      const sessions = await replaceStudySessionsWithRecommendedWeek(
        client as StudySessionsRepositoryClient,
        userId,
        recommendedSessions,
      );

      return {
        ok: true,
        message: "Calendario restablecido a la semana recomendada.",
        sessions,
      };
    } catch {
      return {
        ok: false,
        message: "No se pudieron restablecer las sesiones guardadas. El planificador actual queda igual.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Calendario"
        title="Planificador semanal persistente"
        description="Las personas con sesión iniciada cargan y guardan sesiones mediante Supabase. Sin sesión, se puede ajustar el planificador local de demo."
      />
      <CalendarPlanner
        initialSessions={initialSessions}
        recommendedSessions={recommendedSessions}
        canPersist={canPersist}
        statusMessage={statusMessage}
        onSaveSession={saveSessionAction}
        onResetSessions={resetSessionsAction}
      />
    </div>
  );
}
