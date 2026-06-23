create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  timezone text not null,
  study_start_time text not null,
  deep_work_minutes integer not null,
  practice_minutes integer not null,
  review_minutes integer not null,
  workday_start_time text not null,
  workday_end_time text not null,
  reminders_enabled boolean not null default false,
  reminder_channel text not null default 'in_app',
  morning_reminder_time text,
  evening_reminder_time text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminder_channel_in_app_only check (reminder_channel = 'in_app')
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_settings_updated_at on public.user_settings;

create trigger set_user_settings_updated_at
before update on public.user_settings
for each row
execute function public.set_updated_at();

alter table public.user_settings enable row level security;

create policy "user_settings_select_own"
on public.user_settings
for select
to authenticated
using (auth.uid() = user_id);

create policy "user_settings_insert_own"
on public.user_settings
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "user_settings_update_own"
on public.user_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
