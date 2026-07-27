# Implementation Plan — Backend, Auth & Dashboards

**Status:** Planning only — no application code in this document  
**Product:** Single-business personal training booking app (Alex Carter / current landing brand)  
**Stack:** Vite + React SPA · Supabase Auth · PostgreSQL · RLS · Edge Functions · Storage · Resend  
**Timezone:** `America/Los_Angeles` (store UTC, display LA)  
**Payments:** In person only · manual admin tracking · no Stripe

---

## 1. Goals

Build a production-ready booking backend and role-based dashboards on top of the existing Vite SPA:

- Public browsing of schedule and sessions without an account
- Auth-required booking requests (no guest bookings)
- Client dashboard for booking management
- Admin dashboard for sessions, availability, bookings, clients, reporting, settings, and audit logs
- Append-only history for logins, sessions, bookings, roles, and admin actions
- Email notifications via Edge Functions + Resend
- Media via Supabase Storage
- Configurable business/coach settings so this codebase can later be reused for other LANQAR clients **without** building multi-tenant SaaS in v1

---

## 2. Current-app assessment

### What exists today

| Area | State |
|------|--------|
| Framework | Vite 7 + React 19 SPA |
| Routing | Manual pathname switch in `src/App.tsx` (no React Router) |
| UI | shadcn/ui (new-york), Tailwind v4, Framer Motion, Sonner toasts |
| Forms | `react-hook-form` + `zod` |
| Landing | Full branded marketing page with mock availability + booking form |
| Booking | Local-only success toast; no persistence |
| Supabase | Client scaffolded (`src/integrations/supabase/*`); schema empty (`Tables: never`) |
| Auth / dashboards | None |
| Prototype routes | `/trident`, `/kalos`, etc. — **out of scope**; leave untouched |

### Brand / visual baseline (preserve)

Current landing tokens in `src/styles.css`:

- Background: near-black charcoal `oklch(0.12 …)`
- Accent / flame: warm copper-orange `#D67119` / `oklch(0.68 0.16 55)`
- Text: off-white primary, muted gray secondary
- Fonts: **Unbounded** (display), **Manrope** (body)
- Surfaces: elevated charcoal cards, subtle borders, grain overlays
- Tone: elite, direct, performance-focused

Coach/business copy currently hard-coded on the landing should move toward **settings-driven identity** over time. Do **not** redesign the landing for v1; only add small hooks for auth, schedule, and real booking.

### Gaps to close before feature work

1. Add `.env` / `.env.*` to `.gitignore` (currently missing — secrets risk)
2. Introduce a real client router (recommend `react-router-dom`)
3. Create Supabase migrations, RLS, RPCs, Edge Functions
4. Never ship or import `client.server.ts` service-role usage into the browser
5. Regenerate `src/integrations/supabase/types.ts` after schema lands

---

## 3. Architecture overview

```text
┌─────────────────────────────────────────────────────────────┐
│  Vite React SPA (browser)                                   │
│  · Public marketing + /schedule + /book                     │
│  · Auth pages                                               │
│  · /client/*  · /admin/*                                    │
│  · supabase-js (anon key only)                              │
└───────────────┬─────────────────────────────┬───────────────┘
                │ RLS-scoped queries          │ invoke
                ▼                             ▼
┌───────────────────────────┐   ┌─────────────────────────────┐
│  Supabase Postgres        │   │  Edge Functions             │
│  · tables + enums         │◄──│  · privileged workflows     │
│  · RLS policies           │   │  · Resend emails            │
│  · RPCs / SECURITY DEFINER│   │  · occurrence generation    │
│  · triggers / audit       │   │  · auth/login logging       │
│  · Storage + Storage RLS  │   └──────────────┬──────────────┘
└───────────────────────────┘                  │
                                               ▼
                                    ┌─────────────────────┐
                                    │  Resend             │
                                    └─────────────────────┘
```

### Principles

1. **SPA stays SPA** — no Next.js migration.
2. **Anon key only in frontend** — privileged work via RLS-safe RPCs or Edge Functions using the service role **only on the server**.
3. **Database is source of truth** for capacity, roles, statuses, and history.
4. **Settings row(s)** hold coach/business/branding/ops config — avoid hardcoding Alex-specific rules in business logic.
5. **Single business, single coach, single admin in v1** — schema stays normalized and future-friendly, but no `business_id` filtering, workspaces, or multi-tenant RLS yet.

---

## 4. Future-client reuse strategy (not multi-tenant)

v1 is one deployment = one business. Reuse for the next LANQAR client should be **project duplication + configuration**, not runtime multi-tenancy.

### Make configurable in v1

| Area | Storage |
|------|---------|
| Business name, coach name, contact email, phone | `app_settings` |
| Default location, business hours, social links | `app_settings` |
| Timezone (fixed LA now, still stored) | `app_settings` |
| Cancellation deadline + booking cutoff hours | `app_settings` |
| Booking confirmation copy / public messages | `app_settings` |
| Logo / branding assets (`logo_storage_path`), accent tokens, hero media | `app_settings` + Storage |
| Session categories, types, definitions, prices | DB tables |
| Default location (text in v1) | `app_settings` + session fields |
| Email template subjects/bodies (keys + markdown/HTML) | `email_templates` or settings JSON |
| Admin bootstrap email | seed / env `ADMIN_BOOTSTRAP_EMAIL` |

### Explicitly not in v1

- Multiple businesses in one DB
- Workspace switching
- Cross-business RLS
- Shared auth across prototypes
- Multiple coaches

### Future architectural path (document only)

Later, introduce `businesses` / `coaches`, add nullable `business_id` FKs, scope RLS by membership, and fork email/branding per business. Because v1 keeps identity in settings and avoids embedding coach names in RPC logic, that migration stays additive rather than a rewrite.

---

## 5. Recommended technical decisions (open items closed)

| Topic | Recommendation | Why |
|-------|----------------|-----|
| Router | Add `react-router-dom` | Current pathname switch will not scale to nested admin/client routes |
| Session taxonomy | **Tables** for `session_categories` + `session_types` (never enums) | Admin must create/rename freely |
| Session layering | **Definition (`sessions`) → rules → occurrences** | Avoid one oversized table; clear ownership of each concern |
| Recurrence format | **Normalized columns + exceptions table** (not RRULE string, not opaque JSONB) | Best fit for admin UI, SQL validation, and Supabase RPCs — see §9 |
| Occurrence strategy | **Hybrid: materialize ahead + regenerate on rule change** | Book against concrete rows; keep horizon bounded |
| Generation horizon | Rolling **12 weeks** ahead; nightly cron + on-rule-save | Simple ops; avoid infinite rows |
| Capacity | `booked_count` maintained by trigger + `CHECK` + RPC `SELECT … FOR UPDATE` | Prevents race overbooking |
| Role upgrade | DB trigger on booking insert: `user` → `client` | Cannot be bypassed by client |
| Audit | Dedicated domain history tables + `audit_events` + triggers | Frontend logging alone is insufficient |
| Auth emails (reset) | Supabase Auth templates + custom app pages | Standard |
| Transactional emails | Edge Function + Resend | Keeps secrets server-side |
| Login history | Supabase Auth Hook → Edge Function → `login_events` | Realistic given Auth limitations — see §16 |
| Rejection vs ban | `account_status` for rejection; `is_banned` for soft ban | Separate concepts, separate UX |
| Payment | Status `unpaid`/`paid`/`waived` + method `cash`/`card_in_person`/`other` | “In person” is a method context, not a status |
| Media fields | Store `*_storage_path` only; resolve URLs at runtime | Avoid stale permanent URLs |
| Locations in v1 | **Plain text** on sessions/occurrences | Indoor/outdoor without extra tables; dedicated `locations` is a future improvement |
| IP in login history | Hash or truncate; never show raw IP in client UI | Privacy |

