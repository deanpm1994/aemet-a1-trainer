import { describe, expect, it } from "vitest";

import { buildDidacticQuestions } from "./didactic-question-bank";
import type { Topic } from "./types";

const topics: Topic[] = [
  {
    id: "mathematics-1",
    block: "Mathematics",
    officialNumber: "1",
    officialTitle: "Matrices y determinantes. Operaciones elementales.",
    normalizedTitle: "Matrices y determinantes",
    status: "not_started",
    confidence: 1,
    priority: "medium",
    nextReviewAt: "",
    verificationStatus: "verified",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
  },
  {
    id: "physics-1",
    block: "Physics",
    officialNumber: "1",
    officialTitle: "Cinemática y dinámica del punto material.",
    normalizedTitle: "Cinemática y dinámica",
    status: "not_started",
    confidence: 1,
    priority: "medium",
    nextReviewAt: "",
    verificationStatus: "verified",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
  },
];

describe("didactic question bank", () => {
  it("creates exactly one didactic question linked to every verified topic", () => {
    const questions = buildDidacticQuestions(topics);

    expect(questions).toHaveLength(topics.length);
    expect(new Set(questions.flatMap((question) => question.topicIds))).toEqual(
      new Set(topics.map((topic) => topic.id)),
    );
  });

  it("never presents didactic questions as official", () => {
    expect(
      buildDidacticQuestions(topics).every(
        (question) =>
          question.verificationStatus === "unverified" &&
          question.answerSourceStatus === "inferred" &&
          question.sourceExam === "Material didáctico no oficial",
      ),
    ).toBe(true);
  });
});
