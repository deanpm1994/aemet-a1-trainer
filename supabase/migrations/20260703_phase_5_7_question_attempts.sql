create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  attempted_at text not null,
  selected_answer text not null default '',
  is_correct boolean not null default false,
  mistake_types text[] not null default '{}',
  confidence_after integer not null default 3 check (
    confidence_after between 1 and 5
  ),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists question_attempts_user_question_attempted_at_idx
on public.question_attempts (user_id, question_id, attempted_at);

alter table public.question_attempts enable row level security;

create policy "question_attempts_select_own"
on public.question_attempts
for select
to authenticated
using (auth.uid() = user_id);

create policy "question_attempts_insert_own"
on public.question_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "question_attempts_update_own"
on public.question_attempts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "question_attempts_delete_own"
on public.question_attempts
for delete
to authenticated
using (auth.uid() = user_id);
