import { Link } from "react-router-dom";

import { useAuth } from "@/auth/AuthProvider";
import logoImg from "@/assets/incinerate/logo.png";
import { Button } from "@/components/ui/button";

/** Mock user dashboard — proves auth + role routing. */
export function DashboardPage() {
  const { profile, user, signOut } = useAuth();

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
        <p className="text-sm uppercase tracking-[0.14em] text-flame">Member area</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Mock user dashboard. Booking management will land in a later phase.
        </p>
        <div className="mt-8 space-y-3 rounded-xl border border-border/60 bg-surface-elevated/70 p-6">
          <p className="text-sm">
            <span className="text-muted-foreground">Signed in as </span>
            <span className="font-medium">{user?.email}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Name </span>
            <span className="font-medium">
              {[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "—"}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Role </span>
            <span className="rounded-md bg-flame/15 px-2 py-0.5 font-medium text-flame">
              {profile?.role ?? "…"}
            </span>
          </p>
        </div>
        <div className="mt-8">
          <Button asChild className="rounded-md bg-flame text-background hover:bg-flame/90">
            <Link to="/">Back to site</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
