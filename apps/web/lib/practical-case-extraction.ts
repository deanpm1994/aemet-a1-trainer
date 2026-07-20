export type ExtractedPracticalExercise = {
  caseGroup: "A" | "B";
  exerciseNumber: string;
  rawStatement: string;
};

const headingPattern = /^EJERCI(?:CIO|O)\s+([AB])(\d+)(?:\s*\([^)]*\))?\s*$/i;
const furniturePatterns = [
  /^TRIBUNAL CALIFICADOR DEL PROCESO SELECTIVO/i,
  /^SUPERIOR DE METEORÓLOGOS DEL ESTADO/i,
  /^METEORÓLOGOS DEL ESTADO/i,
  /^RESOLUCIÓN de /i,
  /^ACCESO LIBRE$/i,
  /^SUPUESTO PRÁCTICO [AB]$/i,
  /^Enunciados$/i,
  /^\(Acceso Libre\)$/i,
];

export function extractPracticalExercises(rawPdfText: string): ExtractedPracticalExercise[] {
  const lines = rawPdfText
    .replaceAll("\f", "\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !furniturePatterns.some((pattern) => pattern.test(line)));
  const headings = lines
    .map((line, index) => ({ index, match: headingPattern.exec(line) }))
    .filter((entry): entry is { index: number; match: RegExpExecArray } => Boolean(entry.match));

  return headings.map((heading, position) => {
    const end = headings[position + 1]?.index ?? lines.length;
    return {
      caseGroup: heading.match[1]!.toUpperCase() as "A" | "B",
      exerciseNumber: heading.match[2]!,
      rawStatement: lines.slice(heading.index + 1, end).join("\n").trim(),
    };
  });
}
