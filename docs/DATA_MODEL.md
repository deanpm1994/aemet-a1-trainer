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