---

## 6. Domain model overview

Three-layer session model (do **not** collapse into one table):

```text
session_categories          ← admin CRUD taxonomy
        │
session_types               ← admin CRUD offerings templates (One-on-One, Group, …)
        │
sessions                    ← reusable session definitions / offerings
        │                     (title, price, location, active_from/until, …)
        ├── availability_rules + availability_exceptions
        │         │
        └── session_occurrences   ← concrete bookable slots (generated or one-off)
                    │
                 bookings

auth.users 1──1 profiles
profiles 1──* bookings
profiles 1──* login_events / role history / moderation history

app_settings (singleton)
email_templates / email_outbox
audit_events
storage: paths only in DB; buckets for avatars, coach, session, site media
```

**Bookable unit for clients:** always a `session_occurrences` row.  
**Admin editing a series:** edit `availability_rules` / exceptions.  
**Admin editing one date:** edit or detach that `session_occurrences` row.

---

## 7. Enums and controlled system values

Use Postgres enums (or check-constrained text) **only** for true system workflows.  
Do **not** enum anything the admin should create or rename.

### Allowed system enums

```sql
-- roles (system)
user_role: 'user' | 'client' | 'admin'

-- account rejection (system; ban is separate boolean — see profiles)
account_status: 'active' | 'rejected'

-- occurrence lifecycle (system)
session_occurrence_status:
  'scheduled' | 'cancelled' | 'completed' | 'blocked'

-- booking lifecycle (system)
booking_status:
  'pending' | 'confirmed' | 'completed'
  | 'cancelled_by_client' | 'cancelled_by_admin'
  | 'rejected' | 'no_show'

-- payment (system) — whether money was settled; NOT “on-premises”
payment_status: 'unpaid' | 'paid' | 'waived'

-- how it was paid when status = paid (nullable until recorded)
payment_method: 'cash' | 'card_in_person' | 'other'

-- availability (system)
availability_rule_mode: 'date_range' | 'ongoing'
availability_exception_type: 'cancel' | 'modify' | 'block'

-- moderation history actions (system)
moderation_action:
  'rejected' | 'unrejected' | 'banned' | 'unbanned'

-- audit
actor_type: 'user' | 'admin' | 'system' | 'edge_function'
-- audit_action: text codes (see §15), not a rigid enum list
```

### Must be tables / free text (never enums)

- Session categories
- Session types
- Session titles / descriptions
- Locations (text in v1)
- Coach-editable business copy and branding content

### Active booking definition (capacity + duplicates)

Treat these as **active** (consume a slot / block duplicate booking):

- `pending`
- `confirmed`

Non-active (free the slot for live capacity):

- `cancelled_by_client`, `cancelled_by_admin`, `rejected`, `no_show`, `completed`  
  Count only `pending` + `confirmed` toward live `booked_count`.
---

## 8. Database schema

Money stored as integer cents (`*_cents` / `base_price_cents` / `price_cents` / `amount_paid_cents`) unless noted. Timestamps are `timestamptz` in **UTC**; UI displays `America/Los_Angeles`.

### 8.1 `profiles`

Extends `auth.users` 1:1. Do **not** store passwords or duplicate Auth credentials. Email remains in Auth; mirror to profile for admin convenience if desired.

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK = `auth.users.id` | |
| `email` | `text` not null | synced from auth on create/update |
| `first_name` | `text` | |
| `last_name` | `text` | |
| `display_name` | `text` | optional public/friendly name |
| `avatar_storage_path` | `text` | Storage path only — resolve URL at runtime |
| `phone_country_code` | `text` | e.g. `+1` |
| `phone_number` | `text` | national number without forcing a single combined field |
| `address_line_1` | `text` | optional in v1 UI |
| `address_line_2` | `text` | optional |
| `city` | `text` | optional |
| `state_or_region` | `text` | optional |
| `postal_code` | `text` | optional |
| `country_code` | `text` | optional ISO 3166-1 alpha-2 |
| `role` | `user_role` not null default `'user'` | |
| `account_status` | `account_status` not null default `'active'` | `active` \| `rejected` |
| `rejection_reason` | `text` | when rejected |
| `rejected_at` | `timestamptz` | |
| `rejected_by` | `uuid` → profiles | |
| `is_banned` | `boolean` not null default `false` | soft ban flag |
| `ban_reason` | `text` | current ban |
| `banned_at` | `timestamptz` | |
| `banned_by` | `uuid` → profiles | |
| `created_at` / `updated_at` | `timestamptz` | |

Indexes: `role`, `account_status`, `is_banned`, `(role, account_status, is_banned)`, `email` unique.

**Booking lock rule:** deny booking mutations when `account_status <> 'active'` **or** `is_banned = true`.

### 8.2 `app_settings` (singleton)

One row (`id = 1` enforced by check).

- Identity: `business_name`, `coach_name`, `contact_email`, `contact_phone`
- Ops: `timezone` (default `America/Los_Angeles`), `default_location` (text), `cancellation_deadline_hours` (default `24`), `booking_cutoff_hours` (recommend default **2**)
- Copy: `booking_request_message`, `confirmation_public_message`, `contact_instructions_after_cutoff`
- Branding: `logo_storage_path`, `accent_color`, `social_links` jsonb, `business_hours` jsonb
- Admin notify: `admin_notification_email`
- Meta: `bootstrap_completed` boolean

Public read of non-sensitive settings via view/RLS; writes admin-only. Prefer settings over hardcoding Alex-specific values in RPC logic.

### 8.3 `session_categories` (admin CRUD)

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `name` | text not null | |
| `slug` | text not null unique | URL-safe; unique |
| `description` | text | |
| `is_active` | boolean not null default true | archive/deactivate without delete |
| `sort_order` | int not null default 0 | admin reorder |
| `created_at` / `updated_at` | timestamptz | |
| `created_by` / `updated_by` | uuid → profiles | |

**Deletion behavior:** hard delete **only when unused** (no `session_types` reference it). Enforce with `ON DELETE RESTRICT` FK from `session_types.category_id`. Prefer deactivate (`is_active = false`) in the UI.

**Seed examples (templates only):** Personal Training, Strength Training, Conditioning, Mobility, Recovery, Assessment, Consultation.

### 8.4 `session_types` (admin CRUD — never an enum)

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `category_id` | uuid not null FK → `session_categories` | `ON DELETE RESTRICT` |
| `name` | text not null | |
| `slug` | text not null unique | |
| `description` | text | |
| `base_price_cents` | int not null check >= 0 | |
| `default_duration_minutes` | int not null check > 0 | |
| `default_max_slots` | int not null check > 0 | |
| `default_location` | text | free text in v1 |
| `image_storage_path` | text | path only |
| `is_active` | boolean not null default true | |
| `created_at` / `updated_at` | timestamptz | |
| `created_by` / `updated_by` | uuid → profiles | |

