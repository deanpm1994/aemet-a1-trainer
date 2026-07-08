# Past Exam Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import the first official AEMET A1 past-exam question subset with source metadata and strict answer-key verification rules.

**Architecture:** The work is source-gated: no question wording is added until an official AEMET or Spanish government exam source is documented. After source acquisition, extend the import contract, add a checked-in official subset loader parallel to the syllabus subset, and make the question loader prefer the valid official subset before mock fallback when Notion is not configured or fails.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Markdown source manifests, existing Notion/fallback question loader.

---

## File Structure

- Create `docs/official-sources/<official-source-id>.md`: first official past-exam source manifest.
- Modify `apps/web/lib/types.ts`: add optional answer-source provenance fields to `Question`.
- Modify `apps/web/lib/official-content-import.ts`: extend imported past-exam records, validate answer-source metadata, and map imported records into `Question`.
- Modify `apps/web/lib/official-content-import.test.ts`: TDD coverage for answered and unanswered official questions.
- Create `apps/web/lib/official-past-exam-subset.ts`: checked-in first official question subset.
- Create `apps/web/lib/official-past-exam-subset.test.ts`: TDD coverage for subset loading and metadata preservation.
- Modify `apps/web/lib/notion-questions.ts`: prefer official subset fallback before mock fallback when Notion is unavailable or errors.
- Modify `apps/web/lib/notion-questions.test.ts`: loader preference and invalid-subset fallback tests.
- Modify `docs/DATA_MODEL.md`: document answer-source provenance and official question import path.
- Modify `docs/PROJECT_MEMORY.md`: record question-bank import status and remaining limitations.

## Task 1: Acquire and Document the First Official Exam Source

**Files:**
- Create: `docs/official-sources/<official-source-id>.md`

- [ ] **Step 1: Search only official source locations**

Use web search or a browser against official domains only. Search terms must include the exam body and source type.

Required search set:

```text
site:aemet.es "Cuerpo Superior de Meteorólogos" "primer ejercicio"
site:aemet.es "Cuerpo Superior de Meteorólogos" "plantilla"
site:aemet.es "Cuerpo Superior de Meteorólogos del Estado" "cuestionario"
site:miteco.gob.es "Cuerpo Superior de Meteorólogos" "examen"
site:administracion.gob.es "Cuerpo Superior de Meteorólogos" "examen"
```

Accept a source only if it is an official AEMET, MITECO, BOE, INAP, or Spanish government URL and directly provides past-exam question wording or an official answer template.

- [ ] **Step 2: Record the source decision**

If no official source with question wording is found, stop implementation and report:

```text
Blocked: no official AEMET/Spanish government past-exam question PDF or page found.
Needed input: official exam PDF/page URL, or local official PDF files to import.
```

If an official source is found, create a manifest at `docs/official-sources/<official-source-id>.md` using a source id derived from the official document, for example `aemet-a1-2024-primer-ejercicio`.

Use this structure and fill every value from the official source:

```md
# <official-source-id>

- source_owner: <official owner name>
- source_id: <stable id derived from official source>
- source_url: <official question source URL>
- answer_source_url: <official answer source URL, or NONE when no official answer source is available>
- retrieved_at: 2026-07-09
- document_type: past_exam
- exam_year: <year shown by the official source>
- exam_phase: <phase or exercise shown by the official source>
- document_description: <short description of the official document>
- authoritative_scope: Official past-exam question wording for the imported subset; answer key scope only when answer_source_url is not NONE
- verification_decision: verified_for_partial_question_subset
- unresolved_questions: Ninguna for the imported subset, or a short note explaining the missing official answer key
- import_notes: This manifest supports a small checked-in question subset, not a full historical exam archive
```

- [ ] **Step 3: Commit the manifest**

Run:

```bash
git add docs/official-sources
git commit -m "docs(import): record past exam source"
```

## Task 2: Extend the Past-Exam Import Contract

**Files:**
- Modify: `apps/web/lib/types.ts`
- Modify: `apps/web/lib/official-content-import.ts`
- Modify: `apps/web/lib/official-content-import.test.ts`

