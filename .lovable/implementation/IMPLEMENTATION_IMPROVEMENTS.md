# Frontend improvements — implementation plan

This document turns the agreed frontend-only suggestions into an actionable plan. Use the checklists to track progress; no backend work is assumed unless noted as optional future wiring.

---

## How to use this file

- Check items off as you complete them (`[ ]` → `[x]`).
- Work in any order that fits your sprint; **Suggested order** groups dependencies and quick wins.
- Each section ends with a **Definition of done** summary you can treat as a mini acceptance criteria block.

---

## Suggested order (milestones)

1. [x] **M1 — Trust & clarity** — Booking UX truth, success copy, external links (fast, high impact on credibility).
2. [x] **M2 — Accessibility baseline** — Skip link, `aria-expanded`, focus behavior, `prefers-reduced-motion`, anchor scroll offset.
3. [x] **M3 — Conversion polish** — Hero CTAs, optional sticky mobile CTA, schedule slot semantics.
4. [x] **M4 — Brand & edge UI** — Error/404 alignment, optional grain overlay, stats consistency, NotFound button styling.
5. [x] **M5 — Discoverability & performance** — Meta/OG image, LCP hero tuning, JSON-LD, lazy-load audit.

---

## M1 — Trust and clarity (copy + UI alignment)

Align what the interface implies with what actually happens (client-only today).

### Checklist

- [x] **Booking picker vs submit:** Either (a) pass selected day/time into the form as visible summary fields and include them in submitted client state (still no API required), or (b) relabel the calendar block (e.g. “Typical availability”) and remove interactive affordances that suggest a real hold.
- [x] **Post-submit messaging:** Replace any wording that implies an automated confirmation email was sent; use language like “Request received” / “Alex will confirm by email.”
- [x] **Instagram link:** Point `@alex.carter` to the real profile URL, or use a neutral “Find us on Instagram” without a broken/generic `instagram.com` root link until the handle is final.
- [x] **Schedule section time chips:** If they remain decorative, remove `cursor-pointer` and button-like hover; if they become real affordances, wire them to booking or deep-link with hash + state.

### Definition of done

No UI element suggests a reservation or email was created unless that is true; outbound social links match displayed handles.

---

## M2 — Accessibility baseline

### Checklist

- [x] **Skip link:** Add a visually hidden, keyboard-first “Skip to main content” (or “Skip to booking”) link that targets `#top` or `#booking` and appears on focus.
- [x] **Mobile menu toggle:** Set `aria-expanded={open}` on the hamburger button; optionally `aria-controls` pointing at the mobile panel id.
- [x] **Mobile menu:** Close on `Escape`; optionally trap focus inside the open panel (document as progressive enhancement if partial).
- [x] **`prefers-reduced-motion`:** Disable or shorten Framer parallax on the hero and disable/simplify `Reveal` animations when `prefers-reduced-motion: reduce`.
- [x] **Anchor scroll offset:** Add `scroll-margin-top` (or equivalent padding) on sections with `id` targets so headings are not hidden under the fixed header.
- [x] **Focus visibility:** Verify focus rings on all interactive controls (including `Button` inside `<a>` patterns); fix any double-tab or missing ring cases.
- [x] **Form selects:** Ensure Radix `Select` values stay in sync with `react-hook-form` for display and validation (controlled pattern or `Controller`), including error association if you add `aria-invalid` / `aria-describedby`.

**Progressive enhancement note:** The mobile panel does not fully trap focus (Tab can leave the panel). Escape closes the menu and returns focus to the toggle; opening moves focus to the first nav link.

### Definition of done

Keyboard navigation through nav, menu, in-page links, form, and FAQ is predictable; motion respects user OS preference; anchors land with readable headings.

---

## M3 — Conversion polish

### Checklist

- [x] **Hero CTAs:** Differentiate “Book Your Session” vs “Free Consultation” (e.g. different hash targets, auto-focus message field, or distinct subcopy)—avoid two identical destinations unless intentional.
- [x] **Sticky mobile CTA (optional):** After scroll past hero, show a compact bottom or floating “Book session” control; dismiss or hide near `#booking` to avoid clutter.
- [x] **Footer secondary path (optional):** Add a low-emphasis text link (e.g. “View schedule”) for users not ready to book.