**Deletion behavior:** `ON DELETE RESTRICT` from `sessions.session_type_id`. Soft-deactivate when referenced. Admin may create additional types beyond seeds.

**Seed examples (templates only):** One-on-One, Group, Workshop, Consultation.

Indexes: `(category_id)`, `(is_active)`, `(slug)`.

### 8.5 `sessions` (reusable definitions / offerings)

This is the **session definition** layer — not the bookable calendar row.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `session_type_id` | uuid not null FK → `session_types` | `ON DELETE RESTRICT` |
| `title` | text not null | |
| `description` | text | |
| `max_slots` | int not null check > 0 | default capacity for generated occurrences |
| `price_cents` | int not null check >= 0 | |
| `currency` | text not null default `'USD'` | |
| `location` | text | free text (indoor/outdoor/address blurb) |
| `image_storage_path` | text | |
| `is_active` | boolean not null default true | |
| `active_from` | date null | optional offering window (LA calendar date) |
| `active_until` | date null | null = no end; generator respects this |
| `created_at` / `updated_at` | timestamptz | |
| `created_by` / `updated_by` | uuid → profiles | |

Indexes: `(session_type_id)`, `(is_active)`, `(active_from, active_until)`.

**Deletion behavior:** prefer deactivate. If hard delete needed later, restrict while rules/occurrences/bookings exist.

### 8.6 `availability_rules` (normalized recurrence — see §9)

Belongs to a `sessions` definition.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `session_id` | uuid not null FK → `sessions` | |
| `mode` | `availability_rule_mode` | `date_range` \| `ongoing` |
| `starts_on` | date not null | LA calendar date |
| `ends_on` | date null | required conceptually for `date_range`; null when `ongoing` |
| `days_of_week` | `smallint[]` not null | `0=Sun … 6=Sat` (document in code comments) |
| `start_time_local` | `time` not null | LA wall clock |
| `duration_minutes` | int not null check > 0 | |
| `max_slots` | int null | override session default when set |
| `price_cents` | int null | override when set |
| `location` | text null | override when set |
| `booking_cutoff_hours` | int null | override app default when set |
| `cancellation_deadline_hours` | int null | override app default when set |
| `is_active` | boolean not null default true | |
| `created_by` / `updated_by` | uuid | |
| `created_at` / `updated_at` | timestamptz | |

Checks: `ends_on IS NULL OR ends_on >= starts_on`; `days_of_week` non-empty; values 0–6.

**One-off sessions:** create a `sessions` row (or reuse one) and insert a single `session_occurrences` row with `availability_rule_id` null — do **not** force a fake recurrence rule.

### 8.7 `availability_exceptions`

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `availability_rule_id` | uuid not null FK → `availability_rules` ON DELETE CASCADE | |
| `exception_date` | date not null | LA date |
| `exception_type` | `availability_exception_type` | `cancel` \| `modify` \| `block` |
| `start_time_local` | time null | for `modify` |
| `duration_minutes` | int null | |
| `max_slots` | int null | |
| `price_cents` | int null | |
| `location` | text null | |
| `reason` | text | |
| `created_by` | uuid | |
| `created_at` | timestamptz | |

Unique `(availability_rule_id, exception_date)`.

### 8.8 `session_occurrences` (bookable units)

Materialized scheduled (or one-off) slots. Clients book these rows only.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `session_id` | uuid not null FK → `sessions` | |
| `session_type_id` | uuid not null FK → `session_types` | denormalized for simpler public queries; keep in sync via trigger |
| `availability_rule_id` | uuid null FK → `availability_rules` | null = one-off |
| `detached_from_rule` | boolean not null default false | true after single-occurrence edit; regenerator skips |
| `title` | text not null | may override definition |
| `description` | text | optional override |
| `starts_at` | timestamptz not null | UTC |
| `ends_at` | timestamptz not null | UTC |
| `max_slots` | int not null | effective capacity (override allowed) |
| `booked_count` | int not null default 0 | maintained by trigger |
| `price_cents` | int not null | effective price (override allowed) |
| `currency` | text not null default `'USD'` | |
| `location` | text | override allowed |
| `image_storage_path` | text null | optional override |
| `status` | `session_occurrence_status` not null default `'scheduled'` | |
| `cancellation_reason` | text | |
| `cancelled_at` | timestamptz | |
| `cancelled_by` | uuid | |
| `is_active` | boolean not null default true | soft hide from public |
| `created_at` / `updated_at` | timestamptz | |
| `created_by` / `updated_by` | uuid | |

Constraints:

- `CHECK (booked_count >= 0 AND booked_count <= max_slots)`
- `CHECK (ends_at > starts_at)`
- Partial unique: `(availability_rule_id, starts_at)` WHERE `availability_rule_id IS NOT NULL` — prevent duplicate generation

Indexes: `(starts_at)`, `(status, starts_at)`, `(session_id, starts_at)`, `(session_type_id, starts_at)`, `(is_active, status, starts_at)`.

**Deletion behavior:** no hard delete of occurrences with bookings. Cancel instead (`status = cancelled` + reason).

### 8.9 `bookings`

New requests always start as **`pending`** (Alex confirms personally within ~24 hours). Never permanently delete bookings.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `session_occurrence_id` | uuid not null FK → `session_occurrences` | |
| `user_id` | uuid not null FK → profiles | |
| `status` | `booking_status` not null default `'pending'` | |
| `price_snapshot_cents` | int not null | frozen agreed price |
| `currency` | text not null default `'USD'` | |
| `goal` | text | from booking form |
| `client_note` | text | |
| `admin_note` | text | internal |
| `cancel_reason` | text | |
| `cancelled_at` | timestamptz | |
| `cancelled_by` | uuid | client or admin actor |
| `confirmed_at` | timestamptz | |
| `confirmed_by` | uuid | admin |
| `rejected_at` | timestamptz | |
| `rejected_by` | uuid | |
| `rejection_reason` | text | |
| `completed_at` | timestamptz | |
| `no_show_marked_at` | timestamptz | |
| `created_by_admin` | boolean not null default false | manual admin-created booking |
| `created_by` | uuid null | admin actor when manual |
| `payment_status` | `payment_status` not null default `'unpaid'` | |
| `payment_method` | `payment_method` null | set when recording payment |
| `amount_paid_cents` | int null | |
| `paid_at` | timestamptz null | |
| `payment_note` | text | admin only |
| `payment_updated_by` | uuid null | |
| `created_at` / `updated_at` | timestamptz | |

Constraints / indexes:

- **Partial unique index:** one active booking per user+occurrence  
  `UNIQUE (user_id, session_occurrence_id) WHERE status IN ('pending','confirmed')`
- Indexes on `status`, `user_id`, `session_occurrence_id`, `created_at`, `payment_status`

### 8.10 History tables (append-only)

#### `login_events`

| Column | Notes |
|--------|--------|
| `id`, `user_id` nullable | failed attempts may lack user |
| `email_attempted` | for failures |
| `succeeded` | boolean |
| `auth_method` | e.g. `password`, `recovery` |
| `user_agent` | text |
| `ip_hash` | text nullable |
| `created_at` | |

No client UPDATE/DELETE. Admin read-only.

#### `session_history`

Covers definition (`sessions`) create/update/activate window changes: `session_id`, `action`, `changed_fields` jsonb, `actor_id`, `created_at`.

#### `session_occurrence_history`

