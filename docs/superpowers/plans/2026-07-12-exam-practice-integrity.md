# Exam Practice Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task.

**Goal:** Serve only verified historic exam questions as practice.

### Task 1: Remove generated practice source

- [ ] Red test: default question source contains verified historic records only; no `didactic-` id or unverified generated question.
- [ ] Remove `buildDidacticQuestions` merge from `notion-questions.ts`; retain official subset fallback.
- [ ] Run focused tests; commit `fix(questions): remove generated practice prompts`.

### Task 2: Preserve truthful quiz UI

- [ ] Red test: topic quiz selection has no question when no verified topic mapping exists.
- [ ] Replace topic quiz launch UI with no-verified-question message; remove random quiz paths that include generated material.
- [ ] Run full tests/lint/build; docs; commit `fix(quiz): require verified exam questions`.
