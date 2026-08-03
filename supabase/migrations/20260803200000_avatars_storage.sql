-- Private avatars bucket: users access only their own folder; admins can access all.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Ensure avatar_storage_path stays under the profile owner's folder (or admin override).
CREATE OR REPLACE FUNCTION public.enforce_avatar_storage_path()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.avatar_storage_path IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.avatar_storage_path !~ ('^' || NEW.id::text || '/[^/]+$') THEN
    RAISE EXCEPTION 'avatar_storage_path must be under the profile owner folder';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_enforce_avatar_path ON public.profiles;
CREATE TRIGGER trg_profiles_enforce_avatar_path
  BEFORE INSERT OR UPDATE OF avatar_storage_path ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_avatar_storage_path();

-- Storage RLS policies for avatars
DROP POLICY IF EXISTS "avatars_select_own_or_admin" ON storage.objects;
CREATE POLICY "avatars_select_own_or_admin"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "avatars_insert_own_or_admin" ON storage.objects;
CREATE POLICY "avatars_insert_own_or_admin"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "avatars_update_own_or_admin" ON storage.objects;
CREATE POLICY "avatars_update_own_or_admin"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "avatars_delete_own_or_admin" ON storage.objects;
CREATE POLICY "avatars_delete_own_or_admin"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

-- Trigger function should not be callable via PostgREST RPC.
REVOKE ALL ON FUNCTION public.enforce_avatar_storage_path() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_avatar_storage_path() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_avatar_storage_path() TO postgres, service_role;
