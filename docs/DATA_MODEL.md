# Data Model

## Entity: Topic

Fields:
- id
- block
- official_number
- official_text
- short_title
- priority
- status
- confidence
- source_name
- source_url
- retrieved_at
- verification_status
- notes
- bibliography_ids
- question_ids
- last_studied_at
- next_review_at

Persistence notes:
- Source topic content is loaded from Notion or local fallback data.
- Real verified syllabus topics may now be loaded from a checked-in BOE subset source through the official import layer before broader Notion or full-source ingestion exists.
- User-owned topic study state is stored separately in Supabase table `topic_progress`.
- `topic_progress` overlays `status`, `confidence`, `priority`, `next_review_at`, and `notes_status` by `user_id` and `topic_id`.
- Official wording, source URL, retrieval date, and verification status remain source-owned and are not written by topic progress updates.
- Anonymous topic progress remains source-only/local fallback state.

## Entity: Question

Fields:
- id
- type
- source_year
- source_exam
- source_url
- retrieved_at
- verification_status
- question_number
- statement
- options
- correct_answer
- answer_source_status
- explanation
- topic_ids
- difficulty
- attempts_count
- last_attempt_at
- next_review_at
- mistake_type

Persistence notes:
- Source question content is loaded from Notion or local fallback data.
- User-owned practice progress is stored separately in Supabase table `question_progress`.
- `question_progress` overlays `attempts_count`, `last_attempt_at`, `next_review_at`, and `mistake_types` by `user_id` and `question_id`.
- Detailed signed-in attempt history is stored in Supabase table `question_attempts`.
- A saved attempt records the selected answer, user-marked correctness, mistake types, confidence, notes, and attempt date.
- `question_progress` is updated from the saved attempt history so dashboards can load aggregate review state without mutating source question content.
- Statements, options, answer keys, explanations, answer source status, source URLs, retrieval dates, and verification status remain source-owned.
- Anonymous question progress remains source-only/local fallback state.

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

## Entity: QuestionAttempt

Fields:
- id
- user_id
- question_id
- attempted_at
- selected_answer
- is_correct
- mistake_types
- confidence_after
- notes
- created_at

Persistence notes:
- Question attempts are user-owned and protected by row-level security.
- Correctness is a user-entered practice result, not an official answer-key claim.
- Attempt history does not alter official statements, options, answer keys, source URLs, retrieval dates, or verification status.

## Entity: BibliographyItem

Fields:
- id
- title
- author
- year
- block
- chapters
- priority
- source_type
- source_url
- verification_status
- notes

## Entity: StudySession

Fields:
- id
- user_id
- planned_start
- planned_end
- actual_start
- actual_end
- topic_ids
- question_ids
- session_type
- objective
- completed
- focus_score
- notes_created
- questions_solved
- flashcards_created
- mistakes_logged
- confidence_after
- next_review_at

Persistence notes:
- Calendar study sessions are stored in Supabase table `study_sessions`.
- `id` is a stable text domain identifier and is unique together with `user_id`.
- Rows are owned by `user_id` and protected by row-level security.
- `isPersisted` is an app-derived flag, not an authoritative database field.
- Focus mode stores timer and review outcomes on the same `study_sessions` rows for signed-in users.
- Completed focus sessions also update user-owned `topic_progress` and `question_progress` overlays when they reference known topic or question IDs.
- Focus-derived question progress is aggregate practice state only; it does not create detailed `question_attempts` records because focus completion does not know the selected answer.
- Anonymous calendar and focus flows remain local-only demos.

## Entity: MonitoringSource

Fields:
- id
- name
- url
- source_type
- keywords
- check_frequency
- last_checked_at
- last_hash
- last_change_at
- status
- notes
- verification_status
- last_verified_at
- verified_by
- expected_signals

Implementation notes:
- Monitoring sources are currently local placeholder fixtures.
- Placeholder URLs use `TODO_VERIFY_OFFICIAL_SOURCE`.
- Sources with placeholder URLs or non-verified status are not counted as configured or active.
- Sources are not ready for automation until verification metadata and expected official signals are recorded.
- No monitoring source is persisted or polled yet.

## Entity: MonitoringEvent

Fields:
- id
- source_id
- detected_at
- event_type
- title
- url
- summary
- confidence
- requires_action
- resolved
- verification_status

Implementation notes:
- Monitoring events are currently local workflow placeholders.
- Events are not detected from BOE/AEMET yet.
- Placeholder events must not be presented as official changes.

## Entity: Countdown

Fields:
- id
- name
- target_type
- target_date
- certainty
- source_url
- verification_status
- active
- notes
