import { Link } from "react-router-dom";

import { homePathForRole, useAuth } from "@/auth/AuthProvider";
import markImg from "@/assets/incinerate/mark.png";

export function NotAuthorizedPage() {
  const { user, profile } = useAuth();
  const dashboardPath = homePathForRole(profile?.role);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 grain opacity-90" aria-hidden />
      <div className="relative z-10 max-w-md text-center">
        <img src={markImg} alt="" className="mx-auto h-14 w-auto" />
        <h1 className="mt-6 font-display text-6xl font-semibold tracking-tight text-flame">403</h1>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
          Not authorized
        </h2>
        <p className="mt-3 text-sm text-pretty text-muted-foreground">
          You don&apos;t have permission to view this page.
          {user
            ? " Your account can access the member dashboard."
            : " Sign in with an account that has access."}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {user ? (
            <Link
              to={dashboardPath}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-flame px-6 py-2.5 text-sm font-semibold tracking-[0.01em] text-background shadow-flame transition-all hover:-translate-y-0.5 hover:bg-flame/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Go to dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-flame px-6 py-2.5 text-sm font-semibold tracking-[0.01em] text-background shadow-flame transition-all hover:-translate-y-0.5 hover:bg-flame/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Log in
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border/70 bg-background/40 px-6 py-2.5 text-sm font-semibold tracking-[0.01em] text-foreground transition-all hover:-translate-y-0.5 hover:border-flame/50 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
