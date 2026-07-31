# Phase 0 — Schema, auth & role dashboards

**Status:** Implemented (local)  
**GitHub issue:** [#13](https://github.com/lesash10/la-performance-lab/issues/13)  
**Milestone:** [M0 — Foundations](https://github.com/lesash10/la-performance-lab/milestone/2)  
**Branch:** `issue-13-phase-0-foundations`  
**Plan reference:** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) (schema §7–8, auth §10, routes §22, roles §23)

---

## Goal

Ship an end-to-end auth + roles vertical slice: full Supabase schema, signup/login, role handling (admin promoted manually in Supabase), mock admin and user dashboards.

## Checklist

### 1. Supabase setup + all tables

- [x] Env hygiene: ignore `.env` / `.env.*`; local env for Supabase URL + anon key
- [x] `supabase/migrations` pipeline + remote schema applied
- [x] System enums + core tables (profiles, settings, taxonomy, sessions, rules, occurrences, bookings, histories, audit, email_outbox)
- [x] Profile auto-create trigger on `auth.users` → `role = 'user'`
- [x] Baseline RLS + `is_admin()` / `can_mutate_bookings()`
- [x] Seed `app_settings` + categories/types
- [x] Regenerated `src/integrations/supabase/types.ts`

### 2. Signup & login pages

- [x] React Router wired; landing extracted; prototypes preserved
- [x] Auth provider + session listener
- [x] `/signup`, `/login`, `/logout`
- [x] Forms via `react-hook-form` + `zod`; Incinerate brand
- [x] Toast position top-left
- [x] Visible **Log in** in desktop navbar + mobile menu

### 3. User roles

- [x] App loads `profiles.role`
- [x] Role-aware redirects (`admin` → `/admin`, else `/dashboard`)
- [x] Route guards on `/dashboard` and `/admin`

### 4. Mock dashboards

- [x] `/dashboard` mock for authenticated users
- [x] `/admin` mock for `admin` role
- [x] Prototype routes untouched

## Manual Supabase steps (admin)

After signing up your real account:

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL@example.com';
```

If Auth requires email confirmation and you need to unblock a local test user:

```sql
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'YOUR_EMAIL@example.com';
```

Optional (faster local testing): Supabase Dashboard → Authentication → Providers → Email → disable “Confirm email”.

## Out of scope (later)

- Real booking RPCs, occurrence generator, Resend, Storage
- Full admin CRUD / reporting
- Automated admin bootstrap endpoint
