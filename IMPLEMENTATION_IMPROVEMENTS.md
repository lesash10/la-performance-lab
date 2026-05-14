# Frontend improvements — implementation plan

This document turns the agreed frontend-only suggestions into an actionable plan. Use the checklists to track progress; no backend work is assumed unless noted as optional future wiring.

---

## How to use this file

- Check items off as you complete them (`[ ]` → `[x]`).
- Work in any order that fits your sprint; **Suggested order** groups dependencies and quick wins.
- Each section ends with a **Definition of done** summary you can treat as a mini acceptance criteria block.

---

## Suggested order (milestones)

1. **M1 — Trust & clarity** — Booking UX truth, success copy, external links (fast, high impact on credibility).
2. **M2 — Accessibility baseline** — Skip link, `aria-expanded`, focus behavior, `prefers-reduced-motion`, anchor scroll offset.
3. **M3 — Conversion polish** — Hero CTAs, optional sticky mobile CTA, schedule slot semantics.
4. **M4 — Brand & edge UI** — Error/404 alignment, optional grain overlay, stats consistency, NotFound button styling.
5. **M5 — Discoverability & performance** — Meta/OG image, LCP hero tuning, JSON-LD, lazy-load audit.

---

## M1 — Trust and clarity (copy + UI alignment)

Align what the interface implies with what actually happens (client-only today).

### Checklist

- [ ] **Booking picker vs submit:** Either (a) pass selected day/time into the form as visible summary fields and include them in submitted client state (still no API required), or (b) relabel the calendar block (e.g. “Typical availability”) and remove interactive affordances that suggest a real hold.
- [ ] **Post-submit messaging:** Replace any wording that implies an automated confirmation email was sent; use language like “Request received” / “Alex will confirm by email.”
- [ ] **Instagram link:** Point `@alex.carter` to the real profile URL, or use a neutral “Find us on Instagram” without a broken/generic `instagram.com` root link until the handle is final.
- [ ] **Schedule section time chips:** If they remain decorative, remove `cursor-pointer` and button-like hover; if they become real affordances, wire them to booking or deep-link with hash + state.

### Definition of done

No UI element suggests a reservation or email was created unless that is true; outbound social links match displayed handles.

---

## M2 — Accessibility baseline

### Checklist

- [ ] **Skip link:** Add a visually hidden, keyboard-first “Skip to main content” (or “Skip to booking”) link that targets `#top` or `#booking` and appears on focus.
- [ ] **Mobile menu toggle:** Set `aria-expanded={open}` on the hamburger button; optionally `aria-controls` pointing at the mobile panel id.
- [ ] **Mobile menu:** Close on `Escape`; optionally trap focus inside the open panel (document as progressive enhancement if partial).
- [ ] **`prefers-reduced-motion`:** Disable or shorten Framer parallax on the hero and disable/simplify `Reveal` animations when `prefers-reduced-motion: reduce`.
- [ ] **Anchor scroll offset:** Add `scroll-margin-top` (or equivalent padding) on sections with `id` targets so headings are not hidden under the fixed header.
- [ ] **Focus visibility:** Verify focus rings on all interactive controls (including `Button` inside `<a>` patterns); fix any double-tab or missing ring cases.
- [ ] **Form selects:** Ensure Radix `Select` values stay in sync with `react-hook-form` for display and validation (controlled pattern or `Controller`), including error association if you add `aria-invalid` / `aria-describedby`.

### Definition of done

Keyboard navigation through nav, menu, in-page links, form, and FAQ is predictable; motion respects user OS preference; anchors land with readable headings.

---

## M3 — Conversion polish

### Checklist

- [ ] **Hero CTAs:** Differentiate “Book Your Session” vs “Free Consultation” (e.g. different hash targets, auto-focus message field, or distinct subcopy)—avoid two identical destinations unless intentional.
- [ ] **Sticky mobile CTA (optional):** After scroll past hero, show a compact bottom or floating “Book session” control; dismiss or hide near `#booking` to avoid clutter.
- [ ] **Footer secondary path (optional):** Add a low-emphasis text link (e.g. “View schedule”) for users not ready to book.

