import { describe, expect, it } from "vitest";

import {
  mapRecommendedSessionsToRowInputs,
  mapRowToStudySession,
  mapStudySessionToRowInput,
} from "./study-sessions";
import type { StudySession } from "./types";

const studySession: StudySession = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Deep thermodynamics",
  sessionType: "deep_topic",
  objective: "Review atmospheric stability",
  topicIds: ["topic-1"],
  questionIds: ["question-1"],
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

describe("study session row mapping", () => {
  it("maps a database row into a persisted study session", () => {
    expect(
      mapRowToStudySession({
        id: "11111111-1111-4111-8111-111111111111",
        user_id: "user-1",
        name: "Deep thermodynamics",
        session_type: "deep_topic",
        objective: "Review atmospheric stability",
        topic_ids: ["topic-1"],
        question_ids: ["question-1"],
        planned_date: "2026-07-01",
        planned_start_time: "07:30",
        planned_end_time: "09:00",
        planned_duration_minutes: 90,
        status: "scheduled",
        timer_status: "idle",
        completed: false,
        review_state: "not_needed",
        notes_created: false,
        questions_solved: 0,
        flashcards_created: 0,
        mistakes_logged: 0,
        confidence_after: null,
        next_review_at: null,
        notes: "",
        is_template: true,
        created_at: "2026-06-30T07:00:00.000Z",
        updated_at: "2026-06-30T07:00:00.000Z",
      }),
    ).toEqual({
      ...studySession,
      isPersisted: true,
    });
  });

  it("maps a study session into a user-owned row input", () => {
    expect(mapStudySessionToRowInput("user-1", studySession)).toEqual({
      id: "11111111-1111-4111-8111-111111111111",
      user_id: "user-1",
      name: "Deep thermodynamics",
      session_type: "deep_topic",
      objective: "Review atmospheric stability",
      topic_ids: ["topic-1"],
      question_ids: ["question-1"],
      planned_date: "2026-07-01",
      planned_start_time: "07:30",
      planned_end_time: "09:00",
      planned_duration_minutes: 90,
      status: "scheduled",
      timer_status: "idle",
      completed: false,
      review_state: "not_needed",
      notes_created: false,
      questions_solved: 0,
      flashcards_created: 0,
      mistakes_logged: 0,
      confidence_after: null,
      next_review_at: null,
      notes: "",
      is_template: true,
    });
  });

  it("maps recommended sessions as non-template persisted row inputs", () => {
    expect(mapRecommendedSessionsToRowInputs("user-1", [studySession])).toEqual([
      expect.objectContaining({
        user_id: "user-1",
        is_template: false,
      }),
    ]);
  });
});
