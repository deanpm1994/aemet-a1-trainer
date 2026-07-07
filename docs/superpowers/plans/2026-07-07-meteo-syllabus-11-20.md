# Meteorology and Climatology Syllabus 11-20 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the verified BOE Meteorology and Climatology block through topics 11 through 20 while keeping the same source-owned subset loader and `/topics` preference path.

**Architecture:** Reuse the existing `BOE-A-2026-1292` manifest, checked-in subset source, and official-content import parser. Extend the subset data with Meteorology and Climatology topics 11 through 20, then tighten tests and docs so Mathematics and Physics remain complete while Meteorology and Climatology is explicitly partial through topic 20.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Markdown docs, existing official-content import helpers.

---

## File Structure

- Modify `apps/web/lib/official-syllabus-subset.ts`: extend the checked-in BOE subset with Meteorology and Climatology topics 11 through 20.
- Modify `apps/web/lib/official-syllabus-subset.test.ts`: add TDD coverage for the Meteorology and Climatology 1-20 sequence and new total subset count.
- Modify `apps/web/lib/notion-topics.test.ts`: update the subset-preference assertion to the larger total and Meteorology and Climatology range.
- Modify `docs/PROJECT_MEMORY.md`: record that Meteorology and Climatology is now imported through topic 20 and point the next syllabus step to another Meteorology and Climatology batch.
- Modify `docs/DATA_MODEL.md`: update the checked-in subset description so it states Mathematics and Physics are complete and Meteorology and Climatology is imported through topic 20.

## Task 1: Extend the Verified Meteorology and Climatology Block

**Files:**
- Modify: `apps/web/lib/official-syllabus-subset.ts`
- Modify: `apps/web/lib/official-syllabus-subset.test.ts`

- [ ] **Step 1: Write the failing tests for the Meteorology and Climatology 1-20 import**

