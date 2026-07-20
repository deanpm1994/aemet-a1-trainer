-- Preserve raw extraction separately from reviewed learner-facing text.
alter table public.questions
  add column if not exists raw_statement text,
  add column if not exists raw_options jsonb,
  add column if not exists content_format text not null default 'plain_text'
    check (content_format in ('plain_text', 'latex')),
  add column if not exists reviewed_at timestamptz;

update public.questions
set raw_statement = statement,
    raw_options = options
where raw_statement is null or raw_options is null;

alter table public.questions
  alter column raw_statement set not null,
  alter column raw_options set not null;

create table if not exists public.question_source_assets (
  id uuid primary key default gen_random_uuid(),
  question_id text not null references public.questions (id) on delete cascade,
  asset_type text not null check (asset_type in ('official_question_crop')),
  source_label text not null,
  official_pdf_url text not null,
  official_pdf_page integer not null check (official_pdf_page > 0),
  crop_box jsonb not null,
  storage_bucket text not null default 'official-question-source-images',
  storage_path text not null,
  content_hash text not null,
  retrieved_at text not null,
  verification_status text not null check (verification_status in ('verified', 'unverified', 'needs_review', 'deprecated')),
  created_at timestamptz not null default now(),
  unique (question_id, storage_bucket, storage_path)
);

create index if not exists question_source_assets_question_id_idx
  on public.question_source_assets (question_id);

alter table public.question_source_assets enable row level security;

create policy "question_source_assets_read_practice_bank" on public.question_source_assets
  for select to anon, authenticated
  using (exists (
    select 1 from public.questions
    where questions.id = question_source_assets.question_id
      and questions.origin in ('official_historic', 'didactic_reviewed')
  ));

insert into storage.buckets (id, name, public)
values ('official-question-source-images', 'official-question-source-images', false)
on conflict (id) do update set public = false;

create policy "official_question_source_images_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'official-question-source-images');
