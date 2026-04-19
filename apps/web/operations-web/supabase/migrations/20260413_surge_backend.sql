create table if not exists public.surge_companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  normalized_name text not null,
  category text not null default 'Other',
  location text not null default '',
  website text not null default '',
  priority text not null default 'med' check (priority in ('high', 'med', 'low')),
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.surge_roles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  company_id uuid not null references public.surge_companies (id) on delete cascade,
  title text not null,
  normalized_title text not null,
  role_type text not null default 'general',
  location text not null default '',
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.surge_applications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  company_id uuid not null references public.surge_companies (id) on delete cascade,
  role_id uuid not null references public.surge_roles (id) on delete cascade,
  source text not null default 'browser' check (source in ('linkedin', 'indeed', 'direct', 'email', 'browser', 'imported', 'other')),
  status text not null default 'lead' check (status in ('lead', 'applied', 'confirmed', 'review', 'recruiter', 'interview', 'offer', 'rejected', 'withdrawn')),
  applied_at date,
  source_url text not null default '',
  location text not null default '',
  compensation text not null default '',
  next_step text not null default '',
  next_step_at date,
  notes text not null default '',
  job_description text not null default '',
  last_signal_at timestamptz not null default timezone('utc', now()),
  workspace jsonb not null default '{}'::jsonb,
  tailoring jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.surge_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  application_id uuid not null references public.surge_applications (id) on delete cascade,
  document_type text not null,
  stage text not null default 'extras' check (stage in ('working', 'final', 'extras')),
  file_name text not null,
  absolute_path text not null default '',
  relative_path text not null default '',
  extension text not null default '',
  tags jsonb not null default '[]'::jsonb,
  source_template text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists idx_surge_companies_owner_normalized
on public.surge_companies (owner_id, normalized_name);

create unique index if not exists idx_surge_roles_owner_company_title
on public.surge_roles (owner_id, company_id, normalized_title);

create unique index if not exists idx_surge_documents_application_relative_path
on public.surge_documents (application_id, relative_path);

create index if not exists idx_surge_applications_owner_updated
on public.surge_applications (owner_id, updated_at desc);

create index if not exists idx_surge_applications_owner_status
on public.surge_applications (owner_id, status, updated_at desc);

create index if not exists idx_surge_roles_company
on public.surge_roles (company_id, updated_at desc);

create index if not exists idx_surge_documents_application
on public.surge_documents (application_id, updated_at desc);

drop trigger if exists surge_companies_set_updated_at on public.surge_companies;
create trigger surge_companies_set_updated_at
before update on public.surge_companies
for each row
execute function public.set_updated_at();

drop trigger if exists surge_roles_set_updated_at on public.surge_roles;
create trigger surge_roles_set_updated_at
before update on public.surge_roles
for each row
execute function public.set_updated_at();

drop trigger if exists surge_applications_set_updated_at on public.surge_applications;
create trigger surge_applications_set_updated_at
before update on public.surge_applications
for each row
execute function public.set_updated_at();

drop trigger if exists surge_documents_set_updated_at on public.surge_documents;
create trigger surge_documents_set_updated_at
before update on public.surge_documents
for each row
execute function public.set_updated_at();

alter table public.surge_companies enable row level security;
alter table public.surge_roles enable row level security;
alter table public.surge_applications enable row level security;
alter table public.surge_documents enable row level security;

drop policy if exists "surge_companies_select_own" on public.surge_companies;
create policy "surge_companies_select_own"
on public.surge_companies
for select
using (owner_id = auth.uid());

drop policy if exists "surge_companies_insert_own" on public.surge_companies;
create policy "surge_companies_insert_own"
on public.surge_companies
for insert
with check (owner_id = auth.uid());

drop policy if exists "surge_companies_update_own" on public.surge_companies;
create policy "surge_companies_update_own"
on public.surge_companies
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "surge_roles_select_own" on public.surge_roles;
create policy "surge_roles_select_own"
on public.surge_roles
for select
using (owner_id = auth.uid());

drop policy if exists "surge_roles_insert_own" on public.surge_roles;
create policy "surge_roles_insert_own"
on public.surge_roles
for insert
with check (owner_id = auth.uid());

drop policy if exists "surge_roles_update_own" on public.surge_roles;
create policy "surge_roles_update_own"
on public.surge_roles
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "surge_applications_select_own" on public.surge_applications;
create policy "surge_applications_select_own"
on public.surge_applications
for select
using (owner_id = auth.uid());

drop policy if exists "surge_applications_insert_own" on public.surge_applications;
create policy "surge_applications_insert_own"
on public.surge_applications
for insert
with check (owner_id = auth.uid());

drop policy if exists "surge_applications_update_own" on public.surge_applications;
create policy "surge_applications_update_own"
on public.surge_applications
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "surge_documents_select_own" on public.surge_documents;
create policy "surge_documents_select_own"
on public.surge_documents
for select
using (owner_id = auth.uid());

drop policy if exists "surge_documents_insert_own" on public.surge_documents;
create policy "surge_documents_insert_own"
on public.surge_documents
for insert
with check (owner_id = auth.uid());

drop policy if exists "surge_documents_update_own" on public.surge_documents;
create policy "surge_documents_update_own"
on public.surge_documents
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "surge_documents_delete_own" on public.surge_documents;
create policy "surge_documents_delete_own"
on public.surge_documents
for delete
using (owner_id = auth.uid());
