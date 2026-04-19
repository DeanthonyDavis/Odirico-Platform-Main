create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'qa', 'designer', 'viewer')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create or replace function public.sync_profile_from_auth(
  target_user_id uuid,
  target_email text,
  target_user_meta jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
begin
  derived_name := coalesce(
    nullif(trim(target_user_meta ->> 'full_name'), ''),
    nullif(trim(target_user_meta ->> 'name'), ''),
    nullif(trim(split_part(coalesce(target_email, ''), '@', 1)), ''),
    'New user'
  );

  insert into public.profiles (id, full_name, role)
  values (target_user_id, derived_name, 'viewer')
  on conflict (id) do update
  set full_name = case
    when public.profiles.full_name is null or btrim(public.profiles.full_name) = '' then excluded.full_name
    else public.profiles.full_name
  end;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.sync_profile_from_auth(
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data, '{}'::jsonb)
  );

  return new;
exception
  when others then
    raise warning 'handle_new_user failed for auth user %: %', new.id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
