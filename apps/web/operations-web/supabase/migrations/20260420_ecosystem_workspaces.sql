create table if not exists public.ecosystem_workspaces (
  user_id uuid not null references auth.users (id) on delete cascade,
  app_key text not null check (app_key in ('ember', 'sol')),
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, app_key)
);

drop trigger if exists ecosystem_workspaces_set_updated_at on public.ecosystem_workspaces;
create trigger ecosystem_workspaces_set_updated_at
before update on public.ecosystem_workspaces
for each row
execute function public.set_updated_at();

alter table public.ecosystem_workspaces enable row level security;

drop policy if exists "ecosystem_workspaces_select_self_or_admin" on public.ecosystem_workspaces;
create policy "ecosystem_workspaces_select_self_or_admin"
on public.ecosystem_workspaces
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "ecosystem_workspaces_insert_self_or_admin" on public.ecosystem_workspaces;
create policy "ecosystem_workspaces_insert_self_or_admin"
on public.ecosystem_workspaces
for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "ecosystem_workspaces_update_self_or_admin" on public.ecosystem_workspaces;
create policy "ecosystem_workspaces_update_self_or_admin"
on public.ecosystem_workspaces
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());
