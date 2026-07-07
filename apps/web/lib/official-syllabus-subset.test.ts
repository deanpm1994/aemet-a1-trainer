import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Meteorology and Climatology topics 1 through 20", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(58);

    const meteoTopics = result.topics.filter(
      (topic) => topic.block === "Meteorology and Climatology",
    );

    expect(meteoTopics).toHaveLength(20);
    expect(meteoTopics.map((topic) => topic.officialNumber)).toEqual([
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
      "19",
      "20",
    ]);
    expect(meteoTopics[19]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(meteoTopics[19]?.retrievedAt).toBe("2026-07-06");
    expect(meteoTopics[19]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const finalMeteoTopic = officialSyllabusSubsetSource.find(
      (topic) =>
        topic.block === "Meteorology and Climatology" &&
        topic.officialNumber === "20",
    );

    expect(finalMeteoTopic).toBeDefined();
    expect(finalMeteoTopic?.officialTitle).not.toBe(finalMeteoTopic?.normalizedTitle);
    expect(finalMeteoTopic?.officialTitle).toContain(".");
  });
});
