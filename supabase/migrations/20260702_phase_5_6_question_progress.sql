create table if not exists public.question_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  attempts_count integer not null default 0,
  last_attempt_at text not null default '',
  next_review_at text not null default '',
  mistake_types text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

drop trigger if exists set_question_progress_updated_at on public.question_progress;

create trigger set_question_progress_updated_at
before update on public.question_progress
for each row
execute function public.set_updated_at();

alter table public.question_progress enable row level security;

create policy "question_progress_select_own"
on public.question_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "question_progress_insert_own"
on public.question_progress
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "question_progress_update_own"
on public.question_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "question_progress_delete_own"
on public.question_progress
for delete
to authenticated
using (auth.uid() = user_id);
