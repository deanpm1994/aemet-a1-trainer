# Project Memory

This file stores persistent project context for Codex and contributors.

## Project

Name: AEMET A1 Trainer

Purpose:
A web/PWA app for preparing the Spanish public opposition exam:
Grupo A1 – Cuerpo Superior de Meteorólogos del Estado, AEMET.

## User

The primary user is preparing for the next AEMET A1 opening.

Known constraints:
- Works 12:30–23:00.
- Best study time: morning.
- Background: Meteorology degree from Cuba.
- Spanish qualification: Master in Meteorology and Geophysics.
- Wants calendar-based checklist and focus support.
- Wants a question bank from past exams.
- Wants countdowns for future openings and exam phases.
- Wants official BOE/AEMET monitoring.
- Husband is a software developer and wants this as a GitHub portfolio project.

## Study defaults

Morning deep work is preferred.

Default weekday plan:
- 07:30–09:00 deep technical study
- 09:10–10:10 problems/practical case
- 10:20–11:00 legal/informatics/flashcards
- 23:30–00:00 optional light review

Avoid heavy study after 23:00.

## Official syllabus size

Current known structure from latest referenced A1 programme:
- Mathematics: 18 topics
- Physics: 18 topics
- Meteorology and Climatology: 59 topics
- Informatics and Communications: 10 topics
- General/Common topics: 23 topics from BOE-A-2026-1292 acceso libre Temas generales

Total: 128 topics

Important:
The exact topic wording must be verified against the official BOE call before importing.

## Core app modules

1. Dashboard
2. Official topic checklist
3. Question bank
4. Practical case trainer
5. Focus mode
6. Calendar planner
7. Countdown system
8. BOE/AEMET monitor
9. Notion sync
10. Progress analytics

## Architecture direction

Preferred stack:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Notion API
- Google Calendar API later
- Vercel deployment
- PWA-first design

## Official-source policy

Only official-source verified data may be displayed as official.

Official preferred sources:
- BOE
- AEMET
- Spanish government legal sources
- WMO
- ECMWF
- EUMETSAT

Use `TODO_VERIFY_OFFICIAL_SOURCE` for uncertain data.

## Current implementation handoff

Date: 2026-07-05

Branch:
- `past-exam-import`

Private deployment:
- Vercel project created and linked from `apps/web`: `deanpm1994s-projects/web`
- Production URL: `https://web-konn52wdr-deanpm1994s-projects.vercel.app`
- Required production env vars copied from local `.env.local` into Vercel production: Notion token/data source IDs and Supabase URL/publishable/secret keys
- Vercel SSO deployment protection disabled so the URL is directly reachable; app-level Supabase auth remains available for persisted user data
- Live route smoke checks returned HTTP 200 for `/`, `/dashboard`, `/calendar`, `/focus`, `/manifest.webmanifest`, `/auth/sign-up`, `/auth/sign-in`, `/topics`, `/questions`, and `/settings`

Phase 5 status:
- Phase 5.1 Supabase-backed user settings persistence implemented
- Phase 5.2 Supabase email/password auth implemented
- Phase 5.3 Supabase-backed calendar study-session persistence implemented and merged
- Phase 5.4 Supabase-backed focus-session timer and review outcome persistence implemented
- Phase 5.5 Supabase-backed topic progress overlay persistence implemented
- Phase 5.6 Supabase-backed question progress overlay persistence implemented
- Phase 5.7 Supabase-backed question attempt history implemented and remote migration applied
- Phase 5.8 completed focus sessions update topic/question progress overlays

Phase 6 status:
- Manual BOE/AEMET monitoring MVP implemented with persisted snapshots, hash comparison, keyword enrichment, and review-only events
- Monitoring source verification readiness queue implemented
- No scheduled polling, alerts, or automatic official conclusions are active

Phase 7 status:
- Basic PWA installability metadata and project-owned icon placeholders implemented
- Saved reminder preferences now show a dismissible in-app banner at the configured local minute while the signed-in app is open
- Countdown/status widget shell implemented; it explicitly shows no verified official date until source-backed date records exist
- No browser notifications, push subscriptions, service worker, offline cache, or scheduled reminder delivery are active

i18n status:
- Spanish-first UI foundation implemented with internal `es`/`en` dictionaries
- The root app language defaults to Spanish (`es`)
- Shared shell, navigation, homepage, source-state, and content-readiness UI copy use the i18n helper
- Spanish UI pass 2 translated remaining primary route, form, auth, planner, focus, question, topic, resource, monitoring, settings, manifest, and user-facing status copy
- English fallback strings exist in code, but no user-facing language selector or persisted language preference is implemented yet
- Product UI strings may be translated; source-owned topic/question fields and future BOE/AEMET official wording must not be machine-translated or rewritten by the i18n layer
- Unverified starter study fixture content in `mock-data.ts` may still contain English study statements, names, objectives, bibliography titles, and source notes; treat that as content cleanup/import work, not UI chrome

