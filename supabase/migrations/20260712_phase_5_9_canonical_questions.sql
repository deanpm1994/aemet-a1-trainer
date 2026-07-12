create table if not exists public.questions (
  id text primary key,
  name text not null,
  type text not null,
  source_year integer not null,
  source_exam text not null,
  source_url text not null,
  retrieved_at text not null,
  verification_status text not null check (verification_status in ('verified', 'unverified', 'needs_review', 'deprecated')),
  question_number text not null,
  statement text not null,
  options jsonb not null,
  correct_answer text not null,
  answer_source_status text not null,
  answer_source_url text,
  answer_retrieved_at text,
  explanation text not null default '',
  topic_ids text[] not null default '{}',
  difficulty integer not null check (difficulty between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_sources (
  id uuid primary key default gen_random_uuid(),
  question_id text not null references public.questions (id) on delete cascade,
  source_url text not null,
  content_hash text not null,
  retrieved_at text not null,
  imported_at timestamptz not null default now(),
  verification_status text not null check (verification_status in ('verified', 'unverified', 'needs_review', 'deprecated')),
  unique (question_id, source_url, content_hash)
);

create index if not exists questions_verified_source_year_idx on public.questions (verification_status, source_year desc);
create index if not exists question_sources_question_id_idx on public.question_sources (question_id);

drop trigger if exists set_questions_updated_at on public.questions;
create trigger set_questions_updated_at before update on public.questions for each row execute function public.set_updated_at();

alter table public.questions enable row level security;
alter table public.question_sources enable row level security;

create policy "questions_read_verified" on public.questions for select to anon, authenticated using (verification_status = 'verified');
create policy "question_sources_read_verified_questions" on public.question_sources for select to anon, authenticated using (exists (select 1 from public.questions where questions.id = question_sources.question_id and questions.verification_status = 'verified'));
