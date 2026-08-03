-- Question-bank rebuild metadata. Canonical IDs remain unchanged so attempts,
-- progress and hidden-question preferences keep their foreign-key targets.
alter table public.questions
  add column if not exists oep_year integer,
  add column if not exists exam_date date,
  add column if not exists exam_part text
    check (exam_part in ('first_exercise_part_1', 'first_exercise_part_2')),
  add column if not exists question_role text not null default 'ordinary'
    check (question_role in ('ordinary', 'reserve')),
  add column if not exists reserve_disposition text not null default 'not_applicable'
    check (reserve_disposition in ('not_applicable', 'activated', 'unused')),
  add column if not exists disposition text not null default 'available'
    check (disposition in ('available', 'annulled', 'quarantined', 'deprecated')),
  add column if not exists case_group text check (case_group in ('A', 'B')),
  add column if not exists model_answer text,
  add column if not exists answer_format text not null default 'single_choice'
    check (answer_format in ('single_choice', 'developed_response')),
  add column if not exists grading_rubric text,
  add column if not exists statement_reviewed_at timestamptz,
  add column if not exists options_reviewed_at timestamptz,
  add column if not exists answer_reviewed_at timestamptz;

update public.questions
set answer_format = 'developed_response',
    exam_part = coalesce(exam_part, 'first_exercise_part_2')
where type = 'practical_case';

update public.questions
set exam_part = coalesce(exam_part, 'first_exercise_part_1')
where type = 'multiple_choice' and origin = 'official_historic';

create index if not exists questions_practice_disposition_idx
  on public.questions (verification_status, disposition, source_year desc);
create index if not exists questions_oep_part_idx
  on public.questions (oep_year, exam_part, case_group, question_number);

create table if not exists public.official_source_documents (
  id text primary key,
  source_url text not null,
  document_sha256 text not null check (document_sha256 ~ '^[0-9a-f]{64}$'),
  retrieved_at date not null,
  oep_year integer,
  exam_date date,
  exam_part text check (exam_part in ('first_exercise_part_1', 'first_exercise_part_2')),
  document_role text not null
    check (document_role in ('questionnaire', 'definitive_answer_key', 'practical_paper', 'authoritative_support')),
  verification_status text not null
    check (verification_status in ('verified', 'unverified', 'needs_review', 'deprecated')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_url, document_sha256)
);

drop trigger if exists set_official_source_documents_updated_at on public.official_source_documents;
create trigger set_official_source_documents_updated_at
before update on public.official_source_documents
for each row execute function public.set_updated_at();

create table if not exists public.question_source_documents (
  question_id text not null references public.questions (id) on delete cascade,
  source_document_id text not null references public.official_source_documents (id) on delete restrict,
  placement text not null
    check (placement in ('statement', 'option', 'diagram', 'model_answer')),
  option_key text not null default '',
  primary key (question_id, source_document_id, placement, option_key)
);

create table if not exists public.question_answer_supports (
  id uuid primary key default gen_random_uuid(),
  question_id text not null references public.questions (id) on delete cascade,
  label text not null,
  source_url text not null,
  retrieved_at date not null,
  verification_status text not null
    check (verification_status in ('verified', 'unverified', 'needs_review', 'deprecated')),
  placement text not null
    check (placement in ('statement', 'option', 'diagram', 'model_answer')),
  option_key text not null default '',
  content_hash text,
  created_at timestamptz not null default now(),
  unique (question_id, source_url, placement, option_key)
);

alter table public.question_source_assets
  add column if not exists placement text not null default 'statement'
    check (placement in ('statement', 'option', 'diagram', 'model_answer')),
  add column if not exists option_key text,
  add column if not exists alt_text text;

update public.question_source_assets
set alt_text = 'Recorte del documento oficial conservado como evidencia visual.'
where alt_text is null;

alter table public.question_source_assets
  alter column alt_text set not null;

alter table public.question_attempts
  add column if not exists draft_response text not null default '',
  add column if not exists self_assessment text not null default 'ungraded'
    check (self_assessment in ('correct', 'partial', 'incorrect', 'ungraded'));

alter table public.official_source_documents enable row level security;
alter table public.question_source_documents enable row level security;
alter table public.question_answer_supports enable row level security;

create policy "official_source_documents_read" on public.official_source_documents
  for select to anon, authenticated using (true);

create policy "question_source_documents_read_available" on public.question_source_documents
  for select to anon, authenticated using (exists (
    select 1 from public.questions
    where questions.id = question_source_documents.question_id
      and questions.verification_status = 'verified'
      and questions.disposition = 'available'
  ));

create policy "question_answer_supports_read_available" on public.question_answer_supports
  for select to anon, authenticated using (exists (
    select 1 from public.questions
    where questions.id = question_answer_supports.question_id
      and questions.verification_status = 'verified'
      and questions.disposition = 'available'
  ));
