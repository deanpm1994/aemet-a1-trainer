# Exam Practice Integrity Design

## Goal

Stop presenting syllabus-recognition prompts as exam practice. Questions and
quizzes must contain only verified historic questions until reviewed exam-style
simulacra exist.

## Changes

- Remove generated per-topic didactic questions from the question source, topic
  quiz entry points, random quizzes, planner selection, and readiness counts.
- Preserve official historic questions, their exact source wording/options,
  official answer provenance, and user attempt/progress overlays.
- Replace topic quiz entry with clear empty state when no verified historic
  question is mapped to that topic: no verified practice question imported yet.
- Keep study cards; they are explicitly non-official study guidance, not exam
  questions.

## Future Content Rule

Exam-style simulacra require manual authorship/review against historic exam
patterns and a visible non-official label. Never generate syllabus-title
recognition questions as practice.

## Verification

- Tests prove generated didactic questions are absent from loaded practice data.
- Tests prove official historic questions still load and quizzes never include
  non-official generated questions.
- Full tests, lint, build; update docs/issue ledger.