- [ ] **Step 1: Write failing tests for official and unanswered past-exam records**

Add this import in `apps/web/lib/official-content-import.test.ts`:

```ts
import type { Question } from "./types";
```

Extend the existing import from `./official-content-import` to include `mapImportedPastExamQuestionToQuestion`:

```ts
import {
  mapImportedPastExamQuestionToQuestion,
  mapImportedSyllabusTopicToTopic,
  parseOfficialSyllabusTopicRecord,
  validateOfficialPastExamQuestionRecord,
} from "./official-content-import";
```

Append these tests inside `describe("official content import", () => { ... })`:

```ts
  it("maps a verified official past-exam question with official answer provenance", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceYear: 2024,
      questionNumber: "1",
      statement: "Seleccione la respuesta correcta.",
      options: ["A. Opcion A", "B. Opcion B", "C. Opcion C", "D. Opcion D"],
      correctAnswer: "B",
      answerSourceStatus: "official",
      answerSourceUrl: "https://www.aemet.es/documentos/es/empleo/plantilla.pdf",
      answerRetrievedAt: "2026-07-09",
      sourceName: "AEMET",
      sourceUrl: "https://www.aemet.es/documentos/es/empleo/examen.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      topicIds: ["meteorology-and-climatology-1"],
      difficulty: 3,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected valid past-exam question");
    }

    expect(mapImportedPastExamQuestionToQuestion(result.record)).toEqual<Question>({
      id: "aemet-a1-acceso-libre-primer-ejercicio-2024-1",
      name: "AEMET A1 acceso libre primer ejercicio 2024 pregunta 1",
      type: "multiple_choice",
      sourceYear: 2024,
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceUrl: "https://www.aemet.es/documentos/es/empleo/examen.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      questionNumber: "1",
      statement: "Seleccione la respuesta correcta.",
      options: ["A. Opcion A", "B. Opcion B", "C. Opcion C", "D. Opcion D"],
      correctAnswer: "B",
      answerSourceStatus: "official",
      answerSourceUrl: "https://www.aemet.es/documentos/es/empleo/plantilla.pdf",
      answerRetrievedAt: "2026-07-09",
      explanation: "",
      topicIds: ["meteorology-and-climatology-1"],
      difficulty: 3,
      attemptsCount: 0,
      lastAttemptAt: "TODO_VERIFY_OFFICIAL_SOURCE",
      nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
      mistakeTypes: ["none"],
    });
  });

  it("accepts official questions without answer keys only as needs_review", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre segundo ejercicio",
      sourceYear: 2024,
      questionNumber: "2",
      statement: "Desarrolle el supuesto practico propuesto.",
      options: ["Respuesta desarrollada sin opciones cerradas"],
      correctAnswer: "",
      answerSourceStatus: "unknown",
      answerSourceUrl: "",
      answerRetrievedAt: "",
      sourceName: "AEMET",
      sourceUrl: "https://www.aemet.es/documentos/es/empleo/supuesto.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "needs_review",
      topicIds: ["general-common-1"],
      difficulty: 4,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected reviewable unanswered question");
    }

    expect(result.record.correctAnswer).toBe("");
    expect(result.record.answerSourceStatus).toBe("unknown");
    expect(result.record.verificationStatus).toBe("needs_review");
  });

  it("rejects verified question imports without official answer source metadata", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceYear: 2024,
      questionNumber: "3",
      statement: "Seleccione la respuesta correcta.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      answerSourceStatus: "official",
      answerSourceUrl: "",
      answerRetrievedAt: "",
      sourceName: "AEMET",
      sourceUrl: "https://www.aemet.es/documentos/es/empleo/examen.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      topicIds: ["meteorology-and-climatology-2"],
      difficulty: 2,
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          field: "answerSourceUrl",
          message: "answerSourceUrl is required for official answer imports",
        },
        {
          field: "answerRetrievedAt",
          message: "answerRetrievedAt is required for official answer imports",
        },
      ],
    });
  });

  it("rejects inferred answers for verified official imports", () => {
    const result = validateOfficialPastExamQuestionRecord({
      sourceExam: "AEMET A1 acceso libre primer ejercicio",
      sourceYear: 2024,
      questionNumber: "4",
      statement: "Seleccione la respuesta correcta.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      answerSourceStatus: "inferred",
      answerSourceUrl: "",
      answerRetrievedAt: "",
      sourceName: "AEMET",
      sourceUrl: "https://www.aemet.es/documentos/es/empleo/examen.pdf",
      retrievedAt: "2026-07-09",
      verificationStatus: "verified",
      topicIds: ["meteorology-and-climatology-3"],
      difficulty: 2,
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          field: "answerSourceStatus",
          message:
            "verified official question imports require official answer sources",
        },
      ],
    });
  });
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- official-content-import
```

