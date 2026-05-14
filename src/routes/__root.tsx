import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { buildLandingJsonLd } from "@/lib/landing-schema";
import { getSiteOrigin } from "@/lib/site-url";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 grain opacity-90" aria-hidden />
      <div className="relative z-10 max-w-md text-center">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-ember">
          Alex Carter
        </p>
        <h1 className="font-display text-7xl font-semibold tracking-tight text-ember">404</h1>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
          Page not found
        </h2>
        <p className="mt-3 text-sm text-muted-foreground text-pretty">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-2.5 text-sm font-medium text-background shadow-ember transition-colors hover:bg-ember/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 grain opacity-90" aria-hidden />
      <div className="relative z-10 max-w-md text-center">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-ember">
          Alex Carter
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-3 text-sm text-muted-foreground text-pretty">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-ember px-6 py-2.5 text-sm font-medium text-background shadow-ember transition-colors hover:bg-ember/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border/80 bg-surface/40 px-6 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const OG_TITLE = "Alex Carter — Premium Personal Training in LA";
const OG_DESCRIPTION =
  "Structured training. Real results. Premium indoor & outdoor coaching in Los Angeles.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const origin = getSiteOrigin();
    const canonical = `${origin}/`;
    const ogImage = `${origin}/og.jpg`;
    const ogImageAlt = "Personal trainer Alex Carter performing strength training in Los Angeles";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Alex Carter — Premium Personal Training in Los Angeles" },
        {
          name: "description",
          content:
            "Structured indoor & outdoor personal training in Los Angeles for expats and busy professionals. Book your first session with Alex Carter.",
        },
        { name: "author", content: "Alex Carter" },
        { property: "og:title", content: OG_TITLE },
        { property: "og:description", content: OG_DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1920" },
        { property: "og:image:height", content: "1080" },
        { property: "og:image:alt", content: ogImageAlt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: OG_TITLE },
        { name: "twitter:description", content: OG_DESCRIPTION },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:image:alt", content: ogImageAlt },
        { "script:ld+json": buildLandingJsonLd(origin) },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "canonical",
          href: canonical,
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-center" richColors />
    </QueryClientProvider>
  );
}
