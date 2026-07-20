-- Historical questions already classified as verified before the evidence
-- migration are deciphered, structurally complete official exam records.
-- Restore those to practice while leaving OCR-damaged, annulled, deprecated
-- and needs-review records quarantined.
update public.questions
set disposition = 'available'
where origin = 'official_historic'
  and source_year between 2014 and 2018
  and verification_status = 'verified'
  and correct_answer ~ '^[A-D]$'
  and jsonb_typeof(options) = 'array'
  and jsonb_array_length(options) = 4
  and btrim(statement) <> '';
