import { describe, expect, it } from "vitest";

import { routeCards, studySessions } from "./mock-data";
import {
  buildPlannerWeek,
  buildPlannerWeekSummary,
  completeSessionReview,
  extendSession,
  getTodayMissionSession,
  moveSessionToReview,
} from "./focus-planner";

describe("study session fixtures", () => {
  it("exposes a non-empty current-week session list", () => {
    expect(studySessions.length).toBeGreaterThan(0);
  });

  it("keeps all sessions local and editable for the current week", () => {
    expect(studySessions.every((session) => session.isTemplate === false)).toBe(true);
    expect(studySessions.every((session) => session.isPersisted === false)).toBe(true);
  });

  it("includes at least one session already ready for review", () => {
    expect(studySessions.some((session) => session.status === "ready_for_review")).toBe(true);
  });

  it("updates the calendar and focus route copy to describe real tools", () => {
    expect(routeCards.find((card) => card.href === "/calendar")?.description).toContain(
      "Editable current-week planner",
    );
    expect(routeCards.find((card) => card.href === "/focus")?.description).toContain(
      "Timer-driven focus session",
    );
  });
});

describe("planner helpers", () => {
  it("groups sessions into planner days", () => {
    const days = buildPlannerWeek(studySessions);

    expect(days.length).toBeGreaterThan(0);
    expect(days[0]?.sessions.length).toBeGreaterThan(0);
  });

  it("builds the weekly summary from session statuses", () => {
    expect(buildPlannerWeekSummary(studySessions)).toEqual({
      totalSessions: 3,
      completedSessions: 1,
      readyForReviewSessions: 1,
      totalPlannedMinutes: 190,
      completedMinutes: 90,
    });
  });

  it("returns the next current-week session as today's mission candidate", () => {
    expect(getTodayMissionSession(studySessions)?.id).toBe("session-2026-06-23-questions");
  });

  it("moves a running session into review instead of completing it", () => {
    const updated = moveSessionToReview({
      ...studySessions[2],
      status: "in_progress",
      timerStatus: "running",
    });

    expect(updated.status).toBe("ready_for_review");
    expect(updated.timerStatus).toBe("finished");
    expect(updated.completed).toBe(false);
    expect(updated.reviewState).toBe("waiting");
  });

  it("marks a reviewed session complete only after explicit confirmation", () => {
    const updated = completeSessionReview(studySessions[1], {
      notesCreated: true,
      questionsSolved: 6,
      flashcardsCreated: 1,
      mistakesLogged: 1,
      confidenceAfter: 4,
      nextReviewAt: "2026-06-26",
      notes: "Finished the full derivative review set.",
    });

    expect(updated.status).toBe("completed");
    expect(updated.completed).toBe(true);
    expect(updated.reviewState).toBe("done");
  });

  it("extends a review-ready session back into progress", () => {
    const updated = extendSession(studySessions[1], 15);

    expect(updated.status).toBe("extended");
    expect(updated.timerStatus).toBe("running");
    expect(updated.plannedDurationMinutes).toBe(75);
  });
});
