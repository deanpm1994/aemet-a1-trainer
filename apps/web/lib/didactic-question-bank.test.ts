import { describe, expect, it } from "vitest";

import { buildDidacticQuestions } from "./didactic-question-bank";
import { loadOfficialSyllabusSubset } from "./official-syllabus-subset";
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
  it("creates three reviewed didactic questions linked to every verified topic", () => {
    const questions = buildDidacticQuestions(topics);

    expect(questions).toHaveLength(topics.length * 3);
    expect(new Set(questions.flatMap((question) => question.topicIds))).toEqual(
      new Set(topics.map((topic) => topic.id)),
    );
  });

  it("never presents didactic questions as official", () => {
    expect(
      buildDidacticQuestions(topics).every(
        (question) =>
          question.verificationStatus === "verified" &&
          question.origin === "didactic_reviewed" &&
          question.editorialStatus === "reviewed" &&
          question.answerSourceStatus === "inferred" &&
          question.sourceExam === "Material didáctico no oficial (revisado)",
      ),
    ).toBe(true);
  });

  it("covers all 128 verified BOE topics with three cited questions each", () => {
    const syllabus = loadOfficialSyllabusSubset();
    expect(syllabus.ok).toBe(true);
    if (!syllabus.ok) throw new Error("Expected verified syllabus");
    const questions = buildDidacticQuestions(syllabus.topics);
    expect(questions).toHaveLength(384);
    expect(questions.every((question) => question.options.length === 4)).toBe(true);
    expect(questions.every((question) => question.options.includes(question.correctAnswer))).toBe(true);
    expect(questions.every((question) => question.sourceUrl.includes("boe.es"))).toBe(true);
  });
});
