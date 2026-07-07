# Meteorology and Climatology Syllabus 21-30 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the verified BOE Meteorology and Climatology block through topics 21 through 30 while keeping the same source-owned subset loader and `/topics` preference path.

**Architecture:** Reuse the existing `BOE-A-2026-1292` manifest, checked-in subset source, and official-content import parser. Extend the subset data with Meteorology and Climatology topics 21 through 30, then tighten tests and docs so Mathematics and Physics remain complete while Meteorology and Climatology is explicitly partial through topic 30.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Markdown docs, existing official-content import helpers.

---

## File Structure

- Modify `apps/web/lib/official-syllabus-subset.ts`: extend the checked-in BOE subset with Meteorology and Climatology topics 21 through 30.
- Modify `apps/web/lib/official-syllabus-subset.test.ts`: add TDD coverage for the Meteorology and Climatology 1-30 sequence and new total subset count.
- Modify `apps/web/lib/notion-topics.test.ts`: update the subset-preference assertion to the larger total and Meteorology and Climatology range.
- Modify `docs/PROJECT_MEMORY.md`: record that Meteorology and Climatology is now imported through topic 30 and point the next syllabus step to another Meteorology and Climatology batch.
- Modify `docs/DATA_MODEL.md`: update the checked-in subset description so it states Mathematics and Physics are complete and Meteorology and Climatology is imported through topic 30.

## Task 1: Extend the Verified Meteorology and Climatology Block

**Files:**
- Modify: `apps/web/lib/official-syllabus-subset.ts`
- Modify: `apps/web/lib/official-syllabus-subset.test.ts`

- [ ] **Step 1: Write the failing tests for the Meteorology and Climatology 1-30 import**

Replace `apps/web/lib/official-syllabus-subset.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Meteorology and Climatology topics 1 through 30", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(68);

    const meteoTopics = result.topics.filter(
      (topic) => topic.block === "Meteorology and Climatology",
    );

    expect(meteoTopics).toHaveLength(30);
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
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ]);
    expect(meteoTopics[29]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(meteoTopics[29]?.retrievedAt).toBe("2026-07-06");
    expect(meteoTopics[29]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const finalMeteoTopic = officialSyllabusSubsetSource.find(
      (topic) =>
        topic.block === "Meteorology and Climatology" &&
        topic.officialNumber === "30",
    );

    expect(finalMeteoTopic).toBeDefined();
    expect(finalMeteoTopic?.officialTitle).not.toBe(finalMeteoTopic?.normalizedTitle);
    expect(finalMeteoTopic?.officialTitle).toContain(".");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: FAIL because the current subset contains 58 topics and Meteorology and Climatology only runs through topic 20.

- [ ] **Step 3: Extend the checked-in BOE subset with Meteorology and Climatology topics 21 through 30**

Update `apps/web/lib/official-syllabus-subset.ts` by inserting these records after Meteorology and Climatology topic `20` and before the Informatics and Communications topic:

```ts
  {
    block: "Meteorology and Climatology",
    officialNumber: "21",
    officialTitle:
      "Predicción meteorológica. Principios generales. Escalas temporales y espaciales. Limitaciones de la predicción.",
    normalizedTitle:
      "Prediccion meteorologica Principios generales Escalas temporales y espaciales Limitaciones de la prediccion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "22",
    officialTitle:
      "Modelos numéricos de predicción. Ecuaciones primitivas. Condiciones iniciales y de contorno. Resolución numérica.",
    normalizedTitle:
      "Modelos numericos de prediccion Ecuaciones primitivas Condiciones iniciales y de contorno Resolucion numerica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "23",
    officialTitle:
      "Asimilación de datos meteorológicos. Observaciones convencionales y remotas. Métodos de análisis objetivo.",
    normalizedTitle:
      "Asimilacion de datos meteorologicos Observaciones convencionales y remotas Metodos de analisis objetivo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "24",
    officialTitle:
      "Predicción por conjuntos. Perturbaciones iniciales. Interpretación probabilista. Productos derivados.",
    normalizedTitle:
      "Prediccion por conjuntos Perturbaciones iniciales Interpretacion probabilista Productos derivados",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "25",
    officialTitle:
      "Predicción inmediata y de muy corto plazo. Nowcasting. Integración de observaciones radar, satélite y superficie.",
    normalizedTitle:
      "Prediccion inmediata y de muy corto plazo Nowcasting Integracion de observaciones radar satelite y superficie",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "26",
    officialTitle:
      "Meteorología aeronáutica. Fenómenos significativos para la aviación. Información meteorológica aeronáutica.",
    normalizedTitle:
      "Meteorologia aeronautica Fenomenos significativos para la aviacion Informacion meteorologica aeronautica",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "27",
    officialTitle:
      "Meteorología marítima. Oleaje, viento y estado del mar. Servicios meteorológicos marinos.",
    normalizedTitle:
      "Meteorologia maritima Oleaje viento y estado del mar Servicios meteorologicos marinos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "28",
    officialTitle:
      "Meteorología de montaña. Influencia del relieve. Riesgos asociados en alta montaña.",
    normalizedTitle:
      "Meteorologia de montana Influencia del relieve Riesgos asociados en alta montana",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "29",
    officialTitle:
      "Climatología. Tiempo y clima. Factores y elementos del clima. Clasificaciones climáticas.",
    normalizedTitle:
      "Climatologia Tiempo y clima Factores y elementos del clima Clasificaciones climaticas",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "30",
    officialTitle:
      "Sistema climático. Subsistemas y procesos de interacción. Balance energético del sistema climático.",
    normalizedTitle:
      "Sistema climatico Subsistemas y procesos de interaccion Balance energetico del sistema climatico",
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
git commit -m "feat(import): add meteo syllabus batch 21-30"
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
    expect(result.topics).toHaveLength(68);
    expect(
      result.topics
        .filter((topic) => topic.block === "Meteorology and Climatology")
        .map((topic) => topic.officialNumber),
    ).toEqual([
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
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ]);
  });
