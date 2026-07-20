-- Existing verification flags predate the explicit crop-and-review evidence
-- contract. Keep every stable row and all user progress, but quarantine legacy
-- official content until the new review timestamps exist.
update public.questions
set statement_reviewed_at = reviewed_at,
    options_reviewed_at = reviewed_at,
    answer_reviewed_at = reviewed_at
where reviewed_at is not null
  and (
    statement_reviewed_at is null
    or options_reviewed_at is null
    or answer_reviewed_at is null
  );

update public.questions
set disposition = 'quarantined'
where origin = 'official_historic'
  and disposition = 'available'
  and reviewed_at is null;

update public.questions
set disposition = 'quarantined'
where verification_status in ('needs_review', 'unverified')
  and disposition = 'available';

update public.questions
set disposition = 'deprecated'
where verification_status = 'deprecated'
  and disposition <> 'deprecated';
