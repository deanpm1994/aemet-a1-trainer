export type ExtractedRecentQuestion = {
  questionNumber: string;
  rawStatement: string;
  rawOptions: string[];
};

export type DefinitiveKeyEntry = {
  questionNumber: string;
  answer: "A" | "B" | "C" | "ANULADA";
};

const furniture = [
  /^TRIBUNAL CALIFICADOR DEL PROCESO SELECTIVO/i,
  /^SUPERIOR DE METEORÓLOGOS DEL ESTADO/i,
  /^METEORÓLOGOS DEL ESTADO/i,
  /^RESOLUCIÓN de /i,
  /^PRIMER EJERCICIO PARTE 1\.? ACCESO LIBRE/i,
  /^CSM(?:E)?_L\s*-\s*\d+/i,
  /^©COPYRIGHT/i,
];

export function extractRecentMultipleChoice(rawPdfText: string): ExtractedRecentQuestion[] {
  const lines = rawPdfText
    .replaceAll("\f", "\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !furniture.some((pattern) => pattern.test(line)));
  const starts: Array<{ index: number; number: string; firstLine: string }> = [];
  lines.forEach((line, index) => {
    const match = /^(\d{1,3})\.\s+(.+)/.exec(line);
    if (match) starts.push({ index, number: match[1]!, firstLine: match[2]! });
  });

  const extracted = starts.map((start, position) => {
    const end = starts[position + 1]?.index ?? lines.length;
    const block = [start.firstLine, ...lines.slice(start.index + 1, end)];
    const optionStarts = block
      .map((line, index) => ({ index, match: /^([A-Ca-c])[\.)]\s*(.*)$/.exec(line) }))
      .filter((entry): entry is { index: number; match: RegExpExecArray } => Boolean(entry.match));
    if (optionStarts.length !== 3) {
      return {
        questionNumber: start.number,
        rawStatement: block.join("\n").trim(),
        rawOptions: [],
      };
    }
    const rawStatement = block.slice(0, optionStarts[0]!.index).join("\n").trim();
    const rawOptions = optionStarts.map((option, optionIndex) => {
      const next = optionStarts[optionIndex + 1]?.index ?? block.length;
      return [option.match[2]!, ...block.slice(option.index + 1, next)].join("\n").trim();
    });
    return { questionNumber: start.number, rawStatement, rawOptions };
  });
  const byNumber = new Map<string, ExtractedRecentQuestion>();
  for (const question of extracted) byNumber.set(question.questionNumber, question);
  return [...byNumber.values()].sort(
    (left, right) => Number(left.questionNumber) - Number(right.questionNumber),
  );
}

export function extractDefinitiveKey(layoutPdfText: string): DefinitiveKeyEntry[] {
  const entries = new Map<string, DefinitiveKeyEntry["answer"]>();
  for (const line of layoutPdfText.split(/\r?\n/)) {
    for (const match of line.matchAll(/(?:Reserva\s+)?(\d{1,3})\s+(ANULADA|[ABC])(?=\s|$)/g)) {
      entries.set(match[1]!, match[2]! as DefinitiveKeyEntry["answer"]);
    }
  }
  return [...entries].map(([questionNumber, answer]) => ({ questionNumber, answer }));
}
