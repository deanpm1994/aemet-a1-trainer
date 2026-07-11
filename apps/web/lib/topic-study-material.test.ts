import { describe, expect, it } from "vitest";

import { buildTopicStudyCards, getTopicStudyCard } from "./topic-study-material";
import { loadOfficialSyllabusSubset } from "./official-syllabus-subset";
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

  it("adds rich notes for Mathematics and Physics", () => {
    expect(getTopicStudyCard(mathematicsTopic).richNotes.length).toBeGreaterThan(0);
    expect(getTopicStudyCard(physicsTopic).richNotes.length).toBeGreaterThanOrEqual(3);
  });

  it("adds labelled rich notes for every verified Physics topic", () => {
    const loaded = loadOfficialSyllabusSubset();

    expect(loaded.ok).toBe(true);

    if (!loaded.ok) {
      throw new Error("Expected official syllabus");
    }

    const cards = loaded.topics
      .filter((topic) => topic.block === "Physics")
      .map(getTopicStudyCard);

    expect(cards).toHaveLength(18);
    expect(cards.every((card) => card.label === "Material didáctico no oficial")).toBe(
      true,
    );
    expect(cards.every((card) => card.richNotes.length >= 3)).toBe(true);
  });

  it("adds labelled rich notes for every verified Informatics topic", () => {
    const loaded = loadOfficialSyllabusSubset();

    expect(loaded.ok).toBe(true);

    if (!loaded.ok) {
      throw new Error("Expected official syllabus");
    }

    const cards = loaded.topics
      .filter((topic) => topic.block === "Informatics and Communications")
      .map(getTopicStudyCard);

    expect(cards).toHaveLength(10);
    expect(cards.every((card) => card.label === "Material didáctico no oficial")).toBe(
      true,
    );
    expect(cards.every((card) => card.richNotes.length >= 3)).toBe(true);
  });

  it("adds labelled rich notes for every verified General/Common topic", () => {
    const loaded = loadOfficialSyllabusSubset();

    expect(loaded.ok).toBe(true);

    if (!loaded.ok) {
      throw new Error("Expected official syllabus");
    }

    const cards = loaded.topics
      .filter((topic) => topic.block === "General/Common")
      .map(getTopicStudyCard);

    expect(cards).toHaveLength(23);
    expect(cards.every((card) => card.label === "Material didáctico no oficial")).toBe(
      true,
    );
    expect(cards.every((card) => card.richNotes.length >= 3)).toBe(true);
  });
});
