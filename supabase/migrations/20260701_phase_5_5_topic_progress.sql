create table if not exists public.topic_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null,
  status text not null,
  confidence integer not null,
  priority text not null,
  next_review_at text not null default '',
  notes_status text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

drop trigger if exists set_topic_progress_updated_at on public.topic_progress;

create trigger set_topic_progress_updated_at
before update on public.topic_progress
for each row
execute function public.set_updated_at();

alter table public.topic_progress enable row level security;

create policy "topic_progress_select_own"
on public.topic_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "topic_progress_insert_own"
on public.topic_progress
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "topic_progress_update_own"
on public.topic_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "topic_progress_delete_own"
on public.topic_progress
for delete
to authenticated
using (auth.uid() = user_id);
