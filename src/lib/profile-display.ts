import { useEffect, useState } from "react";

import type { Profile } from "@/auth/AuthProvider";
import { createAvatarSignedUrl } from "@/lib/avatar-storage";

export function profileDisplayName(profile: Profile | null | undefined, email?: string | null): string {
  if (!profile) return email?.trim() || "Account";
  const fromParts = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
  if (fromParts) return fromParts;
  if (profile.display_name?.trim()) return profile.display_name.trim();
  return profile.email || email?.trim() || "Account";
}

export function profileInitials(profile: Profile | null | undefined, email?: string | null): string {
  const first = profile?.first_name?.trim()?.[0];
  const last = profile?.last_name?.trim()?.[0];
  if (first && last) return `${first}${last}`.toUpperCase();
  if (first) return first.toUpperCase();
  const display = profile?.display_name?.trim();
  if (display) {
    const parts = display.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return display.slice(0, 2).toUpperCase();
  }
  const fromEmail = (profile?.email || email || "?").trim();
  return fromEmail.slice(0, 1).toUpperCase() || "?";
}

/** Load a signed avatar URL for the private `avatars` bucket. */
export function useAvatarUrl(avatarStoragePath: string | null | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    if (!avatarStoragePath) {
      setUrl(undefined);
      return;
    }

    void createAvatarSignedUrl(avatarStoragePath).then((signed) => {
      if (!cancelled) setUrl(signed);
    });

    return () => {
      cancelled = true;
    };
  }, [avatarStoragePath]);

  return url;
}