### Definition of done

Primary and secondary intents are distinguishable; mobile users can reach booking without excessive scroll fatigue.

---

## M4 — Brand consistency and visual depth

### Checklist

- [ ] **404 / error pages:** Align `NotFoundComponent` and `ErrorComponent` with marketing tokens (ember accent, display font, rounded-full primary actions) so edge states feel on-brand.
- [ ] **NotFound CTA:** Optionally match button shape (e.g. pill buttons) to the landing page for visual continuity.
- [ ] **`.grain` utility:** Apply a very subtle grain/noise layer on hero or alternating sections; verify contrast and performance (GPU-friendly, low opacity).
- [ ] **Stats harmonization:** Reconcile hero metrics vs social proof strip (e.g. `100+` vs `100+`, `12` vs `12+`) so numbers and labels do not contradict each other.

### Definition of done

Marketing and system routes share one visual language; decorative layers do not hurt readability or CLS.

---

## M5 — Discoverability, SEO, and performance

### Checklist

- [ ] **`og:image` (and optional `twitter:image`):** Add absolute URL(s) for a default share image; update `twitter:card` to `summary_large_image` if using a strong image.
- [ ] **Hero LCP:** Mark hero `<img>` with high fetch priority where appropriate; ensure hero is not lazy-loaded; document or add responsive `srcset`/`sizes` if multiple assets exist later.
- [ ] **Lazy-load audit:** Confirm non-LCP images use `loading="lazy"` consistently; add explicit dimensions where missing to reduce layout shift.
- [ ] **JSON-LD (static):** Inject structured data for `Person` or `LocalBusiness` (and `FAQPage` aligned with FAQ copy) in the document head or route head API—content can mirror existing copy.
- [ ] **Canonical URL (optional):** If production domain is fixed, add `rel="canonical"` in head for the landing route.

### Definition of done

Share previews show a correct image and title; Lighthouse LCP and CLS trends improve or stay green; rich-result validators pass for injected schema.

---

## Master progress checklist

Use this table for a single glance at status.

| Area                         | ID | Status |
|-----------------------------|----|--------|
| Booking truth / picker      | M1 | [ ]    |
| Success & external links    | M1 | [ ]    |
| Schedule chips semantics    | M1 | [ ]    |
| Skip link                   | M2 | [ ]    |
| Mobile `aria-expanded`      | M2 | [ ]    |
| Menu Escape / focus (opt.)  | M2 | [ ]    |
| `prefers-reduced-motion`    | M2 | [ ]    |
| Anchor `scroll-margin-top`  | M2 | [ ]    |
| Focus + form a11y sync      | M2 | [ ]    |
| Hero CTA differentiation    | M3 | [ ]    |
| Sticky mobile CTA (opt.)    | M3 | [ ]    |
| Footer secondary link (opt.)| M3 | [ ]    |
| 404 / error on-brand        | M4 | [ ]    |
| Grain overlay (opt.)        | M4 | [ ]    |
| Stats copy consistency      | M4 | [ ]    |
| OG / Twitter cards          | M5 | [ ]    |
| Hero LCP tuning             | M5 | [ ]    |
| Lazy-load / dimensions      | M5 | [ ]    |
| JSON-LD schema              | M5 | [ ]    |
| Canonical URL (opt.)        | M5 | [ ]    |

Replace `[ ]` with `[x]` as items complete.

---

## Out of scope (for this document)

- Real email, calendar, or payment integrations (backend or third-party APIs).
- CMS or content workflow changes unless they only affect static copy in the repo.

---

## Notes

- Revisit this file after any copy or pricing change so stats and FAQ schema stay aligned with the live page.
- If you later add a real booking API, M1 becomes “wire picker to API” and success copy can safely mention confirmation again.
