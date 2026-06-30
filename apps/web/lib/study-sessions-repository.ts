import type { StudySession } from "./types";
import {
  mapRecommendedSessionsToRowInputs,
  mapRowToStudySession,
  mapStudySessionToRowInput,
} from "./study-sessions";

type StudySessionsTableClient = {
  from: (table: string) => any;
};

export async function getStudySessions(
  client: StudySessionsTableClient,
  userId: string,
): Promise<StudySession[]> {
  const query = client
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("planned_date", { ascending: true })
    .order("planned_start_time", { ascending: true });
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRowToStudySession);
}

export async function saveStudySessionPlan(
  client: StudySessionsTableClient,
  userId: string,
  session: StudySession,
): Promise<void> {
  const payload = mapStudySessionToRowInput(userId, session);
  const { error } = await client
    .from("study_sessions")
    .upsert(payload, { onConflict: "user_id,id" });

  if (error) {
    throw error;
  }
}

export async function replaceStudySessionsWithRecommendedWeek(
  client: StudySessionsTableClient,
  userId: string,
  recommendedSessions: StudySession[],
): Promise<StudySession[]> {
  const deleteQuery = client.from("study_sessions").delete().eq("user_id", userId);
  const { error: deleteError } = await deleteQuery;

  if (deleteError) {
    throw deleteError;
  }

  const payload = mapRecommendedSessionsToRowInputs(userId, recommendedSessions);
  const { error: insertError } = await client.from("study_sessions").insert(payload);

  if (insertError) {
    throw insertError;
  }

  return payload.map((row) =>
    mapRowToStudySession({
      ...row,
      created_at: "",
      updated_at: "",
    }),
  );
}

export async function ensureStudySessions(
  client: StudySessionsTableClient,
  userId: string,
  recommendedSessions: StudySession[],
): Promise<StudySession[]> {
  const existingSessions = await getStudySessions(client, userId);

  if (existingSessions.length > 0) {
    return existingSessions;
  }

  return replaceStudySessionsWithRecommendedWeek(
    client,
    userId,
    recommendedSessions,
  );
}
