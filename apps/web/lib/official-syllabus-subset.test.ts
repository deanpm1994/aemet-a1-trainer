import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Physics topics 1 through 18", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(39);

    const physicsTopics = result.topics.filter((topic) => topic.block === "Physics");

    expect(physicsTopics).toHaveLength(18);
    expect(physicsTopics.map((topic) => topic.officialNumber)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
    ]);
    expect(physicsTopics[17]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(physicsTopics[17]?.retrievedAt).toBe("2026-07-06");
    expect(physicsTopics[17]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const finalPhysicsTopic = officialSyllabusSubsetSource.find(
      (topic) => topic.block === "Physics" && topic.officialNumber === "18",
    );

    expect(finalPhysicsTopic).toBeDefined();
    expect(finalPhysicsTopic?.officialTitle).not.toBe(
      finalPhysicsTopic?.normalizedTitle,
    );
    expect(finalPhysicsTopic?.officialTitle).toContain(".");
  });
});
