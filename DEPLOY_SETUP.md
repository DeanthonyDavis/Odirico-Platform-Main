# Odirico Platform Deploy Setup

## Canonical publish repo

Use this folder as the deploy repo:

- `D:\Odirico\publish\Odirico-platform-main`

This repo includes:

- `apps/web/operations-web`
- `packages/core`
- `packages/auth`
- `packages/api`

This single deploy now serves:

- the public website at `/`, `/about`, `/expertise`, `/products`, `/sectors`, `/contact`, and `/capability`
- the platform shell and app routes at `/dashboard`, `/ember`, `/sol`, `/surge`, `/billing`, and `/settings`

## 1. Create the GitHub repo

Create an empty GitHub repository with no README, no license, and no `.gitignore`.

Recommended name:

- `odirico-platform-main`

## 2. Push this repo

From this folder:

```powershell
cd D:\Odirico\publish\Odirico-platform-main
git add .
git commit -m "Initial Odirico platform app"
git remote add origin https://github.com/<your-user-or-org>/odirico-platform-main.git
git push -u origin main
```

## 3. Create the Supabase project

Create one Supabase project for the platform app.

Then open SQL Editor and run:

- `apps/web/operations-web/supabase/migrations/20260402_initial_schema.sql`

## 4. Create the first user

In Supabase:

- go to `Authentication -> Users`
- create your first email/password user manually
- copy that user UUID

## 5. Promote the first user to admin

Run this in the Supabase SQL Editor after creating the first user.

Replace:

- `YOUR_EMAIL_HERE`
- `YOUR_NAME_HERE`

```sql
update auth.users
set
  raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
    'roles', jsonb_build_array('admin', 'pm'),
    'teams', jsonb_build_array('Alpha'),
    'display_name', 'YOUR_NAME_HERE'
  ),
  raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'full_name', 'YOUR_NAME_HERE'
  )
where email = 'YOUR_EMAIL_HERE';

insert into public.profiles (id, full_name, role)
select id, 'YOUR_NAME_HERE', 'admin'
from auth.users
where email = 'YOUR_EMAIL_HERE'
on conflict (id) do update
set
  full_name = excluded.full_name,
  role = excluded.role;
```

## 6. Configure Supabase auth URLs

In Supabase:

- go to `Authentication -> URL Configuration`

Set:

- `Site URL` = your production app URL

Add Redirect URLs:

- `https://your-project.vercel.app/**`
- `https://your-domain.com/**`
- `http://localhost:3000/**`

## 7. Create the Vercel project

Import the GitHub repo into Vercel.

Important setting:

- `Root Directory` = `apps/web/operations-web`

## 8. Add Vercel environment variables

Required:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOWED_ORIGINS`
- `NEXT_PUBLIC_ENABLE_DEMO_AUTH`

Optional:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_DSN`

Recommended first production values:

```text
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
ALLOWED_ORIGINS=https://your-project.vercel.app
NEXT_PUBLIC_ENABLE_DEMO_AUTH=false
```

If you add a custom domain later, update:

- `NEXT_PUBLIC_APP_URL`
- `ALLOWED_ORIGINS`
- Supabase `Site URL`
- Supabase Redirect URLs

## 9. Where each value comes from

In Supabase `Settings -> API`:

- `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
- `Publishable key` -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `service_role secret` -> `SUPABASE_SERVICE_ROLE_KEY`

## 10. First login

After deploy:

1. open `/login`
2. sign in with the email/password user you created in Supabase
3. go to `/settings`
4. manage additional users and roles from there

## Notes

- The app currently supports email/password login cleanly.
- The `/callback` route is in place for OAuth work, but Google sign-in is not fully wired in the login UI yet.
- Upstash is optional; if omitted, rate limiting safely falls back to permissive mode.