```

- [ ] **Step 2: Run the loader test to verify it fails**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: FAIL because the imported subset count is still 58 and Meteorology and Climatology only runs through topic 20.

- [ ] **Step 3: Update docs to state Meteorology and Climatology is imported through topic 30**

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics and Physics blocks plus Meteorology and Climatology topics 1 through 20, with one verified starter topic in Informatics and Communications and General/Common; this remains a partial subset, not a full verified syllabus
```

with:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics and Physics blocks plus Meteorology and Climatology topics 1 through 30, with one verified starter topic in Informatics and Communications and General/Common; this remains a partial subset, not a full verified syllabus
```

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Continue the BOE Annex I syllabus import with Meteorology and Climatology topics 21 onward in another controlled batch, then proceed through Informatics and Communications and General/Common before treating all topic blocks as official-ready
```

with:

```md
- Continue the BOE Annex I syllabus import with Meteorology and Climatology topics 31 onward in another controlled batch, then proceed through Informatics and Communications and General/Common before treating all topic blocks as official-ready
```

Edit `docs/DATA_MODEL.md` by replacing:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics and Physics blocks, Meteorology and Climatology topics 1 through 20, and one verified starter topic in Informatics and Communications and General/Common.
```

with:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics and Physics blocks, Meteorology and Climatology topics 1 through 30, and one verified starter topic in Informatics and Communications and General/Common.
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
git commit -m "docs(import): record meteo syllabus batch 21-30"
```

## Self-Review

- Spec coverage: the plan covers only the approved scope: Meteorology and Climatology topics 21 through 30, updated loader assertions, and status docs.
- Placeholder scan: no unresolved placeholders or vague “handle later” instructions remain.
- Type consistency: all file paths, function names, and test targets match the current repo structure and the existing official import flow.
