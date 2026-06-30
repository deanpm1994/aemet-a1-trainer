create table if not exists public.study_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  session_type text not null,
  objective text not null,
  topic_ids text[] not null default '{}',
  question_ids text[] not null default '{}',
  planned_date date not null,
  planned_start_time text not null,
  planned_end_time text not null,
  planned_duration_minutes integer not null,
  status text not null,
  timer_status text not null,
  completed boolean not null default false,
  review_state text not null,
  notes_created boolean not null default false,
  questions_solved integer not null default 0,
  flashcards_created integer not null default 0,
  mistakes_logged integer not null default 0,
  confidence_after integer,
  next_review_at date,
  notes text not null default '',
  is_template boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_study_sessions_updated_at on public.study_sessions;

create trigger set_study_sessions_updated_at
before update on public.study_sessions
for each row
execute function public.set_updated_at();

alter table public.study_sessions enable row level security;

create policy "study_sessions_select_own"
on public.study_sessions
for select
to authenticated
using (auth.uid() = user_id);

create policy "study_sessions_insert_own"
on public.study_sessions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "study_sessions_update_own"
on public.study_sessions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "study_sessions_delete_own"
on public.study_sessions
for delete
to authenticated
using (auth.uid() = user_id);
