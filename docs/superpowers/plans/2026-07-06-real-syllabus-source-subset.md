# Real Syllabus Source Subset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first real verified BOE syllabus source manifest, import a small Annex I subset into source-owned topic records, and make `/topics` prefer that verified subset when available.

**Architecture:** Add one checked-in source manifest plus one checked-in raw syllabus subset file, then extend the official import layer with a small loader for the subset. Update the topics source loader to prefer imported verified subset records before the current Notion/mock path, while preserving explicit fallback behavior.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, existing topic loader and official import helpers, Markdown docs.

---

## File Structure

- Create `docs/official-sources/boe-a-2026-1292.md`: provenance manifest for the authoritative BOE convocatoria source.
- Create `apps/web/lib/official-syllabus-subset.ts`: checked-in raw subset data plus a helper that imports it through the official-content parser.
- Modify `apps/web/lib/official-content-import.ts`: export any minimal types/helpers needed by the new subset loader and keep validation local.
- Create `apps/web/lib/official-syllabus-subset.test.ts`: TDD coverage for exact wording preservation and subset import behavior.
- Modify `apps/web/lib/notion-topics.ts`: prefer imported verified subset topics before Notion/mock fallback and keep source-state messaging explicit.
- Modify `apps/web/lib/notion-topics.test.ts`: cover the new preference path and fallback behavior.
- Modify `docs/PROJECT_MEMORY.md`: record the first real verified BOE syllabus subset import and its partial scope.
- Modify `docs/DATA_MODEL.md` only if the new checked-in subset source path needs explicit mention.

## Task 1: Source Manifest and Raw BOE Subset

**Files:**
- Create: `docs/official-sources/boe-a-2026-1292.md`
- Create: `apps/web/lib/official-syllabus-subset.ts`
- Test: `apps/web/lib/official-syllabus-subset.test.ts`

- [ ] **Step 1: Write the failing test for the verified subset import**

Create `apps/web/lib/official-syllabus-subset.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  loadOfficialSyllabusSubset,
  officialSyllabusSubsetSource,
} from "./official-syllabus-subset";

describe("official syllabus subset", () => {
  it("loads a verified BOE subset with exact official wording preserved", () => {
    const result = loadOfficialSyllabusSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected verified syllabus subset");
    }

    expect(result.topics).toHaveLength(5);
    expect(result.topics[0]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(result.topics[0]?.retrievedAt).toBe("2026-07-06");
    expect(result.topics[0]?.verificationStatus).toBe("verified");
  });

  it("keeps the raw source wording separate from the normalized display title", () => {
    const topic = officialSyllabusSubsetSource[0];

    expect(topic.officialTitle).not.toBe(topic.normalizedTitle);
    expect(topic.officialTitle).toContain(".");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: FAIL because `./official-syllabus-subset` does not exist.

- [ ] **Step 3: Write the manifest**

Create `docs/official-sources/boe-a-2026-1292.md`:

```md
# BOE-A-2026-1292

- source_owner: BOE
- source_id: BOE-A-2026-1292
- source_url: https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292
- pdf_url: https://www.boe.es/boe/dias/2026/01/20/pdfs/BOE-A-2026-1292.pdf
- retrieved_at: 2026-07-06
- document_type: convocatoria
- document_description: Resolución de 30 de diciembre de 2025 por la que se convoca proceso selectivo para ingreso en el Cuerpo Superior de Meteorólogos del Estado
- authoritative_scope: El programa del proceso selectivo figura en el anexo I
- verification_decision: verified_for_partial_syllabus_subset
- unresolved_questions: Ninguna para el subconjunto transcrito en esta rama
- import_notes: Esta rama importa solo un subconjunto pequeño y verificado del anexo I, no el temario completo
```

- [ ] **Step 4: Write the minimal checked-in subset source and loader**

Create `apps/web/lib/official-syllabus-subset.ts`:

```ts
import {
  mapImportedSyllabusTopicToTopic,
  parseOfficialSyllabusTopicRecord,
} from "./official-content-import";

type LoadedOfficialSyllabusSubset =
  | { ok: true; topics: ReturnType<typeof mapImportedSyllabusTopicToTopic>[] }
  | {
      ok: false;
      issues: Array<{ index: number; field: string; message: string }>;
    };

