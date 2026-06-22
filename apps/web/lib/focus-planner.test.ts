import { describe, expect, it } from "vitest";

import { routeCards, studySessions } from "./mock-data";

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
