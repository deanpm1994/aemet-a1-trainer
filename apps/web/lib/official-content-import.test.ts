import { describe, expect, it } from "vitest";

import {
  mapImportedSyllabusTopicToTopic,
  parseOfficialSyllabusTopicRecord,
  validateOfficialPastExamQuestionRecord,
} from "./official-content-import";

describe("official content import", () => {
  it("preserves exact official syllabus wording and derives normalized title", () => {
    const result = parseOfficialSyllabusTopicRecord({
      block: "Meteorology and Climatology",
      officialNumber: "39",
      officialTitle:
        "Termodinamica de la atmosfera. Ecuaciones termodinamicas. Procesos adiabaticos.",
      sourceName: "BOE",
      sourceUrl: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-00000",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected valid syllabus record");
    }

    expect(result.record.officialTitle).toBe(
      "Termodinamica de la atmosfera. Ecuaciones termodinamicas. Procesos adiabaticos.",
    );
    expect(result.record.normalizedTitle).toBe(
      "Termodinamica de la atmosfera Ecuaciones termodinamicas Procesos adiabaticos",
    );
    expect(result.record.id).toBe("meteorology-and-climatology-39");
  });

  it("returns structured validation issues when required syllabus metadata is missing", () => {
    const result = parseOfficialSyllabusTopicRecord({
      block: "Mathematics",
      officialNumber: "1",
      officialTitle: "Algebra lineal.",
      sourceName: "BOE",
      sourceUrl: "",
      retrievedAt: "",
      verificationStatus: "verified",
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        { field: "sourceUrl", message: "sourceUrl is required for official imports" },
        { field: "retrievedAt", message: "retrievedAt is required for official imports" },
      ],
    });
  });

  it("maps a validated imported syllabus topic into the app Topic shape", () => {
    const parsed = parseOfficialSyllabusTopicRecord({
      block: "Physics",
      officialNumber: "7",
      officialTitle: "Radiacion. Leyes fundamentales.",
      sourceName: "BOE",
      sourceUrl: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-00000",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
    });

    if (!parsed.ok) {
      throw new Error("Expected valid syllabus record");
    }

    expect(mapImportedSyllabusTopicToTopic(parsed.record)).toEqual({
      id: "physics-7",
      block: "Physics",
      officialNumber: "7",
      officialTitle: "Radiacion. Leyes fundamentales.",
      normalizedTitle: "Radiacion Leyes fundamentales",
      status: "not_started",
      confidence: 0,
      priority: "medium",
      nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
      verificationStatus: "verified",
      sourceUrl: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-00000",
      retrievedAt: "2026-07-06",
      notesStatus: "source_imported",
    });
  });

  it("validates the past exam question contract without importing questions yet", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1",
      sourceYear: 2024,
      questionNumber: "12",
      statement: "Que magnitud describe la estabilidad atmosferica?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "B",
      answerSourceStatus: "official",
      sourceName: "BOE",
      sourceUrl: "",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        { field: "sourceUrl", message: "sourceUrl is required for official imports" },
      ],
    });
  });

  it("rejects unsupported official answer claims when the answer source is unknown", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1",
      sourceYear: 2024,
      questionNumber: "13",
      statement: "Seleccione la respuesta correcta.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      answerSourceStatus: "unknown",
      sourceName: "Unofficial notes",
      sourceUrl: "https://example.com/notes",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          field: "answerSourceStatus",
          message:
            "verified official question imports cannot use unknown or user answer sources",
        },
      ],
    });
  });
});
