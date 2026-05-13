## Goal
Ship a single long landing page for **Alex Carter**, a premium LA personal trainer targeting expat professionals. Conversion-first, dark aesthetic, every section funnels to the booking form.

## Design system
- **Palette (Charcoal & Ember):** bg `#1a1a1a`, surface `#2d2d2d`, border `#4a4a4a`, accent ember `#e85d3a` → tokenized in `src/styles.css` as oklch.
- **Type:** Inter (body) + a tight display sans for headlines (e.g. Space Grotesk). Large hierarchy, generous tracking on uppercase eyebrows.
- **Surface language:** rounded-2xl cards, subtle glassmorphism (backdrop-blur on dark translucent surfaces), soft ember glow shadows on hover, 1px hairline borders.
- **Motion:** Framer Motion fade/slide-up on scroll, magnetic CTA hover, smooth in-page anchor scroll.
- **Mobile-first**, responsive grids, sticky top nav with "Book Now" CTA always visible.

## Page structure (single route `/` with anchor sections)
1. **Sticky Nav** — logo, anchor links (Services, Schedule, Why Alex, Booking, FAQ), persistent ember "Book Session" button.
2. **Hero** — full-screen AI image (LA outdoor training, cinematic dark), headline "Structured Training. Real Results.", subheadline, two CTAs (primary ember + ghost), small stat strip beneath.
3. **Social Proof** — 3 stat cards (100+ sessions, international clients, personalized coaching) + 3 testimonial cards in glass surfaces, transformation imagery.
4. **Services** — 3 cards: Indoor PT, Outdoor Sessions, Custom Programs. Each: icon, blurb, 3 benefit bullets, "Book this" CTA.
5. **Why Train With Alex** — 6-item icon grid (structured, efficient, accountability, flexible locations, expat-friendly, progression tracking).
6. **Schedule / Classes** — Card grid for 4 session types (1-on-1 Indoor, Outdoor Strength, Small Group, Mobility & Conditioning). Each card: duration, location, intensity badge, price placeholder, time-slot chips (AM / Lunch / PM), "Book This Session" CTA.
7. **Trust** — Lead paragraph + 5 trust badges (Structured, Flexible Locations, Beginner Friendly, Results Focused, 24h response). Certification chips row.
8. **Logistics** — Two-column: Indoor venues / Outdoor locations, areas covered chips (West Hollywood, Beverly Hills, Santa Monica, Venice, DTLA), session durations, what to bring, cancellation & payment placeholders. End CTA.
9. **Booking (anchor focus)** — Two-column: left = visual calendar mockup with selectable day/time chips (UI only); right = qualification form (Name, Email, Goal select, Preferred training type select, optional message). Submit → success toast + confirmation card. Microcopy "Response within 24 hours."
10. **FAQ** — shadcn Accordion with the 5 listed questions.
11. **Footer** — minimal: logo, tagline, Instagram + email + LA location, quick anchor links, final ember CTA.

## Tech
- TanStack Start (existing). Single route file `src/routes/index.tsx` composing section components from `src/components/sections/`.
- TailwindCSS v4 tokens in `src/styles.css`.
- shadcn/ui: Button, Card, Accordion, Input, Textarea, Select, Label, Badge, Sonner (toast).
- Framer Motion for reveal + hover animations.
- React Hook Form + Zod for the booking form (client-only, toast on submit, no backend).
- Lucide icons throughout.

## Imagery (AI-generated, saved to `src/assets/`)
- `hero.jpg` — cinematic outdoor training, LA golden-hour, moody dark grade, ember rim light (1920×1080).
- `service-indoor.jpg`, `service-outdoor.jpg`, `service-custom.jpg` — square premium shots.
- `transformation-1/2/3.jpg` — athletic portraits, dark studio.
- `trust-coach.jpg` — Alex coaching shot for trust section.
- `og.jpg` — 16:9 social share.
All prompts will emphasize: charcoal tones, ember accent lighting, premium athletic, no text, no logos.

## SEO
- `head()` on root route: title "Alex Carter — Premium Personal Training in Los Angeles", meta description, og:title/description/image (`/og.jpg`), single H1 in hero.

## Out of scope
- No backend, no auth, no DB, no real calendar integration, no blog, no multi-route.

## Deliverable
A polished, scroll-driven prototype where every section ends pointing toward `#booking`.