Expected: FAIL because `mapImportedPastExamQuestionToQuestion`, `answerSourceUrl`, `answerRetrievedAt`, `topicIds`, and `difficulty` are not yet supported by the import contract.

- [ ] **Step 3: Extend the `Question` type**

In `apps/web/lib/types.ts`, add these optional fields to `Question` immediately after `answerSourceStatus`:

```ts
  answerSourceUrl?: string;
  answerRetrievedAt?: string;
```

- [ ] **Step 4: Extend the official import types**

In `apps/web/lib/official-content-import.ts`, change the import line to:

```ts
import type {
  AnswerSourceStatus,
  Question,
  Topic,
  VerificationStatus,
} from "./types";
```

Add these fields to `ImportedPastExamQuestionRecord` after `answerSourceStatus`:

```ts
  answerSourceUrl: string;
  answerRetrievedAt: string;
  topicIds: string[];
  difficulty: Question["difficulty"];
```

Add the same fields to `RawPastExamQuestionRecord` after `answerSourceStatus`:

```ts
  answerSourceUrl: string;
  answerRetrievedAt: string;
  topicIds: string[];
  difficulty: Question["difficulty"];
```

Add this helper after `getImportVerificationStatus`:

```ts
function isSupportedDifficulty(value: number): value is Question["difficulty"] {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}
```

- [ ] **Step 5: Tighten past-exam validation**

In `validateOfficialPastExamQuestionRecord`, after the existing `verificationStatus` issue block, replace the current verified-answer-source check with:

```ts
  if (
    verificationStatus === "verified" &&
    input.answerSourceStatus !== "official"
  ) {
    issues.push({
      field: "answerSourceStatus",
      message:
        "verified official question imports require official answer sources",
    });
  }

  if (verificationStatus === "verified" && !normalizeWhitespace(input.correctAnswer)) {
    issues.push({
      field: "correctAnswer",
      message: "correctAnswer is required for verified official question imports",
    });
  }

  if (
    verificationStatus === "verified" &&
    !normalizeWhitespace(input.answerSourceUrl)
  ) {
    issues.push({
      field: "answerSourceUrl",
      message: "answerSourceUrl is required for official answer imports",
    });
  }

  if (
    verificationStatus === "verified" &&
    !normalizeWhitespace(input.answerRetrievedAt)
  ) {
    issues.push({
      field: "answerRetrievedAt",
      message: "answerRetrievedAt is required for official answer imports",
    });
  }

  if (
    verificationStatus === "needs_review" &&
    input.answerSourceStatus === "official"
  ) {
    issues.push({
      field: "answerSourceStatus",
      message: "official answer sources require verified question imports",
    });
  }

  if (!Array.isArray(input.topicIds)) {
    issues.push({
      field: "topicIds",
      message: "topicIds must be an array",
    });
  }

  if (!isSupportedDifficulty(input.difficulty)) {
    issues.push({
      field: "difficulty",
      message: "difficulty must be an integer from 1 to 5",
    });
  }
```

Then add these fields to the returned `record` object after `answerSourceStatus`:

