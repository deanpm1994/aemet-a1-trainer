# Meteorology and Climatology Syllabus 2-10 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the verified BOE Meteorology and Climatology block through topics 2 through 10 while keeping the same source-owned subset loader and `/topics` preference path.

**Architecture:** Reuse the existing `BOE-A-2026-1292` manifest, checked-in subset source, and official-content import parser. Extend the subset data with Meteorology and Climatology topics 2 through 10, then tighten tests and docs so Mathematics and Physics remain complete while Meteorology and Climatology is explicitly partial through topic 10.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Markdown docs, existing official-content import helpers.

---

## File Structure

- Modify `apps/web/lib/official-syllabus-subset.ts`: extend the checked-in BOE subset with Meteorology and Climatology topics 2 through 10.
- Modify `apps/web/lib/official-syllabus-subset.test.ts`: add TDD coverage for the Meteorology and Climatology 1-10 sequence and new total subset count.
- Modify `apps/web/lib/notion-topics.test.ts`: update the subset-preference assertion to the larger total and Meteorology and Climatology range.
- Modify `docs/PROJECT_MEMORY.md`: record that Meteorology and Climatology is now imported through topic 10 and point the next syllabus step to another Meteorology and Climatology batch.
- Modify `docs/DATA_MODEL.md`: update the checked-in subset description so it states Mathematics and Physics are complete and Meteorology and Climatology is imported through topic 10.

## Task 1: Extend the Verified Meteorology and Climatology Block

**Files:**
- Modify: `apps/web/lib/official-syllabus-subset.ts`
- Modify: `apps/web/lib/official-syllabus-subset.test.ts`

- [ ] **Step 1: Write the failing tests for the Meteorology and Climatology 1-10 import**

