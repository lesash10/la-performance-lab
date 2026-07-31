-- Phase 0: enums, core tables, helpers, RLS, profile trigger, seeds
-- Project: la-performance-lab / Incinerate

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM ('user', 'client', 'admin');
CREATE TYPE public.account_status AS ENUM ('active', 'rejected');
CREATE TYPE public.session_occurrence_status AS ENUM (
  'scheduled', 'cancelled', 'completed', 'blocked'
);
CREATE TYPE public.booking_status AS ENUM (
  'pending', 'confirmed', 'completed',
  'cancelled_by_client', 'cancelled_by_admin',
  'rejected', 'no_show'
);
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid', 'waived');
CREATE TYPE public.payment_method AS ENUM ('cash', 'card_in_person', 'other');
CREATE TYPE public.availability_rule_mode AS ENUM ('date_range', 'ongoing');
CREATE TYPE public.availability_exception_type AS ENUM ('cancel', 'modify', 'block');
CREATE TYPE public.moderation_action AS ENUM (
  'rejected', 'unrejected', 'banned', 'unbanned'
);
CREATE TYPE public.actor_type AS ENUM ('user', 'admin', 'system', 'edge_function');
CREATE TYPE public.email_outbox_status AS ENUM ('pending', 'sent', 'failed');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text,
  last_name text,
  display_name text,
  avatar_storage_path text,
  phone_country_code text,
  phone_number text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state_or_region text,
  postal_code text,
  country_code text,
  role public.user_role NOT NULL DEFAULT 'user',
  account_status public.account_status NOT NULL DEFAULT 'active',
  rejection_reason text,
  rejected_at timestamptz,
  rejected_by uuid REFERENCES public.profiles (id),
  is_banned boolean NOT NULL DEFAULT false,
  ban_reason text,
  banned_at timestamptz,
  banned_by uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_email_unique UNIQUE (email)
);

CREATE INDEX profiles_role_idx ON public.profiles (role);
CREATE INDEX profiles_account_status_idx ON public.profiles (account_status);
CREATE INDEX profiles_is_banned_idx ON public.profiles (is_banned);
CREATE INDEX profiles_role_status_banned_idx
  ON public.profiles (role, account_status, is_banned);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.can_mutate_bookings()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.account_status = 'active'
      AND p.is_banned = false
  );
$$;

-- ---------------------------------------------------------------------------
-- app_settings (singleton)
-- ---------------------------------------------------------------------------
CREATE TABLE public.app_settings (
  id integer PRIMARY KEY CHECK (id = 1),
  business_name text NOT NULL DEFAULT 'Incinerate',
  coach_name text NOT NULL DEFAULT 'Coach',
  contact_email text,
  contact_phone text,
  timezone text NOT NULL DEFAULT 'America/Los_Angeles',
  default_location text,
  cancellation_deadline_hours integer NOT NULL DEFAULT 24,
  booking_cutoff_hours integer NOT NULL DEFAULT 2,
  booking_request_message text,
  confirmation_public_message text,
  contact_instructions_after_cutoff text,
  logo_storage_path text,
  accent_color text DEFAULT '#D67119',
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  business_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  admin_notification_email text,
  bootstrap_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER app_settings_set_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Session taxonomy & definitions
-- ---------------------------------------------------------------------------
CREATE TABLE public.session_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id),
  updated_by uuid REFERENCES public.profiles (id)
);

CREATE TRIGGER session_categories_set_updated_at
  BEFORE UPDATE ON public.session_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.session_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.session_categories (id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  base_price_cents integer NOT NULL CHECK (base_price_cents >= 0),
  default_duration_minutes integer NOT NULL CHECK (default_duration_minutes > 0),
  default_max_slots integer NOT NULL CHECK (default_max_slots > 0),
  default_location text,
  image_storage_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id),
  updated_by uuid REFERENCES public.profiles (id)
);

CREATE INDEX session_types_category_id_idx ON public.session_types (category_id);
CREATE INDEX session_types_is_active_idx ON public.session_types (is_active);

