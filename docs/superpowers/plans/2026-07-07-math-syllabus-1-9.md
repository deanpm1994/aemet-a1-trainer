# Mathematics Syllabus 1-9 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the verified BOE syllabus subset so the app imports Mathematics topics 1 through 9 from BOE Annex I while keeping `/topics` on the same verified-source path.

**Architecture:** Reuse the existing `BOE-A-2026-1292` manifest, official-content parser, and subset loader. Extend the checked-in subset dataset with Mathematics topics 2 through 9, then tighten tests and status docs so the app clearly reflects a larger but still partial verified syllabus import.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Markdown docs, existing official-content import helpers.

---

## File Structure

- Modify `apps/web/lib/official-syllabus-subset.ts`: extend the checked-in verified BOE subset with Mathematics topics 2 through 9.
- Modify `apps/web/lib/official-syllabus-subset.test.ts`: add TDD coverage for the expanded Mathematics batch, ordering, and source metadata.
- Modify `apps/web/lib/notion-topics.test.ts`: update subset-preference assertions to the new record count and verify the Mathematics batch is present in live loader output.
- Modify `docs/PROJECT_MEMORY.md`: record that verified BOE syllabus import now includes Mathematics topics 1 through 9 and set the next recommendation to Mathematics 10 through 18.
- Modify `docs/DATA_MODEL.md`: mention the deeper checked-in Mathematics BOE batch if needed.

## Task 1: Expand the Verified BOE Subset

**Files:**
- Modify: `apps/web/lib/official-syllabus-subset.ts`
- Modify: `apps/web/lib/official-syllabus-subset.test.ts`

- [ ] **Step 1: Write the failing tests for the expanded Mathematics batch**

Replace `apps/web/lib/official-syllabus-subset.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads the verified BOE subset including Mathematics topics 1 through 9", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(13);

    const mathematicsTopics = result.topics.filter(
      (topic) => topic.block === "Mathematics",
    );

    expect(mathematicsTopics).toHaveLength(9);
    expect(mathematicsTopics.map((topic) => topic.officialNumber)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    expect(mathematicsTopics[0]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(mathematicsTopics[0]?.retrievedAt).toBe("2026-07-06");
    expect(mathematicsTopics[0]?.verificationStatus).toBe("verified");
  });

  it("keeps source-owned wording separate from normalized display titles", () => {
    const firstMathTopic = officialSyllabusSubsetSource.find(
      (topic) => topic.block === "Mathematics" && topic.officialNumber === "1",
    );

    expect(firstMathTopic).toBeDefined();
    expect(firstMathTopic?.officialTitle).not.toBe(firstMathTopic?.normalizedTitle);
    expect(firstMathTopic?.officialTitle).toContain(".");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: FAIL because the test expects 13 imported topics and 9 Mathematics records, but the current subset only contains 5 records.

- [ ] **Step 3: Extend the checked-in BOE subset with Mathematics 2 through 9**

Update `apps/web/lib/official-syllabus-subset.ts` by replacing the exported source array with:

```ts
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
    block: "Mathematics",
    officialNumber: "2",
    officialTitle: "Matrices. Determinantes. Rango de una matriz. Matriz inversa.",
    normalizedTitle: "Matrices Determinantes Rango de una matriz Matriz inversa",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "3",
    officialTitle: "Sistemas de ecuaciones lineales. Teorema de Rouché-Fröbenius. Diagonalizacion de matrices.",
    normalizedTitle: "Sistemas de ecuaciones lineales Teorema de Rouche Frobenius Diagonalizacion de matrices",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "4",
    officialTitle: "Funciones de una variable. Continuidad y derivabilidad. Maximos y minimos. Regla de L'Hopital.",
    normalizedTitle: "Funciones de una variable Continuidad y derivabilidad Maximos y minimos Regla de LHopital",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "5",
    officialTitle: "Integral de Riemann. Metodos de integracion. Integrales impropias.",
    normalizedTitle: "Integral de Riemann Metodos de integracion Integrales impropias",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "6",
    officialTitle: "Funciones de varias variables. Derivadas parciales. Extremos condicionados. Integrales multiples.",
    normalizedTitle: "Funciones de varias variables Derivadas parciales Extremos condicionados Integrales multiples",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "7",
    officialTitle: "Ecuaciones diferenciales ordinarias. Ecuaciones lineales. Sistemas de ecuaciones diferenciales.",
    normalizedTitle: "Ecuaciones diferenciales ordinarias Ecuaciones lineales Sistemas de ecuaciones diferenciales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "8",
    officialTitle: "Variable aleatoria discreta y continua. Distribuciones binomial, de Poisson y normal. Distribucion conjunta. Correlacion y regresion.",
    normalizedTitle: "Variable aleatoria discreta y continua Distribuciones binomial de Poisson y normal Distribucion conjunta Correlacion y regresion",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Mathematics",
    officialNumber: "9",
    officialTitle: "Muestreo aleatorio. Estimacion puntual y por intervalos. Contrastes de hipotesis.",
    normalizedTitle: "Muestreo aleatorio Estimacion puntual y por intervalos Contrastes de hipotesis",
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
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: PASS with 2 tests in `apps/web/lib/official-syllabus-subset.test.ts`.

- [ ] **Step 5: Commit the expanded BOE batch**

```bash
git add apps/web/lib/official-syllabus-subset.ts apps/web/lib/official-syllabus-subset.test.ts
git commit -m "feat(import): add math syllabus batch 1-9"
```

## Task 2: Update Loader Assertions and Project Status

**Files:**
- Modify: `apps/web/lib/notion-topics.test.ts`
- Modify: `docs/PROJECT_MEMORY.md`
- Modify: `docs/DATA_MODEL.md`

- [ ] **Step 1: Write the failing assertions for the larger subset in the topics loader**

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
    expect(result.topics).toHaveLength(13);
    expect(
      result.topics.filter((topic) => topic.block === "Mathematics").map((topic) => topic.officialNumber),
    ).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  });
```

- [ ] **Step 2: Run the loader test to verify it fails**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: FAIL because the current imported subset count is still asserted as 5.

- [ ] **Step 3: Update docs for the deeper Mathematics import**

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- First real verified BOE syllabus subset imported from Annex I of BOE-A-2026-1292; this remains a partial subset, not a full verified syllabus
```

with:

```md
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes Mathematics topics 1 through 9 plus one verified starter topic in each remaining block; this remains a partial subset, not a full verified syllabus
```

Edit `docs/PROJECT_MEMORY.md` to replace:

```md
- Continue the BOE Annex I syllabus import in controlled verified batches or complete the full verified syllabus workflow before treating all topic blocks as official-ready
```

with:

```md
- Continue the BOE Annex I syllabus import with Mathematics topics 10 through 18 next, then proceed through the remaining blocks in controlled verified batches before treating all topic blocks as official-ready
```

Edit `docs/DATA_MODEL.md` by replacing:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists.
```

with:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists. The current checked-in subset includes Mathematics topics 1 through 9 plus one verified starter topic in each remaining syllabus block.
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
git commit -m "docs(import): record math syllabus batch 1-9"
```

## Self-Review

- Spec coverage: the plan covers the approved scope only: Mathematics topics 1 through 9, continued loader preference, and partial-import status docs.
- Placeholder scan: no `TODO`, `TBD`, or vague implementation steps are left in this plan.
- Type consistency: all file paths, function names, and test targets match the current repository structure and the existing official import flow.
