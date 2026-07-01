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
- Statements, options, answer keys, explanations, answer source status, source URLs, retrieval dates, and verification status remain source-owned.
- Anonymous question progress remains source-only/local fallback state.

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
