# LA Performance Lab

Vite + React SPA for conversion-first personal training landing pages. The primary product is **Incinerate Elite Personal Training** (Roger Rojas, Kearny Mesa / San Diego): a single long-scroll marketing page where every section funnels to booking.

Alternate brand prototypes live on separate pathnames under `src/pages/` — useful design references, not the main product path.

Booking today is **client-only** (slot pick → form → success toast). Supabase is scaffolded but not wired into the booking flow yet. Backend / auth / dashboards are planned separately (see `.lovable/implementation/`).

---

## Stack

| Layer | Choice |
| --- | --- |
| Runtime / bundler | **Vite 7** |
| UI | **React 19** + TypeScript |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`), design tokens in `src/styles.css` |
| Components | **shadcn/ui** (New York) + **Radix** primitives |
| Motion | **Framer Motion** |
| Forms | **React Hook Form** + **Zod** |
| Icons | **Lucide React** |
| Toasts | **Sonner** |
| Backend (scaffold) | **Supabase** (`@supabase/supabase-js`) |
| Analytics / deploy | **Vercel Analytics**, SPA rewrites in `vercel.json` |
| Tooling | ESLint, Prettier |

Fonts: **Unbounded** (display) + **Manrope** (body). Accent token: flame / copper (`--flame`).

There is **no React Router** — routing is a pathname switch in `src/App.tsx` plus `vercel.json` rewrite to `index.html`.

---

## Routes

| Path | Page |
| --- | --- |
| `/` | Incinerate Fitness landing (production target) |
| `/trident` | Trident Fitness prototype |
| `/1rm-performance` | 1RM Performance prototype |
| `/spry`, `/spry-fitness-prototype` | Spry Fitness prototype |
| `/kalos`, `/kalos-sthenos` | Kalos Sthenos prototype |
| `/michaels-wellness`, `/michaels-wellness-center` | Michael’s Wellness Center prototype |

Unknown paths render a simple 404.

---

## Project layout

```text
src/
  App.tsx                 # Route switch + Incinerate landing (home)
  main.tsx                # React root + Vercel Analytics
  styles.css              # Tailwind v4 theme / tokens
  components/ui/          # shadcn primitives
  components/marketing/   # Shared marketing helpers (e.g. Reveal)
  pages/                  # Alternate brand landings
  lib/                    # FAQ copy, JSON-LD, site URL, utils
  integrations/supabase/  # Client scaffold (lazy Proxy) + types
  assets/incinerate/      # Home-page imagery & logos
public/                   # Static assets (favicon, og, etc.)
supabase/                 # Local Supabase config (schema still empty)
```

Home sections (anchors): `#top` → `#why` → `#programs` → `#results` → `#process` → `#appointments` → `#faq`.

---

## Getting started

```bash
npm install
npm run dev
```

App runs at the Vite default (`http://localhost:5173`).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

### Environment

Copy or create a `.env` in the repo root. The Supabase client expects:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
# optional aliases also checked by the client:
# SUPABASE_URL=
# SUPABASE_PUBLISHABLE_KEY=

# optional — canonical origin for JSON-LD / absolute URLs
VITE_SITE_URL=https://incineratefitness.com
```

The landing itself does not require Supabase to render. Importing `@/integrations/supabase/client` without those vars will throw.

---

## Notes for contributors

- **Path aliases:** `@/` → `src/` (via `vite-tsconfig-paths`).
- **SPA hosting:** keep the catch-all rewrite in `vercel.json` so deep links to prototype routes work.
- **Prototype pages:** leave untouched unless the task is specifically about that brand; production work targets `/`.
- **Do not** import `client.server.ts` (service role) into browser code.
- Planned next phase (auth, real schedule, client/admin dashboards) is documented under `.lovable/implementation/` — not implemented in this tree yet.
