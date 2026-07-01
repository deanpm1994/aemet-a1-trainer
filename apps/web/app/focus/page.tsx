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
  let statusMessage = "Focus changes are local-only until you sign in.";

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
      statusMessage = "Focus session loaded from Supabase.";
    }
  } catch (error) {
    statusMessage =
      error instanceof SupabaseConfigError
        ? "Supabase focus persistence unavailable until required env vars are configured."
        : "Unable to load saved focus sessions right now. Showing the local focus session.";
  }

  const initialSession = getNextFocusSession(sessions) ?? null;

  async function saveFocusSessionAction(session: StudySession) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in required before focus changes can sync to Supabase.",
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
            ? "Focus session and progress saved."
            : "Focus session saved.",
      };
    } catch {
      return {
        ok: false,
        message: "Could not save this focus change. Try again before leaving.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Focus"
        title="Persisted focus session"
        description="Signed-in users save timer and review outcomes through Supabase. Anonymous users can still try the local demo flow."
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
