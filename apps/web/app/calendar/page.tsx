import { CalendarPlanner } from "@/components/calendar-planner";
import { PageHeader } from "@/components/page-header";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import {
  ensureStudySessions,
  replaceStudySessionsWithRecommendedWeek,
  saveStudySessionPlan,
} from "@/lib/study-sessions-repository";
import { studySessions } from "@/lib/mock-data";
import type { StudySession } from "@/lib/types";

type StudySessionsRepositoryClient = Parameters<typeof ensureStudySessions>[0];

export default async function CalendarPage() {
  let canPersist = false;
  let initialSessions = studySessions;
  let statusMessage = "Planner changes are local-only until you sign in.";

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      initialSessions = await ensureStudySessions(
        client as StudySessionsRepositoryClient,
        userId,
        studySessions,
      );
      canPersist = true;
      statusMessage = "Calendar sessions loaded from Supabase.";
    }
  } catch (error) {
    statusMessage =
      error instanceof SupabaseConfigError
        ? "Supabase session persistence unavailable until required env vars are configured."
        : "Unable to load saved sessions right now. Showing the local planner.";
  }

  async function saveSessionAction(session: StudySession) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in required before calendar changes can sync to Supabase.",
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
        message: "Calendar session saved.",
      };
    } catch {
      return {
        ok: false,
        message: "Could not save this calendar change. Try again before leaving.",
      };
    }
  }

  async function resetSessionsAction() {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in required before calendar changes can sync to Supabase.",
      };
    }

    try {
      const client = await createSupabaseServerClient();
      const sessions = await replaceStudySessionsWithRecommendedWeek(
        client as StudySessionsRepositoryClient,
        userId,
        studySessions,
      );

      return {
        ok: true,
        message: "Calendar reset to the recommended week.",
        sessions,
      };
    } catch {
      return {
        ok: false,
        message: "Could not reset saved sessions. Current planner remains in place.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Calendar"
        title="Persisted current-week planner"
        description="Signed-in users load and save calendar sessions through Supabase. Anonymous users can still adjust the local demo planner."
      />
      <CalendarPlanner
        initialSessions={initialSessions}
        recommendedSessions={studySessions}
        canPersist={canPersist}
        statusMessage={statusMessage}
        onSaveSession={saveSessionAction}
        onResetSessions={resetSessionsAction}
      />
    </div>
  );
}