```ts
      answerSourceUrl: normalizeWhitespace(input.answerSourceUrl),
      answerRetrievedAt: normalizeWhitespace(input.answerRetrievedAt),
      topicIds: input.topicIds.map((topicId) => normalizeWhitespace(topicId)),
      difficulty: input.difficulty,
```

- [ ] **Step 6: Add the mapper**

Add this function after `validateOfficialPastExamQuestionRecord`:

```ts
export function mapImportedPastExamQuestionToQuestion(
  record: ImportedPastExamQuestionRecord,
): Question {
  return {
    id: record.id,
    name: `${record.sourceExam} ${record.sourceYear} pregunta ${record.questionNumber}`,
    type: "multiple_choice",
    sourceYear: record.sourceYear,
    sourceExam: record.sourceExam,
    sourceUrl: record.sourceUrl,
    retrievedAt: record.retrievedAt,
    verificationStatus: record.verificationStatus,
    questionNumber: record.questionNumber,
    statement: record.statement,
    options: record.options,
    correctAnswer: record.correctAnswer,
    answerSourceStatus: record.answerSourceStatus,
    answerSourceUrl: record.answerSourceUrl || undefined,
    answerRetrievedAt: record.answerRetrievedAt || undefined,
    explanation: "",
    topicIds: record.topicIds,
    difficulty: record.difficulty,
    attemptsCount: 0,
    lastAttemptAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    mistakeTypes: ["none"],
  };
}
```

- [ ] **Step 7: Run the focused test to verify it passes**

Run:

```bash
npm --prefix apps/web test -- official-content-import
```

Expected: PASS.

- [ ] **Step 8: Commit the import contract**

Run:

```bash
git add apps/web/lib/types.ts apps/web/lib/official-content-import.ts apps/web/lib/official-content-import.test.ts
git commit -m "feat(import): add past exam contract"
```

## Task 3: Add the Official Past-Exam Subset Loader

**Files:**
- Create: `apps/web/lib/official-past-exam-subset.ts`
- Create: `apps/web/lib/official-past-exam-subset.test.ts`
- Modify: `apps/web/lib/notion-questions.ts`
- Modify: `apps/web/lib/notion-questions.test.ts`

- [ ] **Step 1: Transcribe the first source-backed records**

From the manifest created in Task 1, manually transcribe 5 to 10 official questions into a draft table outside the code editor first.

For each record capture:

```text
sourceExam
sourceYear
questionNumber
statement
option A
option B
option C
option D
correctAnswer
answerSourceStatus
answerSourceUrl
answerRetrievedAt
sourceName
sourceUrl
retrievedAt
verificationStatus
topicIds
difficulty
```

Rules:
- Copy statement and options exactly from the official source.
- Use `verificationStatus: "verified"` only when both question wording and answer key are official.
- Use `verificationStatus: "needs_review"` and `answerSourceStatus: "unknown"` when the official question has no official answer key.
- Use existing topic IDs from the completed syllabus import.

- [ ] **Step 2: Write the failing subset loader test**

Create `apps/web/lib/official-past-exam-subset.test.ts` using real values from the Task 1 manifest and Task 3 Step 1 transcription:

```ts
import { describe, expect, it } from "vitest";

import {
  loadOfficialPastExamSubset,
  officialPastExamSubsetSource,
} from "./official-past-exam-subset";

describe("official past exam subset", () => {
  it("loads checked-in official past exam questions with source metadata", () => {
    const result = loadOfficialPastExamSubset();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected official past exam subset to load");
    }

    expect(result.questions.length).toBeGreaterThanOrEqual(5);
    expect(result.questions.length).toBeLessThanOrEqual(10);
    expect(result.questions.every((question) => question.sourceUrl.length > 0)).toBe(true);
    expect(result.questions.every((question) => question.retrievedAt === "2026-07-09")).toBe(true);
    expect(
      result.questions.every((question) =>
        question.answerSourceStatus === "official"
          ? question.verificationStatus === "verified" &&
            question.answerSourceUrl &&
            question.answerRetrievedAt
          : question.verificationStatus === "needs_review",
      ),
    ).toBe(true);
  });

  it("preserves source-owned statement text separately from derived names", () => {
    const firstQuestion = officialPastExamSubsetSource[0];

    expect(firstQuestion).toBeDefined();
    expect(firstQuestion?.statement).not.toBe(firstQuestion?.sourceExam);
    expect(firstQuestion?.statement.length).toBeGreaterThan(20);
  });
});
```

