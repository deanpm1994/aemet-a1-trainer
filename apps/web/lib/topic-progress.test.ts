import { describe, expect, it } from "vitest";

import { topics as topicFixtures } from "./mock-data";
import type { Topic } from "./types";
import {
  buildBlockSummaries,
  countExamReadyTopics,
  countTouchedTopics,
  selectWeakTopics,
} from "./topic-progress";

const topics: Topic[] = [
  {
    id: "math-01",
    block: "Mathematics",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Calculus foundations",
    status: "in_progress",
    confidence: 2,
    priority: "high",
    nextReviewAt: "2026-06-21",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Limits, derivatives, and integration fundamentals.",
    studyFocus: "Rebuild confidence with core formulas and worked examples.",
    relatedQuestionCount: 0,
    notesStatus: "No notes yet",
  },
  {
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
  },
  {
    id: "gen-01",
    block: "General/Common",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Spanish public administration basics",
    status: "exam_ready",
    confidence: 5,
    priority: "medium",
    nextReviewAt: "2026-06-24",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "State structure and public-sector fundamentals.",
    studyFocus: "Keep this ready with light spaced review.",
    relatedQuestionCount: 0,
    notesStatus: "Outline complete",
  },
];

describe("topic progress helpers", () => {
  it("counts touched topics as every topic not in not_started", () => {
    expect(countTouchedTopics(topics)).toBe(2);
  });

  it("counts exam ready topics from the shared topic list", () => {
    expect(countExamReadyTopics(topics)).toBe(1);
  });

  it("selects weak topics by low confidence and excludes exam ready topics", () => {
    expect(selectWeakTopics(topics)).toEqual([
      {
        id: "met-01",
        label: "Meteorology and Climatology: Atmospheric thermodynamics",
        confidence: 1,
        status: "not_started",
        verificationStatus: "needs_review",
      },
      {
        id: "math-01",
        label: "Mathematics: Calculus foundations",
        confidence: 2,
        status: "in_progress",
        verificationStatus: "unverified",
      },
    ]);
  });

  it("builds block summaries from topic counts", () => {
    expect(buildBlockSummaries(topics)).toEqual([
      {
        block: "General/Common",
        totalTopics: 1,
        touchedTopics: 1,
        examReadyTopics: 1,
      },
      {
        block: "Mathematics",
        totalTopics: 1,
        touchedTopics: 1,
        examReadyTopics: 0,
      },
      {
        block: "Meteorology and Climatology",
        totalTopics: 1,
        touchedTopics: 0,
        examReadyTopics: 0,
      },
    ]);
  });

  it("keeps TODO_VERIFY_OFFICIAL_SOURCE metadata intact in the topic fixtures", () => {
    expect(topicFixtures[0]?.officialTitle).toBe("TODO_VERIFY_OFFICIAL_SOURCE");
    expect(topicFixtures[0]?.sourceUrl).toBe("TODO_VERIFY_OFFICIAL_SOURCE");
  });
});
