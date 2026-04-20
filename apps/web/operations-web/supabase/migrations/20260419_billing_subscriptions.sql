create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  stripe_price_id text,
  plan_key text not null default 'free' check (plan_key in ('free', 'pro', 'semester')),
  status text not null check (
    status in (
      'trialing',
      'active',
      'past_due',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'unpaid',
      'paused'
    )
  ),
  cancel_at_period_end boolean not null default false,
  current_period_start timestamptz,
  current_period_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_billing_customers_stripe_customer_id
on public.billing_customers (stripe_customer_id);

create index if not exists idx_billing_subscriptions_user_id_status
on public.billing_subscriptions (user_id, status);

create index if not exists idx_billing_subscriptions_customer_id
on public.billing_subscriptions (stripe_customer_id);

drop trigger if exists billing_customers_set_updated_at on public.billing_customers;
create trigger billing_customers_set_updated_at
before update on public.billing_customers
for each row
execute function public.set_updated_at();

drop trigger if exists billing_subscriptions_set_updated_at on public.billing_subscriptions;
create trigger billing_subscriptions_set_updated_at
before update on public.billing_subscriptions
for each row
execute function public.set_updated_at();

alter table public.billing_customers enable row level security;
alter table public.billing_subscriptions enable row level security;

drop policy if exists "billing_customers_select_own_or_admin" on public.billing_customers;
create policy "billing_customers_select_own_or_admin"
on public.billing_customers
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "billing_customers_update_own_or_admin" on public.billing_customers;
create policy "billing_customers_update_own_or_admin"
on public.billing_customers
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "billing_subscriptions_select_own_or_admin" on public.billing_subscriptions;
create policy "billing_subscriptions_select_own_or_admin"
on public.billing_subscriptions
for select
using (user_id = auth.uid() or public.is_admin());