- [ ] **Step 3: Run the focused test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- official-past-exam-subset
```

Expected: FAIL because `official-past-exam-subset.ts` does not exist.

- [ ] **Step 4: Create the subset loader with real records**

Create `apps/web/lib/official-past-exam-subset.ts`:

```ts
import {
  mapImportedPastExamQuestionToQuestion,
  validateOfficialPastExamQuestionRecord,
} from "./official-content-import";
import type { Question } from "./types";

type LoadedOfficialPastExamSubset =
  | { ok: true; questions: Question[] }
  | {
      ok: false;
      issues: Array<{ index: number; field: string; message: string }>;
    };

export const officialPastExamSubsetSource = [
  // Insert the real records transcribed in Task 3 Step 1.
];

export function loadOfficialPastExamSubset(): LoadedOfficialPastExamSubset {
  const issues: Array<{ index: number; field: string; message: string }> = [];
  const questions = officialPastExamSubsetSource.flatMap((record, index) => {
    const parsed = validateOfficialPastExamQuestionRecord(record);

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

    return [mapImportedPastExamQuestionToQuestion(parsed.record)];
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, questions };
}
```

Replace the comment in `officialPastExamSubsetSource` with the real transcribed record objects before running tests. Do not commit an empty subset.

- [ ] **Step 5: Run the subset test to verify it passes**

Run:

```bash
npm --prefix apps/web test -- official-past-exam-subset
```

Expected: PASS.

- [ ] **Step 6: Write failing question-loader preference tests**

In `apps/web/lib/notion-questions.test.ts`, add this test inside `describe("loadQuestionsSource", () => { ... })` after the fallback config test:

```ts
  it("prefers imported official past exam questions before mock fallback questions", async () => {
    const result = await loadQuestionsSource({
      env: {},
      fallbackQuestions: [],
      officialSubsetLoader: () => ({
        ok: true,
        questions: [
          {
            id: "official-question-1",
            name: "Official question 1",
            type: "multiple_choice",
            sourceYear: 2024,
            sourceExam: "AEMET A1 acceso libre primer ejercicio",
            sourceUrl: "https://www.aemet.es/documentos/es/empleo/examen.pdf",
            retrievedAt: "2026-07-09",
            verificationStatus: "verified",
            questionNumber: "1",
            statement: "Seleccione la respuesta correcta.",
            options: ["A", "B", "C", "D"],
            correctAnswer: "B",
            answerSourceStatus: "official",
            answerSourceUrl: "https://www.aemet.es/documentos/es/empleo/plantilla.pdf",
            answerRetrievedAt: "2026-07-09",
            explanation: "",
            topicIds: ["meteorology-and-climatology-1"],
            difficulty: 3,
            attemptsCount: 0,
            lastAttemptAt: "TODO_VERIFY_OFFICIAL_SOURCE",
            nextReviewAt: "TODO_VERIFY_OFFICIAL_SOURCE",
            mistakeTypes: ["none"],
          },
        ],
      }),
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.questions).toHaveLength(1);
    expect(result.questions[0]?.id).toBe("official-question-1");
  });

  it("falls back to mock questions when official past exam subset is invalid", async () => {
    const result = await loadQuestionsSource({
      env: {},
      fallbackQuestions,
      officialSubsetLoader: () => ({
        ok: false,
        issues: [{ index: 0, field: "sourceUrl", message: "sourceUrl is required" }],
      }),
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.questions).toEqual(fallbackQuestions);
  });
```

- [ ] **Step 7: Run the loader tests to verify they fail**

Run:

```bash
npm --prefix apps/web test -- notion-questions
```

Expected: FAIL because `officialSubsetLoader` is not yet a supported option.

- [ ] **Step 8: Wire the official subset into the question loader**

In `apps/web/lib/notion-questions.ts`, add:

```ts
import { loadOfficialPastExamSubset } from "./official-past-exam-subset";
```

Update `LoadQuestionsSourceOptions`:

```ts
  officialSubsetLoader?: typeof loadOfficialPastExamSubset;
```

Add this helper near `loadQuestionsSource`:

```ts
function getPreferredFallbackQuestions(
  fallbackQuestions: Question[],
  officialSubsetLoader: typeof loadOfficialPastExamSubset,
): Question[] {
  const officialSubset = officialSubsetLoader();

  if (officialSubset.ok) {
    return officialSubset.questions;
  }

  return fallbackQuestions;
}
```

At the start of `loadQuestionsSource`, after `fallbackQuestions` and `env`, add:

```ts
  const officialSubsetLoader = options.officialSubsetLoader ?? loadOfficialPastExamSubset;
  const preferredFallbackQuestions = getPreferredFallbackQuestions(
    fallbackQuestions,
    officialSubsetLoader,
  );
```

Replace each returned `questions: fallbackQuestions` with:

```ts
questions: preferredFallbackQuestions
```

- [ ] **Step 9: Run loader tests to verify they pass**

Run:

```bash
npm --prefix apps/web test -- notion-questions official-past-exam-subset
```

Expected: PASS.

- [ ] **Step 10: Commit the subset and loader**

Run:

```bash
git add apps/web/lib/official-past-exam-subset.ts apps/web/lib/official-past-exam-subset.test.ts apps/web/lib/notion-questions.ts apps/web/lib/notion-questions.test.ts
git commit -m "feat(import): add official exam subset"
```

## Task 4: Update Documentation

**Files:**
- Modify: `docs/DATA_MODEL.md`
- Modify: `docs/PROJECT_MEMORY.md`

- [ ] **Step 1: Update the data model docs**

In `docs/DATA_MODEL.md`, under `## Entity: Question`, add these fields:

```md
- answer_source_url
- answer_retrieved_at
```

In the `Question` persistence notes, add:

```md
- Official past-exam questions may be loaded from a checked-in source subset before broader Notion or full-source ingestion exists.
- Official answer claims require official answer-source metadata. Questions without official answer templates remain `needs_review` with `answer_source_status` set to `unknown`.
```

- [ ] **Step 2: Update project memory**

In `docs/PROJECT_MEMORY.md`, under `Study content readiness`, add:

```md
- Past exam import has begun with a small official-source subset. Official answer keys are tracked separately from question wording; questions without official answer templates remain `needs_review`.
```

Under `Next recommended MVP steps`, replace the past-exam import line with:

```md
- Continue official past-exam imports in small source-backed batches, prioritizing exams with official answer templates and importing unanswered official questions as `needs_review`.
```

- [ ] **Step 3: Run source scans**

Run:

```bash
rg -n "Insert the real records|official question source URL|<official|\\[|\\]" docs/superpowers/plans/2026-07-09-past-exam-import.md docs apps/web/lib
```

Expected: no output outside the plan file itself. The plan file may contain instructional placeholders, but implementation files and docs must not.

- [ ] **Step 4: Commit docs**

Run:

```bash
git add docs/DATA_MODEL.md docs/PROJECT_MEMORY.md
git commit -m "docs(import): record past exam import"
```

## Task 5: Final Verification

**Files:**
- No file edits expected.

- [ ] **Step 1: Run focused import tests**

Run:

```bash
npm --prefix apps/web test -- official-content-import official-past-exam-subset notion-questions question-bank
```

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm --prefix apps/web test
```

Expected: PASS.

- [ ] **Step 3: Run lint/typecheck**

Run:

```bash
npm --prefix apps/web run lint
```

Expected: PASS.

- [ ] **Step 4: Run production build**

Run:

```bash
npm --prefix apps/web run build
```

Expected: PASS.

- [ ] **Step 5: Check git status**

Run:

```bash
git status --short
```

Expected: clean working tree after all commits.
