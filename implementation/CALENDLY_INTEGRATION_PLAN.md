# Calendly Embed Integration Plan

**Repo:** `lesash10/la-performance-lab`  
**Tracking:** [#22](https://github.com/lesash10/la-performance-lab/issues/22) (this plan) · [#21](https://github.com/lesash10/la-performance-lab/issues/21) (implementation)  
**Milestone:** [Launch readiness — observability](https://github.com/lesash10/la-performance-lab/milestone/1)  
**Status:** Plan only — no application code in this document  
**Date:** 2026-08-16

---

## Repo context (discovered)

| Area | What we have |
|---|---|
| Framework | **Vite 7 + React 19** SPA (`vite.dev` / `vite.build`) — **not Next.js** |
| Routing | `react-router-dom` v7 in `src/App.tsx` (`BrowserRouter`) |
| Deploy | Vercel SPA rewrite in `vercel.json` → `/index.html` |
| Styling | Tailwind CSS v4 + CSS variables in `src/styles.css` |
| Primary marketing surface | `/` → `src/pages/incinerate/IncinerateLandingPage.tsx` (Incinerate Fitness) |
| Existing booking UX | Mock weekly slots + local Zod/RHF form in `#appointments` / `#booking-panel` (toast-only; no real scheduling) |
| CTAs | Multiple “Book Your First Session” / “Free Consultation” handlers scroll to `#appointments` |
| UI primitives | Radix Dialog already available at `src/components/ui/dialog.tsx` |
| Cookie banner | **None** today; `@vercel/analytics` loads in `src/main.tsx` |
| SSR | **None** — client-only hydrate. Still treat third-party scripts as client-only modules |

**Brand tokens to map into Calendly (Incinerate):**

| Role | Site token | Suggested Calendly hex |
|---|---|---|
| Primary / CTA | `--flame` / `--primary` (`#D67119`) | `primary_color=D67119` |
| Text | `--foreground` (near-white) | `text_color=F7F5F0` |
| Background | `--background` (near-black warm) | `background_color=1F1C1A` |

> Calendly expects **hex without `#`**. Exact background hex should be sampled from the live page during implementation if `1F1C1A` looks off.

**Hard constraints (confirmed):**

- Embed only — **no** Calendly Scheduling API.
- Single Event Type URL for v1 (placeholder OK until production link is set).
- Admins configure event types, invitee questions, and locations **inside Calendly**.
- Do **not** build an on-site Calendly admin panel.

---

## A) Recommended embed approach

### Recommendation: **Advanced JavaScript embed** (official Calendly widget), not a bare static iframe

Use Calendly’s widget script (`https://assets.calendly.com/assets/external/widget.js` + companion CSS) and:

1. **Primary flow:** `Calendly.initInlineWidget({ url, parentElement, prefill?, utm? })` inside a reserved-height container on the booking section.
2. **Optional alternate flow:** `Calendly.initPopupWidget({ url, prefill?, utm? })` from CTA buttons (or a thin wrapper that opens popup after scroll intent).

### Why JS embed over raw `<iframe src="…">`

| Concern | Advanced JS embed | Raw iframe |
|---|---|---|
| Popup / modal CTA | First-class `initPopupWidget` | DIY modal + iframe; focus trap / scroll lock fragile |
| Prefill (future) | Official `prefill` object | Manual query-string construction |
| Resize / height | Widget manages more of the experience | Manual `min-height` + postMessage guessing |
| Event hooks (future analytics) | `calendly.event_scheduled` message API | Same postMessage, but less consistent init |
| Branding params | Same URL query params either way | Same |
| Bundle / perf | Extra script + CSS (mitigate with lazy load) | Slightly lighter, but weaker UX |

**Do not** use an unofficial React wrapper package unless it is clearly maintained and thin; prefer a small first-party hook/component so we control script lifecycle, cleanup, and feature flags.

### What we will *not* do in v1

- Custom CSS injection into the Calendly iframe (impossible / unsupported).
- Scheduling API, OAuth, or server-side availability sync.
- Replacing Calendly’s invitee-question UI with our mock form as the source of truth.

### Branding limitations (document for stakeholders)

Calendly allows only limited theming via URL/query params (and account branding on some plans):

- Supported (typical): `primary_color`, `text_color`, `background_color`, `hide_gdpr_banner`, `hide_event_type_details`, `hide_landing_page_details`.
- **Not supported:** full CSS control, custom fonts (site uses Unbounded/Manrope — widget will not match), arbitrary layout, removing Calendly chrome entirely.
- Invitee questions / locations / duration / buffers are **Calendly admin** settings; the embed only surfaces whatever the Event Type already defines.

---

## B) Step-by-step tasks (checkable)

### B0 — Calendly account (outside the repo)

- [ ] Confirm Incinerate Calendly account / Event Type for the primary booking flow.
- [ ] Copy the Event Type public scheduling URL (placeholder until ready: e.g. `https://calendly.com/your-org/your-event`).
- [ ] In Calendly admin, configure **Invitee questions** (name/email are built-in; add goal, phone, injury notes, etc. as needed).
- [ ] Configure **location** (in-person address / phone / custom) on the Event Type.
- [ ] Decide timezone display (Calendly auto-detects invitee TZ; confirm host TZ is America/Los_Angeles for San Diego).
- [ ] Preview the Event Type page with brand colors in Calendly’s embed builder if available; note final hex values.

### B1 — Config & env

- [ ] Add `VITE_CALENDLY_URL` (required for embed to render).
- [ ] Add optional `VITE_CALENDLY_PRIMARY_COLOR`, `VITE_CALENDLY_TEXT_COLOR`, `VITE_CALENDLY_BACKGROUND_COLOR` (or a single config module with defaults matching Incinerate).
- [ ] Add optional `VITE_CALENDLY_HIDE_GDPR_BANNER` (`true`/`false`) — default carefully (see § Security).
- [ ] Add optional feature flag `VITE_CALENDLY_ENABLED` (`true` to show embed; `false` keeps fallback).
- [ ] Document vars in `.env.example` (no secrets — URL is public).
- [ ] Set production values in Vercel project env (Preview + Production).

### B2 — Shared Calendly utilities

- [ ] Add `src/lib/calendly.ts`: URL builder that appends branding query params; validates URL; exports typed options.
- [ ] Add `src/hooks/useCalendlyScript.ts`: load widget JS/CSS **once**, idempotent, rejects on failure, cleans up only if we own the nodes.
- [ ] Add TypeScript declarations for `window.Calendly` (minimal interface).

### B3 — Components

- [ ] Add `src/components/calendly/CalendlyInlineEmbed.tsx`:
  - Client-only mount via `useEffect`.
  - Reserved `min-height` skeleton/placeholder (match typical Calendly inline height ~630–700px; tune on mobile).
  - Calls `initInlineWidget` when script ready + URL present.
  - Re-inits safely if URL/prefill changes; clears container on unmount.
  - Error / missing-URL fallback UI (link-out + short message).
- [ ] Add `src/components/calendly/CalendlyPopupButton.tsx`:
  - Button that calls `initPopupWidget` on click after ensuring script loaded.
  - Accessible label; disabled + loading state while script pending.
- [ ] (Optional) Add `src/components/calendly/CalendlyBookingSection.tsx` thin section wrapper with heading copy aligned to current Incinerate voice.

### B4 — Wire into Incinerate landing

- [ ] In `IncinerateLandingPage.tsx`, replace (or gate) the mock `AvailableAppointments` slot grid + local form with the inline embed as the **primary** booking experience.
- [ ] Keep `#appointments` (and/or `#booking-panel`) IDs so existing nav / sticky CTA scroll targets keep working.
- [ ] Map CTA behavior:
  - **Primary:** scroll to inline embed (current `goBook` pattern).
  - **Optional alternate:** selected CTAs use `CalendlyPopupButton` / `initPopupWidget` (e.g. sticky mobile CTA or Final CTA) without removing scroll-to-section.
- [ ] Resolve **session vs consult** modes for v1:
  - **v1 default (matches “single Event Type URL” constraint):** one URL; copy can still mention consultation vs session, but Calendly defines the actual event.
  - **Follow-up:** `VITE_CALENDLY_URL_SESSION` + `VITE_CALENDLY_URL_CONSULT` if two Event Types are created later.
- [ ] Update booking process copy (`BookingProcess`) so it no longer promises a site-native form if questions live in Calendly.
- [ ] Remove or feature-flag dead mock schedule/form code once embed is verified (avoid leaving two competing booking UIs).

### B5 — Performance & reliability

- [ ] Lazy-init: load Calendly script when booking section enters viewport (`IntersectionObserver`) **or** on first CTA intent — prefer observer for Lighthouse on first paint.
- [ ] Do not put Calendly script tags in `index.html` globally.
- [ ] Reserve height + skeleton to avoid CLS.
- [ ] Handle React StrictMode double-invoke without double-injecting script tags.
- [ ] On route leave (`/` → `/login`, etc.), destroy/clear inline widget container.
- [ ] Timeout: if script fails within N seconds, show fallback link to open Calendly in a new tab.
- [ ] Confirm `@vercel/analytics` still works; do not block analytics on Calendly.

### B6 — Privacy / copy

- [ ] Confirm whether to set `hide_gdpr_banner=1` (only if legal/privacy review says our site banner or Calendly account settings already cover EU visitors — see § Security).
- [ ] Add a one-line privacy note near the embed if needed (“Scheduling powered by Calendly”).
- [ ] No PII logged to our servers from the embed in v1.

### B7 — Docs & handoff

- [ ] Keep this plan updated if paths/env names change during implementation.
- [ ] Comment on [#21](https://github.com/lesash10/la-performance-lab/issues/21) with PR link when coding starts.
- [ ] Close [#21](https://github.com/lesash10/la-performance-lab/issues/21) when acceptance criteria are met.

---

## C) Files / components to add or modify

### Add

| Path | Purpose |
|---|---|
| `implementation/CALENDLY_INTEGRATION_PLAN.md` | This plan |
| `src/lib/calendly.ts` | Build embed URL + branding/query helpers |
| `src/hooks/useCalendlyScript.ts` | Idempotent script/CSS loader |
| `src/types/calendly.d.ts` | `window.Calendly` typings |
| `src/components/calendly/CalendlyInlineEmbed.tsx` | Inline widget host |
| `src/components/calendly/CalendlyPopupButton.tsx` | Popup CTA helper |
| `src/components/calendly/CalendlyBookingSection.tsx` | Optional section chrome (heading + embed) |

### Modify

| Path | Change |
|---|---|
| `.env.example` | Document `VITE_CALENDLY_*` vars |
| `src/pages/incinerate/IncinerateLandingPage.tsx` | Swap mock `#appointments` booking for embed; wire CTAs; adjust copy |
| Vercel env (dashboard, not in git) | Production/Preview `VITE_CALENDLY_URL` (+ colors/flag) |

### Likely unchanged (v1)

| Path | Notes |
|---|---|
| `src/App.tsx` | No new route required if booking stays on `/#appointments` |
| `index.html` | Do **not** hardcode Calendly script |
| `src/pages/AdminPage.tsx` | No Calendly admin UI |
| Prototype brand pages (`/trident`, `/spry`, etc.) | Out of scope unless explicitly requested |
| `vercel.json` | SPA rewrite already sufficient |

### Optional later

| Path | Purpose |
|---|---|
| `src/pages/BookPage.tsx` + route `/book` | Dedicated booking page if homepage embed feels heavy |
| Content constants file under `src/pages/incinerate/` | If booking copy is extracted from the large landing file |

---

## D) Environment / config

### Proposed env vars

```bash
# Public Event Type URL (required when Calendly is enabled)
VITE_CALENDLY_URL=https://calendly.com/REPLACE_ME/event-type

# Feature flag (optional; default true when URL is set)
VITE_CALENDLY_ENABLED=true

# Branding (hex without #). Defaults can live in src/lib/calendly.ts
VITE_CALENDLY_PRIMARY_COLOR=D67119
VITE_CALENDLY_TEXT_COLOR=F7F5F0
VITE_CALENDLY_BACKGROUND_COLOR=1F1C1A

# GDPR banner inside widget (see privacy section)
VITE_CALENDLY_HIDE_GDPR_BANNER=false
```

### Where values live

| Environment | Storage |
|---|---|
| Local dev | `.env` / `.env.local` (gitignored) |
| Documented placeholders | `.env.example` |
| Preview / Production | Vercel Project → Settings → Environment Variables (`VITE_*` must be present at **build** time for Vite) |

### Config module pattern (recommended)

`src/lib/calendly.ts` should:

1. Read `import.meta.env.VITE_CALENDLY_URL`.
2. Apply defaults for colors from Incinerate tokens (so missing env still looks on-brand).
3. Append query params once (avoid double-encoding).
4. Export `isCalendlyConfigured` boolean for UI gating.

**Note:** Vite inlines `VITE_*` at build time on Vercel — changing the Calendly URL in the Vercel dashboard requires a **redeploy**.

---

## E) QA checklist

### Functional

- [ ] Inline embed loads on `/` booking section with correct Event Type.
- [ ] Available times match Calendly admin (host calendar connected).
- [ ] Booking completes end-to-end on a test Event Type; confirmation email arrives.
- [ ] Invitee questions configured in Calendly appear in the embed flow.
- [ ] Location details show as configured in Calendly.
- [ ] Popup CTA opens Calendly overlay; closes cleanly; page scroll restored.
- [ ] Existing nav “Times” / Book CTAs still scroll to the booking section.
- [ ] Sticky mobile booking CTA still behaves (scroll or popup — per chosen wiring).
- [ ] Missing/invalid `VITE_CALENDLY_URL` shows fallback (no blank hole).
- [ ] Script blocked / offline → fallback link works.

### Desktop / mobile

- [ ] Desktop Chrome: layout, height, no double scrollbars.
- [ ] Desktop Safari: popup + inline both work.
- [ ] Mobile Safari (iOS): embed usable; soft keyboard doesn’t break layout; popup not clipped.
- [ ] Mobile Chrome (Android): same.
- [ ] Tablet widths: reserved height doesn’t leave huge empty gap.

### Timezone

- [ ] Invitee in non–Pacific TZ sees local times; confirmation reflects correct instant.
- [ ] Host calendar (San Diego) receives correct slot.

### Privacy / blockers

- [ ] With ad blockers (uBlock, Brave shields): either embed works or fallback appears — never silent failure.
- [ ] If a site cookie banner is added later, Calendly load policy is defined (see § Security).
- [ ] `hide_gdpr_banner` behavior verified for an EU VPN/test profile if banner is hidden.

### Performance

- [ ] Lighthouse (mobile): Calendly script not on critical path before first paint (lazy load).
- [ ] No major CLS when embed mounts (skeleton → widget).
- [ ] Navigating away from `/` and back does not leak duplicate scripts/listeners.

### Branding

- [ ] Widget primary/text/background roughly match Incinerate flame/dark theme.
- [ ] Stakeholders accept font/layout differences inside the widget.

### Regression

- [ ] Auth routes (`/login`, `/dashboard`, etc.) unaffected.
- [ ] Prototype brand routes unaffected.
- [ ] Vercel Analytics still fires.

---

## F) Rollout plan

### 1. Feature flag / safe default

- Ship code behind `VITE_CALENDLY_ENABLED` + URL presence.
- If disabled or URL empty → keep **fallback**: either temporary mock UI **or** (preferred once ready) a clear “Book on Calendly” external link button — do not leave a broken embed frame.

### 2. Staging / Preview verification

1. Set Preview env vars on Vercel with a **Calendly test Event Type**.
2. Deploy Preview from the implementation PR.
3. Run §E QA on the Preview URL.
4. Complete one real test booking; cancel/delete test invitee in Calendly.

### 3. Production

1. Set Production `VITE_CALENDLY_URL` to the live Event Type.
2. Redeploy Production.
3. Smoke-test `/#appointments` and one popup CTA.
4. Monitor for user reports of blank booking area (adblock / network).

### 4. Fallback if Calendly fails to load

Layered fallbacks:

1. **Inline error state** in `CalendlyInlineEmbed`: message + “Open scheduling in a new tab” button using the same URL.
2. **CTA mailto / phone** already present in the landing footer remains available.
3. Optional: toast on popup failure (“Scheduler unavailable — opening link instead”) then `window.open(url)`.

### 5. Rollback

- Set `VITE_CALENDLY_ENABLED=false` and redeploy, **or** revert the PR.
- Because URL is build-time, rollback is redeploy-based (not instant runtime config unless we later read a remote config — out of scope).

---

## G) Future upgrades

| Upgrade | Notes |
|---|---|
| **On-site prefill pre-step** | Implemented: booking modal → URL query prefill (`name`, `email`, `a1`…`aN` by question order). Do **not** also pass `initInlineWidget({ prefill })` alongside the same URL params (can drop answers past `a1`). Dropdown values must match Calendly option text exactly. Embed cannot hide prefilled questions. |
| **Dual Event Types** | Map `session` / `consult` modes to two env URLs; keep mode toggle UI. |
| **UTM / campaign tracking** | Pass `utm: { utmSource, utmMedium, utmCampaign, … }` from page query string into widget options for Calendly reporting. |
| **`calendly.event_scheduled` listener** | Fire Vercel Analytics / custom event on successful booking (client-side only). |
| **Dedicated `/book` route** | Lighter landing; deep-link ads to booking page. |
| **Webhooks (paid plan)** | On plan upgrade: Calendly webhooks → Edge/API route → Supabase (lead row, notify Roger). Still no Scheduling API required for basic booking. |
| **CRM / email automation** | Zapier/Make via Calendly native integrations before building custom. |
| **Cookie Consent Mode** | If a real CMP is added, gate Calendly script behind marketing/third-party consent; document Calendly as third-party. |
| **Multiple brands** | Reuse `CalendlyInlineEmbed` on other prototype pages with different env prefixes only if product asks. |

---

## Security / privacy notes

### Data passed

| Data | Path | Our servers? |
|---|---|---|
| Event Type URL + branding colors | Browser → Calendly iframe/widget | No |
| Invitee name, email, answers, booking time | Entered inside Calendly → Calendly | No (v1) |
| Optional future prefill | Our page → Calendly widget API | Still not stored by us unless we add that |
| Page analytics | Vercel Analytics | Separate from Calendly |

### GDPR banner

- Calendly may show its own GDPR/cookie notice inside the widget for applicable visitors.
- `hide_gdpr_banner=1` removes that UI — **only enable after confirming** Calendly account settings + site privacy policy cover the same requirements.
- Default in plan: **`false` (do not hide)** until legal/product confirms otherwise.

### Cookies

- Calendly’s embed can set **third-party cookies / storage** from `calendly.com` (and related domains) for session, localization, and abuse prevention.
- This site currently has **no first-party cookie consent banner**. Adding Calendly increases third-party footprint; if marketing to the EU/UK, plan a CMP before relying on `hide_gdpr_banner`.
- Ad blockers may block `assets.calendly.com` — hence the explicit fallback link.

### CSP (if added later)

Allowlist (typical):

- Script/style: `https://assets.calendly.com`
- Frame: `https://calendly.com`
- (Confirm Calendly’s current domain list at implementation time.)

No CSP is configured in-repo today.

---

## Suggested implementation order (for #21)

1. Env + `src/lib/calendly.ts` + script hook  
2. `CalendlyInlineEmbed` with skeleton + fallback  
3. Swap into `#appointments` behind flag  
4. `CalendlyPopupButton` on 1–2 CTAs  
5. Copy cleanup + remove mock booking  
6. Preview QA → Production env → ship  

---

## Session “done” criteria (this document)

- [x] Repo inspected (Vite/React Router/Tailwind; Incinerate mock booking identified).
- [x] Plan covers deliverables A–G.
- [x] File written to `implementation/CALENDLY_INTEGRATION_PLAN.md`.
- [x] GitHub issues created for plan (#22) and implementation (#21).
)
