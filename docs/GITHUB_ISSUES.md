# GitHub Issue Backlog

Last checked: 2026-07-10

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

GitHub status: open.

Current implementation is a manual/read-only monitoring workflow. GitHub issue was updated with this partial status on 2026-07-09. Missing for this issue:
- persisted monitoring sources/events
- source snapshot retrieval
- hash comparison
- keyword/event detection
- scheduled execution
- action queue backed by real checks

## #5 feat(pwa): add installable PWA shell and study reminders

GitHub status: open.

GitHub issue was updated with this partial status on 2026-07-09. Implemented:
- manifest/installability metadata
- project-owned icons
- persisted reminder preference settings

Still missing:
- visible in-app reminder behavior
- service worker/offline shell, if still desired
- browser notification permission flow and delivery, if in scope
- scheduled reminder delivery
- manual installability verification in a browser

## #6 docs(roadmap): refresh project memory and issue backlog docs after Phase 5

GitHub status: closed 2026-07-10.

Closure note: closed after `docs/ROADMAP.md`, `docs/GITHUB_ISSUES.md`, and `docs/PROJECT_MEMORY.md` were reconciled with Phase 5 completion and current issue state.

## #8 test(release): run private MVP study smoke test

GitHub status: open.

Purpose: verify the private working version on the candidate's real phone with a 30-minute end-to-end study flow: sign in, create or load a plan, run focus, complete review, and confirm persisted progress after reload.

## #9 feat(import): continue official historical past exam import

GitHub status: closed.

Closure note: work was absorbed by the verified historical subset import; create a new focused issue before the next source batch.

## #12 feat(content): expand detailed Spanish topic notes

GitHub status: closed 2026-07-11.

Closure note: reviewed, clearly non-official Spanish notes now cover all 128 verified topics while source-owned BOE metadata remains unchanged. Full test suite, lint, and production build passed.

## #13 feat(import): resume verified historical exams

GitHub status: open.

Purpose: resume official AEMET/MITECO historical Acceso Libre imports from source inspection. The 2014 batches import questions 1, 2, 3, 5, 6, 8, 9, 10, 13, 15 through 22, and 27 through 42 with official answer provenance; questions 4, 7, 11, 12, and 14 remain excluded pending formula/OCR review. Keep no-key material as `needs_review`; exclude annulled, formula-heavy, or OCR-uncertain questions from verified practice until manually reviewed.
