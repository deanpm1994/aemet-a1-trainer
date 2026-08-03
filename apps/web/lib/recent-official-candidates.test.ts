import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type MultipleChoiceCandidate = {
  oepYear: number;
  questionNumber: string;
  rawStatement: string;
  rawOptions: string[];
  definitiveAnswer: string;
  questionRole: "ordinary" | "reserve";
  reserveDisposition: "not_applicable" | "activated" | "unused";
  disposition: "annulled" | "quarantined";
  verificationStatus: "needs_review";
};

type PracticalCandidate = {
  oepYear: number;
  caseGroup: "A" | "B";
  exerciseNumber: string;
  rawStatement: string;
  modelAnswer: null;
  gradingRubric: null;
  disposition: "quarantined";
  verificationStatus: "needs_review";
};

function readRecords<T>(file: string): T[] {
  return (JSON.parse(readFileSync(resolve(process.cwd(), `../../data/${file}`), "utf8")) as { records: T[] }).records;
}

describe("recent official candidate datasets", () => {
  it("accounts for 223 usable decisions and seven annulled audit records", () => {
    const records = readRecords<MultipleChoiceCandidate>("recent-official-question-candidates.json");
    expect(records).toHaveLength(230);
    expect(records.filter((record) => record.oepYear === 2024)).toHaveLength(105);
    expect(records.filter((record) => record.oepYear === 2025)).toHaveLength(125);
    expect(records.filter((record) => record.definitiveAnswer === "ANULADA")).toHaveLength(7);
    expect(records.filter((record) => record.definitiveAnswer !== "ANULADA")).toHaveLength(223);
    expect(records.every((record) => record.rawStatement && record.rawOptions.length === 3)).toBe(true);
    expect(records.every((record) => record.verificationStatus === "needs_review")).toBe(true);
  });

  it("preserves definitive corrections and reserve dispositions", () => {
    const records = readRecords<MultipleChoiceCandidate>("recent-official-question-candidates.json");
    const find = (oepYear: number, questionNumber: string) =>
      records.find((record) => record.oepYear === oepYear && record.questionNumber === questionNumber);

    expect(find(2025, "37")?.definitiveAnswer).toBe("B");
    expect(find(2025, "96")?.definitiveAnswer).toBe("B");
    expect(["5", "7", "13", "52", "74"].map((number) => find(2024, number)?.disposition))
      .toEqual(Array(5).fill("annulled"));
    expect(["41", "62"].map((number) => find(2025, number)?.disposition))
      .toEqual(Array(2).fill("annulled"));
    expect(["101", "102", "103", "104", "105"].map((number) => find(2024, number)?.reserveDisposition))
      .toEqual(Array(5).fill("activated"));
    expect(["121", "122"].map((number) => find(2025, number)?.reserveDisposition))
      .toEqual(Array(2).fill("activated"));
    expect(["123", "124", "125"].map((number) => find(2025, number)?.reserveDisposition))
      .toEqual(Array(3).fill("unused"));
  });

  it("accounts for all 32 practical prompts without pretending model solutions are reviewed", () => {
    const records = readRecords<PracticalCandidate>("recent-official-practical-candidates.json");
    expect(records).toHaveLength(32);
    for (const year of [2024, 2025]) {
      for (const group of ["A", "B"] as const) {
        expect(records.filter((record) => record.oepYear === year && record.caseGroup === group)).toHaveLength(8);
      }
    }
    expect(records.every((record) =>
      record.rawStatement &&
      record.modelAnswer === null &&
      record.gradingRubric === null &&
      record.disposition === "quarantined" &&
      record.verificationStatus === "needs_review"
    )).toBe(true);
  });
});