Replace `apps/web/lib/official-syllabus-subset.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Meteorology and Climatology topics 1 through 10", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(48);

    const meteoTopics = result.topics.filter(
      (topic) => topic.block === "Meteorology and Climatology",
    );

    expect(meteoTopics).toHaveLength(10);
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
    ]);
    expect(meteoTopics[9]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(meteoTopics[9]?.retrievedAt).toBe("2026-07-06");
    expect(meteoTopics[9]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const finalMeteoTopic = officialSyllabusSubsetSource.find(
      (topic) =>
        topic.block === "Meteorology and Climatology" &&
        topic.officialNumber === "10",
    );

    expect(finalMeteoTopic).toBeDefined();
    expect(finalMeteoTopic?.officialTitle).not.toBe(finalMeteoTopic?.normalizedTitle);
    expect(finalMeteoTopic?.officialTitle).toContain(".");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: FAIL because the current subset contains 39 topics and only Meteorology and Climatology topic 1.

- [ ] **Step 3: Extend the checked-in BOE subset with Meteorology and Climatology topics 2 through 10**

Update `apps/web/lib/official-syllabus-subset.ts` by inserting these records after Meteorology and Climatology topic `1` and before the Informatics and Communications topic:

```ts
  {
    block: "Meteorology and Climatology",
    officialNumber: "2",
    officialTitle:
      "Composición química de la atmósfera. Composición isotópica. Ozonosfera. Variabilidad de la composición atmosférica.",
    normalizedTitle:
      "Composicion quimica de la atmosfera Composicion isotopica Ozonosfera Variabilidad de la composicion atmosferica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "3",
    officialTitle:
      "La radiación en la atmósfera. Radiación solar y terrestre. Procesos de absorción, emisión y dispersión. Balance radiativo terrestre.",
    normalizedTitle:
      "La radiacion en la atmosfera Radiacion solar y terrestre Procesos de absorcion emision y dispersion Balance radiativo terrestre",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "4",
    officialTitle:
      "Ecuación de estado del aire atmosférico. Ecuaciones fundamentales de la estática atmosférica. Espesor de una capa atmosférica.",
    normalizedTitle:
      "Ecuacion de estado del aire atmosferico Ecuaciones fundamentales de la estatica atmosferica Espesor de una capa atmosferica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "5",
    officialTitle:
      "El agua en la atmósfera. Evaporación y condensación. Tensión de vapor. Variación de la temperatura de cambio de fase con la temperatura. Humedad absoluta, específica, relativa y razón de mezcla. Punto de rocío. Balance hídrico.",
    normalizedTitle:
      "El agua en la atmosfera Evaporacion y condensacion Tension de vapor Variacion de la temperatura de cambio de fase con la temperatura Humedad absoluta especifica relativa y razon de mezcla Punto de rocio Balance hidrico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "6",
    officialTitle:
      "Procesos adiabáticos en la atmósfera. El gradiente adiabático seco y saturado. Estabilidad estática. Inestabilidad condicional. Índices de estabilidad.",
    normalizedTitle:
      "Procesos adiabaticos en la atmosfera El gradiente adiabatico seco y saturado Estabilidad estatica Inestabilidad condicional Indices de estabilidad",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "7",
    officialTitle:
      "Nubes. Clasificación y génesis. Nubes cumuliformes y estratiformes. Nubes altas, medias y bajas. Nieblas.",
    normalizedTitle:
      "Nubes Clasificacion y genesis Nubes cumuliformes y estratiformes Nubes altas medias y bajas Nieblas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "8",
    officialTitle:
      "Procesos microfísicos en nubes cálidas y frías. Nucleación homogénea y heterogénea. Colisión-coalescencia. Proceso Bergeron-Findeisen.",
    normalizedTitle:
      "Procesos microfisicos en nubes calidas y frias Nucleacion homogenea y heterogenea Colision coalescencia Proceso Bergeron Findeisen",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "9",
    officialTitle:
      "Precipitación. Tipos y mecanismos de formación. Intensidad y duración. Medida de la precipitación.",
    normalizedTitle:
      "Precipitacion Tipos y mecanismos de formacion Intensidad y duracion Medida de la precipitacion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "10",
    officialTitle:
      "Visibilidad. Atenuación y extinción de la radiación en la atmósfera. Factores que afectan a la visibilidad. Medida instrumental de la visibilidad.",
    normalizedTitle:
      "Visibilidad Atenuacion y extincion de la radiacion en la atmosfera Factores que afectan a la visibilidad Medida instrumental de la visibilidad",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: PASS with 2 tests in `apps/web/lib/official-syllabus-subset.test.ts`.

- [ ] **Step 5: Commit the Meteorology and Climatology batch**

```bash
git add apps/web/lib/official-syllabus-subset.ts apps/web/lib/official-syllabus-subset.test.ts
git commit -m "feat(import): add meteo syllabus batch 2-10"
```

## Task 2: Update Loader Assertions and Project Status

**Files:**
- Modify: `apps/web/lib/notion-topics.test.ts`
- Modify: `docs/PROJECT_MEMORY.md`
- Modify: `docs/DATA_MODEL.md`

- [ ] **Step 1: Write the failing loader assertions for the Meteorology and Climatology batch**

Update the `prefers imported verified syllabus subset topics before fallback topics` test in `apps/web/lib/notion-topics.test.ts` to:

```ts
  it("prefers imported verified syllabus subset topics before fallback topics", async () => {
    const result = await loadTopicsSource({
      env: {},
      fallbackTopics: [],
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.topics[0]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(result.topics).toHaveLength(48);
    expect(
      result.topics
        .filter((topic) => topic.block === "Meteorology and Climatology")
        .map((topic) => topic.officialNumber),
    ).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  });
```

- [ ] **Step 2: Run the loader test to verify it fails**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: FAIL because the imported subset count is still 39 and Meteorology and Climatology only runs through topic 1.

- [ ] **Step 3: Update docs to state Meteorology and Climatology is imported through topic 10**

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics and Physics blocks (topics 1 through 18 in both) plus one verified starter topic in each remaining block; this remains a partial subset, not a full verified syllabus
```

with:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics and Physics blocks plus Meteorology and Climatology topics 1 through 10, with one verified starter topic in Informatics and Communications and General/Common; this remains a partial subset, not a full verified syllabus
```

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Continue the BOE Annex I syllabus import with Meteorology and Climatology as the next recommended block, then proceed through Informatics and Communications and General/Common in controlled verified batches before treating all topic blocks as official-ready
```

with:

```md
- Continue the BOE Annex I syllabus import with Meteorology and Climatology topics 11 onward in another controlled batch, then proceed through Informatics and Communications and General/Common before treating all topic blocks as official-ready
```

Edit `docs/DATA_MODEL.md` by replacing:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics and Physics blocks plus one verified starter topic in each remaining syllabus block.
```

with:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics and Physics blocks, Meteorology and Climatology topics 1 through 10, and one verified starter topic in Informatics and Communications and General/Common.
```

- [ ] **Step 4: Run the updated loader test to verify it passes**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: PASS for the updated imported-subset preference path and existing fallback/live-path coverage.

- [ ] **Step 5: Run branch verification**

Run:
- `npm --prefix apps/web test -- official-syllabus-subset`
- `npm --prefix apps/web test -- notion-topics`
- `npm --prefix apps/web test`
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web run build`

Expected:
- PASS for `official-syllabus-subset.test.ts`
- PASS for `notion-topics.test.ts`
- PASS for the full Vitest suite
- PASS for lint
- PASS for production build

- [ ] **Step 6: Commit loader and docs updates**

```bash
git add apps/web/lib/notion-topics.test.ts docs/PROJECT_MEMORY.md docs/DATA_MODEL.md
git commit -m "docs(import): record meteo syllabus batch 2-10"
```

## Self-Review

- Spec coverage: the plan covers only the approved scope: Meteorology and Climatology topics 2 through 10, updated loader assertions, and status docs.
- Placeholder scan: no unresolved placeholders or vague “handle later” instructions remain.
- Type consistency: all file paths, function names, and test targets match the current repo structure and the existing official import flow.
