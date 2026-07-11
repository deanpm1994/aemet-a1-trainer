import { describe, expect, it } from "vitest";

import { orchestrateStudyWeek, rankStudyTopics } from "./study-orchestrator";
import type { Question, Topic } from "./types";

const baseTopic: Topic = {
  id: "not-started", block: "Mathematics", officialNumber: "3", officialTitle: "Tema nuevo.", normalizedTitle: "Tema nuevo",
  status: "not_started", confidence: 3, priority: "medium", nextReviewAt: "", verificationStatus: "verified",
  sourceUrl: "https://example.test", retrievedAt: "2026-07-11",
};

const topics: Topic[] = [
  { ...baseTopic, id: "weak", officialNumber: "2", status: "in_progress", confidence: 1 },
  { ...baseTopic, id: "due-review", officialNumber: "1", status: "reviewed", confidence: 4, nextReviewAt: "2026-07-10" },
  baseTopic,
];

const question: Question = {
  id: "question", name: "Pregunta", type: "multiple_choice", sourceYear: 0, sourceExam: "Material didáctico no oficial",
  sourceUrl: "https://example.test", retrievedAt: "2026-07-11", verificationStatus: "unverified", questionNumber: "1",
  statement: "Pregunta", options: ["A"], correctAnswer: "A", answerSourceStatus: "inferred", explanation: "Explicación",
  topicIds: ["due-review"], difficulty: 1, attemptsCount: 0, lastAttemptAt: "", nextReviewAt: "", mistakeTypes: ["none"],
};

describe("study orchestrator", () => {
  it("prioritises due review before weak then unstarted topics", () => {
    expect(rankStudyTopics(topics, "2026-07-11").map((topic) => topic.id)).toEqual([
      "due-review", "weak", "not-started",
    ]);
  });

  it("creates valid morning topic, questions and review sessions", () => {
    const sessions = orchestrateStudyWeek({ topics, questions: [question], startDate: "2026-07-13" });

    expect(sessions.slice(0, 3).map((session) => session.plannedStartTime)).toEqual(["07:30", "09:10", "10:20"]);
    expect(sessions.every((session) => session.topicIds.length === 1)).toBe(true);
    expect(sessions).toHaveLength(15);
  });
});
