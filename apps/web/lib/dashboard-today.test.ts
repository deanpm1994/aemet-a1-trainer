import { describe, expect, it } from "vitest";

import {
  monitoringEvents,
  monitoringSources,
  questions,
  studySessions,
  topics,
} from "./mock-data";
import { buildTodayDashboard } from "./dashboard-today";

describe("today dashboard", () => {
  it("builds one actionable study workflow from existing app data", () => {
    const dashboard = buildTodayDashboard({
      sessions: studySessions,
      topics,
      questions,
      monitoringSources,
      monitoringEvents,
      today: "2026-07-01",
    });

    expect(dashboard.nextSession?.id).toBe("session-2026-06-23-questions");
    expect(dashboard.weakTopics.map((topic) => topic.id)).toEqual([
      "met-01",
      "math-01",
      "gen-01",
    ]);
    expect(dashboard.overdueQuestions.map((question) => question.id)).toEqual([
      "q-math-calc-01",
      "q-met-thermo-01",
      "q-gen-admin-01",
      "q-inf-networks-01",
    ]);
    expect(dashboard.monitoringSummary.activeSources).toBe(0);
    expect(dashboard.monitoringSummary.pendingReviewEvents).toBe(1);
  });

  it("returns a clear primary action for the next session", () => {
    const dashboard = buildTodayDashboard({
      sessions: studySessions,
      topics,
      questions,
      monitoringSources,
      monitoringEvents,
      today: "2026-07-01",
    });

    expect(dashboard.primaryAction).toEqual({
      href: "/focus",
      label: "Abrir sesión de concentración",
      detail: "09:10 Calculus question block",
    });
  });
});
