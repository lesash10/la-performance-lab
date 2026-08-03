import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/auth/AuthProvider";
import logoImg from "@/assets/incinerate/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  removeAvatarForUser,
  uploadAvatarForUser,
  validateAvatarFile,
} from "@/lib/avatar-storage";
import {
  profileDisplayName,
  profileInitials,
  useAvatarUrl,
} from "@/lib/profile-display";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

/** Shared profile page for any authenticated role. */
export function ProfilePage() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const avatarUrl = useAvatarUrl(profile?.avatar_storage_path);
  const name = profileDisplayName(profile, user?.email);
  const initials = profileInitials(profile, user?.email);
  const phone = [profile?.phone_country_code, profile?.phone_number].filter(Boolean).join(" ");
  const address = [
    profile?.address_line_1,
    profile?.address_line_2,
    [profile?.city, profile?.state_or_region].filter(Boolean).join(", "),
    profile?.postal_code,
    profile?.country_code,
  ]
    .filter(Boolean)
    .join(" · ");

  const homePath = profile?.role === "admin" ? "/admin" : "/dashboard";
  const hasAvatar = Boolean(profile?.avatar_storage_path);

  const onPickFile = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    const validationError = validateAvatarFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploading(true);
    try {
      const { error } = await uploadAvatarForUser(
        user.id,
        file,
        profile?.avatar_storage_path,
      );
      if (error) {
        toast.error(error.message);
        return;
      }
      await refreshProfile();
      toast.success("Profile picture updated");
    } finally {
      setUploading(false);
    }
  };

  const onRemoveAvatar = async () => {
    if (!user || !hasAvatar || uploading) return;
    setUploading(true);
    try {
      const { error } = await removeAvatarForUser(user.id, profile?.avatar_storage_path);
      if (error) {
        toast.error(error.message);
        return;
      }
      await refreshProfile();
      toast.success("Profile picture removed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 grain opacity-80" aria-hidden />
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <Link to="/">
            <img src={logoImg} alt="Incinerate" className="h-7 w-auto" />
          </Link>
          <Button type="button" variant="outline" className="rounded-md" onClick={() => void signOut()}>
            Log out
          </Button>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-3xl px-5 py-12">
        <p className="text-sm uppercase tracking-[0.14em] text-flame">Account</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Your account details. You can update your profile picture below.
        </p>

        <div className="mt-8 flex flex-col gap-5 rounded-xl border border-border/60 bg-surface-elevated/70 p-6 sm:flex-row sm:items-center">
          <Avatar className="size-20 border border-border/70">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-flame/15 font-display text-xl font-semibold text-flame">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-semibold tracking-tight">{name}</p>
            <p className="mt-1 truncate text-sm text-muted-foreground">{user?.email}</p>
            <p className="mt-2">
              <span className="rounded-md bg-flame/15 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-flame">
                {profile?.role ?? "…"}
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(e) => void onFileChange(e)}
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-md"
                disabled={uploading || !user}
                onClick={onPickFile}
              >
                <Camera className="size-4" />
                {uploading ? "Uploading…" : hasAvatar ? "Change photo" : "Upload photo"}
              </Button>
              {hasAvatar ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-md text-muted-foreground"
                  disabled={uploading || !user}
                  onClick={() => void onRemoveAvatar()}
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              JPEG, PNG, WebP, or GIF · max 5 MB · private to you (admins can view)
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-5 rounded-xl border border-border/60 bg-surface-elevated/70 p-6 sm:grid-cols-2">
          <Field label="Email" value={profile?.email || user?.email || "—"} />
          <Field label="Display name" value={profile?.display_name?.trim() || "—"} />
          <Field label="First name" value={profile?.first_name?.trim() || "—"} />
          <Field label="Last name" value={profile?.last_name?.trim() || "—"} />
          <Field label="Phone" value={phone || "—"} />
          <Field label="Account status" value={profile?.account_status ?? "—"} />
          <div className="sm:col-span-2">
            <Field label="Address" value={address || "—"} />
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-md">
            <Link to={homePath}>Dashboard</Link>
          </Button>
          <Button asChild className="rounded-md bg-flame text-background hover:bg-flame/90">
            <Link to="/">Back to site</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
