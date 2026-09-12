create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  track text not null check (track in ('kafka', 'arquitetura')),
  bank text not null check (bank in ('gate', 'simulador')),
  lesson_slug text not null,
  tag text,
  prompt text not null,
  options jsonb not null,
  answer_index integer not null,
  why text not null,
  sort_order integer not null default 0
);

create index if not exists questions_bank_idx
  on public.questions (track, bank, lesson_slug, sort_order);

create table if not exists public.quiz_topics (
  track text not null check (track in ('kafka', 'arquitetura')),
  tag text not null,
  name text not null,
  href text not null,
  primary key (track, tag)
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  visited text[] not null default '{}',
  last_path text,
  gates jsonb not null default '{}'::jsonb,
  quiz jsonb not null default '{}'::jsonb,
  sessions jsonb not null default '{}'::jsonb,
  simulador jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_progress (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.questions enable row level security;
alter table public.quiz_topics enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "authenticated read questions" on public.questions;
create policy "authenticated read questions"
  on public.questions for select to authenticated using (true);

drop policy if exists "authenticated read topics" on public.quiz_topics;
create policy "authenticated read topics"
  on public.quiz_topics for select to authenticated using (true);

drop policy if exists "own progress select" on public.user_progress;
create policy "own progress select"
  on public.user_progress for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "own progress insert" on public.user_progress;
create policy "own progress insert"
  on public.user_progress for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "own progress update" on public.user_progress;
create policy "own progress update"
  on public.user_progress for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.questions, public.quiz_topics, public.user_progress to postgres, service_role;
grant select on table public.questions, public.quiz_topics to authenticated;
grant select, insert, update on table public.user_progress to authenticated;