Occurrence create/update/cancel/capacity/price/location/time changes: `occurrence_id`, `action`, `changed_fields` jsonb, `actor_id`, `created_at`.

#### `booking_history`

Every meaningful status/payment change: `booking_id`, `from_status`, `to_status`, `payload` jsonb (reasons, payment fields), `actor_id`, `actor_type`, `created_at`.

#### `user_role_history`

Signup (`null` → `user`), `user` → `client`, admin assignment/demotion: `previous_role`, `new_role`, `actor_id`, `reason`, `created_at`.

#### `user_moderation_history`

Append-only: `action` (`moderation_action`), `reason`, `previous_status` / `new_status` (or previous/new ban flags in jsonb), `actor_id` (admin), `created_at`.

#### `session_type_history` / `session_category_history`

Create/update/activate/deactivate/image/reorder changes.

#### `settings_history` (recommended)

Snapshot or diff of `app_settings` on each admin save.

#### `audit_events` (general admin actions)

| Column | Type |
|--------|------|
| `id` | uuid |
| `actor_id` | uuid null |
| `actor_type` | `actor_type` |
| `action` | text |
| `entity_type` | text |
| `entity_id` | uuid null |
| `metadata` | jsonb |
| `created_at` | timestamptz |

**Immutability:** no UPDATE/DELETE for authenticated roles on history tables; INSERT only via triggers / security definer functions / service role.

### 8.11 `email_outbox` (recommended)

`to_email`, `template_key`, `payload`, `status` (`pending`/`sent`/`failed`), `provider_id`, `error`, `idempotency_key`, `created_at`.

### 8.12 Locations (v1 vs future)

**v1:** `location` remains **text** on `session_types`, `sessions`, rules, and occurrences (Alex does indoor + outdoor coaching without needing a location entity).

**Future improvement:** a dedicated `locations` table (name, address, indoor/outdoor flag, map link, `is_active`) referenced by FK. Mention only; do not build in v1.

### 8.13 Relationships (ER sketch)

```text
session_categories 1──* session_types 1──* sessions
                                              │
                    availability_rules *──────┤
                         │                    │
              availability_exceptions         │
                         │                    │
                         └──► session_occurrences ◄──* bookings *──1 profiles

profiles 1──* login_events | user_role_history | user_moderation_history
bookings 1──* booking_history
sessions 1──* session_history
session_occurrences 1──* session_occurrence_history
```

### 8.14 Deletion summary

| Entity | Preferred | Hard delete |
|--------|-----------|-------------|
| Category | deactivate | only if no session_types (RESTRICT) |
| Session type | deactivate | only if no sessions (RESTRICT) |
| Session definition | deactivate | restrict if rules/occurrences/bookings |
| Occurrence | cancel | never if bookings exist |
| Booking | status change | **never** |
| User | moderation flags | **never** (no Auth disable in normal flows) |
---

## 9. Recurring availability & occurrence handling

### 9.1 Recurrence format comparison

| Approach | Pros | Cons | Verdict for v1 |
|----------|------|------|----------------|
| **RFC 5545 RRULE** (single text field) | Compact; standard; libraries exist | Hard for admin UI; timezone edge cases; weak SQL constraints; painful partial edits | Reject for v1 |
| **Structured JSONB** blob | Flexible | Weak DB validation; easy to drift schema; harder indexes/checks | Reject as primary model |
| **Normalized columns + exceptions table** | Maps 1:1 to admin forms; CHECK constraints; clear exceptions; easy generator | Slightly more tables | **Choose this** |

**Chosen design:** normalized `availability_rules` + `availability_exceptions` (fields in §8.6–8.7). No unexplained `recurrence_rule` text field.

Supports: days of week, start time, duration, start date, optional end date, ongoing mode, per-rule cutoff/cancellation overrides, date exceptions, blocked dates, cancel/modify one date, and single-occurrence edits via `detached_from_rule`.

### 9.2 Occurrence generation strategy (resolved)

**Hybrid — materialize ahead of time, with refresh triggers:**

1. **Primary:** generate `session_occurrences` for a rolling **12-week** horizon when a rule is created/updated and via a **daily cron** Edge Function.
2. **On demand (admin only):** “Generate further” / open calendar beyond horizon may call the same generator for an extended window — still writes rows, does not book against virtual slots.
3. **Not used for booking:** pure on-the-fly expansion at query time (no row to lock, weak audit/capacity).

**Why hybrid wins:** booking concurrency needs real rows; a bounded horizon keeps the table small; cron + on-save keeps the calendar filled without infinite generation.

### 9.3 Generator behavior

1. Admin creates `sessions` definition, then `availability_rules` (+ exceptions).
2. Generator expands rules into `session_occurrences` within horizon, respecting `sessions.active_from` / `active_until`, rule mode/dates, and exceptions.
3. Exception `cancel` / `block` → skip or mark blocked; `modify` → generate with overrides.
4. On rule edit:
   - Future occurrences with `booked_count = 0` and `detached_from_rule = false`: update or replace safely
   - Occurrences with bookings: **do not** auto-destroy; admin cancels/edits individually
5. Single occurrence cancel → `status = cancelled` + reason/datetime/actor; require active bookings to be handled first (RPC).
6. Edit one occurrence without changing the series → update that row; set `detached_from_rule = true` so regenerator skips it.

### 9.4 Public availability query

Return occurrences where:

- `status = 'scheduled'`
- `is_active = true`
- parent `sessions.is_active` and within active window
- parent `session_types.is_active`
- `starts_at > now() + effective_booking_cutoff`
- `booked_count < max_slots`
- user not considering already-held active booking (UI)
---

## 10. Authentication lifecycle

1. Visitor browses `/`, `/schedule`, public session details.
2. On book CTA → if anonymous, redirect to `/login` or `/signup` with `redirect` query back to `/book/:sessionId`.
3. Signup via Supabase Auth email/password (v1).
4. Trigger `on_auth_user_created` → insert `profiles` with `role = user`, `account_status = active`, `is_banned = false`, write `user_role_history`.
5. Login attempts → Auth Hook → `login_events` (see §16 for limitations).
6. Forgot / reset password via Supabase + `/forgot-password`, `/reset-password` pages.
7. Logout clears session → `/logout` then redirect home.
8. Profile edit on `/profile` (names, phone parts, optional address, avatar). Email change via Supabase Auth flows if enabled.

### Role transitions

| Event | Result |
|-------|--------|
| Signup | `user` |
| First booking insert (`pending`) | `user` → `client` (trigger; irreversible for v1) |
| Admin promotion | `admin` via bootstrap / secure RPC only |
| Cancel/reject booking | role stays `client` |

Only one admin expected in v1; still store role as data (not hardcoded email checks in UI alone).

### Alex admin bootstrap

1. Env / secret: `ADMIN_BOOTSTRAP_EMAIL` (provided later).
2. Secure options (pick one, document in repo):
   - **SQL seed migration** run once in Supabase SQL editor, or
   - **Edge Function** `bootstrap-admin` protected by a one-time `BOOTSTRAP_SECRET`, or
   - **Supabase seed script** in CI/local with service role
3. Function sets matching profile `role = admin`, writes role history, sets `app_settings.bootstrap_completed = true`.
4. Never expose bootstrap endpoint without secret; remove or lock after use.

---

## 11. Rejection, ban, and unban

Keep **three separate concepts**:

1. **User rejection** — `account_status = rejected` (not accepting this account as a training candidate / spam, etc.)
2. **Soft ban** — `is_banned = true` (+ reason / timestamps / admin)
3. **Booking rejection** — booking `status = rejected` (does not reject or ban the user)

### User rejection

- Store reason, timestamp, admin id on profile.
- Append `user_moderation_history` with previous/new status.
- Rejected users: can log in, view profile/history; **cannot** create/modify/cancel bookings.
- Unreject → `account_status = active` + history.

### Soft ban (`is_banned = true`)

- Can log in
- Can view profile + booking history
- Cannot create, modify, or cancel bookings
- Store `ban_reason`, `banned_at`, `banned_by`
- Full ban/unban history in `user_moderation_history` (include previous/new ban state)
- Unban → `is_banned = false`; does **not** clear an unrelated `rejected` status

### Booking rejection

- Booking fields: `rejected_at`, `rejected_by`, `rejection_reason`, `status = rejected`
- Independent of account moderation

### Hard rules

- Do **not** delete users
- Do **not** disable Supabase Auth accounts in normal moderation
- All moderation checks enforced in RPCs + RLS, not only UI

---

## 12. Session categories, types, definitions & occurrences

### Admin CRUD — categories

Routes: `/admin/session-categories`, `/new`, `/:categoryId`  
Reorder via `sort_order`  
Deactivate preferred; delete only when unused (FK RESTRICT)

### Admin CRUD — session types

Routes: `/admin/session-types`, `/new`, `/:sessionTypeId`  
Assign `category_id`; seed One-on-One / Group / Workshop / Consultation as starting templates only  
History via `session_type_history`

### Admin CRUD — session definitions (`sessions`)

Routes: prefer `/admin/sessions` for definitions list + `/admin/sessions/:sessionId` for definition detail, with clear UI separation between **definition** vs **calendar occurrences** (tabs or nested section).  
If the list becomes noisy, add `/admin/offerings` later — not required if UX labels are clear.

Fields per §8.5 including `active_from` / `active_until`.

### Admin CRUD — availability & occurrences

- Calendar-oriented UI on `/admin/calendar`
- Create/edit rules and exceptions on dedicated pages (`/admin/availability/new`, `/:ruleId`) when helpful
- Create one-off occurrence under a session definition
- Edit single occurrence overrides (title, time, capacity, price, location); set `detached_from_rule`
- Cancel occurrence with required reason
- Prevent lowering `max_slots` below `booked_count`

---

## 13. Booking request flow

```text
Select occurrence → Auth gate → Submit request
    → RPC create_booking_request
        · auth required
        · account_status = active AND is_banned = false
        · occurrence bookable (scheduled, active, not cancelled/blocked)
        · parent session + type active / in window
        · cutoff OK (rule override → app default)
        · no duplicate active booking
        · lock occurrence row FOR UPDATE
        · insert booking status=pending + price_snapshot_cents
        · recount booked_count (trigger)
        · promote role user→client
        · booking_history + audit
        · enqueue emails
```

### Capacity & concurrency (transaction-safe RPC)

Implement `create_booking_request(occurrence_id, goal, note)` as `SECURITY DEFINER`:

1. Resolve `auth.uid()`; load profile; reject if missing / rejected / banned
2. `SELECT * FROM session_occurrences WHERE id = … FOR UPDATE`
3. Validate status, `is_active`, parent session/type, cutoff, `booked_count < max_slots`
4. Insert booking (`pending`, snapshot price/currency from occurrence)
5. Trigger recounts active bookings → updates `booked_count` → CHECK enforces capacity
6. Partial unique index blocks duplicate active bookings
7. Write `booking_history`; enqueue notification outbox

Prefer **recount from active bookings** on INSERT/UPDATE OF status so cancel/reject always frees capacity consistently.

### Admin confirmation flow

Admin on `/admin/bookings/:id`:

- Confirm → set `confirmed_at` / `confirmed_by` + status + email
- Reject → reason required → `rejected_*` fields + email + free slot
- Cancel → reason required → `cancelled_*` + email + free slot
- Complete → `completed_at`; no-show → `no_show_marked_at`
- Manual create → `admin_create_booking` with `created_by_admin = true`
- Payment → `admin_update_payment` only (see §14a)

### Status transition matrix (v1)

| From | To (allowed) |
|------|----------------|
| pending | confirmed, rejected, cancelled_by_client, cancelled_by_admin |
| confirmed | completed, no_show, cancelled_by_client*, cancelled_by_admin |
| others | terminal (no further client changes) |

\*client cancel on confirmed only if before cancellation deadline.

---

## 14. Cancellation rules

- Configurable `cancellation_deadline_hours` (default **24**); per-rule override allowed
- Client may cancel `pending` or `confirmed` if `now() <= starts_at - deadline`
- Optional client `cancel_reason`
- After deadline: UI message to contact coach (from settings); only admin cancel
- Admin cancel always requires reason
- Never hard-delete bookings
- Capacity freed when status leaves active set

---

## 14a. Manual in-person payment tracking

Clients pay on premises. That is **how** they pay — not a payment status.

| Field | Values / notes |
|-------|----------------|
| `payment_status` | `unpaid` \| `paid` \| `waived` |
| `payment_method` | `cash` \| `card_in_person` \| `other` (nullable until paid) |
| `amount_paid_cents` | optional; defaults to snapshot when marking paid |
| `paid_at` | when marked paid |
| `payment_note` | admin internal |
| `payment_updated_by` | admin actor |

Rules:

- Preserve `price_snapshot_cents` forever
- No Stripe, checkout, subscriptions, credits, packages, refunds APIs, or client payment UI
- Admin-only payment edits; every change → `booking_history` + audit
- Do **not** use a status like `on-premises` or `paid_in_person`
---

## 15. History & audit strategy

| Mechanism | Use |
|-----------|-----|
| Dedicated domain history tables | bookings, occurrences, session definitions, types, categories, roles, moderation, settings |
| `audit_events` | cross-cutting admin actions (media delete, manual booking, bootstrap, etc.) |
| Table triggers | critical field/status changes that must not depend on the SPA |
| SECURITY DEFINER RPCs | multi-step writes + explicit history insert in one transaction |
| Edge Functions | email side effects, occurrence generation, login hook — log outcomes, not as sole source of truth |
| Frontend | never sole audit source |

### Minimum audit / history actions

`booking.created`, `booking.status_changed`, `booking.payment_changed`, `session.created`, `session.updated`, `occurrence.created`, `occurrence.updated`, `occurrence.cancelled`, `session_type.*`, `session_category.*`, `settings.updated`, `user.role_changed`, `user.banned`, `user.unbanned`, `user.rejected`, `media.deleted`, `admin.booking_manual_create`

---

## 16. Login history strategy

### Supabase Auth limitations

- Auth does not give a perfect, first-class “all login attempts” table out of the box.
- Client-only logging is spoofable and misses failed password attempts that never reach app code.
- IP/user-agent availability depends on Auth Hook / middleware configuration and privacy policy.

### Recommended realistic approach (v1)

1. Prefer a **Supabase Auth Hook** (or Auth webhook) on login / token issuance events → Edge Function verifies shared secret → inserts `login_events`.
2. Store when available: `user_id`, timestamp, `auth_method`, success flag, `user_agent`, **hashed or truncated** IP (never raw IP in client UI).
3. Optionally supplement with a client best-effort log on successful `SIGNED_IN` for user-agent only — never rely on it alone.
4. Admin views under `/admin/audit-logs` (login filter) and client detail.
5. Document clearly that failed-attempt coverage depends on hook coverage; do not invent fake certainty.

