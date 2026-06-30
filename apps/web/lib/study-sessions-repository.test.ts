import { describe, expect, it, vi } from "vitest";

import type { StudySessionRow } from "./study-sessions";
import {
  ensureStudySessions,
  getStudySessions,
  replaceStudySessionsWithRecommendedWeek,
  saveStudySessionPlan,
} from "./study-sessions-repository";
import type { StudySession } from "./types";

const session: StudySession = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Deep thermodynamics",
  sessionType: "deep_topic",
  objective: "Review atmospheric stability",
  topicIds: ["topic-1"],
  questionIds: [],
  plannedDate: "2026-07-01",
  plannedStartTime: "07:30",
  plannedEndTime: "09:00",
  plannedDurationMinutes: 90,
  status: "scheduled",
  timerStatus: "idle",
  completed: false,
  reviewState: "not_needed",
  notesCreated: false,
  questionsSolved: 0,
  flashcardsCreated: 0,
  mistakesLogged: 0,
  confidenceAfter: null,
  nextReviewAt: "",
  notes: "",
  isTemplate: true,
  isPersisted: false,
};

const row: StudySessionRow = {
  id: session.id,
  user_id: "user-1",
  name: session.name,
  session_type: session.sessionType,
  objective: session.objective,
  topic_ids: session.topicIds,
  question_ids: session.questionIds,
  planned_date: session.plannedDate,
  planned_start_time: session.plannedStartTime,
  planned_end_time: session.plannedEndTime,
  planned_duration_minutes: session.plannedDurationMinutes,
  status: session.status,
  timer_status: session.timerStatus,
  completed: session.completed,
  review_state: session.reviewState,
  notes_created: session.notesCreated,
  questions_solved: session.questionsSolved,
  flashcards_created: session.flashcardsCreated,
  mistakes_logged: session.mistakesLogged,
  confidence_after: session.confidenceAfter,
  next_review_at: null,
  notes: session.notes,
  is_template: false,
  created_at: "2026-06-30T07:00:00.000Z",
  updated_at: "2026-06-30T07:00:00.000Z",
};

describe("study sessions repository", () => {
  it("loads sessions sorted by planned date and start time", async () => {
    const orderStart = vi.fn().mockResolvedValue({ data: [row], error: null });
    const orderDate = vi.fn(() => ({ order: orderStart }));
    const eq = vi.fn(() => ({ order: orderDate }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getStudySessions({ from } as never, "user-1")).resolves.toEqual([
      {
        ...session,
        isTemplate: false,
        isPersisted: true,
      },
    ]);

    expect(from).toHaveBeenCalledWith("study_sessions");
    expect(eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(orderDate).toHaveBeenCalledWith("planned_date", { ascending: true });
    expect(orderStart).toHaveBeenCalledWith("planned_start_time", { ascending: true });
  });

  it("seeds recommended sessions when no saved rows exist", async () => {
    const existingOrderStart = vi.fn().mockResolvedValue({ data: [], error: null });
    const existingOrderDate = vi.fn(() => ({ order: existingOrderStart }));
    const existingEq = vi.fn(() => ({ order: existingOrderDate }));
    const select = vi.fn(() => ({ eq: existingEq }));
    const deleteEq = vi.fn().mockResolvedValue({ error: null });
    const deleteFromTable = vi.fn(() => ({ eq: deleteEq }));
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ select, delete: deleteFromTable, insert }));

    await expect(
      ensureStudySessions({ from } as never, "user-1", [session]),
    ).resolves.toEqual([
      {
        ...session,
        isTemplate: false,
        isPersisted: true,
      },
    ]);

    expect(insert).toHaveBeenCalledWith([
      expect.objectContaining({
        user_id: "user-1",
        is_template: false,
      }),
    ]);
  });

  it("upserts one edited session for the current user", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ upsert }));

    await saveStudySessionPlan({ from } as never, "user-1", session);

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: session.id,
        user_id: "user-1",
        objective: "Review atmospheric stability",
      }),
      { onConflict: "user_id,id" },
    );
  });

  it("replaces only the current user's sessions on reset", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const deleteEq = vi.fn().mockResolvedValue({ error: null });
    const deleteFromTable = vi.fn(() => ({ eq: deleteEq }));
    const from = vi.fn((table: string) =>
      table === "study_sessions" ? { delete: deleteFromTable, insert } : {},
    );

    await replaceStudySessionsWithRecommendedWeek(
      { from } as never,
      "user-1",
      [session],
    );

    expect(deleteEq).toHaveBeenCalledWith("user_id", "user-1");
    expect(insert).toHaveBeenCalledWith([
      expect.objectContaining({
        user_id: "user-1",
      }),
    ]);
  });

  it("throws Supabase errors instead of swallowing them", async () => {
    const error = new Error("database unavailable");
    const orderStart = vi.fn().mockResolvedValue({ data: null, error });
    const orderDate = vi.fn(() => ({ order: orderStart }));
    const eq = vi.fn(() => ({ order: orderDate }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getStudySessions({ from } as never, "user-1")).rejects.toThrow(
      "database unavailable",
    );
  });
});
