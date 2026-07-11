import { describe, expect, it } from "vitest";

import {
  loadOfficialPastExamSubset,
  officialPastExamSubsetSource,
} from "./official-past-exam-subset";

describe("official past exam subset", () => {
  it("loads the verified AEMET/MITECO 2014 first-exercise slice", () => {
    const result = loadOfficialPastExamSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified past-exam subset");
    }

    const imported2014Questions = result.questions.filter(
      (question) => question.sourceYear === 2014,
    );

    expect(result.questions).toHaveLength(27);
    expect(imported2014Questions.map((question) => question.questionNumber)).toEqual([
      "1",
      "2",
      "3",
      "5",
      "6",
      "8",
      "9",
      "10",
    ]);
    expect(imported2014Questions.map((question) => question.correctAnswer)).toEqual([
      "A",
      "D",
      "A",
      "B",
      "B",
      "C",
      "C",
      "A",
    ]);
    expect(imported2014Questions.every((question) => question.answerSourceStatus === "official")).toBe(true);
    expect(imported2014Questions[0]).toMatchObject({
      id: "aemet-a1-acceso-libre-primer-ejercicio-2014-1",
      sourceUrl: expect.stringContaining("ex_met_lib_2014"),
      answerSourceUrl: expect.stringContaining("plantilla%20respuestas_tcm30-92321"),
      answerRetrievedAt: "2026-07-11",
    });
  });

  it("loads the verified MITECO/AEMET 2018 first-exercise subset", () => {
    const result = loadOfficialPastExamSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified past-exam subset");
    }

    expect(result.questions).toHaveLength(27);
    expect(
      result.questions
        .filter((question) => question.sourceYear === 2018)
        .map((question) => question.questionNumber),
    ).toEqual(["8", "10", "13", "17", "19"]);
    expect(
      result.questions
        .filter((question) => question.sourceYear === 2017)
        .map((question) => question.questionNumber),
    ).toEqual(["12", "13", "14", "15", "16"]);
    expect(
      result.questions
        .filter((question) => question.sourceYear === 2016)
        .map((question) => question.questionNumber),
    ).toEqual(["14", "15", "16", "17", "20"]);
    expect(
      result.questions
        .filter((question) => question.sourceYear === 2015)
        .map((question) => question.questionNumber),
    ).toEqual(["19", "20", "21", "22"]);
    expect(result.questions.find((question) => question.sourceYear === 2018)).toMatchObject({
      id: "aemet-a1-acceso-libre-primer-ejercicio-2018-8",
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceYear: 2018,
      questionNumber: "8",
      correctAnswer: "A",
      answerSourceStatus: "official",
      verificationStatus: "verified",
      answerRetrievedAt: "2026-07-09",
    });
  });

  it("preserves official question wording and answer provenance", () => {
    const sourceQuestion = officialPastExamSubsetSource.find(
      (question) => question.sourceYear === 2018 && question.questionNumber === "10",
    );

    expect(sourceQuestion).toBeDefined();
    expect(sourceQuestion?.statement).toBe(
      "Señale la afirmación correcta. El coeficiente de correlación de Pearson sirve para estudiar:",
    );
    expect(sourceQuestion?.options).toEqual([
      "A) La relación lineal entre dos variables de cualquier tipo.",
      "B) La relación exponencial entre dos variables cuantitativas.",
      "C) La relación lineal entre dos variables dicotómicas.",
      "D) La relación lineal entre dos variables cuantitativas.",
    ]);
    expect(sourceQuestion?.correctAnswer).toBe("D");
    expect(sourceQuestion?.answerSourceUrl).toContain(
      "plantilla_definitiva_notas_1ejercicio_libre_cs_meteorologos",
    );
  });

  it("loads the verified MITECO/AEMET 2017 first-exercise slice", () => {
    const result = loadOfficialPastExamSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified past-exam subset");
    }

    const imported2017Questions = result.questions.filter(
      (question) => question.sourceYear === 2017,
    );

    expect(imported2017Questions.map((question) => question.correctAnswer)).toEqual([
      "B",
      "C",
      "B",
      "C",
      "A",
    ]);
    expect(imported2017Questions[0]).toMatchObject({
      id: "aemet-a1-acceso-libre-primer-ejercicio-2017-12",
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      questionNumber: "12",
      statement: "El rango intercuartílico de una muestra es:",
      answerSourceStatus: "official",
      answerRetrievedAt: "2026-07-09",
    });
    expect(imported2017Questions[0]?.answerSourceUrl).toContain(
      "resolucion2017__plantillarespuestas_definitiva_pe_sello",
    );
  });

  it("loads the verified MITECO/AEMET 2016 first-exercise slice from the corrected key", () => {
    const result = loadOfficialPastExamSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified past-exam subset");
    }

    const imported2016Questions = result.questions.filter(
      (question) => question.sourceYear === 2016,
    );

    expect(imported2016Questions.map((question) => question.correctAnswer)).toEqual([
      "C",
      "A",
      "C",
      "A",
      "A",
    ]);
    expect(imported2016Questions[0]).toMatchObject({
      id: "aemet-a1-acceso-libre-primer-ejercicio-2016-14",
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      questionNumber: "14",
      statement:
        "Suponga que realiza 1000 aplicaciones de un test estadístico cumpliéndose en todas la hipótesis nula, trabajando al nivel de significación 0.05. Entonces, se puede afirmar que:",
      answerSourceStatus: "official",
      answerRetrievedAt: "2026-07-09",
    });
    expect(imported2016Questions[0]?.answerSourceUrl).toContain(
      "resolucion__correccionplantilladefc_sup_meteorologos",
    );
  });

  it("loads the verified AEMET/MITECO 2015 first-exercise slice", () => {
    const result = loadOfficialPastExamSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified past-exam subset");
    }

    const imported2015Questions = result.questions.filter(
      (question) => question.sourceYear === 2015,
    );

    expect(imported2015Questions.map((question) => question.correctAnswer)).toEqual([
      "C",
      "C",
      "D",
      "B",
    ]);
    expect(imported2015Questions[0]).toMatchObject({
      id: "aemet-a1-acceso-libre-primer-ejercicio-2015-19",
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      questionNumber: "19",
      statement:
        "En un proceso de nucleación heterogénea la curva de Köhler, que proporciona la razón de saturación de equilibrio en función del tamaño de las gotitas de disolución, indica que:",
      answerSourceStatus: "official",
      answerRetrievedAt: "2026-07-09",
    });
    expect(imported2015Questions[0]?.sourceUrl).toContain("ex_met_lib_2015");
    expect(imported2015Questions[0]?.answerSourceUrl).toContain(
      "plantilla_ejercicio1_meteorologos_libre",
    );
  });
});
