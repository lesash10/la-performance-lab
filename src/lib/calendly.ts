import type { CalendlyApi, CalendlyPrefill, CalendlyUtm } from "@/types/calendly";

const DEFAULT_PRIMARY_COLOR = "D67119"; // --flame / Incinerate orange
const DEFAULT_TEXT_COLOR = "F7F5F0"; // cream foreground
const DEFAULT_BACKGROUND_COLOR = "14110F"; // aligns with site --background

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const STYLESHEET_HREF = "https://assets.calendly.com/assets/external/widget.css";

export const CALENDLY_SCRIPT_SRC = SCRIPT_SRC;
export const CALENDLY_STYLESHEET_HREF = STYLESHEET_HREF;
export const CALENDLY_LOAD_TIMEOUT_MS = 12_000;
export const CALENDLY_INLINE_MIN_HEIGHT_PX = 700;

function envString(key: keyof ImportMetaEnv): string | undefined {
  const raw = import.meta.env[key];
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function stripHash(hex: string): string {
  return hex.replace(/^#/, "").trim();
}

function isTruthyFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  const normalized = value.toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return defaultValue;
}

export function isValidCalendlyUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith("calendly.com");
  } catch {
    return false;
  }
}

export type CalendlyConfig = {
  enabled: boolean;
  url: string | null;
  embedUrl: string | null;
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  hideGdprBanner: boolean;
  hideEventTypeDetails: boolean;
};

export function getCalendlyConfig(): CalendlyConfig {
  const enabled = isTruthyFlag(envString("VITE_CALENDLY_ENABLED"), true);
  const rawUrl = envString("VITE_CALENDLY_URL") ?? null;
  const url = rawUrl && isValidCalendlyUrl(rawUrl) ? rawUrl : null;

  const primaryColor = stripHash(envString("VITE_CALENDLY_PRIMARY_COLOR") ?? DEFAULT_PRIMARY_COLOR);
  const textColor = stripHash(envString("VITE_CALENDLY_TEXT_COLOR") ?? DEFAULT_TEXT_COLOR);
  const backgroundColor = stripHash(
    envString("VITE_CALENDLY_BACKGROUND_COLOR") ?? DEFAULT_BACKGROUND_COLOR,
  );
  const hideGdprBanner = isTruthyFlag(envString("VITE_CALENDLY_HIDE_GDPR_BANNER"), false);
  // Hide Calendly's event header inside our branded modal (photo/name/duration chrome).
  const hideEventTypeDetails = isTruthyFlag(
    envString("VITE_CALENDLY_HIDE_EVENT_TYPE_DETAILS"),
    true,
  );

  const embedUrl =
    url === null
      ? null
      : buildCalendlyEmbedUrl(url, {
          primaryColor,
          textColor,
          backgroundColor,
          hideGdprBanner,
          hideEventTypeDetails,
        });

  return {
    enabled: enabled && url !== null,
    url,
    embedUrl,
    primaryColor,
    textColor,
    backgroundColor,
    hideGdprBanner,
    hideEventTypeDetails,
  };
}

export function isCalendlyConfigured(): boolean {
  return getCalendlyConfig().enabled;
}

export function buildCalendlyEmbedUrl(
  baseUrl: string,
  options: {
    primaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    hideGdprBanner?: boolean;
    hideEventTypeDetails?: boolean;
  } = {},
): string {
  const url = new URL(baseUrl);

  const primary = stripHash(options.primaryColor ?? DEFAULT_PRIMARY_COLOR);
  const text = stripHash(options.textColor ?? DEFAULT_TEXT_COLOR);
  const background = stripHash(options.backgroundColor ?? DEFAULT_BACKGROUND_COLOR);

  // Official embed colors only (paid plan). Native field fills stay white.
  url.searchParams.set("primary_color", primary);
  url.searchParams.set("text_color", text);
  url.searchParams.set("background_color", background);

  if (options.hideGdprBanner) {
    url.searchParams.set("hide_gdpr_banner", "1");
  } else {
    url.searchParams.delete("hide_gdpr_banner");
  }

  if (options.hideEventTypeDetails !== false) {
    url.searchParams.set("hide_event_type_details", "1");
  } else {
    url.searchParams.delete("hide_event_type_details");
  }

  return url.toString();
}

/**
 * iframe src Calendly's widget builds for inline embeds (keeps user on our origin page).
 */
export function buildCalendlyIframeSrc(
  embedUrl: string,
  embedType: "Inline" | "PopupText",
  prefill?: CalendlyPrefill,
): string {
  const url = new URL(applyPrefillToCalendlyUrl(embedUrl, prefill));
  url.searchParams.set("embed_domain", window.location.host);
  url.searchParams.set("embed_type", embedType);
  return url.toString().replace(/\+/g, "%20");
}

