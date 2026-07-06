# Official Content Import Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a source-owned import foundation for official content, implement syllabus import and mapping first, and define the parallel contract for past exam questions without importing real source files yet.

**Architecture:** Add one pure import module for typed source records, validation result objects, normalization helpers, and syllabus-to-topic mapping. Keep the import foundation isolated from the current Notion/mock loaders so the app behavior does not change in the same slice. Add a dedicated source-manifest document shell so the next step can record real official document provenance before any verified content import.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, existing app domain types and docs.

---

## File Structure

- Create `apps/web/lib/official-content-import.ts`: source record types, validation result types, normalization helpers, syllabus parser, topic mapper, and question-contract validator.
- Create `apps/web/lib/official-content-import.test.ts`: TDD coverage for syllabus import and question contract validation.
- Modify `docs/PROJECT_MEMORY.md`: record that the import foundation exists and that real source manifests are the next step.
- Modify `docs/DATA_MODEL.md`: document the new source-owned import boundary and source manifest concept.
- Create `docs/official-sources/README.md`: source-manifest policy and required fields for the next real import step.

## Task 1: Import Contracts and Syllabus Parsing

**Files:**
- Create: `apps/web/lib/official-content-import.ts`
- Test: `apps/web/lib/official-content-import.test.ts`

- [ ] **Step 1: Write the failing test for syllabus parsing and mapping**

Create `apps/web/lib/official-content-import.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  mapImportedSyllabusTopicToTopic,
  parseOfficialSyllabusTopicRecord,
  validateOfficialPastExamQuestionRecord,
} from "./official-content-import";

describe("official content import", () => {
  it("preserves exact official syllabus wording and derives normalized title", () => {
    const result = parseOfficialSyllabusTopicRecord({
      block: "Meteorology and Climatology",
      officialNumber: "39",
      officialTitle:
        "Termodinámica de la atmósfera. Ecuaciones termodinámicas. Procesos adiabáticos.",
      sourceName: "BOE",
      sourceUrl: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-00000",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected valid syllabus record");
    }

    expect(result.record.officialTitle).toBe(
      "Termodinámica de la atmósfera. Ecuaciones termodinámicas. Procesos adiabáticos.",
    );
    expect(result.record.normalizedTitle).toBe(
      "Termodinamica de la atmosfera Ecuaciones termodinamicas Procesos adiabaticos",
    );
    expect(result.record.id).toBe("meteorology-and-climatology-39");
  });

  it("returns structured validation issues when required syllabus metadata is missing", () => {
    const result = parseOfficialSyllabusTopicRecord({
      block: "Mathematics",
      officialNumber: "1",
      officialTitle: "Álgebra lineal.",
      sourceName: "BOE",
      sourceUrl: "",
      retrievedAt: "",
      verificationStatus: "verified",
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        { field: "sourceUrl", message: "sourceUrl is required for official imports" },
        { field: "retrievedAt", message: "retrievedAt is required for official imports" },
      ],
    });
  });

  it("maps a validated imported syllabus topic into the app Topic shape", () => {
    const parsed = parseOfficialSyllabusTopicRecord({
      block: "Physics",
      officialNumber: "7",
      officialTitle: "Radiación. Leyes fundamentales.",
      sourceName: "BOE",
      sourceUrl: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-00000",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
    });

    if (!parsed.ok) {
      throw new Error("Expected valid syllabus record");
    }

    expect(mapImportedSyllabusTopicToTopic(parsed.record)).toEqual({
      id: "physics-7",
      block: "Physics",
      officialNumber: "7",
      officialTitle: "Radiación. Leyes fundamentales.",
      normalizedTitle: "Radiacion Leyes fundamentales",
      status: "not_started",
      confidence: 0,
      priority: "medium",
      nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
      verificationStatus: "verified",
      sourceUrl: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-00000",
      retrievedAt: "2026-07-06",
      notesStatus: "source_imported",
    });
  });

  it("validates the past exam question contract without importing questions yet", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1",
      sourceYear: 2024,
      questionNumber: "12",
      statement: "¿Qué magnitud describe la estabilidad atmosférica?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "B",
      answerSourceStatus: "official",
      sourceName: "BOE",
      sourceUrl: "",
      retrievedAt: "2026-07-06",
      verificationStatus: "verified",
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        { field: "sourceUrl", message: "sourceUrl is required for official imports" },
      ],
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix apps/web test -- official-content-import`

Expected: FAIL because `./official-content-import` does not exist.

- [ ] **Step 3: Write the minimal import module**

Create `apps/web/lib/official-content-import.ts`:

```ts
import type {
  AnswerSourceStatus,
  Question,
  Topic,
  VerificationStatus,
} from "./types";

type ImportIssue = {
  field: string;
  message: string;
};

type ValidationResult<T> =
  | { ok: true; record: T }
  | { ok: false; issues: ImportIssue[] };

export type ImportedSyllabusTopicRecord = {
  id: string;
  block: string;
  officialNumber: string;
  officialTitle: string;
  normalizedTitle: string;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: "verified" | "needs_review";
};

export type ImportedPastExamQuestionRecord = {
  id: string;
  sourceExam: string;
  sourceYear: number;
  questionNumber: string;
  statement: string;
  options: string[];
  correctAnswer: string;
  answerSourceStatus: AnswerSourceStatus;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: "verified" | "needs_review";
};

type RawSyllabusTopicRecord = {
  block: string;
  officialNumber: string;
  officialTitle: string;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
};

type RawPastExamQuestionRecord = {
  sourceExam: string;
  sourceYear: number;
  questionNumber: string;
  statement: string;
  options: string[];
  correctAnswer: string;
  answerSourceStatus: AnswerSourceStatus;
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
};

const allowedImportVerificationStatuses = new Set(["verified", "needs_review"]);

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeAsciiTitle(value: string): string {
  return normalizeWhitespace(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateImportVerificationStatus(
  value: VerificationStatus,
): value is ImportedSyllabusTopicRecord["verificationStatus"] {
  return allowedImportVerificationStatuses.has(value);
}

export function parseOfficialSyllabusTopicRecord(
  input: RawSyllabusTopicRecord,
): ValidationResult<ImportedSyllabusTopicRecord> {
  const issues: ImportIssue[] = [];

  if (!normalizeWhitespace(input.sourceUrl)) {
    issues.push({
      field: "sourceUrl",
      message: "sourceUrl is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.retrievedAt)) {
    issues.push({
      field: "retrievedAt",
      message: "retrievedAt is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.officialTitle)) {
    issues.push({
      field: "officialTitle",
      message: "officialTitle is required for official imports",
    });
  }

  if (!validateImportVerificationStatus(input.verificationStatus)) {
    issues.push({
      field: "verificationStatus",
      message: "verificationStatus must be verified or needs_review",
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const normalizedTitle = normalizeAsciiTitle(input.officialTitle);

  return {
    ok: true,
    record: {
      id: toSlug(`${input.block}-${input.officialNumber}`),
      block: normalizeWhitespace(input.block),
      officialNumber: normalizeWhitespace(input.officialNumber),
      officialTitle: normalizeWhitespace(input.officialTitle),
      normalizedTitle,
      sourceName: normalizeWhitespace(input.sourceName),
      sourceUrl: normalizeWhitespace(input.sourceUrl),
      retrievedAt: normalizeWhitespace(input.retrievedAt),
      verificationStatus: input.verificationStatus,
    },
  };
}

export function mapImportedSyllabusTopicToTopic(
  record: ImportedSyllabusTopicRecord,
): Topic {
  return {
    id: record.id,
    block: record.block,
    officialNumber: record.officialNumber,
    officialTitle: record.officialTitle,
    normalizedTitle: record.normalizedTitle,
    status: "not_started",
    confidence: 0,
    priority: "medium",
    nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    verificationStatus: record.verificationStatus,
    sourceUrl: record.sourceUrl,
    retrievedAt: record.retrievedAt,
    notesStatus: "source_imported",
  };
}

export function validateOfficialPastExamQuestionRecord(
  input: RawPastExamQuestionRecord,
): ValidationResult<ImportedPastExamQuestionRecord> {
  const issues: ImportIssue[] = [];

  if (!normalizeWhitespace(input.sourceUrl)) {
    issues.push({
      field: "sourceUrl",
      message: "sourceUrl is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.retrievedAt)) {
    issues.push({
      field: "retrievedAt",
      message: "retrievedAt is required for official imports",
    });
  }

  if (!normalizeWhitespace(input.statement)) {
    issues.push({
      field: "statement",
      message: "statement is required for official imports",
    });
  }

  if (!Array.isArray(input.options) || input.options.length === 0) {
    issues.push({
      field: "options",
      message: "options must contain at least one source option",
    });
  }

  if (!validateImportVerificationStatus(input.verificationStatus)) {
    issues.push({
      field: "verificationStatus",
      message: "verificationStatus must be verified or needs_review",
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    record: {
      id: toSlug(`${input.sourceExam}-${input.sourceYear}-${input.questionNumber}`),
      sourceExam: normalizeWhitespace(input.sourceExam),
      sourceYear: input.sourceYear,
      questionNumber: normalizeWhitespace(input.questionNumber),
      statement: normalizeWhitespace(input.statement),
      options: input.options.map((option) => normalizeWhitespace(option)),
      correctAnswer: normalizeWhitespace(input.correctAnswer),
      answerSourceStatus: input.answerSourceStatus,
      sourceName: normalizeWhitespace(input.sourceName),
      sourceUrl: normalizeWhitespace(input.sourceUrl),
      retrievedAt: normalizeWhitespace(input.retrievedAt),
      verificationStatus: input.verificationStatus,
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix apps/web test -- official-content-import`

Expected: PASS for `apps/web/lib/official-content-import.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/official-content-import.ts apps/web/lib/official-content-import.test.ts
git commit -m "feat(import): add official content foundation"
```

## Task 2: Tighten Question Contract Validation

