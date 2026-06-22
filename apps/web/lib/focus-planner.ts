import type { PlannerDay, PlannerWeekSummary, StudySession } from "./types";

type SessionReviewInput = Pick<
  StudySession,
  | "notesCreated"
  | "questionsSolved"
  | "flashcardsCreated"
  | "mistakesLogged"
  | "confidenceAfter"
  | "nextReviewAt"
  | "notes"
>;

function sortSessionsByStart(a: StudySession, b: StudySession) {
  return a.plannedStartTime.localeCompare(b.plannedStartTime);
}

export function buildPlannerWeek(sessions: StudySession[]): PlannerDay[] {
  const grouped = new Map<string, StudySession[]>();

  for (const session of sessions) {
    const daySessions = grouped.get(session.plannedDate) ?? [];
    daySessions.push(session);
    grouped.set(session.plannedDate, daySessions);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, daySessions]) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
      sessions: [...daySessions].sort(sortSessionsByStart),
    }));
}

export function buildPlannerWeekSummary(
  sessions: StudySession[],
): PlannerWeekSummary {
  const totalPlannedMinutes = sessions.reduce(
    (sum, session) => sum + session.plannedDurationMinutes,
    0,
  );
  const completedSessions = sessions.filter((session) => session.completed).length;
  const readyForReviewSessions = sessions.filter(
    (session) => session.status === "ready_for_review",
  ).length;
  const completedMinutes = sessions
    .filter((session) => session.completed)
    .reduce((sum, session) => sum + session.plannedDurationMinutes, 0);

  return {
    totalSessions: sessions.length,
    completedSessions,
    readyForReviewSessions,
    totalPlannedMinutes,
    completedMinutes,
  };
}

export function getTodayMissionSession(
  sessions: StudySession[],
): StudySession | undefined {
  return [...sessions]
    .filter((session) =>
      session.status === "scheduled" || session.status === "ready_for_review",
    )
    .sort((left, right) => {
      const dateCompare = left.plannedDate.localeCompare(right.plannedDate);

      return dateCompare !== 0
        ? dateCompare
        : left.plannedStartTime.localeCompare(right.plannedStartTime);
    })[0];
}

export function moveSessionToReview(session: StudySession): StudySession {
  return {
    ...session,
    status: "ready_for_review",
    timerStatus: "finished",
    completed: false,
    reviewState: "waiting",
  };
}

export function completeSessionReview(
  session: StudySession,
  review: SessionReviewInput,
): StudySession {
  return {
    ...session,
    ...review,
    status: "completed",
    timerStatus: "finished",
    completed: true,
    reviewState: "done",
  };
}

export function extendSession(
  session: StudySession,
  extraMinutes: number,
): StudySession {
  return {
    ...session,
    status: "extended",
    timerStatus: "running",
    reviewState: "not_needed",
    plannedDurationMinutes: session.plannedDurationMinutes + extraMinutes,
  };
}
