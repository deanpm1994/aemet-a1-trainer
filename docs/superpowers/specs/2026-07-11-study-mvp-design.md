# Study MVP Design

Date: 2026-07-11
Branch: `feat/study-mvp`

## Goal

Provide a usable Spanish-first study MVP for the candidate: complete verified
syllabus visibility, topic-linked practice with feedback, topic documentation,
and a schedule that always proposes the next bounded study session.

## Content policy

- The 128 BOE Annex I topics remain source-owned and `verified`.
- Existing historical exam questions remain official only when their question and
  answer provenance are stored.
- New didactic questions are explicitly `unverified`, use a distinct source
  label, and never claim to be official past-exam questions.
- Topic documentation is Spanish study guidance, not official text. Every card
  links back to the verified official topic/source.

## Scope

### Topic documentation

Add a topic-study-card dataset and loader. Every topic gets a concise Spanish
card with objectives, study checklist, and review prompts. Mathematics and
Meteorology and Climatology receive richer notes first. Missing rich notes use
the concise card without pretending they are comprehensive lessons.

### Practice

Create one Spanish didactic multiple-choice question per topic. Questions map
to a topic, show options one at a time, validate the selected answer locally,
show a Spanish explanation, and reuse the current signed-in attempt persistence
path. The question bank exposes topic and random quiz modes.

### Schedule orchestrator

Add a pure planner that ranks due review topics first, then weak/in-progress
topics, then not-started topics. It fills the existing candidate study template:
07:30–09:00 topic, 09:10–10:10 linked questions, and 10:20–11:00 review.
It generates editable existing study sessions; it does not invent a call or
exam date.

## Architecture

Keep source fixtures and deterministic domain functions in `apps/web/lib`.
Routes/components only load, render, and persist their output. Reuse `Topic`,
`Question`, question-attempt persistence, and study-session persistence where
possible; no new external dependency or official-data migration is planned.

## UI

All product copy and study content added by this work is Spanish. English
remains only internal/fallback UI support. A visible `Material didáctico no
oficial` label distinguishes generated questions and notes from verified BOE
wording and official past exams.

## Testing

Test-first coverage must prove:

- every verified syllabus topic has a card and at least one linked question;
- random and topic quiz selectors are deterministic, constrained, and exclude
  unsupported questions;
- feedback reveals only after selection and identifies the correct answer;
- orchestrator prioritises due/weak work and produces valid, non-overlapping
  morning sessions;
- existing import, persistence, lint, and build suites remain green.

## Non-goals and follow-ups

- No claim that all didactic material is official or comprehensive.
- No automated BOE/AEMET monitoring or browser notifications.
- Continue historical official-question import separately in issue #9.
- Phone end-to-end study smoke test remains issue #8.

## Acceptance criteria

Candidate can open any topic, read Spanish study guidance, take linked or
random questions with feedback, and reset a personalised next-week plan that
contains actionable morning sessions. Source labels remain accurate throughout.