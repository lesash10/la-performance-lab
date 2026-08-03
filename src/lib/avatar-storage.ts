import { supabase } from "@/integrations/supabase/client";

export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const EXT_BY_MIME: Record<(typeof AVATAR_ALLOWED_MIME)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function validateAvatarFile(file: File): string | null {
  if (!(AVATAR_ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return "Use a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

function extensionForFile(file: File): string {
  const fromMime = EXT_BY_MIME[file.type as (typeof AVATAR_ALLOWED_MIME)[number]];
  if (fromMime) return fromMime;
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  return "jpg";
}

/** Create a short-lived signed URL for a private avatar object. */
export async function createAvatarSignedUrl(
  avatarStoragePath: string | null | undefined,
  expiresInSeconds = 60 * 60,
): Promise<string | undefined> {
  if (!avatarStoragePath) return undefined;
  if (/^https?:\/\//i.test(avatarStoragePath)) return avatarStoragePath;

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarStoragePath, expiresInSeconds);

  if (error) {
    console.error("[avatar] signed URL failed", error);
    return undefined;
  }
  return data.signedUrl;
}

export async function uploadAvatarForUser(
  userId: string,
  file: File,
  previousPath?: string | null,
): Promise<{ path: string | null; error: Error | null }> {
  const validationError = validateAvatarFile(file);
  if (validationError) {
    return { path: null, error: new Error(validationError) };
  }

  const ext = extensionForFile(file);
  const objectPath = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { path: null, error: new Error(uploadError.message) };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_storage_path: objectPath })
    .eq("id", userId);

  if (updateError) {
    // Best-effort cleanup of the orphaned upload
    await supabase.storage.from(AVATAR_BUCKET).remove([objectPath]);
    return { path: null, error: new Error(updateError.message) };
  }

  if (previousPath && previousPath !== objectPath) {
    await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);
  }

  return { path: objectPath, error: null };
}

export async function removeAvatarForUser(
  userId: string,
  currentPath?: string | null,
): Promise<{ error: Error | null }> {
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_storage_path: null })
    .eq("id", userId);

  if (updateError) {
    return { error: new Error(updateError.message) };
  }

  if (currentPath) {
    await supabase.storage.from(AVATAR_BUCKET).remove([currentPath]);
  }

  return { error: null };
}