Avoid storing unnecessary sensitive data (full IP, device fingerprints beyond user-agent, passwords).

---

## 17. RLS policies (every table)

Assume helpers:

```sql
auth.uid()
is_admin()              -- profile.role = admin
can_mutate_bookings()   -- active account AND NOT is_banned
```

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | self; admin all | trigger/system | self (safe cols); moderation via RPC | no |
| `app_settings` | anon/auth public view; admin full | no | admin | no |
| `session_categories` | public active; admin all | admin | admin | admin if unused |
| `session_types` | public active; admin all | admin | admin | admin if unused |
| `sessions` | public active; admin all | admin | admin | soft preferred |
| `availability_rules` | admin | admin | admin | admin |
| `availability_exceptions` | admin | admin | admin | admin |
| `session_occurrences` | public bookable subset; admin all | admin / generator service | admin / generator | no hard delete |
| `bookings` | own; admin all | via RPC only | via RPC only | no |
| history / `audit_events` / `login_events` | admin (own logins optional) | trigger/service | no | no |
| `email_outbox` | admin | service | service | no |
| `settings_history` | admin | trigger | no | no |

**Important:** Direct client `INSERT`/`UPDATE` on `bookings` denied; use `create_booking_request` / `cancel_own_booking` / admin RPCs.

---

## 18. Secure database functions (RPC)

| Function | Caller | Purpose |
|----------|--------|---------|
| `create_booking_request` | authenticated + `can_mutate_bookings` | create `pending` booking |
| `cancel_own_booking` | client + `can_mutate_bookings` | cancel if deadline OK |
| `admin_set_booking_status` | admin | confirm/reject/cancel/complete/no_show |
| `admin_create_booking` | admin | manual booking (`created_by_admin`) |
| `admin_update_payment` | admin | status/method/amount/note |
| `admin_set_account_status` | admin | reject/unreject |
| `admin_set_ban` | admin | ban/unban |
| `admin_set_user_role` | admin | promote/demote (prevent self-lockout) |
| `generate_occurrences_for_rule` | service/admin | materialize horizon |
| `public_list_available_occurrences` | anon/auth | safe schedule feed |

All privileged functions: `SECURITY DEFINER`, fixed `search_path`, explicit authz checks inside.
---

## 19. Edge Functions

| Function | Trigger | Responsibility |
|----------|---------|----------------|
| `send-email` | invoked internally / queue worker | Resend send + outbox update |
| `on-booking-event` | DB webhook or RPC tail call | fan-out notification emails |
| `generate-occurrences` | cron daily + on-demand admin | rolling horizon generation |
| `auth-login-hook` | Auth Hook | `login_events` |
| `bootstrap-admin` | manual once | assign Alex admin |
| `storage-cleanup` (optional) | on media delete | orphan cleanup |