CREATE TRIGGER session_types_set_updated_at
  BEFORE UPDATE ON public.session_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type_id uuid NOT NULL REFERENCES public.session_types (id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text,
  max_slots integer NOT NULL CHECK (max_slots > 0),
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  currency text NOT NULL DEFAULT 'USD',
  location text,
  image_storage_path text,
  is_active boolean NOT NULL DEFAULT true,
  active_from date,
  active_until date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id),
  updated_by uuid REFERENCES public.profiles (id),
  CONSTRAINT sessions_active_window_check
    CHECK (active_until IS NULL OR active_from IS NULL OR active_until >= active_from)
);

CREATE INDEX sessions_session_type_id_idx ON public.sessions (session_type_id);
CREATE INDEX sessions_is_active_idx ON public.sessions (is_active);
CREATE INDEX sessions_active_window_idx ON public.sessions (active_from, active_until);

CREATE TRIGGER sessions_set_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions (id) ON DELETE CASCADE,
  mode public.availability_rule_mode NOT NULL,
  starts_on date NOT NULL,
  ends_on date,
  days_of_week smallint[] NOT NULL,
  start_time_local time NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  max_slots integer CHECK (max_slots IS NULL OR max_slots > 0),
  price_cents integer CHECK (price_cents IS NULL OR price_cents >= 0),
  location text,
  booking_cutoff_hours integer,
  cancellation_deadline_hours integer,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles (id),
  updated_by uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT availability_rules_ends_on_check
    CHECK (ends_on IS NULL OR ends_on >= starts_on),
  CONSTRAINT availability_rules_days_nonempty_check
    CHECK (cardinality(days_of_week) > 0),
  CONSTRAINT availability_rules_days_range_check
    CHECK (
      days_of_week <@ ARRAY[0, 1, 2, 3, 4, 5, 6]::smallint[]
    )
);

CREATE INDEX availability_rules_session_id_idx ON public.availability_rules (session_id);

CREATE TRIGGER availability_rules_set_updated_at
  BEFORE UPDATE ON public.availability_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  availability_rule_id uuid NOT NULL
    REFERENCES public.availability_rules (id) ON DELETE CASCADE,
  exception_date date NOT NULL,
  exception_type public.availability_exception_type NOT NULL,
  start_time_local time,
  duration_minutes integer,
  max_slots integer,
  price_cents integer,
  location text,
  reason text,
  created_by uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT availability_exceptions_unique_date
    UNIQUE (availability_rule_id, exception_date)
);

CREATE TABLE public.session_occurrences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions (id) ON DELETE RESTRICT,
  session_type_id uuid NOT NULL REFERENCES public.session_types (id) ON DELETE RESTRICT,
  availability_rule_id uuid REFERENCES public.availability_rules (id) ON DELETE SET NULL,
  detached_from_rule boolean NOT NULL DEFAULT false,
  title text NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  max_slots integer NOT NULL CHECK (max_slots > 0),
  booked_count integer NOT NULL DEFAULT 0,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  currency text NOT NULL DEFAULT 'USD',
  location text,
  image_storage_path text,
  status public.session_occurrence_status NOT NULL DEFAULT 'scheduled',
  cancellation_reason text,
  cancelled_at timestamptz,
  cancelled_by uuid REFERENCES public.profiles (id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id),
  updated_by uuid REFERENCES public.profiles (id),
  CONSTRAINT session_occurrences_capacity_check
    CHECK (booked_count >= 0 AND booked_count <= max_slots),
  CONSTRAINT session_occurrences_time_check
    CHECK (ends_at > starts_at)
);

CREATE UNIQUE INDEX session_occurrences_rule_starts_unique
  ON public.session_occurrences (availability_rule_id, starts_at)
  WHERE availability_rule_id IS NOT NULL;

CREATE INDEX session_occurrences_starts_at_idx ON public.session_occurrences (starts_at);
CREATE INDEX session_occurrences_status_starts_idx
  ON public.session_occurrences (status, starts_at);
CREATE INDEX session_occurrences_session_starts_idx
  ON public.session_occurrences (session_id, starts_at);
CREATE INDEX session_occurrences_type_starts_idx
  ON public.session_occurrences (session_type_id, starts_at);
CREATE INDEX session_occurrences_public_idx
  ON public.session_occurrences (is_active, status, starts_at);

