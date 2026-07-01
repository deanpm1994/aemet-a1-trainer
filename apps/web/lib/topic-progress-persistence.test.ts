import { describe, expect, it } from "vitest";

import type { Topic } from "./types";
import {
  applyTopicProgress,
  mapRowToTopicProgressUpdate,
  mapTopicProgressUpdateToRowInput,
  type TopicProgressRow,
} from "./topic-progress-persistence";

const topic: Topic = {
  id: "met-01",
  block: "Meteorology and Climatology",
  officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
  officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
  normalizedTitle: "Atmospheric thermodynamics",
  status: "not_started",
  confidence: 1,
  priority: "high",
  nextReviewAt: "Pending schedule",
  verificationStatus: "needs_review",
  sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
  retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
  shortDescription: "Thermodynamic variables and parcel processes.",
  studyFocus: "Map the chapter before starting question practice.",
  relatedQuestionCount: 0,
  notesStatus: "No notes yet",
};

const row: TopicProgressRow = {
  user_id: "user-1",
  topic_id: "met-01",
  status: "in_progress",
  confidence: 3,
  priority: "medium",
  next_review_at: "2026-07-05",
  notes_status: "Outline drafted",
  created_at: "2026-07-01T08:00:00.000Z",
  updated_at: "2026-07-01T08:00:00.000Z",
};

describe("topic progress persistence", () => {
  it("maps Supabase rows to app-level topic progress updates", () => {
    expect(mapRowToTopicProgressUpdate(row)).toEqual({
      topicId: "met-01",
      status: "in_progress",
      confidence: 3,
      priority: "medium",
      nextReviewAt: "2026-07-05",
      notesStatus: "Outline drafted",
    });
  });

  it("maps topic progress updates to user-scoped row inputs", () => {
    expect(
      mapTopicProgressUpdateToRowInput("user-1", "met-01", {
        status: "reviewed",
        confidence: 4,
        priority: "high",
        nextReviewAt: "2026-07-10",
        notesStatus: "Needs formula drill",
      }),
    ).toEqual({
      user_id: "user-1",
      topic_id: "met-01",
      status: "reviewed",
      confidence: 4,
      priority: "high",
      next_review_at: "2026-07-10",
      notes_status: "Needs formula drill",
    });
  });

  it("overlays user progress without changing official/source metadata", () => {
    expect(
      applyTopicProgress([topic], [
        {
          topicId: "met-01",
          status: "first_pass",
          confidence: 4,
          priority: "medium",
          nextReviewAt: "2026-07-08",
          notesStatus: "Summary complete",
        },
      ]),
    ).toEqual([
      {
        ...topic,
        status: "first_pass",
        confidence: 4,
        priority: "medium",
        nextReviewAt: "2026-07-08",
        notesStatus: "Summary complete",
      },
    ]);
  });

  it("ignores progress rows for topics not present in the source list", () => {
    expect(
      applyTopicProgress([topic], [
        {
          topicId: "unknown-topic",
          status: "exam_ready",
          confidence: 5,
          priority: "low",
          nextReviewAt: "2026-07-08",
          notesStatus: "Should not appear",
        },
      ]),
    ).toEqual([topic]);
  });
});
