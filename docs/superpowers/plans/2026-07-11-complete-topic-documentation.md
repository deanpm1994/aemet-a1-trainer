# Complete Topic Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every verified syllabus topic Spanish, clearly non-official study guidance.

**Architecture:** Keep BOE data unchanged. Add a topic-id keyed rich-note registry to `topic-study-material.ts`; its existing `getTopicStudyCard(topic)` adapter returns notes for topic detail UI. Tests load official syllabus and assert coverage/labels.

**Tech Stack:** TypeScript, Vitest, Next.js.

## Global Constraints

- Preserve exact BOE wording, source URL, retrieval date, verification status.
- Every card label remains `Material didáctico no oficial`.
- No bibliography, dates, answer keys, monitoring claims, dependencies, route changes.
- Test red before each production-code batch.
- Conventional Commit per block.

---

### Task 1: Physics study notes

**Files:** Modify `apps/web/lib/topic-study-material.test.ts`, `apps/web/lib/topic-study-material.ts`.

**Interfaces:** Input `Topic` ids `physics-1` through `physics-18`; output `TopicStudyCard.richNotes` with three reviewed prompts.

- [ ] Add failing test loading `loadOfficialSyllabusSubset()`, filtering `block === "Physics"`, expecting 18 labelled cards and each `richNotes.length >= 3`.
- [ ] Run `npm --prefix apps/web test -- topic-study-material.test.ts`; expect failure because Physics notes empty.
- [ ] Add `RICH_NOTES_BY_TOPIC_ID: Record<string, string[]>`; add reviewed Spanish entries for `physics-1` … `physics-18`, each covering concept separation, method/practice, and error/case check. Change `getTopicStudyCard` to use `RICH_NOTES_BY_TOPIC_ID[topic.id] ?? []`.
- [ ] Run focused test; expect PASS.
- [ ] Commit: `feat(content): add physics topic study notes`.

### Task 2: Informatics and Communications study notes

**Files:** Modify `apps/web/lib/topic-study-material.test.ts`, `apps/web/lib/topic-study-material.ts`.

**Interfaces:** Input ids `informatics-and-communications-1` through `informatics-and-communications-10`; output three or more notes per card.

- [ ] Add failing test filtering `block === "Informatics and Communications"`; expect 10 labelled cards, all with three rich notes.
- [ ] Run focused test; expect failure because Informatics notes empty.
- [ ] Add reviewed Spanish registry entries through topic 10. Every entry distinguishes system concepts, relationships/interfaces, and a short comparison or application exercise.
- [ ] Run focused test; expect PASS.
- [ ] Commit: `feat(content): add informatics study notes`.

### Task 3: General/Common study notes

**Files:** Modify `apps/web/lib/topic-study-material.test.ts`, `apps/web/lib/topic-study-material.ts`.

**Interfaces:** Input ids `general-common-1` through `general-common-23`; output three or more notes per card.

- [ ] Add failing test filtering `block === "General/Common"`; expect 23 labelled cards, all with three rich notes.
- [ ] Run focused test; expect failure because General/Common notes empty.
- [ ] Add reviewed Spanish registry entries through topic 23. Every entry identifies competent institution/norm, temporal process/guarantees, and precise short-answer practice; never treat summaries as official wording.
- [ ] Run focused test; expect PASS.
- [ ] Commit: `feat(content): add general topic study notes`.

### Task 4: Record completion and verify

**Files:** Modify `docs/PROJECT_MEMORY.md`, `docs/ROADMAP.md`, `docs/GITHUB_ISSUES.md`.

**Interfaces:** Consume coverage proof from Tasks 1–3; record 128-card non-official study coverage and issue #12 closure eligibility.

- [ ] Update docs: complete coverage; cards non-official; official history import separate; #4/#5/#8 remain open.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, `npm --prefix apps/web run build`, `git diff --check`; expect exit 0.
- [ ] Commit: `docs(roadmap): record complete topic coverage`.
- [ ] Close #12 only after all checks: `gh issue close 12 --comment "Closed after 128 verified topics gained clearly labelled non-official study cards. Vitest, lint, and production build pass."`

## Plan Self-Review

- Spec coverage: Tasks 1–3 cover all 51 remaining topics; Task 4 verifies/records result.
- No unspecified file paths or commands.
- Types remain `Topic -> getTopicStudyCard -> TopicStudyCard`.
