alter table public.billing_subscriptions
drop constraint if exists billing_subscriptions_plan_key_check;

alter table public.billing_subscriptions
add constraint billing_subscriptions_plan_key_check
check (plan_key in ('free', 'basic', 'pro', 'semester'));
