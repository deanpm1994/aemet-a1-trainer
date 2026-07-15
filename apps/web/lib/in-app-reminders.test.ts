import { describe, expect, it } from "vitest";

import { getEligibleReminder } from "./in-app-reminders";

describe("in-app reminders", () => {
  it("shows a morning reminder only at its saved local minute when enabled", () => {
    expect(
      getEligibleReminder({
        enabled: true,
        morning: "07:20",
        evening: "23:20",
        now: new Date(2026, 6, 12, 7, 20),
        dismissed: new Set(),
      }),
    ).toMatchObject({ slot: "morning", href: "/dashboard" });

    expect(
      getEligibleReminder({
        enabled: false,
        morning: "07:20",
        evening: null,
        now: new Date(2026, 6, 12, 7, 20),
        dismissed: new Set(),
      }),
    ).toBeNull();
  });

  it("uses the user's local calendar day for a dismissal key", () => {
    expect(
      getEligibleReminder({
        enabled: true,
        morning: null,
        evening: "23:20",
        now: new Date(2026, 6, 12, 23, 20),
        dismissed: new Set(),
      }),
    ).toMatchObject({
      slot: "evening",
      href: "/focus",
      dismissalKey: "aemet-reminder:2026-07-12:evening",
    });
  });

  it("does not repeat a dismissed reminder on the same day", () => {
    expect(
      getEligibleReminder({
        enabled: true,
        morning: "07:20",
        evening: null,
        now: new Date(2026, 6, 12, 7, 20),
        dismissed: new Set(["aemet-reminder:2026-07-12:morning"]),
      }),
    ).toBeNull();
  });

  it("does not show a reminder outside its configured minute", () => {
    expect(
      getEligibleReminder({
        enabled: true,
        morning: "07:20",
        evening: "23:20",
        now: new Date(2026, 6, 12, 7, 21),
        dismissed: new Set(),
      }),
    ).toBeNull();
  });
});
