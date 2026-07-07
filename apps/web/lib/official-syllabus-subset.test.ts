import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Mathematics topics 1 through 9", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(13);

    const mathematicsTopics = result.topics.filter(
      (topic) => topic.block === "Mathematics",
    );

    expect(mathematicsTopics).toHaveLength(9);
    expect(mathematicsTopics.map((topic) => topic.officialNumber)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    expect(mathematicsTopics[0]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(mathematicsTopics[0]?.retrievedAt).toBe("2026-07-06");
    expect(mathematicsTopics[0]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const firstMathTopic = officialSyllabusSubsetSource.find(
      (topic) => topic.block === "Mathematics" && topic.officialNumber === "1",
    );

    expect(firstMathTopic).toBeDefined();
    expect(firstMathTopic?.officialTitle).not.toBe(firstMathTopic?.normalizedTitle);
    expect(firstMathTopic?.officialTitle).toContain(".");
  });
});