Secrets (Edge only): `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `BOOTSTRAP_SECRET`, `EMAIL_FROM`, webhook secrets.

---

## 20. Resend notification architecture

### Essential v1 emails

| Event | To |
|-------|----|
| Account welcome | user |
| New booking request | admin (`admin_notification_email`) |
| Booking request received | client |
| Booking confirmed | client |
| Booking rejected | client |
| Client cancellation | admin (+ optional client receipt) |
| Admin cancellation | client |
| Important session change (time/location cancel) | clients with active bookings on that occurrence |

### Future (not v1)

- 24h reminders
- Follow-up / win-back
- SMS / WhatsApp

### Implementation notes

- Templates in DB or Edge repo with keys
- Idempotency keys per event id to avoid duplicate sends
- Prefer outbox pattern: write `email_outbox` in same DB transaction as state change when possible; worker sends async
- No SMS in v1

---

## 21. Storage buckets and policies

Store **paths only** in Postgres (`avatar_storage_path`, `image_storage_path`, `logo_storage_path`, `media_storage_path`).  
Build public or signed URLs at runtime from the Supabase client based on bucket policy — do not persist permanent CDN URLs as the source of truth.

| Bucket | Public read? | Contents |
|--------|--------------|----------|
| `avatars` | yes | user profile images |
| `coach-media` | yes | Alex / coaching photos |
| `session-media` | yes | session + session-type images |
| `site-media` | yes | general website media |

No private docs/medical/contracts buckets in v1. Public image buckets are acceptable for marketing/session imagery; tighten to signed URLs later if needed without schema change (paths stay the same).

### Rules

- MIME: `image/jpeg`, `image/png`, `image/webp` (optional `image/gif`)
- Max size: **5 MB** avatars; **10 MB** session/coach/site media
- Naming: `{entityId_or_userId}/{uuid}.{ext}` inside the bucket
- Upload: user → own `avatars/{userId}/…` only; admin → all media buckets
- Replacement: upload new object → update path on row → delete previous object (best-effort Edge/RPC cleanup)
- Delete: owner avatar; admin for all; write `audit_events` on admin deletes; clear DB path when media removed
- Storage RLS: path folder must match `auth.uid()` for avatars; admin role for other buckets’ writes

Out of scope v1: documents, contracts, medical files, private client uploads.

---

## 22. Route and page structure

### Public

| Route | Purpose |
|-------|---------|
| `/` | Existing landing (wire CTAs) |
| `/schedule` | Browse upcoming availability |
| `/book` | Entry / session picker |
| `/book/:sessionId` | Booking request page (auth required to submit); `sessionId` = **occurrence id** |

### Auth / general

| Route | Purpose |
|-------|---------|
| `/signup` | Register |
| `/login` | Sign in |
| `/logout` | Sign out |
| `/forgot-password` | Request reset |
| `/reset-password` | Set new password |
| `/profile` | Profile + avatar + contact fields |

### Client

| Route | Purpose |
|-------|---------|
| `/client/dashboard` | Overview: upcoming, pending, quick links |
| `/client/bookings` | List + filters |
| `/client/bookings/:bookingId` | Detail, cancel if allowed |

### Admin

| Route | Purpose |
|-------|---------|
| `/admin/dashboard` | KPIs, pending queue |
| `/admin/calendar` | Rules + occurrences calendar |
| `/admin/sessions` | Session definitions (+ link into occurrences) |
| `/admin/sessions/new` | Create definition / one-off flow entry |
| `/admin/sessions/:sessionId` | Definition detail/edit |
| `/admin/session-types` | Types list |
| `/admin/session-types/new` | Create type |
| `/admin/session-types/:sessionTypeId` | Edit type |
| `/admin/session-categories` | Categories list / reorder |
| `/admin/session-categories/new` | Create category |
| `/admin/session-categories/:categoryId` | Edit category |
| `/admin/bookings` | All bookings |
| `/admin/bookings/:bookingId` | Review/confirm/payment |
| `/admin/clients` | Users/clients |
| `/admin/clients/:clientId` | Profile, bookings, moderation, login snippet |
| `/admin/reporting` | Metrics §26 |
| `/admin/settings` | App settings |
| `/admin/audit-logs` | Audit + login + history browsers |

### Suggested extra pages (only if needed)

| Route | Why |
|-------|-----|
| `/admin/availability/new` & `/:ruleId` | Cleaner than stuffing rule CRUD only in calendar |
| `/admin/occurrences/:occurrenceId` | If definition vs occurrence editing should be fully separate URLs |
| `/admin/media` | Optional library for site/session uploads |

Prototype brand routes remain as-is and unconnected.

### Route guards

- `/client/*` → authenticated + role `client` or `admin` (admin may view)
- `/admin/*` → `role = admin`
- Banned/rejected: allow profile + read bookings; block booking mutations

### UI conventions (unchanged intent)

- Dedicated pages/slugs for major workflows
- Modals only for confirmations, destructive actions, quick status changes, small field edits
- Toasts **top-left**, explicit copy, never replacing inline validation
- Preserve Alex Carter / current landing branding (dark, warm orange, off-white, muted gray, large headings, rounded controls, generous spacing, strong contrast)
- shadcn as component reference
---

## 23. Permissions by role

| Capability | Anon | user | client | banned/rejected | admin |
|------------|------|------|--------|-----------------|-------|
| View landing/schedule | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sign up / login | ✓ | | | ✓ | ✓ |
| Submit booking | | ✓* | ✓ | | ✓ |
| Manage own bookings | | | ✓ | read-only | ✓ |
| CRUD categories/types/session definitions/rules | | | | | ✓ |
| Confirm/reject bookings | | | | | ✓ |
| Moderate users | | | | | ✓ |
| Reporting / audit / settings | | | | | ✓ |
| Manual payment fields | | | | | ✓ |

\*First booking also upgrades `user` → `client`.

---

## 24. Admin dashboard requirements

- Pending booking count + list
- Today / next 7 days sessions with fill rate
- Recent cancellations / no-shows
- Quick links: calendar, bookings, clients
- Unpaid confirmed/completed bookings count
- System health soft signals (failed emails optional)

### Admin workflows (pages, not modals)

- Full category / type / session definition / booking / client editors on slug routes
- Calendar for availability visualization

### Modals only

- Confirm destructive cancel/ban/reject
- Quick status change confirmations
- Tiny field edits (e.g. inline note) if desired

---

## 25. Client dashboard requirements

- Next upcoming confirmed session
- Pending requests awaiting Alex
- List of bookings with status badges
- CTA to `/schedule` or `/book`
- Cancel action when allowed; otherwise contact instructions from settings
- Profile link
- Ban/reject banner explaining booking lock (if applicable)

---

## 26. Reporting requirements

`/admin/reporting` (date range filter, default last 30 days + upcoming):

- Bookings over time (chart — `recharts` already installed)
- Counts by booking status
- Pending / confirmed / completed / cancellations / rejections / no-shows
- Upcoming sessions
- Capacity & fill rate per occurrence / aggregate
- Most popular session types
- Active clients, new clients over time, repeat clients
- Attendance rate, no-show rate
- Paid vs unpaid vs waived counts (and simple sums of `price_snapshot_cents` / `amount_paid_cents` — **not** accounting)
- Breakdown by `payment_method` when paid (cash / card_in_person / other)
No forecasting, tax, or Stripe reporting.

Prefer SQL views or RPCs `admin_report_*` for consistent metrics.

---

## 27. UI & branding guide

### Brand principles

- Very dark charcoal background
- Warm orange / flame accent (`--flame` / primary)
- Off-white primary text; muted gray secondary
- Bold oversized **Unbounded** headings
- **Manrope** for body/UI
- Generous spacing; minimal clutter
- Strong contrast; performance-focused copy
- Rounded controls (`--radius` ~0.75rem); rounded cards; subtle borders
- Prefer atmosphere already on landing (grain, soft glows) on marketing; keep dashboards calmer but on-token

### shadcn reference

Use existing primitives for: Button, Input, Textarea, Card, Table, Dropdown, Tabs, Alert, AlertDialog, Sidebar, Calendar, Popover date/time, Pagination, Skeleton, Empty patterns, Form, Select, Badge, Sonner.

### Dashboard chrome

- Admin: shadcn `Sidebar` + top bar (coach business name from settings)
- Client: simpler top nav + content
- Do not invent a second design system

### Landing

- Keep visual design unchanged except wiring auth/booking/schedule links

### Toast conventions

- Position: **top-left** (configure Sonner `position="top-left"`)
- Success / warning / error with explicit copy (“Booking request sent — Alex will confirm within 24 hours”)
- Never replace field-level validation
- One toast per action outcome

### Modal conventions

- `AlertDialog` for destructive confirms
- Small edits only
- Major creates/edits → dedicated routes

### Empty / loading / error

- Skeleton loaders on tables and dashboard cards
- Empty states with one clear CTA
- Inline error alerts on failed mutations; toast for global failures
- 403/unauthorized page for role violations
- Preserve friendly 404

---

## 28. Phased implementation order

### Phase 0 — Foundations

- Gitignore env files
- Add React Router; split landing out of mega-`App.tsx` carefully
- Auth provider + session listener
- Toast position top-left
- Supabase migration pipeline (`supabase/migrations`)

### Phase 1 — Schema & security

- System enums only (roles, statuses, payment, moderation actions)
- Tables: categories, types, sessions, rules, exceptions, occurrences, bookings, histories, settings
- Indexes, FKs, RESTRICT delete rules, checks, partial unique active bookings
- History tables + triggers
- RLS + helper functions + booking RPCs skeleton
- Seed categories + session types + default `app_settings`
- Bootstrap admin process
- Regenerate types

### Phase 2 — Auth pages & profile

- Signup/login/logout/forgot/reset/profile
- Split name/phone/address fields + avatar path upload
- Login events hook
- Role-aware redirects

### Phase 3 — Taxonomy, definitions & occurrences

- Admin CRUD categories (reorder/archive)
- Admin CRUD session types
- Admin CRUD session definitions (`sessions`)
- Availability rules + exceptions (normalized)
- Occurrence generator Edge Function + cron (hybrid horizon)
- Public `/schedule` + `/book/:sessionId` read paths

### Phase 4 — Bookings

- `create_booking_request` + capacity tests
- Client bookings list/detail + cancel rules
- Admin bookings review/confirm/reject/cancel/complete/no-show
- Manual admin booking create
- Payment fields UI (admin)

### Phase 5 — Notifications

- Outbox + Resend
- Essential email set
- Session-change notifications

### Phase 6 — Clients, moderation, audit

- Clients list/detail
- Reject/ban/unban
- Audit logs UI
- Settings page

### Phase 7 — Reporting & polish

- Reporting RPCs + charts
- Empty/loading/error pass
- Security review
- Wire landing CTAs
- Soft brand strings from settings where low-risk

### Phase 8 — Hardening

- Load/concurrency tests on booking RPC
- Email idempotency
- Backup/restore notes
- Admin runbook (bootstrap, cron, Resend)

---

## 29. Testing strategy

| Layer | Focus |
|-------|--------|
| SQL tests / manual RPC scripts | overbooking race (parallel requests), duplicate booking, ban/reject blocks, cutoff, cancel deadline |
| Unit | status transition helpers, LA timezone formatting, deadline calculations |
| Integration | Auth signup → book → admin confirm → email outbox row |
| E2E (Playwright optional) | public schedule → login → book → admin confirm → client sees confirmed |
| RLS | attempt unauthorized reads/writes with anon and non-admin JWTs |
| Storage | upload size/mime path traversal attempts |
| Regression | landing still renders; prototype routes untouched |

Prioritize concurrency and RLS — highest risk areas.

---

## 30. Security risks and mitigations

| Risk | Mitigation |
|------|------------|
| Service role in frontend | Never bundle; only Edge Functions |
| Overbooking | Row lock + recount trigger + check constraint + partial unique index |
| Privilege escalation | Admin RPCs check `is_admin()`; no direct table updates for status |
| Banned/rejected user booking via API | Enforce `can_mutate_bookings()` in RPC + RLS |
| Open bootstrap | One-time secret + `bootstrap_completed` flag |
| `.env` committed | Add to gitignore; rotate keys if ever exposed |
| Email enumeration | Generic auth messages |
| XSS in admin notes | React escaping; sanitize any markdown email HTML |
| Storage abuse | MIME/size limits + path-scoped RLS |
| History tampering | No update/delete policies for clients/admins on history |

---

## 31. Environment variables

### Vite (public)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID` (optional)

### Edge / server secrets

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL` (fallback; prefer DB settings)
- `ADMIN_BOOTSTRAP_EMAIL`
- `BOOTSTRAP_SECRET`
- `AUTH_HOOK_SECRET` / webhook secrets
- `APP_ORIGIN` (absolute URLs in emails)

Never put service role or Resend keys in `VITE_*`.

---

## 32. Deployment considerations

- Keep Vercel static SPA deploy + `vercel.json` rewrite to `index.html`
- Supabase project already referenced in `supabase/config.toml` — use migrations, not manual-only prod drift
- Configure Auth redirect URLs for local + production origins
- Schedule `generate-occurrences` cron in Supabase
- Configure custom SMTP or Supabase email + Resend for transactional
- Monitor Edge Function logs and `email_outbox` failures
- Document how to set Alex’s admin email when provided
- Ensure `.env` is local-only; use Vercel env for any public Vite vars; Supabase secrets for Edge

---

## 33. Future improvements (explicitly not v1)

- Multi-tenant businesses / workspaces / `business_id` RLS
- Multiple coaches / calendars
- Dedicated `locations` table (replace free-text location)
- Waitlists
- Stripe / online checkout / packages / credits / subscriptions
- SMS reminders
- 24h email reminders & follow-ups
- Guest checkout
- Advanced CRM, goals history, referrals
- Health/medical/injury/emergency records
- Documents / contracts private storage
- Mobile apps
- Advanced accounting / tax / forecasting
- User-selectable timezones
- Connecting `/trident`, `/kalos`, and other prototypes to this backend
- RRULE import/export if an external calendar integration is ever required

---

## 34. Deliverables checklist (when implementation starts)

- [ ] Migrations for full schema (categories, types, sessions, rules, occurrences, bookings, histories) + RLS + triggers + RPCs
- [ ] Edge Functions listed above
- [ ] Resend templates for essential emails
- [ ] Storage buckets + path-based policies
- [ ] Router + auth + all routes in §22 (including session categories)
- [ ] Admin + client dashboards
- [ ] Reporting page
- [ ] Branding tokens reused; Sonner top-left
- [ ] Landing CTAs wired without redesign
- [ ] Bootstrap admin path documented
- [ ] Types regenerated
- [ ] Test scripts for capacity/RLS/moderation/payment
- [ ] Runbook + env sample (`.env.example` without secrets)

---

## 35. Summary recommendation

Ship a **three-layer session model** (categories → types → definitions) with **normalized recurrence**, **hybrid materialized occurrences**, **RPC-enforced capacity**, **append-only history**, **settings-driven identity**, and **role-gated Vite routes**. Keep v1 single-coach and payment-offline (status `unpaid`/`paid`/`waived` + in-person methods), with Resend email only. Structure tables and settings so a future LANQAR client can reuse the app by duplication and configuration—not by building SaaS tenancy now.

**Blocked on you before implementation:** exact `ADMIN_BOOTSTRAP_EMAIL` for Alex Carter (can proceed with schema/UI using a placeholder secret until then).

---

## Changes Made From the Original Plan

### Preserved

- Vite + React SPA + Supabase Auth/Postgres/RLS/Edge Functions/Storage + Resend architecture
- Single business / single coach / single admin v1; no multi-tenant SaaS; prototypes disconnected
- Settings-driven configurability and future-client duplication strategy
- Booking statuses and pending-first confirmation workflow
- Soft-ban behavior; rejection vs booking rejection as separate concepts
- Client cancel deadline (default 24h); admin reason required
- Capacity protection via RPC row locks, recount triggers, checks, partial unique index
- Append-only domain history + general `audit_events`; no frontend-only audit
- Public / auth / client / admin route set and page-vs-modal / top-left toast / branding / shadcn conventions
- Phased rollout, testing focus on concurrency + RLS, env var split, deployment notes
- Materialized bookable occurrences (not pure virtual recurrence at booking time)

### Improved

- **Session types are full CRUD table records** with seeds (One-on-One, Group, Workshop, Consultation), slugs, `category_id`, storage paths, and audit columns — explicitly **not** enums
- Added **`session_categories`** table with admin CRUD, reorder, deactivate, and FK `ON DELETE RESTRICT` when in use
- Clarified **three-layer model**: `sessions` (definitions) → `availability_rules` / exceptions → `session_occurrences` (bookable), instead of overloading one sessions table
- **Recurrence section** now compares RRULE vs JSONB vs normalized tables and **recommends normalized columns**; generation strategy resolved as **hybrid** (12-week materialization + cron + on-save refresh)
- **Bookings** gained explicit lifecycle timestamps/actors (`confirmed_*`, `rejected_*`, `cancelled_*`, `completed_at`, `no_show_marked_at`, `created_by_admin`)
- **Payments** corrected: statuses `unpaid` / `paid` / `waived` + methods `cash` / `card_in_person` / `other` (no “on-premises” / `paid_in_person` status)
- **Profiles** expanded to modern contact fields (split name/phone, optional address), `avatar_storage_path`, and **`is_banned` separate from `account_status`**
- **Media** standardized on `*_storage_path` with runtime URL resolution; replacement/delete behavior documented
- **Login history** documents Supabase Auth limitations and a realistic Auth Hook approach
- **RLS / RPCs / phases / routes** updated for categories, definitions, ban helper, and payment RPC
- **Locations**: text in v1; dedicated table called out as future improvement only

### Removed or replaced

- Any implication that session types/categories could be enums or fixed code lists
- Flattened “rules hang directly off session_types” model without a definition layer
- Unspecified / string `recurrence_rule` as an acceptable primary design
- Payment status `paid_in_person` / on-premises-as-status wording
- Combined `full_name` / single `phone` / permanent URL path fields as the profile/media standard
- Treating ban solely as an `account_status = banned` value (replaced with `is_banned` + rejection status)

### Why the important architectural changes were made

1. **CRUD categories/types** — coaches must invent and rename offerings; enums would force migrations for content edits.
2. **Definition vs occurrence split** — keeps recurring series, one-offs, overrides, and booking FKs understandable and safe.
3. **Normalized recurrence + hybrid generation** — safest simple fit for admin UI and concurrency without RRULE complexity.
4. **Payment status vs method** — “paid in person” is how money moved, not whether it moved.
5. **Storage paths** — durable references; URLs can change with CDN/bucket policy.
6. **Richer profiles + separate ban flag** — cleaner moderation semantics and room for optional address without messy string fields.