**Files:**
- Modify: `apps/web/lib/official-content-import.test.ts`
- Modify: `apps/web/lib/official-content-import.ts`

- [ ] **Step 1: Write the failing test for unsupported official answer claims**

Add to `apps/web/lib/official-content-import.test.ts`:

```ts
it("rejects unsupported official answer claims when the answer source is unknown", () => {
  const result = validateOfficialPastExamQuestionRecord({
    sourceExam: "AEMET A1",
    sourceYear: 2024,
    questionNumber: "13",
    statement: "Seleccione la respuesta correcta.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    answerSourceStatus: "unknown",
    sourceName: "Unofficial notes",
    sourceUrl: "https://example.com/notes",
    retrievedAt: "2026-07-06",
    verificationStatus: "verified",
  });

  expect(result).toEqual({
    ok: false,
    issues: [
      {
        field: "answerSourceStatus",
        message:
          "verified official question imports cannot use unknown or user answer sources",
      },
    ],
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix apps/web test -- official-content-import`

Expected: FAIL because current validation allows the unsupported answer-source claim.

- [ ] **Step 3: Add the minimal validation rule**

Update `validateOfficialPastExamQuestionRecord` in `apps/web/lib/official-content-import.ts`:

```ts
  if (
    input.verificationStatus === "verified" &&
    (input.answerSourceStatus === "unknown" || input.answerSourceStatus === "user")
  ) {
    issues.push({
      field: "answerSourceStatus",
      message:
        "verified official question imports cannot use unknown or user answer sources",
    });
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix apps/web test -- official-content-import`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/official-content-import.ts apps/web/lib/official-content-import.test.ts
git commit -m "test(import): tighten question source validation"
```

## Task 3: Document Real Source Manifest Next

**Files:**
- Create: `docs/official-sources/README.md`
- Modify: `docs/DATA_MODEL.md`
- Modify: `docs/PROJECT_MEMORY.md`

- [ ] **Step 1: Write the failing doc-oriented test by defining the expected documentation updates**

No automated doc test is required here. Instead, verify scope with a targeted grep after edits.

- [ ] **Step 2: Write the source-manifest documentation**

Create `docs/official-sources/README.md`:

```md
# Official Source Manifests

This directory stores provenance records for real official documents before they are imported into the app as verified content.

Each source manifest should record:
- official URL
- retrieval date
- source owner
- document type
- document description
- verification decision
- unresolved verification questions
- import notes

No real official content should be promoted to verified app data until a matching manifest exists here.
```

Update `docs/DATA_MODEL.md` by adding after the `Question` entity section:

```md
## Entity: OfficialContentImport

Fields:
- source_name
- source_url
- retrieved_at
- verification_status
- official_text
- normalized_text
- import_notes

Implementation notes:
- This is an app-layer import boundary, not a persisted database table in this slice.
- Imported official content remains source-owned.
- User progress overlays must not overwrite imported source fields.
- Real verified imports require a matching source manifest under `docs/official-sources/`.
```

Update `docs/PROJECT_MEMORY.md`:

```md
Study content readiness:
- Official content import foundation exists for syllabus-first ingestion and question-contract validation
```

and under `Next recommended MVP steps` replace the current official-content note with:

```md
- Create the first real official source manifest with BOE/AEMET URL, retrieval date, document description, verification decision, and import provenance before importing verified syllabus records
```

- [ ] **Step 3: Verify the documentation changes**

Run:

`rg -n "Official Source Manifests|OfficialContentImport|source manifest|official content import foundation" docs`

Expected:
- one match in `docs/official-sources/README.md`
- one match in `docs/DATA_MODEL.md`
- one or more matches in `docs/PROJECT_MEMORY.md`

- [ ] **Step 4: Commit**

```bash
git add docs/official-sources/README.md docs/DATA_MODEL.md docs/PROJECT_MEMORY.md
git commit -m "docs(import): record source manifest workflow"
```

## Task 4: Full Verification

**Files:**
- Verify only

- [ ] **Step 1: Run focused tests**

Run: `npm --prefix apps/web test -- official-content-import`

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run: `npm --prefix apps/web test`

Expected: all tests pass.

- [ ] **Step 3: Run lint**

Run: `npm --prefix apps/web run lint`

Expected: exit 0.

- [ ] **Step 4: Run build**

Run: `npm --prefix apps/web run build`

Expected: exit 0.

## Self-Review

- Spec coverage: the plan covers typed source records for syllabus and questions, structured validation results, exact wording preservation, syllabus-to-topic mapping, question-contract validation, and explicit real source-manifest documentation.
- Placeholder scan: no `TBD`, deferred code placeholders, or unspecified files remain. The only deferred item is the intentionally out-of-scope real source import, which the spec requires.
- Type consistency: `ImportedSyllabusTopicRecord`, `ImportedPastExamQuestionRecord`, `parseOfficialSyllabusTopicRecord`, `mapImportedSyllabusTopicToTopic`, and `validateOfficialPastExamQuestionRecord` are named consistently across tasks.
