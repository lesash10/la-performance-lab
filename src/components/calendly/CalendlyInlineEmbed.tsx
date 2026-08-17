import { useEffect, useRef, useState } from "react";

import {
  CALENDLY_INLINE_MIN_HEIGHT_PX,
  applyPrefillToCalendlyUrl,
  buildCalendlyIframeSrc,
  ensureCalendlyScript,
  getCalendlyApi,
  getCalendlyConfig,
} from "@/lib/calendly";
import type { CalendlyPrefill, CalendlyUtm } from "@/types/calendly";
import { cn } from "@/lib/utils";

type CalendlyInlineEmbedProps = {
  className?: string;
  /** When false, load as soon as mounted (recommended for the booking section). */
  lazy?: boolean;
  prefill?: CalendlyPrefill;
  utm?: CalendlyUtm;
  minHeight?: number;
  /** Stretch to the parent’s height (booking modal step). */
  fill?: boolean;
};

function StatusPanel({
  message,
  onRetry,
  minHeight = CALENDLY_INLINE_MIN_HEIGHT_PX,
  fill = false,
}: {
  message: string;
  onRetry?: () => void;
  minHeight?: number;
  fill?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-sm border border-border/60 bg-surface/80 px-6 py-16 text-center",
        fill && "h-full min-h-full",
      )}
      style={fill ? undefined : { minHeight }}
      role="status"
    >
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-flame px-5 py-2.5 text-sm font-semibold text-background shadow-flame hover:bg-flame/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

function mountInlineIframe(parent: HTMLElement, embedUrl: string, prefill?: CalendlyPrefill) {
  parent.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.src = buildCalendlyIframeSrc(embedUrl, "Inline", prefill);
  iframe.title = "Select a Date & Time - Calendly";
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.border = "0";
  iframe.setAttribute("frameborder", "0");
  parent.appendChild(iframe);
}

export function CalendlyInlineEmbed({
  className,
  lazy = false,
  prefill,
  utm,
  minHeight = CALENDLY_INLINE_MIN_HEIGHT_PX,
  fill = false,
}: CalendlyInlineEmbedProps) {
  const config = getCalendlyConfig();
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(!lazy);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [retryToken, setRetryToken] = useState(0);
  const prefillKey = JSON.stringify(prefill ?? null);
  const utmKey = JSON.stringify(utm ?? null);

  useEffect(() => {
    if (!lazy || inView) return;
    const node = hostRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [lazy, inView]);

  useEffect(() => {
    if (!config.enabled || !config.embedUrl || !inView) return;
    const embedUrl = config.embedUrl;

    let cancelled = false;
    const widgetEl = widgetRef.current;
    if (!widgetEl) return;

    setStatus("loading");
    widgetEl.setAttribute("data-url", embedUrl);

    const init = async () => {
      try {
        // Prefer official widget API; fall back to the same iframe the widget injects.
        try {
          await ensureCalendlyScript();
        } catch (scriptErr) {
          console.warn("[Calendly] widget script unavailable, using iframe embed", scriptErr);
        }
        if (cancelled) return;

        widgetEl.innerHTML = "";
        // Prefill via URL query params only. Calendly's widget also supports a `prefill`
        // object (postMessage), but combining URL + object can drop answers past a1.
        // URL params (a1…aN by question order) are the reliable path for dropdowns + text.
        const prefilledUrl = applyPrefillToCalendlyUrl(embedUrl, prefill);
        widgetEl.setAttribute("data-url", prefilledUrl);
        const api = getCalendlyApi();
        if (api) {
          api.initInlineWidget({
            url: prefilledUrl,
            parentElement: widgetEl,
            utm,
          });
        } else {
          mountInlineIframe(widgetEl, embedUrl, prefill);
        }

        const appeared = await new Promise<boolean>((resolve) => {
          const started = Date.now();
          const tick = () => {
            if (cancelled) {
              resolve(false);
              return;
            }
            if (widgetEl.querySelector("iframe")) {
              resolve(true);
              return;
            }
            if (Date.now() - started > 8_000) {
              resolve(false);
              return;
            }
            window.requestAnimationFrame(tick);
          };
          tick();
        });

        if (cancelled) return;
        if (!appeared) throw new Error("Calendly iframe did not render");
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("[Calendly] inline embed failed", err);
        setStatus("error");
      }
    };

    void init();

    return () => {
      cancelled = true;
      widgetEl.innerHTML = "";
      widgetEl.removeAttribute("data-url");
    };
  }, [
    config.enabled,
    config.embedUrl,
    inView,
    prefillKey,
    utmKey,
    retryToken,
    prefill,
    utm,
  ]);

  if (!config.enabled || !config.embedUrl) {
    return (
      <StatusPanel message="Online scheduling is not configured yet. Please check back shortly or contact Roger directly." />
    );
  }

  const brandBg = `#${config.backgroundColor}`;
  const heightStyle = fill
    ? { minWidth: "320px", height: "100%", minHeight: "100%", backgroundColor: brandBg }
    : { minWidth: "320px", height: minHeight, minHeight, backgroundColor: brandBg };

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative w-full",
        fill && "h-full min-h-0",
        className,
      )}
      style={fill ? { backgroundColor: brandBg } : undefined}
    >
      {status === "error" ? (
        <div className="absolute inset-0 z-20">
          <StatusPanel
            fill={fill}
            minHeight={fill ? undefined : minHeight}
            message="We couldn't load the scheduler on this page. Stay here and try again — you won't be sent to another site."
            onRetry={() => setRetryToken((n) => n + 1)}
          />
        </div>
      ) : null}

      {status !== "ready" && status !== "error" ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex animate-pulse flex-col justify-center gap-3 px-8",
            fill && "min-h-full",
          )}
          style={{ backgroundColor: brandBg, ...(fill ? {} : { minHeight }) }}
          aria-hidden
        >
          <div className="mx-auto h-3 w-2/5 rounded-sm bg-foreground/10" />
          <div className="mx-auto mt-2 grid w-full max-w-sm grid-cols-7 gap-2">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-full bg-flame/20" />
            ))}
          </div>
        </div>
      ) : null}

      <div
        ref={widgetRef}
        id="booking-panel"
        className="calendly-inline-widget h-full w-full overflow-hidden [&_iframe]:h-full [&_iframe]:min-h-full"
        style={heightStyle}
        aria-busy={status !== "ready"}
        aria-label="Schedule a session with Calendly"
      />
      {status === "ready" ? (
        <p className="sr-only">Scheduling powered by Calendly</p>
      ) : null}
    </div>
  );
}