CREATE TRIGGER session_occurrences_set_updated_at
  BEFORE UPDATE ON public.session_occurrences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_occurrence_id uuid NOT NULL
    REFERENCES public.session_occurrences (id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  status public.booking_status NOT NULL DEFAULT 'pending',
  price_snapshot_cents integer NOT NULL CHECK (price_snapshot_cents >= 0),
  currency text NOT NULL DEFAULT 'USD',
  goal text,
  client_note text,
  admin_note text,
  cancel_reason text,
  cancelled_at timestamptz,
  cancelled_by uuid REFERENCES public.profiles (id),
  confirmed_at timestamptz,
  confirmed_by uuid REFERENCES public.profiles (id),
  rejected_at timestamptz,
  rejected_by uuid REFERENCES public.profiles (id),
  rejection_reason text,
  completed_at timestamptz,
  no_show_marked_at timestamptz,
  created_by_admin boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles (id),
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  payment_method public.payment_method,
  amount_paid_cents integer,
  paid_at timestamptz,
  payment_note text,
  payment_updated_by uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX bookings_active_unique
  ON public.bookings (user_id, session_occurrence_id)
  WHERE status IN ('pending', 'confirmed');

CREATE INDEX bookings_status_idx ON public.bookings (status);
CREATE INDEX bookings_user_id_idx ON public.bookings (user_id);
CREATE INDEX bookings_occurrence_idx ON public.bookings (session_occurrence_id);
CREATE INDEX bookings_created_at_idx ON public.bookings (created_at);
CREATE INDEX bookings_payment_status_idx ON public.bookings (payment_status);

CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- History / audit / email
-- ---------------------------------------------------------------------------
CREATE TABLE public.login_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  email_attempted text,
  succeeded boolean NOT NULL,
  auth_method text,
  user_agent text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX login_events_user_id_idx ON public.login_events (user_id);
CREATE INDEX login_events_created_at_idx ON public.login_events (created_at);

CREATE TABLE public.user_role_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  previous_role public.user_role,
  new_role public.user_role NOT NULL,
  actor_id uuid REFERENCES public.profiles (id),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_moderation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  action public.moderation_action NOT NULL,
  reason text,
  previous_status public.account_status,
  new_status public.account_status,
  previous_is_banned boolean,
  new_is_banned boolean,
  actor_id uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.session_category_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.session_categories (id) ON DELETE SET NULL,
  action text NOT NULL,
  changed_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.session_type_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type_id uuid REFERENCES public.session_types (id) ON DELETE SET NULL,
  action text NOT NULL,
  changed_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.session_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions (id) ON DELETE SET NULL,
  action text NOT NULL,
  changed_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.session_occurrence_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_id uuid REFERENCES public.session_occurrences (id) ON DELETE SET NULL,
  action text NOT NULL,
  changed_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.booking_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings (id) ON DELETE CASCADE,
  from_status public.booking_status,
  to_status public.booking_status,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid REFERENCES public.profiles (id),
  actor_type public.actor_type NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.settings_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  changed_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles (id),
  actor_type public.actor_type NOT NULL DEFAULT 'system',
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_events_created_at_idx ON public.audit_events (created_at);
CREATE INDEX audit_events_entity_idx ON public.audit_events (entity_type, entity_id);

CREATE TABLE public.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  template_key text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.email_outbox_status NOT NULL DEFAULT 'pending',
  provider_id text,
  error text,
  idempotency_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER email_outbox_set_updated_at
  BEFORE UPDATE ON public.email_outbox
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth → profile trigger + role history
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_first text := COALESCE(NEW.raw_user_meta_data ->> 'first_name', '');
  v_last text := COALESCE(NEW.raw_user_meta_data ->> 'last_name', '');
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NULLIF(v_first, ''),
    NULLIF(v_last, ''),
    NULLIF(trim(both FROM concat_ws(' ', v_first, v_last)), ''),
    'user'
  );

  INSERT INTO public.user_role_history (user_id, previous_role, new_role, actor_id, reason)
  VALUES (NEW.id, NULL, 'user', NEW.id, 'signup');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Block privilege escalation from the client (SQL editor / service role may change roles)
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.role IS DISTINCT FROM OLD.role
       AND auth.uid() IS NOT NULL
       AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can change roles';
    END IF;

    IF (
         NEW.account_status IS DISTINCT FROM OLD.account_status
      OR NEW.is_banned IS DISTINCT FROM OLD.is_banned
      OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason
      OR NEW.ban_reason IS DISTINCT FROM OLD.ban_reason
      OR NEW.rejected_by IS DISTINCT FROM OLD.rejected_by
      OR NEW.banned_by IS DISTINCT FROM OLD.banned_by
    )
       AND auth.uid() IS NOT NULL
       AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can change moderation fields';
    END IF;

    IF NEW.role IS DISTINCT FROM OLD.role THEN
      INSERT INTO public.user_role_history (user_id, previous_role, new_role, actor_id, reason)
      VALUES (
        NEW.id,
        OLD.role,
        NEW.role,
        auth.uid(),
        'role_change'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_protect_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_moderation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_category_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_type_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_occurrence_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY profiles_select_own_or_admin
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- app_settings: public read, admin write
CREATE POLICY app_settings_select_all
  ON public.app_settings FOR SELECT
  USING (true);

CREATE POLICY app_settings_update_admin
  ON public.app_settings FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- taxonomy: public read active; admin all
CREATE POLICY session_categories_select_public
  ON public.session_categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY session_categories_admin_write
  ON public.session_categories FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY session_types_select_public
  ON public.session_types FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY session_types_admin_write
  ON public.session_types FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY sessions_select_public
  ON public.sessions FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY sessions_admin_write
  ON public.sessions FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY availability_rules_admin_all
  ON public.availability_rules FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY availability_exceptions_admin_all
  ON public.availability_exceptions FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY session_occurrences_select_public
  ON public.session_occurrences FOR SELECT
  USING (
    public.is_admin()
    OR (
      is_active = true
      AND status = 'scheduled'
      AND starts_at > now()
    )
  );

CREATE POLICY session_occurrences_admin_write
  ON public.session_occurrences FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- bookings: own select; mutations via future RPCs (no direct insert/update for clients)
CREATE POLICY bookings_select_own_or_admin
  ON public.bookings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY bookings_admin_write
  ON public.bookings FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- history: admin read; own login/role history readable by self
CREATE POLICY login_events_select
  ON public.login_events FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY user_role_history_select
  ON public.user_role_history FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY user_moderation_history_admin
  ON public.user_moderation_history FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY session_category_history_admin
  ON public.session_category_history FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY session_type_history_admin
  ON public.session_type_history FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY session_history_admin
  ON public.session_history FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY session_occurrence_history_admin
  ON public.session_occurrence_history FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY booking_history_select
  ON public.booking_history FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY settings_history_admin
  ON public.settings_history FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY audit_events_admin
  ON public.audit_events FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY email_outbox_admin
  ON public.email_outbox FOR SELECT TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Seeds
-- ---------------------------------------------------------------------------
INSERT INTO public.app_settings (
  id,
  business_name,
  coach_name,
  timezone,
  accent_color,
  booking_request_message,
  confirmation_public_message
) VALUES (
  1,
  'Incinerate',
  'Coach',
  'America/Los_Angeles',
  '#D67119',
  'Your request was received. We will confirm by email.',
  'Your session is confirmed. See you on the floor.'
);

INSERT INTO public.session_categories (name, slug, description, sort_order) VALUES
  ('Personal Training', 'personal-training', '1:1 coaching', 10),
  ('Strength Training', 'strength-training', 'Strength-focused work', 20),
  ('Conditioning', 'conditioning', 'Conditioning & energy systems', 30),
  ('Mobility', 'mobility', 'Mobility & movement quality', 40),
  ('Recovery', 'recovery', 'Recovery sessions', 50),
  ('Assessment', 'assessment', 'Intake / assessment', 60),
  ('Consultation', 'consultation', 'Consultations', 70);

INSERT INTO public.session_types (
  category_id, name, slug, description,
  base_price_cents, default_duration_minutes, default_max_slots
)
SELECT c.id, v.name, v.slug, v.description, v.price, v.duration, v.slots
FROM (
  VALUES
    ('personal-training', 'One-on-One', 'one-on-one', 'Private session', 15000, 60, 1),
    ('personal-training', 'Group', 'group', 'Small group training', 7500, 60, 4),
    ('consultation', 'Consultation', 'consultation', 'Free / paid consult', 0, 30, 1),
    ('assessment', 'Workshop', 'workshop', 'Workshop format', 5000, 90, 12)
) AS v(category_slug, name, slug, description, price, duration, slots)
JOIN public.session_categories c ON c.slug = v.category_slug;
