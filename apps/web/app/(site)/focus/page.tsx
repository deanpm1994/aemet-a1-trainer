import { FocusSessionPanel } from "@/components/focus-session-panel";
import { PageHeader } from "@/components/page-header";
import {
  questions as sourceQuestions,
  studySessions,
  topics as sourceTopics,
} from "@/lib/mock-data";
import { buildFocusProgressUpdates } from "@/lib/focus-progress";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import {
  ensureStudySessions,
  saveStudySessionPlan,
} from "@/lib/study-sessions-repository";
import { getNextFocusSession } from "@/lib/focus-planner";
import {
  getQuestionProgress,
  saveQuestionProgress,
} from "@/lib/question-progress-repository";
import {
  getTopicProgress,
  saveTopicProgress,
} from "@/lib/topic-progress-repository";
import type { StudySession } from "@/lib/types";

type StudySessionsRepositoryClient = Parameters<typeof ensureStudySessions>[0];
type QuestionProgressRepositoryClient = Parameters<typeof getQuestionProgress>[0];
type TopicProgressRepositoryClient = Parameters<typeof getTopicProgress>[0];

export default async function FocusPage() {
  let canPersist = false;
  let sessions = studySessions;
  let statusMessage = "Los cambios de concentración son locales hasta iniciar sesión.";

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      sessions = await ensureStudySessions(
        client as StudySessionsRepositoryClient,
        userId,
        studySessions,
      );
      canPersist = true;
      statusMessage = "Sesión de concentración cargada desde Supabase.";
    }
  } catch (error) {
    statusMessage =
      error instanceof SupabaseConfigError
        ? "La persistencia de concentración en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudieron cargar sesiones guardadas. Mostrando la sesión local.";
  }

  const initialSession = getNextFocusSession(sessions) ?? null;

  async function saveFocusSessionAction(session: StudySession) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Inicia sesión para sincronizar cambios de concentración con Supabase.",
      };
    }

    try {
      const client = await createSupabaseServerClient();
      await saveStudySessionPlan(
        client as StudySessionsRepositoryClient,
        userId,
        session,
      );

      if (session.completed && session.status === "completed") {
        const [topicProgress, questionProgress] = await Promise.all([
          getTopicProgress(client as TopicProgressRepositoryClient, userId),
          getQuestionProgress(client as QuestionProgressRepositoryClient, userId),
        ]);
        const { topicUpdates, questionUpdates } = buildFocusProgressUpdates(session, {
          topics: sourceTopics,
          questions: sourceQuestions,
          topicProgress,
          questionProgress,
        });

        await Promise.all([
          ...topicUpdates.map((update) =>
            saveTopicProgress(
              client as TopicProgressRepositoryClient,
              userId,
              update.topicId,
              update,
            ),
          ),
          ...questionUpdates.map((update) =>
            saveQuestionProgress(
              client as QuestionProgressRepositoryClient,
              userId,
              update.questionId,
              update,
            ),
          ),
        ]);
      }

      return {
        ok: true,
        message:
          session.completed && session.status === "completed"
            ? "Sesión de concentración y progreso guardados."
            : "Sesión de concentración guardada.",
      };
    } catch {
      return {
        ok: false,
        message: "No se pudo guardar este cambio de concentración. Reintenta antes de salir.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Concentración"
        title="Sesión de concentración persistente"
        description="Las personas con sesión iniciada guardan temporizador y revisión mediante Supabase. Sin sesión, se puede probar el flujo local de demo."
      />
      <FocusSessionPanel
        initialSession={initialSession}
        canPersist={canPersist}
        statusMessage={statusMessage}
        onSaveSession={saveFocusSessionAction}
      />
    </div>
  );
}
