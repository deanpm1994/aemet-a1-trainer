# GitHub Issue Backlog

Last checked: 2026-08-03

Current issues from `gh issue list --state all --limit 50`:

## #2 feat(focus): persist focus session review outcomes

GitHub status: closed 2026-07-09.

Verification before closing:
- `study_sessions` stores focus review fields.
- `/focus` saves review decisions through the study-session repository.
- Completed focus sessions update topic/question progress overlays.
- `npm --prefix apps/web test -- focus-planner.test.ts study-sessions.test.ts study-sessions-repository.test.ts focus-progress.test.ts` passed: 4 files, 27 tests.

## #3 feat(progress): persist topic and question progress per user

GitHub status: closed 2026-07-09.

Verification before closing:
- Supabase migrations exist for `topic_progress`, `question_progress`, and `question_attempts` with RLS policies.
- Repository tests cover user-owned topic progress, question progress, and question attempts.
- Dashboard/topic/question routes overlay signed-in user progress without mutating source-owned official content.
- `npm --prefix apps/web test -- topic-progress.test.ts topic-progress-repository.test.ts question-progress-persistence.test.ts question-progress-repository.test.ts question-attempts.test.ts question-attempts-repository.test.ts dashboard-today.test.ts` passed: 7 files, 24 tests.

## #4 feat(monitoring): implement BOE/AEMET monitoring MVP

GitHub status: closed 2026-07-15.

Closure note: authenticated manual checks persist allowlisted BOE/AEMET source snapshots, compare SHA-256 hashes, record keyword hits, and create review-only change events. Scheduling, alerts, and automatic official conclusions remain out of scope.

## #5 feat(pwa): add installable PWA shell and study reminders

GitHub status: closed 2026-07-15.

Closure note:
- manifest/installability metadata
- project-owned icons
- persisted reminder preference settings
- visible in-app morning and light-review reminders at the configured local minute while the signed-in app is open
- one dismissal per local date and reminder slot, stored in browser local storage
- explicit absence of browser notifications, push, service worker, offline cache, and background delivery
- focused helper tests, lint, and production build passed

Future browser notifications, offline support, or scheduled delivery require a newly scoped issue and separate verification.

## #6 docs(roadmap): refresh project memory and issue backlog docs after Phase 5

GitHub status: closed 2026-07-10.

Closure note: closed after `docs/ROADMAP.md`, `docs/GITHUB_ISSUES.md`, and `docs/PROJECT_MEMORY.md` were reconciled with Phase 5 completion and current issue state.

## #8 test(release): run private MVP study smoke test

GitHub status: closed as completed on 2026-07-15, but no completion evidence was recorded in the issue.

Replacement: #22 `test(release): verify production mobile study flow` is open and requires a recorded real-phone result before it can close.

## #9 feat(import): continue official historical past exam import

GitHub status: closed.

Closure note: work was absorbed by the verified historical subset import; create a new focused issue before the next source batch.

## #12 feat(content): expand detailed Spanish topic notes

GitHub status: closed 2026-07-11.

Closure note: reviewed, clearly non-official Spanish notes now cover all 128 verified topics while source-owned BOE metadata remains unchanged. Full test suite, lint, and production build passed.

## #13 feat(import): resume verified historical exams

GitHub status: closed as completed on 2026-07-15.

Closure evidence: 2014 questions 27–42 were imported with AEMET questionnaire wording and MITECO answer-template provenance. Questions needing further source review remain outside the verified import and must be tracked in a newly scoped issue if work resumes.

## #20 and #21 question-bank release

GitHub status: merged on 2026-08-03.

- #20 maps the historic-question subset to app-owned syllabus topics and retains unresolved OCR/formula content as `TODO_VERIFY_OFFICIAL_SOURCE`.
- #21 rebuilds the question-bank workflow with provenance-aware metadata, learner-safe filtering, reviewed-practice safeguards, and quarantined audit-only recent extractions.
- The production Vercel deployment for the #21 merge commit completed successfully.

## #22 test(release): verify production mobile study flow

GitHub status: open.

Purpose: record one real candidate end-to-end study flow on the production deployment. The issue requires device/browser evidence, persistence after reload, and a separately tracked defect for each blocker found.