### Definition of done

Primary and secondary intents are distinguishable; mobile users can reach booking without excessive scroll fatigue.

---

## M4 — Brand consistency and visual depth

### Checklist

- [x] **404 / error pages:** Align `NotFoundComponent` and `ErrorComponent` with marketing tokens (ember accent, display font, rounded-full primary actions) so edge states feel on-brand.
- [x] **NotFound CTA:** Optionally match button shape (e.g. pill buttons) to the landing page for visual continuity.
- [x] **`.grain` utility:** Apply a very subtle grain/noise layer on hero or alternating sections; verify contrast and performance (GPU-friendly, low opacity).
- [x] **Stats harmonization:** Reconcile hero metrics vs social proof strip (e.g. `100+` vs `100+`, `12` vs `12+`) so numbers and labels do not contradict each other.

### Definition of done

Marketing and system routes share one visual language; decorative layers do not hurt readability or CLS.

---

## M5 — Discoverability, SEO, and performance

### Checklist

- [x] **`og:image` (and optional `twitter:image`):** Add absolute URL(s) for a default share image; update `twitter:card` to `summary_large_image` if using a strong image.
- [x] **Hero LCP:** Mark hero `<img>` with high fetch priority where appropriate; ensure hero is not lazy-loaded; document or add responsive `srcset`/`sizes` if multiple assets exist later.
- [x] **Lazy-load audit:** Confirm non-LCP images use `loading="lazy"` consistently; add explicit dimensions where missing to reduce layout shift.
- [x] **JSON-LD (static):** Inject structured data for `Person` or `LocalBusiness` (and `FAQPage` aligned with FAQ copy) in the document head or route head API—content can mirror existing copy.
- [x] **Canonical URL (optional):** If production domain is fixed, add `rel="canonical"` in head for the landing route.

### Definition of done

Share previews show a correct image and title; Lighthouse LCP and CLS trends improve or stay green; rich-result validators pass for injected schema.

---

## Master progress checklist

Use this table for a single glance at status.

| Area                         | ID | Status |
|-----------------------------|----|--------|
| Booking truth / picker      | M1 | [x]    |
| Success & external links    | M1 | [x]    |
| Schedule chips semantics    | M1 | [x]    |
| Skip link                   | M2 | [x]    |
| Mobile `aria-expanded`      | M2 | [x]    |
| Menu Escape / focus (opt.)  | M2 | [x]    |
| `prefers-reduced-motion`    | M2 | [x]    |
| Anchor `scroll-margin-top`  | M2 | [x]    |
| Focus + form a11y sync      | M2 | [x]    |
| Hero CTA differentiation    | M3 | [x]    |
| Sticky mobile CTA (opt.)    | M3 | [x]    |
| Footer secondary link (opt.)| M3 | [x]    |
| 404 / error on-brand        | M4 | [x]    |
| NotFound CTA (opt.)         | M4 | [x]    |
| Grain overlay (opt.)        | M4 | [x]    |
| Stats copy consistency      | M4 | [x]    |
| OG / Twitter cards          | M5 | [x]    |
| Hero LCP tuning             | M5 | [x]    |
| Lazy-load / dimensions      | M5 | [x]    |
| JSON-LD schema              | M5 | [x]    |
| Canonical URL (opt.)        | M5 | [x]    |

Replace `[ ]` with `[x]` as items complete.

---

## Out of scope (for this document)

- Real email, calendar, or payment integrations (backend or third-party APIs).
- CMS or content workflow changes unless they only affect static copy in the repo.

---

## Notes

- **M5 deploy:** Set `VITE_SITE_URL` to the live origin (no trailing slash) so `og:image`, `twitter:image`, `canonical`, and JSON-LD URLs match production. Default in code is `https://alexcarter.la`. Share image is `public/og.jpg` (served at `/og.jpg`).
- Revisit this file after any copy or pricing change so stats and FAQ schema stay aligned with the live page.
- If you later add a real booking API, M1 becomes “wire picker to API” and success copy can safely mention confirmation again.
