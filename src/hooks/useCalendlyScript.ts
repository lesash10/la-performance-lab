import { useEffect, useState } from "react";

import { CALENDLY_LOAD_TIMEOUT_MS, ensureCalendlyScript } from "@/lib/calendly";

type LoadState = "idle" | "loading" | "ready" | "error";

/**
 * Lazily loads Calendly widget assets once. Pass `enabled` false until the
 * booking UI is near the viewport (or a popup CTA is used).
 */
export function useCalendlyScript(enabled: boolean) {
  const [state, setState] = useState<LoadState>(() =>
    typeof window !== "undefined" && window.Calendly ? "ready" : "idle",
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window !== "undefined" && window.Calendly) {
      setState("ready");
      setError(null);
      return;
    }

    let cancelled = false;
    setState((prev) => (prev === "ready" ? prev : "loading"));
    setError(null);

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      setState("error");
      setError(new Error("Calendly took too long to load"));
    }, CALENDLY_LOAD_TIMEOUT_MS);

    ensureCalendlyScript()
      .then(() => {
        if (cancelled) return;
        window.clearTimeout(timeoutId);
        setState("ready");
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        window.clearTimeout(timeoutId);
        setState("error");
        setError(err instanceof Error ? err : new Error("Failed to load Calendly"));
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [enabled]);

  return {
    ready: state === "ready",
    loading: state === "loading" || (enabled && state === "idle"),
    error,
    ensureLoaded: ensureCalendlyScript,
  };
}
