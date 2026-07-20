import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  extractDefinitiveKey,
  extractRecentMultipleChoice,
} from "../lib/recent-official-question-extraction";

type ExamConfig = {
  oepYear: number;
  examDate: string;
  ordinaryCount: number;
  questionPdf: string;
  keyPdf: string;
  questionUrl: string;
  keyUrl: string;
  activatedReserves: string[];
};

const exams: ExamConfig[] = [
  {
    oepYear: 2024,
    examDate: "2025-06-01",
    ordinaryCount: 100,
    questionPdf: "/private/tmp/aemet-a1-oep-2024-mcq.pdf",
    keyPdf: "/private/tmp/aemet-a1-oep-2024-key.pdf",
    questionUrl: "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre/2024/20250603_AL_Examen_Test.pdf",
    keyUrl: "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre/2024/report_Resolucion_06_DEF_anonima_AL.pdf",
    activatedReserves: ["101", "102", "103", "104", "105"],
  },
  {
    oepYear: 2025,
    examDate: "2026-05-31",
    ordinaryCount: 120,
    questionPdf: "/private/tmp/aemet-a1-oep-2025-mcq.pdf",
    keyPdf: "/private/tmp/aemet-a1-oep-2025-key.pdf",
    questionUrl: "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre/2025/CSuperior%20Meteorologos_L.pdf",
    keyUrl: "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre/2025/report_Resolucion%2006%20-%20Publicacion%20plantilla%20DEF%20anonima%20AL.pdf",
    activatedReserves: ["121", "122"],
  },
];

function pdfText(path: string, layout = false): string {
  return execFileSync("pdftotext", [...(layout ? ["-layout"] : ["-raw"]), path, "-"], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function main() {
  const records = exams.flatMap((exam) => {
    const questions = extractRecentMultipleChoice(pdfText(exam.questionPdf));
    const keys = new Map(extractDefinitiveKey(pdfText(exam.keyPdf, true))
      .map((entry) => [entry.questionNumber, entry.answer]));
    const expected = exam.ordinaryCount + 5;
    if (questions.length !== expected) {
      throw new Error(`OEP ${exam.oepYear}: expected ${expected} questions, extracted ${questions.length}`);
    }
    return questions.map((question) => {
      const answer = keys.get(question.questionNumber);
      if (!answer) throw new Error(`OEP ${exam.oepYear} question ${question.questionNumber}: definitive answer missing`);
      const reserve = Number(question.questionNumber) > exam.ordinaryCount;
      const annulled = answer === "ANULADA";
      return {
        id: `aemet-a1-oep-${exam.oepYear}-first-exercise-part-1-${question.questionNumber}`,
        oepYear: exam.oepYear,
        examDate: exam.examDate,
        examPart: "first_exercise_part_1",
        questionNumber: question.questionNumber,
        rawStatement: question.rawStatement,
        rawOptions: question.rawOptions,
        definitiveAnswer: answer,
        questionRole: reserve ? "reserve" : "ordinary",
        reserveDisposition: reserve
          ? exam.activatedReserves.includes(question.questionNumber) ? "activated" : "unused"
          : "not_applicable",
        disposition: annulled ? "annulled" : "quarantined",
        verificationStatus: "needs_review",
        questionSourceUrl: exam.questionUrl,
        answerSourceUrl: exam.keyUrl,
        retrievedAt: "2026-07-20",
      };
    });
  });

  const output = resolve("../../data/recent-official-question-candidates.json");
  writeFileSync(output, `${JSON.stringify({ schemaVersion: 1, records }, null, 2)}\n`);
  const annulled = records.filter((record) => record.disposition === "annulled").length;
  const structurallyComplete = records.filter((record) => record.rawOptions.length === 3).length;
  console.log(`Extracted ${records.length} recent official candidates: ${records.length - annulled} non-annulled, ${annulled} annulled, ${structurallyComplete} with three parsed options.`);
}

main();