/**
 * Adds invitee prefill as URL query params for embeds.
 *
 * Custom keys are positional (`a1` = first invitee question, `a2` = second, …).
 * Select/radio options must match Calendly’s option strings exactly.
 *
 * Prefer URL params alone for inline embeds. Passing the same answers both as URL
 * params and as `initInlineWidget({ prefill })` (postMessage) can leave only a1 applied.
 * Spaces must be `%20` (Calendly uses `decodeURIComponent`, not form `+`).
 */
export function applyPrefillToCalendlyUrl(embedUrl: string, prefill?: CalendlyPrefill): string {
  if (!prefill) return embedUrl;
  const url = new URL(embedUrl);
  if (prefill.name) url.searchParams.set("name", prefill.name);
  if (prefill.email) url.searchParams.set("email", prefill.email);
  if (prefill.firstName) url.searchParams.set("first_name", prefill.firstName);
  if (prefill.lastName) url.searchParams.set("last_name", prefill.lastName);
  if (prefill.customAnswers) {
    for (const [key, value] of Object.entries(prefill.customAnswers)) {
      if (value) url.searchParams.set(key, value);
    }
  }
  // Calendly decodes with decodeURIComponent (not form-urlencoded), so spaces must be %20 — not +.
  return url.toString().replace(/\+/g, "%20");
}

export type CalendlyWidgetOptions = {
  prefill?: CalendlyPrefill;
  utm?: CalendlyUtm;
};

const SCRIPT_ATTR = "data-calendly-widget-script";
const STYLE_ATTR = "data-calendly-widget-style";

let loadPromise: Promise<void> | null = null;

function ensureStylesheet(): void {
  if (document.querySelector(`link[${STYLE_ATTR}]`)) return;
  const existing = document.querySelector(
    `link[href="${CALENDLY_STYLESHEET_HREF}"]`,
  ) as HTMLLinkElement | null;
  if (existing) {
    existing.setAttribute(STYLE_ATTR, "true");
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CALENDLY_STYLESHEET_HREF;
  link.setAttribute(STYLE_ATTR, "true");
  document.head.appendChild(link);
}

export function getCalendlyApi(): CalendlyApi | undefined {
  if (typeof window === "undefined") return undefined;
  const fromWindow = window.Calendly;
  if (fromWindow && typeof fromWindow.initInlineWidget === "function") return fromWindow;
  const fromGlobal = (globalThis as { Calendly?: CalendlyApi }).Calendly;
  if (fromGlobal && typeof fromGlobal.initInlineWidget === "function") {
    window.Calendly = fromGlobal;
    return fromGlobal;
  }
  return undefined;
}

function waitForCalendlyApi(timeoutMs = 5_000): Promise<CalendlyApi> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      const api = getCalendlyApi();
      if (api) {
        resolve(api);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        reject(new Error("Calendly script loaded but API is unavailable"));
        return;
      }
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

/** Idempotent loader for Calendly widget.js + CSS. */
export function ensureCalendlyScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Calendly requires a browser environment"));
  }
  if (getCalendlyApi()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    ensureStylesheet();

    let settled = false;
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      loadPromise = null;
      reject(error);
    };
    const ok = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const afterScriptAvailable = () => {
      waitForCalendlyApi()
        .then(() => ok())
        .catch(fail);
    };

    const existing = document.querySelector(
      `script[${SCRIPT_ATTR}], script[src="${CALENDLY_SCRIPT_SRC}"]`,
    ) as HTMLScriptElement | null;

    if (existing) {
      if (getCalendlyApi()) {
        ok();
        return;
      }
      existing.addEventListener(
        "load",
        () => {
          existing.dataset.calendlyLoadState = "complete";
          afterScriptAvailable();
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => {
          existing.remove();
          fail(new Error("Failed to load Calendly script"));
        },
        { once: true },
      );
      // Already-complete tags won't fire load again — poll immediately.
      afterScriptAvailable();
      return;
    }

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.setAttribute(SCRIPT_ATTR, "true");
    script.addEventListener(
      "load",
      () => {
        script.dataset.calendlyLoadState = "complete";
        afterScriptAvailable();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        script.remove();
        fail(new Error("Failed to load Calendly script"));
      },
      { once: true },
    );
    document.body.appendChild(script);
  });

  return loadPromise;
}

/** Opens Calendly's on-page popup overlay. Never navigates away from the site. */
export async function openCalendlyPopup(options: CalendlyWidgetOptions = {}): Promise<void> {
  const config = getCalendlyConfig();

  if (!config.enabled || !config.embedUrl) {
    throw new Error("Calendly is not configured");
  }

  await ensureCalendlyScript();
  const api = getCalendlyApi();
  if (!api) {
    throw new Error("Calendly API missing after script load");
  }

  api.initPopupWidget({
    url: config.embedUrl,
    prefill: options.prefill,
    utm: options.utm,
  });
}
