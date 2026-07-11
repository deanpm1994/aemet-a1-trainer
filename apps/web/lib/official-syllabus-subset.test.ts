import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Meteorology and Climatology topics 1 through 59", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(128);

    const meteoTopics = result.topics.filter(
      (topic) => topic.block === "Meteorology and Climatology",
    );

    expect(meteoTopics).toHaveLength(59);
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
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
    ]);
    expect(meteoTopics[58]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(meteoTopics[58]?.retrievedAt).toBe("2026-07-06");
    expect(meteoTopics[58]?.verificationStatus).toBe("verified");
  });

  it("loads the verified BOE subset including Informatics and Communications topics 1 through 10", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    const informaticsTopics = result.topics.filter(
      (topic) => topic.block === "Informatics and Communications",
    );

    expect(informaticsTopics).toHaveLength(10);
    expect(informaticsTopics.map((topic) => topic.officialNumber)).toEqual([
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
    ]);
    expect(informaticsTopics[9]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(informaticsTopics[9]?.retrievedAt).toBe("2026-07-06");
    expect(informaticsTopics[9]?.verificationStatus).toBe("verified");
  });

  it("loads the verified BOE subset including acceso libre General/Common topics 1 through 23", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    const generalTopics = result.topics.filter(
      (topic) => topic.block === "General/Common",
    );

    expect(generalTopics).toHaveLength(23);
    expect(generalTopics.map((topic) => topic.officialNumber)).toEqual([
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
      "21",
      "22",
      "23",
    ]);
    expect(generalTopics[0]?.officialTitle).toContain(
      "La Constitución Española de 1978",
    );
    expect(generalTopics[22]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(generalTopics[22]?.retrievedAt).toBe("2026-07-06");
    expect(generalTopics[22]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const finalMeteoTopic = officialSyllabusSubsetSource.find(
      (topic) =>
        topic.block === "Meteorology and Climatology" &&
        topic.officialNumber === "59",
    );

    expect(finalMeteoTopic).toBeDefined();
    expect(finalMeteoTopic?.officialTitle).not.toBe(finalMeteoTopic?.normalizedTitle);
    expect(finalMeteoTopic?.officialTitle).toContain(".");
  });
});
