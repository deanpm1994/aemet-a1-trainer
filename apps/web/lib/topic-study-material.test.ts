import { describe, expect, it } from "vitest";

import { buildTopicStudyCards, getTopicStudyCard } from "./topic-study-material";
import type { Topic } from "./types";

const mathematicsTopic: Topic = {
  id: "mathematics-1",
  block: "Mathematics",
  officialNumber: "1",
  officialTitle: "Matrices y determinantes. Propiedades y operaciones elementales.",
  normalizedTitle: "Matrices y determinantes",
  status: "not_started",
  confidence: 1,
  priority: "medium",
  nextReviewAt: "",
  verificationStatus: "verified",
  sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
  retrievedAt: "2026-07-06",
};

const physicsTopic: Topic = {
  ...mathematicsTopic,
  id: "physics-1",
  block: "Physics",
  officialTitle: "Cinemática y dinámica del punto material.",
};

describe("topic study material", () => {
  it("creates one labelled Spanish study card for every verified topic", () => {
    const cards = buildTopicStudyCards([mathematicsTopic, physicsTopic]);

    expect(cards).toHaveLength(2);
    expect(cards.every((card) => card.label === "Material didáctico no oficial")).toBe(
      true,
    );
    expect(cards.every((card) => card.objectives.length > 0 && card.checklist.length > 0)).toBe(
      true,
    );
  });

  it("adds rich notes only for Mathematics and Meteorology and Climatology", () => {
    expect(getTopicStudyCard(mathematicsTopic).richNotes.length).toBeGreaterThan(0);
    expect(getTopicStudyCard(physicsTopic).richNotes).toEqual([]);
  });
});
