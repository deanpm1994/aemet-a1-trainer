import { describe, expect, it } from "vitest";

import type { Question } from "./types";
import {
  mapImportedPastExamQuestionToQuestion,
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
      answerSourceUrl: "https://www.boe.es/answer.pdf",
      answerRetrievedAt: "2026-07-06",
      sourceName: "BOE",
      sourceUrl: "",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
      topicIds: ["meteorology-and-climatology-1"],
      difficulty: 3,
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
      answerSourceUrl: "",
      answerRetrievedAt: "",
      sourceName: "Unofficial notes",
      sourceUrl: "https://example.com/notes",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
      topicIds: ["meteorology-and-climatology-1"],
      difficulty: 3,
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          field: "answerSourceStatus",
          message:
            "verified official question imports require official answer sources",
        },
      ],
    });
  });

  it("maps a verified official past-exam question with official answer provenance", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceYear: 2018,
      questionNumber: "8",
      statement: "Señale la afirmación correcta:",
      options: [
        "A) La distribución hipergeométrica se utiliza en el muestreo de una población finita sin reemplazamiento.",
        "B) La distribución hipergeométrica se utiliza en el muestreo de una población finita con reemplazamiento.",
        "C) La distribución hipergeométrica se aproxima a la distribución binomial si el tamaño de la población no es grande.",
        "D) La distribución hipergeométrica no se aproxima a ninguna distribución.",
      ],
      correctAnswer: "A",
      answerSourceStatus: "official",
      answerSourceUrl:
        "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/plantilla_definitiva_notas_1ejercicio_libre_cs_meteorologos_tcm30-498798.pdf",
      answerRetrievedAt: "2026-07-09",
      sourceName: "MITECO",
      sourceUrl:
        "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/cuestionario_primerejercicio_libre_cs_meteorologos_tcm30-498497.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      topicIds: [],
      difficulty: 3,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected valid past-exam question");
    }

    expect(mapImportedPastExamQuestionToQuestion(result.record)).toEqual<Question>({
      id: "aemet-a1-acceso-libre-primer-ejercicio-2018-8",
      name: "AEMET A1 acceso libre primer ejercicio 2018 pregunta 8",
      type: "multiple_choice",
      sourceYear: 2018,
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceUrl:
        "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/cuestionario_primerejercicio_libre_cs_meteorologos_tcm30-498497.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      questionNumber: "8",
      statement: "Señale la afirmación correcta:",
      options: [
        "A) La distribución hipergeométrica se utiliza en el muestreo de una población finita sin reemplazamiento.",
        "B) La distribución hipergeométrica se utiliza en el muestreo de una población finita con reemplazamiento.",
        "C) La distribución hipergeométrica se aproxima a la distribución binomial si el tamaño de la población no es grande.",
        "D) La distribución hipergeométrica no se aproxima a ninguna distribución.",
      ],
      correctAnswer: "A",
      answerSourceStatus: "official",
      answerSourceUrl:
        "https://www.miteco.gob.es/content/dam/miteco/es/ministerio/empleo-publico/personal-funcionario/plantilla_definitiva_notas_1ejercicio_libre_cs_meteorologos_tcm30-498798.pdf",
      answerRetrievedAt: "2026-07-09",
      origin: "official_historic",
      editorialStatus: "official",
      explanation: "",
      topicIds: [],
      difficulty: 3,
      attemptsCount: 0,
      lastAttemptAt: "TODO_VERIFY_OFFICIAL_SOURCE",
      nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
      mistakeTypes: ["none"],
    });
  });

  it("accepts official questions without answer keys only as needs_review", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre segundo ejercicio",
      sourceYear: 2018,
      questionNumber: "1",
      statement: "Desarrolle el supuesto práctico propuesto.",
      options: ["Respuesta desarrollada sin opciones cerradas"],
      correctAnswer: "",
      answerSourceStatus: "unknown",
      answerSourceUrl: "",
      answerRetrievedAt: "",
      sourceName: "AEMET",
      sourceUrl: "https://www.aemet.es/documentos/es/empleo/examen.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "needs_review",
      topicIds: [],
      difficulty: 4,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected reviewable unanswered question");
    }

    expect(result.record.correctAnswer).toBe("");
    expect(result.record.answerSourceStatus).toBe("unknown");
    expect(result.record.verificationStatus).toBe("needs_review");
  });

  it("rejects verified question imports without official answer source metadata", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceYear: 2018,
      questionNumber: "10",
      statement: "Seleccione la respuesta correcta.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "D",
      answerSourceStatus: "official",
      answerSourceUrl: "",
      answerRetrievedAt: "",
      sourceName: "MITECO",
      sourceUrl: "https://www.miteco.gob.es/documentos/examen.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      topicIds: [],
      difficulty: 3,
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          field: "answerSourceUrl",
          message: "answerSourceUrl is required for official answer imports",
        },
        {
          field: "answerRetrievedAt",
          message: "answerRetrievedAt is required for official answer imports",
        },
      ],
    });
  });

  it("rejects inferred answers for verified official imports", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceYear: 2018,
      questionNumber: "13",
      statement: "Seleccione la respuesta correcta.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "B",
      answerSourceStatus: "inferred",
      answerSourceUrl: "",
      answerRetrievedAt: "",
      sourceName: "MITECO",
      sourceUrl: "https://www.miteco.gob.es/documentos/examen.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      topicIds: [],
      difficulty: 3,
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          field: "answerSourceStatus",
          message:
            "verified official question imports require official answer sources",
        },
      ],
    });
  });
});
