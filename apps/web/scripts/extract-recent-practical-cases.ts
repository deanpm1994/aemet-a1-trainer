import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { extractPracticalExercises } from "../lib/practical-case-extraction";

const papers = [
  {
    oepYear: 2024,
    examDate: "2025-06-01",
    pdf: "/private/tmp/aemet-a1-oep-2024-practical.pdf",
    sourceUrl: "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre/2024/20250603_AL_Problemas.pdf",
  },
  {
    oepYear: 2025,
    examDate: "2026-05-31",
    pdf: "/private/tmp/aemet-a1-oep-2025-practical.pdf",
    sourceUrl: "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre/2025/Problemas%20Acceso%20Libre%20-%20def.pdf",
  },
];

function main() {
  const records = papers.flatMap((paper) => {
    const text = execFileSync("pdftotext", ["-raw", paper.pdf, "-"], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });
    const exercises = extractPracticalExercises(text);
    if (exercises.length !== 16) {
      throw new Error(`OEP ${paper.oepYear}: expected 16 practical exercises, extracted ${exercises.length}`);
    }
    return exercises.map((exercise) => ({
      id: `aemet-a1-oep-${paper.oepYear}-first-exercise-part-2-${exercise.caseGroup}${exercise.exerciseNumber}`,
      oepYear: paper.oepYear,
      examDate: paper.examDate,
      examPart: "first_exercise_part_2",
      caseGroup: exercise.caseGroup,
      exerciseNumber: exercise.exerciseNumber,
      rawStatement: exercise.rawStatement,
      modelAnswer: null,
      gradingRubric: null,
      answerFormat: "developed_response",
      answerSourceStatus: "inferred",
      disposition: "quarantined",
      verificationStatus: "needs_review",
      sourceUrl: paper.sourceUrl,
      retrievedAt: "2026-07-20",
      reviewNote: "Official prompt requires visual review; non-official model solution and rubric require independent editorial review.",
    }));
  });
  const output = resolve("../../data/recent-official-practical-candidates.json");
  writeFileSync(output, `${JSON.stringify({ schemaVersion: 1, records }, null, 2)}\n`);
  console.log(`Extracted ${records.length} official practical candidates; all remain quarantined pending prompt and model-solution review.`);
}

main();
