create table if not exists public.monitoring_sources (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  url text not null,
  source_type text not null,
  keywords text[] not null default '{}',
  verification_status text not null check (verification_status in ('verified', 'unverified', 'needs_review', 'deprecated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.monitoring_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.monitoring_sources (id) on delete cascade,
  checked_at timestamptz not null default now(),
  content_hash text not null,
  keyword_hits text[] not null default '{}',
  check_status text not null check (check_status in ('baseline', 'unchanged', 'changed', 'error')),
  error_message text not null default ''
);

create table if not exists public.monitoring_events (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.monitoring_sources (id) on delete cascade,
  snapshot_id uuid references public.monitoring_snapshots (id) on delete set null,
  detected_at timestamptz not null default now(),
  event_type text not null default 'generic_change',
  keyword_hits text[] not null default '{}',
  requires_review boolean not null default true,
  resolved boolean not null default false,
  verification_status text not null default 'needs_review' check (verification_status in ('verified', 'unverified', 'needs_review', 'deprecated'))
);

alter table public.monitoring_sources enable row level security;
alter table public.monitoring_snapshots enable row level security;
alter table public.monitoring_events enable row level security;

create policy "monitoring_sources_own" on public.monitoring_sources for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "monitoring_snapshots_own" on public.monitoring_snapshots for all to authenticated using (exists (select 1 from public.monitoring_sources where monitoring_sources.id = monitoring_snapshots.source_id and monitoring_sources.user_id = auth.uid())) with check (exists (select 1 from public.monitoring_sources where monitoring_sources.id = monitoring_snapshots.source_id and monitoring_sources.user_id = auth.uid()));
create policy "monitoring_events_own" on public.monitoring_events for all to authenticated using (exists (select 1 from public.monitoring_sources where monitoring_sources.id = monitoring_events.source_id and monitoring_sources.user_id = auth.uid())) with check (exists (select 1 from public.monitoring_sources where monitoring_sources.id = monitoring_events.source_id and monitoring_sources.user_id = auth.uid()));
