/**
 * Base URL for canonical links, Open Graph, and JSON-LD.
 * Set `VITE_SITE_URL` in production (no trailing slash), e.g. `https://incineratefitness.com`.
 */
export function getSiteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL;
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim().replace(/\/$/, "");
  }
  return "https://incineratefitness.com";
}