Study content readiness:
- Dashboard, topics, and questions show whether loaded content is ready for private study tracking
- Unverified starter topics/questions are explicitly not treated as official-ready
- Verified official syllabus wording and verified past-question imports remain the main blocker before calling the app official-content ready
- Official content import foundation exists for syllabus-first ingestion and question-contract validation
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full acceso libre programme: Mathematics, Physics, Meteorology and Climatology, Informatics and Communications, and General/Common. The earlier 127-topic count was corrected to 128 because BOE-A-2026-1292 lists 23 acceso libre Temas generales.
- Verified past-exam subset is imported from official AEMET/MITECO acceso libre primer ejercicio sources. Current checked-in questions: 2018 questions 8, 10, 13, 17, and 19; 2017 questions 12, 13, 14, 15, and 16; 2016 questions 14, 15, 16, 17, and 20; 2015 questions 19, 20, 21, and 22; 2014 questions 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 15 through 22, and 27 through 42. The subset includes official answer-source provenance from official answer-template resolutions, including the 2014 MITECO template, the corrected 2016 answer-template resolution, and the 2015 MITECO answer-template agreement.
- AEMET official Grupo A1 guide URL for accesso libre work: `https://www.aemet.es/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre`.
- AEMET previous-call page for historical exam discovery: `https://www.aemet.es/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/otras_convocatorias`; use the Acceso Libre column.
- Remaining past-exam import work: continue importing official AEMET/MITECO PDFs in batches, keep no-answer official exams as `needs_review`, exclude annulled questions from verified practice import unless explicitly modeled, and manually review formula-heavy or OCR-sensitive question text before checked-in import. The 2014 batch excludes questions 11, 12, and 14 pending further formula/OCR review.
- Source-backed official date records remain required before showing a real countdown to any convocatoria, deadline, or exam phase

Supabase notes:
- Project URL configured in local env
- Project ref linked locally: `adwapclevjpltyxprbyx`
- Supabase now uses publishable and secret keys instead of legacy anon/service-role labels
- Canonical question content is stored in Supabase `questions`, with provenance hashes in `question_sources`. The filtered 2014–2018 Acceso Libre import contains 513 historical rows. Historical source text is selectable only when `verified` and `available`; rows needing visual review remain quarantined without deleting source data or progress. The checked-in offline fallback contains 54 verified questions (2014×35, 2015×4, 2016×5, 2017×5, 2018×5), each with an app-owned syllabus-topic mapping. The 2014 questions 11, 12 and 14 remain `TODO_VERIFY_OFFICIAL_SOURCE` because formula/OCR transcription is unresolved.
- `npm --prefix apps/web run audit:historical-question-extraction` writes `aemet-a1-historical-question-extraction-review.csv`, identifying extraction issues and their official source-PDF pages. `docs/HISTORICAL_QUESTION_REVIEW.md` defines the mandatory crop-then-review workflow; reviewed mathematical text stays selectable and the private crop is evidence/fallback only.
- The bank excludes officially annulled questions and questions tied to repealed Law 30/1992, repealed RDL 3/2011, or the dated 2017–2019 Open Government Action Plan; the exclusions are recorded in `aemet-a1-acceso-libre-2026-program-excluded.csv`. The earlier title-derived syllabus prompts were deleted from Supabase; Notion no longer controls runtime question availability.
- Title-derived didactic questions are excluded from the question bank and practice sessions. A BOE syllabus title is not sufficient factual context for a subject-matter question. Future didactic items require a factual source and editorial review before import.
- Signed-in users may hide a question from quiz feedback only for their own future sessions through `hidden_questions`; RLS prevents access to other users’ preferences. Hiding does not alter the shared question or its verification status.
- Local auth issue was caused by a mistyped publishable key prefix in `.env.local`; working prefix is `sb_publishable_...`
- Dev server restart is required after local env changes
- Remote migrations verified applied: `20260623`, `20260630`, `20260701`, `20260702`, `20260703`, `20260715_phase_5_10_reviewed_questions_and_hiding`

