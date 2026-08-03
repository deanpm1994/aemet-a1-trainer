alter table public.questions
  add column if not exists origin text not null default 'official_historic'
    check (origin in ('official_historic', 'didactic_reviewed')),
  add column if not exists editorial_status text not null default 'official'
    check (editorial_status in ('official', 'reviewed'));

update public.questions
set origin = 'official_historic', editorial_status = 'official'
where origin is null or editorial_status is null;

drop policy if exists "questions_read_verified" on public.questions;
drop policy if exists "questions_read_practice_bank" on public.questions;
create policy "questions_read_practice_bank" on public.questions
  for select to anon, authenticated
  using (origin in ('official_historic', 'didactic_reviewed'));

create table if not exists public.hidden_questions (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null references public.questions (id) on delete cascade,
  hidden_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.hidden_questions enable row level security;
create policy "hidden_questions_select_own" on public.hidden_questions for select to authenticated using (auth.uid() = user_id);
create policy "hidden_questions_insert_own" on public.hidden_questions for insert to authenticated with check (auth.uid() = user_id);
create policy "hidden_questions_delete_own" on public.hidden_questions for delete to authenticated using (auth.uid() = user_id);
