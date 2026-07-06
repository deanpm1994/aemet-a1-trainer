import {
  mapImportedSyllabusTopicToTopic,
  parseOfficialSyllabusTopicRecord,
} from "./official-content-import";
import type { Topic } from "./types";

type LoadedOfficialSyllabusSubset =
  | { ok: true; topics: Topic[] }
  | {
      ok: false;
      issues: Array<{ index: number; field: string; message: string }>;
    };

export const officialSyllabusSubsetSource = [
  {
    block: "Mathematics",
    officialNumber: "1",
    officialTitle: "Espacios vectoriales. Bases y dimension. Aplicaciones lineales.",
    normalizedTitle: "Espacios vectoriales Bases y dimension Aplicaciones lineales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "1",
    officialTitle: "Ley de la gravitacion universal. Teoria del campo gravitatorio.",
    normalizedTitle: "Ley de la gravitacion universal Teoria del campo gravitatorio",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "1",
    officialTitle:
      "Composicion y estructura de la atmosfera. Variacion de la temperatura con la altura.",
    normalizedTitle:
      "Composicion y estructura de la atmosfera Variacion de la temperatura con la altura",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Informatics and Communications",
    officialNumber: "1",
    officialTitle:
      "Concepto de informatica. Arquitectura de ordenadores. Procesador. Memoria. Perifericos.",
    normalizedTitle:
      "Concepto de informatica Arquitectura de ordenadores Procesador Memoria Perifericos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "General/Common",
    officialNumber: "1",
    officialTitle:
      "La Constitucion espanola de 1978: estructura y contenido. Derechos y deberes fundamentales.",
    normalizedTitle:
      "La Constitucion espanola de 1978 estructura y contenido Derechos y deberes fundamentales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
];

export function loadOfficialSyllabusSubset(): LoadedOfficialSyllabusSubset {
  const issues: Array<{ index: number; field: string; message: string }> = [];
  const topics = officialSyllabusSubsetSource.flatMap((record, index) => {
    const parsed = parseOfficialSyllabusTopicRecord(record);

    if (!parsed.ok) {
      issues.push(
        ...parsed.issues.map((issue) => ({
          index,
          field: issue.field,
          message: issue.message,
        })),
      );
      return [];
    }

    return [mapImportedSyllabusTopicToTopic(parsed.record)];
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, topics };
}