Verified working recently:
- `npm --prefix apps/web test`
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web run build`
- Focus/session persistence issue #2 was closed after focused verification: 4 files, 27 tests passed.
- Topic/question progress persistence issue #3 was closed after focused verification: 7 files, 24 tests passed.
- GitHub issues #2, #3, #5, #6, #8, #9, #12, and #13 are closed. Because #8 has no recorded phone-test evidence, replacement issue #22 requires a real candidate production smoke test before it can close.
- Vercel production deployment completed with ready state `READY`
- Sign-up and sign-in flow worked after env fix
- Local `/calendar` smoke test returned HTTP 200 and rendered the planner
- Focus route now loads the next persisted actionable session for signed-in users and saves timer/review transitions through `study_sessions`
- Topic list and detail routes overlay signed-in user progress from `topic_progress` without mutating source-owned official metadata
- Question route overlays signed-in user practice progress from `question_progress` without mutating source-owned statements, options, answer keys, or verification metadata
- Monitoring route shows manual-only source checklist and review queue placeholders; it does not claim active monitoring
- Dashboard now acts as a Today study cockpit, combining next session, weak topics, overdue questions, and monitoring readiness with signed-in persistence overlays
- Question bank now records signed-in user attempts and derives aggregate review progress from attempt history
- Focus completion now saves related topic/question progress overlays for signed-in users
- Basic PWA manifest/installability metadata builds cleanly and exposes `/manifest.webmanifest`
- Dashboard, topics, and questions show study-content readiness without treating unverified starter content as official
- Study MVP now adds Spanish study cards with three detailed review prompts for every verified topic. Cards are explicitly labelled `Material didáctico no oficial`; they do not replace source-owned BOE titles, URLs, retrieval dates, or verification status.
- Questions route supports topic quiz entry points, deterministic random quiz selection, and immediate Spanish feedback. Official historical questions retain their own provenance and status.
- Reviewed didactic-question infrastructure now supports fixed `choose_correct`/`choose_incorrect` instructions, a visible non-official marker, source disclosure after submission, and one-choice validation. No sourced 128-item didactic bank is checked in yet: authoring must use an authoritative factual source for each item rather than a BOE title alone.
- Calendar recommended week now ranks due review, weak, and unstarted topics and creates editable weekday 07:30–11:00 topic/question/review sessions. It does not use an official exam date.

Next recommended MVP steps:
- Order of action:
  1. Run #22 production phone smoke test: sign in, create or use session, focus timer, complete review, reload, verify topic/question progress updates, and record device/browser evidence.
  2. Continue official historical past-exam import in a newly scoped issue, starting with 2014 Acceso Libre only after source inspection.
  4. Consider browser notifications or offline support only after a separate scope and verification plan; current reminders are in-app only.
  5. Add a settings language selector if the candidate wants to switch between Spanish and English.

Ignored local artifacts:
- `apps/web/package-lock.json`
- `supabase/.temp/`

## Question-bank rebuild handoff

Date: 2026-07-20

- Added position-based `QuestionOption` grading, fixing official letter keys
  against unlabeled stored options and supporting both three- and four-option
  papers.
- Added migration `20260720_question_bank_rebuild` for OEP/part/reserve/case
  metadata, publication disposition, source-document hashes, multiple answer
  supports, source-asset placement/alt text, model answers/rubrics and
  practical draft/self-assessment fields.
- Added learner filtering for `verified` plus `available`, reserve labels, full
  correct-option feedback, and a practical-case runner that requires a draft
  or explicit skip before revealing a clearly non-official model answer.
- Added `data/official-question-source-manifest.json` with 16 hash-pinned
  historical and recent official documents.
- Generated a no-write 518-row reconciliation. Under the new evidence
  standard, all 512 structurally complete historical extractions still need
  explicit visual-review records; the six incomplete 2016 rows remain
  quarantined.
- Extracted 230 recent official multiple-choice candidates with definitive
  decisions (223 non-annulled, seven annulled) and 32 practical prompt
  candidates. They remain `needs_review`/`quarantined`; no candidate is
  promoted by extraction alone.
- The 32 reviewed model solutions and 128 source-backed authored questions are
  not complete. Do not claim their acceptance targets or deploy these
  candidates as learner-visible until the editorial gates in
  `docs/QUESTION_BANK_REBUILD.md` pass.
- Remote rollout completed for migrations `20260720`, `20260721` and
  `20260722`, the
  16-document source manifest, 230 recent multiple-choice candidates and 32
  practical candidates. All new content is audit-only/quarantined. The 284
  verified, structurally complete 2014–2018 historical rows are
  learner-available; 229 audit-flagged historical rows remain quarantined
  without deletion or loss of progress references. On 2026-07-31, 2015
  question 3 was source-crop reviewed, corrected to remove an embedded page
  header, and promoted with official answer A.
- Read-only remote verification matched OEP 2024 counts 105/5 annulled/100
  quarantined, OEP 2025 counts 125/2/123, practical 32 quarantined, definitive
  answers 37=B and 96=B, and activated reserves 121–122.

## Release status

Date: 2026-08-03

- Pull requests #20 (historic-question topic mappings) and #21 (question-bank rebuild) were squash-merged into `develop`.
- Post-resolution verification passed: 47 test files / 211 tests, lint/typecheck, production build, and `git diff --check`.
- The Vercel deployment attached to merge commit `08875e5` completed successfully. The public deployment returned HTTP 200 during release verification.
- Do not claim real-phone release validation until issue #22 contains the required evidence.