export const officialSyllabusSubsetSource = [
  {
    block: "Mathematics",
    officialNumber: "1",
    officialTitle: "Espacios vectoriales. Bases y dimensión. Aplicaciones lineales.",
    normalizedTitle: "Espacios vectoriales Bases y dimension Aplicaciones lineales",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Physics",
    officialNumber: "1",
    officialTitle: "Ley de la gravitación universal. Teoría del campo gravitatorio.",
    normalizedTitle: "Ley de la gravitacion universal Teoria del campo gravitatorio",
    sourceName: "BOE",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified" as const,
  },
  {
    block: "Meteorology and Climatology",
    officialNumber: "1",
    officialTitle: "Composición y estructura de la atmósfera. Variación de la temperatura con la altura.",
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
    officialTitle: "Concepto de informática. Arquitectura de ordenadores. Procesador. Memoria. Periféricos.",
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
      "La Constitución española de 1978: estructura y contenido. Derechos y deberes fundamentales.",
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

- [ ] **Step 5: Run test to verify it passes**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: PASS for `apps/web/lib/official-syllabus-subset.test.ts`.

- [ ] **Step 6: Commit**

```bash
git add docs/official-sources/boe-a-2026-1292.md apps/web/lib/official-syllabus-subset.ts apps/web/lib/official-syllabus-subset.test.ts
git commit -m "feat(import): add verified boe syllabus subset"
```

## Task 2: Topics Loader Preference

**Files:**
- Modify: `apps/web/lib/notion-topics.ts`
- Modify: `apps/web/lib/notion-topics.test.ts`

- [ ] **Step 1: Write the failing test for imported subset preference**

Add to `apps/web/lib/notion-topics.test.ts`:

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
  expect(result.topics).toHaveLength(5);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: FAIL because the loader currently falls back to mock topics, not the imported subset.

- [ ] **Step 3: Write the minimal loader preference change**

In `apps/web/lib/notion-topics.ts`, add:

```ts
import { loadOfficialSyllabusSubset } from "./official-syllabus-subset";
```

Near the start of `loadTopicsSource`, before Notion config handling:

```ts
  const importedSubset = loadOfficialSyllabusSubset();

  if (importedSubset.ok && importedSubset.topics.length > 0) {
    return {
      topics: importedSubset.topics,
      sourceState: "fallback_config",
      message:
        "Temario verificado parcial cargado desde el subconjunto oficial BOE; la sincronización completa de Notion sigue pendiente.",
    };
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/notion-topics.ts apps/web/lib/notion-topics.test.ts
git commit -m "feat(topics): prefer verified boe subset"
```

## Task 3: Documentation for Partial Verified Import

**Files:**
- Modify: `docs/PROJECT_MEMORY.md`
- Modify: `docs/DATA_MODEL.md`

- [ ] **Step 1: Update project memory**

Add under `Study content readiness`:

```md
- First real verified BOE syllabus subset imported from Annex I of BOE-A-2026-1292; this remains a partial subset, not a full verified syllabus
```

Replace the official-content next step with:

```md
- Continue the BOE Annex I syllabus import in controlled verified batches or complete the full verified syllabus workflow before treating all topic blocks as official-ready
```

- [ ] **Step 2: Update data model if needed**

In `docs/DATA_MODEL.md`, add to `Topic` persistence notes:

```md
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists.
```

- [ ] **Step 3: Verify documentation changes**

Run:

`rg -n "BOE-A-2026-1292|partial subset|official-ready|verified batches" docs`

Expected:
- matches in `docs/official-sources/boe-a-2026-1292.md`
- matches in `docs/PROJECT_MEMORY.md`
- one relevant match in `docs/DATA_MODEL.md`

- [ ] **Step 4: Commit**

```bash
git add docs/PROJECT_MEMORY.md docs/DATA_MODEL.md
git commit -m "docs(import): record partial boe syllabus import"
```

## Task 4: Full Verification

**Files:**
- Verify only

- [ ] **Step 1: Run focused subset tests**

Run: `npm --prefix apps/web test -- official-syllabus-subset`

Expected: PASS.

- [ ] **Step 2: Run topics loader tests**

Run: `npm --prefix apps/web test -- notion-topics`

Expected: PASS.

- [ ] **Step 3: Run full test suite**

Run: `npm --prefix apps/web test`

Expected: all tests pass.

- [ ] **Step 4: Run lint**

Run: `npm --prefix apps/web run lint`

Expected: exit 0.

- [ ] **Step 5: Run build**

Run: `npm --prefix apps/web run build`

Expected: exit 0.

## Self-Review

- Spec coverage: the plan covers the real BOE manifest, checked-in raw subset, import through the official-content layer, `/topics` preference, tests, and explicit partial-subset documentation.
- Placeholder scan: the plan contains no unresolved placeholders; the only deferred work is the intentionally out-of-scope full Annex I import.
- Type consistency: `loadOfficialSyllabusSubset`, `officialSyllabusSubsetSource`, `parseOfficialSyllabusTopicRecord`, and `mapImportedSyllabusTopicToTopic` are named consistently across tasks.
