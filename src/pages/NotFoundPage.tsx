import { Link } from "react-router-dom";

import markImg from "@/assets/incinerate/mark.png";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 grain opacity-90" aria-hidden />
      <div className="relative z-10 max-w-md text-center">
        <img src={markImg} alt="" className="mx-auto h-14 w-auto" />
        <h1 className="mt-6 font-display text-6xl font-semibold tracking-tight text-flame">404</h1>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
          Page not found
        </h2>
        <p className="mt-3 text-sm text-pretty text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-flame px-6 py-2.5 text-sm font-semibold tracking-[0.01em] text-background shadow-flame transition-all hover:-translate-y-0.5 hover:bg-flame/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
