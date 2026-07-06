import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads a verified BOE subset with exact official wording preserved", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(5);
    expect(result.topics[0]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(result.topics[0]?.retrievedAt).toBe("2026-07-06");
    expect(result.topics[0]?.verificationStatus).toBe("verified");
  });

  it("keeps the raw source wording separate from the normalized display title", () => {
    const topic = officialSyllabusSubsetSource[0];

    expect(topic.officialTitle).not.toBe(topic.normalizedTitle);
    expect(topic.officialTitle).toContain(".");
  });
});