Replace `apps/web/lib/official-syllabus-subset.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Meteorology and Climatology topics 1 through 20", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(58);

    const meteoTopics = result.topics.filter(
      (topic) => topic.block === "Meteorology and Climatology",
    );

    expect(meteoTopics).toHaveLength(20);
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
    ]);
    expect(meteoTopics[19]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(meteoTopics[19]?.retrievedAt).toBe("2026-07-06");
    expect(meteoTopics[19]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const finalMeteoTopic = officialSyllabusSubsetSource.find(
      (topic) =>
        topic.block === "Meteorology and Climatology" &&
        topic.officialNumber === "20",
    );

    expect(finalMeteoTopic).toBeDefined();
    expect(finalMeteoTopic?.officialTitle).not.toBe(finalMeteoTopic?.normalizedTitle);
    expect(finalMeteoTopic?.officialTitle).toContain(".");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: FAIL because the current subset contains 48 topics and Meteorology and Climatology only runs through topic 10.

- [ ] **Step 3: Extend the checked-in BOE subset with Meteorology and Climatology topics 11 through 20**

Update `apps/web/lib/official-syllabus-subset.ts` by inserting these records after Meteorology and Climatology topic `10` and before the Informatics and Communications topic:

```ts
  {
    block: "Meteorology and Climatology",
    officialNumber: "11",
    officialTitle:
      "Meteoros. Clasificación. Litometeoros, hidrometeoros y fotometeoros. Observación meteorológica de fenómenos meteorológicos.",
    normalizedTitle:
      "Meteoros Clasificacion Litometeoros hidrometeoros y fotometeoros Observacion meteorologica de fenomenos meteorologicos",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "12",
    officialTitle:
      "La ecuación de movimiento atmosférico. Principales fuerzas. Sistemas de referencia absolutos y relativos. Aproximaciones características. Escalas de movimiento. Equilibrio geostrófico, gradiente y ciclostrófico.",
    normalizedTitle:
      "La ecuacion de movimiento atmosferico Principales fuerzas Sistemas de referencia absolutos y relativos Aproximaciones caracteristicas Escalas de movimiento Equilibrio geostrofico gradiente y ciclostrofico",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "13",
    officialTitle:
      "Turbulencia en la atmósfera. Capa límite atmosférica. Intercambios turbulentos. Longitud de mezcla. Parámetros característicos de la capa límite.",
    normalizedTitle:
      "Turbulencia en la atmosfera Capa limite atmosferica Intercambios turbulentos Longitud de mezcla Parametros caracteristicos de la capa limite",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "14",
    officialTitle:
      "Circulación general de la atmósfera. Células de circulación. Ondas planetarias. Corrientes en chorro. Monzones.",
    normalizedTitle:
      "Circulacion general de la atmosfera Celulas de circulacion Ondas planetarias Corrientes en chorro Monzones",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "15",
    officialTitle:
      "Masas de aire y frentes. Clasificación. Estructura. Formación y evolución. Frentes fríos, cálidos, ocluidos y estacionarios.",
    normalizedTitle:
      "Masas de aire y frentes Clasificacion Estructura Formacion y evolucion Frentes frios calidos ocluidos y estacionarios",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "16",
    officialTitle:
      "Sistemas de presión. Anticiclones y borrascas. Estructura vertical. Evolución. Ciclogénesis y frontogénesis.",
    normalizedTitle:
      "Sistemas de presion Anticiclones y borrascas Estructura vertical Evolucion Ciclogenesis y frontogenesis",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "17",
    officialTitle:
      "Convección atmosférica. Tormentas. Células convectivas. Mesoescala. Sistemas convectivos de mesoescala.",
    normalizedTitle:
      "Conveccion atmosferica Tormentas Celulas convectivas Mesoescala Sistemas convectivos de mesoescala",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "18",
    officialTitle:
      "Ciclones tropicales. Génesis, estructura y evolución. Clasificación. Riesgos asociados.",
    normalizedTitle:
      "Ciclones tropicales Genesis estructura y evolucion Clasificacion Riesgos asociados",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "19",
    officialTitle:
      "Ondas de montaña y efecto foehn. Brisas marinas y terrestres. Circulaciones locales. Influencia del relieve en el tiempo.",
    normalizedTitle:
      "Ondas de montana y efecto foehn Brisas marinas y terrestres Circulaciones locales Influencia del relieve en el tiempo",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "20",
    officialTitle:
      "Interacción atmósfera-océano. Intercambios de calor, humedad y momento. Oscilación del Sur-El Niño. Variabilidad acoplada.",
    normalizedTitle:
      "Interaccion atmosfera oceano Intercambios de calor humedad y momento Oscilacion del Sur El Nino Variabilidad acoplada",
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
git commit -m "feat(import): add meteo syllabus batch 11-20"
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
    expect(result.topics).toHaveLength(58);
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
    ]);
  });
```

- [ ] **Step 2: Run the loader test to verify it fails**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: FAIL because the imported subset count is still 48 and Meteorology and Climatology only runs through topic 10.

- [ ] **Step 3: Update docs to state Meteorology and Climatology is imported through topic 20**

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics and Physics blocks plus Meteorology and Climatology topics 1 through 10, with one verified starter topic in Informatics and Communications and General/Common; this remains a partial subset, not a full verified syllabus
```

with:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full Mathematics and Physics blocks plus Meteorology and Climatology topics 1 through 20, with one verified starter topic in Informatics and Communications and General/Common; this remains a partial subset, not a full verified syllabus
```

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Continue the BOE Annex I syllabus import with Meteorology and Climatology topics 11 onward in another controlled batch, then proceed through Informatics and Communications and General/Common before treating all topic blocks as official-ready
```

with:

```md
- Continue the BOE Annex I syllabus import with Meteorology and Climatology topics 21 onward in another controlled batch, then proceed through Informatics and Communications and General/Common before treating all topic blocks as official-ready
```

Edit `docs/DATA_MODEL.md` by replacing:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics and Physics blocks, Meteorology and Climatology topics 1 through 10, and one verified starter topic in Informatics and Communications and General/Common.
```

with:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes the full Mathematics and Physics blocks, Meteorology and Climatology topics 1 through 20, and one verified starter topic in Informatics and Communications and General/Common.
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
git commit -m "docs(import): record meteo syllabus batch 11-20"
```

## Self-Review

- Spec coverage: the plan covers only the approved scope: Meteorology and Climatology topics 11 through 20, updated loader assertions, and status docs.
- Placeholder scan: no unresolved placeholders or vague “handle later” instructions remain.
- Type consistency: all file paths, function names, and test targets match the current repo structure and the existing official import flow.
