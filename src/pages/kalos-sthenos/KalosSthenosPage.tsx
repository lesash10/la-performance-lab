import { useEffect, useRef, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";

import coachImg from "@/assets/trust-coach.jpg";
import indoorImg from "@/assets/service-indoor.jpg";
import outdoorImg from "@/assets/service-outdoor.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";

import {
  BRAND_CLARITY,
  BRAND_NAME,
  COMMUNITY_STATS,
  CTA_AFTER_SUBMIT,
  CTA_REASSURANCE,
  FAQ_ITEMS,
  FOOTER_TAGLINE,
  FORM_REASSURANCE,
  HERO_PROOF,
  HOW_IT_WORKS_STEPS,
  KALOS_CONTACT,
  NAV,
  PRIMARY_CTA,
  PROGRAMS,
  SECONDARY_CTA,
  TESTIMONIALS,
  TRIAL_INCLUDES,
  TRUST_STRIP_PROOF,
  WHO_ITS_FOR,
  WHY_KALOS,
} from "./kalos-content";
import { useKalosPageMeta } from "./useKalosPageMeta";

const MOBILE_NAV_PANEL_ID = "kalos-mobile-nav-panel";
const TRIAL_FORM_ID = "trial";

const trialFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  goal: z.string().min(1, "Please select a goal"),
});
type TrialFormValues = z.infer<typeof trialFormSchema>;

const PRIMARY_CTA_CLASS =
  "group rounded-lg bg-kalos-accent px-7 font-semibold tracking-[0.01em] text-kalos-accent-foreground shadow-kalos transition-[transform,box-shadow,background-color] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:bg-kalos-accent/92";
const SECONDARY_CTA_CLASS =
  "group rounded-lg border-border/70 bg-surface/40 px-7 font-semibold tracking-[0.01em] transition-[transform,border-color,background-color] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:border-kalos-accent/40 hover:bg-surface-elevated hover:text-foreground";
const SECTION_PY = "py-16 md:py-24 lg:py-28";
const CONTAINER = "mx-auto max-w-[77.5rem] px-5 md:px-8 lg:px-10";

function CtaArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn("kalos-cta-arrow size-4 transition-transform duration-200", className)}
      aria-hidden
    />
  );
}

function KalosLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 4c-3.5 3-6 5.5-6 9a6 6 0 0 0 12 0c0-3.5-2.5-6-6-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9.5 14.5h5M12 12v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function KalosWordmark({ className, full }: { className?: string; full?: boolean }) {
  if (full) {
    return (
      <span className={cn("font-display font-semibold tracking-[0.04em]", className)}>
        {BRAND_NAME}
      </span>
    );
  }
  return (
    <span className={cn("font-display font-semibold tracking-[0.06em]", className)}>
      KALOS<span className="text-kalos-accent">.</span>STHENOS
    </span>
  );
}

function SectionShell({
  id,
  children,
  tone = "base",
  className,
}: {
  id?: string;
  children: ReactNode;
  tone?: "base" | "alt" | "elevated";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        SECTION_PY,
        tone === "alt" && "kalos-section-alt",
        tone === "elevated" && "kalos-section-elevated",
        className,
      )}
    >
      {tone !== "base" && (
        <div className="pointer-events-none absolute inset-0 grain opacity-80" aria-hidden />
      )}
      <div className={cn(CONTAINER, "relative z-10")}>{children}</div>
    </section>
  );
}

export function KalosSthenosPage() {
  useKalosPageMeta();

  return (
    <main className="kalos-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#top"
        className="absolute -top-14 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 focus:top-0 focus:translate-y-4 focus:outline-none focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      <KalosHeader />
      <KalosHero />
      <TrustStrip />
      <TrialIncludesSection />
      <HowItWorksSection />
      <WhoItsForSection />
      <ResultsSection />
      <WhyKalosSection />
      <ProgramsSection />
      <FAQSection />
      <FinalCTASection />
      <KalosFooter />
      <StickyMobileCta />
    </main>
  );
}

function KalosHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavFirstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      queueMicrotask(() => menuButtonRef.current?.focus());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => mobileNavFirstLinkRef.current?.focus());
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/90 py-2 backdrop-blur-xl"
          : "bg-transparent py-4",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[77.5rem] items-center gap-4 px-5 md:px-8 lg:px-10",
          scrolled && "md:h-[3.25rem]",
        )}
      >
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-9 place-items-center rounded-lg border border-kalos-accent/30 bg-kalos-accent/10">
            <KalosLogo className="size-4 text-kalos-accent" />
          </span>
          <KalosWordmark className="hidden text-sm sm:inline sm:text-base" />
        </a>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center md:flex">
          <Button asChild className={cn("h-10 px-5", PRIMARY_CTA_CLASS)}>
            <a href={`#${TRIAL_FORM_ID}`}>
              {PRIMARY_CTA}
              <CtaArrow />
            </a>
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-md border border-border/60 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={MOBILE_NAV_PANEL_ID}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <div
          id={MOBILE_NAV_PANEL_ID}
          role="navigation"
          aria-label="Mobile site navigation"
          className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                ref={i === 0 ? mobileNavFirstLinkRef : undefined}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <Button asChild className={cn("mt-2 w-full", PRIMARY_CTA_CLASS)}>
              <a href={`#${TRIAL_FORM_ID}`} onClick={() => setOpen(false)}>
                {PRIMARY_CTA}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function KalosHero() {
  const reduceMotion = useReducedMotion();
  const heroProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 kalos-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />

      <div className="absolute inset-0">
        <img
          src={indoorImg}
          alt=""
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          className="size-full object-cover opacity-[0.22] saturate-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70" />
      </div>

      <div
        className={cn(
          CONTAINER,
          "relative z-10 flex min-h-[100svh] flex-col justify-center pt-28 pb-24 md:pt-32 md:pb-28",
        )}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div {...heroProps} className="max-w-2xl">
            <h1 className="font-display text-[clamp(2.35rem,5.8vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance">
              Experience Coaching That Actually Changes How You Train
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl md:leading-[1.65]">
              Try Kalos Sthenos free for 7 days before committing to a membership.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className={cn("h-12 min-h-12 px-8", PRIMARY_CTA_CLASS)}>
                <a href={`#${TRIAL_FORM_ID}`}>
                  {PRIMARY_CTA}
                  <CtaArrow />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className={cn("h-12 min-h-12", SECONDARY_CTA_CLASS)}
              >
                <a href="#trial-includes">
                  {SECONDARY_CTA}
                  <ArrowDown className="size-4 opacity-70" aria-hidden />
                </a>
              </Button>
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-kalos-accent/90">
              {BRAND_CLARITY}
            </p>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {CTA_REASSURANCE}
            </p>

            <div className="mt-10 flex flex-wrap gap-2 border-t border-border/40 pt-8">
              {HERO_PROOF.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border/50 bg-surface/40 px-3 py-1.5 text-xs text-foreground/85"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...(reduceMotion
              ? { initial: false as const }
              : {
                  initial: { opacity: 0, y: 28 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const },
                })}
            className="relative hidden lg:block"
          >
            <div className="kalos-panel overflow-hidden">
              <img
                src={coachImg}
                alt="Coach leading a small group strength session"
                width={900}
                height={1100}
                decoding="async"
                className="aspect-[4/5] w-full object-cover object-[center_15%]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 pt-16">
                <p className="font-display text-lg font-semibold">Coach-led. Every session.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Small groups capped at 10 — so you get real attention.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section
      className="relative border-y border-border/50 bg-surface/45 py-5 md:py-6"
      aria-label="Social proof"
    >
      <div className={CONTAINER}>
        <div className="flex flex-col items-center gap-4 text-center md:gap-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex gap-0.5 text-kalos-accent" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-sm font-medium text-foreground/90 md:text-base">
              Member-loved coaching in Canyon Country
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {TRUST_STRIP_PROOF.map((point) => (
              <span
                key={point}
                className="rounded-full border border-border/55 bg-background/50 px-3.5 py-1.5 text-xs font-medium text-foreground/85 md:text-sm"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrialIncludesSection() {
  return (
    <SectionShell id="trial-includes" tone="alt">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-kalos-accent">
            Your free week
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
            Exactly What Your Free Trial Includes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
            No guessing. No fine print. Here&apos;s what you get the moment you claim your trial.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {TRIAL_INCLUDES.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <article className="kalos-card group flex h-full flex-col p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="kalos-icon-box size-11 shrink-0">
                  <item.icon className="size-5 text-kalos-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-start gap-2">
                    <Check
                      className="mt-1 size-4 shrink-0 text-kalos-accent"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 pl-6 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-12 text-center">
          <Button asChild size="lg" className={cn("h-12", PRIMARY_CTA_CLASS)}>
            <a href={`#${TRIAL_FORM_ID}`}>
              {PRIMARY_CTA}
              <CtaArrow />
            </a>
          </Button>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works" tone="base">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Three steps
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
            How It Works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            One starting point — no separate links, opt-ins, or booking systems to figure out.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08}>
            <div className="relative">
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <div
                  className="pointer-events-none absolute left-1/2 top-12 hidden h-px w-[calc(100%+2rem)] bg-border/60 md:block"
                  aria-hidden
                />
              )}
              <article className="kalos-card h-full p-7 md:p-8">
                <span className="font-display text-4xl font-semibold tracking-tight text-kalos-accent/80">
                  {step.step}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                  <CheckCircle2 className="size-3.5 text-kalos-accent" aria-hidden />
                  {step.reassurance}
                </p>
              </article>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <div className="mt-14 rounded-2xl border border-kalos-accent/25 bg-kalos-accent/5 px-6 py-8 text-center md:px-10">
          <p className="font-display text-lg font-semibold md:text-xl">
            Ready to start? One form. One coach. One path.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Step 1 takes under 60 seconds. A coach handles the rest.
          </p>
          <Button asChild size="lg" className={cn("mt-5 h-12", PRIMARY_CTA_CLASS)}>
            <a href={`#${TRIAL_FORM_ID}`}>
              {PRIMARY_CTA}
              <CtaArrow />
            </a>
          </Button>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function WhoItsForSection() {
  return (
    <SectionShell id="who-its-for" tone="elevated">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Is this for you?
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
            Who This Is For
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            If you&apos;re comparing gyms on four tabs, start here. Kalos Sthenos is built for
            people who want coaching — not just access to equipment.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {WHO_ITS_FOR.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.06}>
            <article className="kalos-card flex h-full flex-col p-7">
              <div className="kalos-icon-box size-11">
                <card.icon className="size-5 text-kalos-accent" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold leading-snug">{card.title}</h3>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.goals.map((goal) => (
                  <span
                    key={goal}
                    className="rounded-md border border-border/50 bg-background/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {goal}
                  </span>
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {card.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ResultsSection() {
  return (
    <SectionShell id="results" tone="base">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Proof
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
              Real Transformations
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Quality movement and consistent coaching — not crash diets or extreme programs.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-5 py-3">
            <div className="flex gap-0.5 text-kalos-accent" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Rated by members</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="kalos-card flex aspect-[4/5] flex-col items-center justify-center p-6 text-center md:p-8"
            >
              <div className="flex w-full max-w-[12rem] gap-px overflow-hidden rounded-lg border border-border/50">
                <div className="flex h-20 flex-1 flex-col items-center justify-center bg-surface-elevated/80 px-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Before
                  </span>
                </div>
                <div className="w-px bg-border/60" aria-hidden />
                <div className="flex h-20 flex-1 flex-col items-center justify-center bg-kalos-accent/8 px-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-kalos-accent/90">
                    After
                  </span>
                </div>
              </div>
              <p className="mt-5 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">
                Before / After examples available on consultation
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={0.08 + i * 0.04}>
            <blockquote className="kalos-card flex h-full flex-col p-6 md:p-7">
              <div
                className="flex gap-0.5 text-kalos-accent"
                aria-label={`${t.rating} star rating`}
              >
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="size-3.5 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-5 border-t border-border/50 pt-4 text-sm font-medium text-muted-foreground">
                — {t.name}
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-border/40 pt-10">
          {COMMUNITY_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-semibold tracking-tight text-kalos-accent md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}

function WhyKalosSection() {
  return (
    <SectionShell tone="alt">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <div className="kalos-panel overflow-hidden">
            <img
              src={outdoorImg}
              alt="Members training in a supportive small group environment"
              width={1024}
              height={820}
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Why members stay
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
              Why Kalos Sthenos
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Not more machines. Not louder workouts. Just coaching, community, and programming that
              works for real people with real lives.
            </p>
          </Reveal>

          <div className="mt-8 space-y-4">
            {WHY_KALOS.map((item, i) => (
              <Reveal key={item.title} delay={0.04 + i * 0.04}>
                <div className="kalos-benefit-row flex gap-4 rounded-xl border border-border/50 bg-background/40 p-5">
                  <div className="kalos-icon-box size-10 shrink-0">
                    <item.icon className="size-4 text-kalos-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ProgramsSection() {
  return (
    <SectionShell id="programs" tone="elevated">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            All included in your trial
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
            Programs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Try any class during your free week. No need to pick a program before you start.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PROGRAMS.map((program, i) => (
          <Reveal key={program.title} delay={i * 0.06}>
            <article className="kalos-card flex h-full flex-col p-7 md:p-8">
              <div className="kalos-icon-box size-11">
                <program.icon className="size-5 text-kalos-accent" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{program.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {program.description}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-kalos-accent">
                {program.includes}
              </p>
              <Button
                asChild
                variant="outline"
                className={cn("mt-6 w-full border-border/70", SECONDARY_CTA_CLASS)}
              >
                <a href={`#${TRIAL_FORM_ID}`}>
                  {PRIMARY_CTA}
                  <CtaArrow />
                </a>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function FAQSection() {
  return (
    <SectionShell id="faq" tone="base">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Before you click
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
            Common Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The questions people ask right before signing up — answered upfront.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border/60 bg-background overflow-hidden"
        >
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              className="border-border/60 last:border-0"
            >
              <AccordionTrigger className="px-6 py-5 text-left font-display text-base font-medium hover:text-kalos-accent hover:no-underline md:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </SectionShell>
  );
}

function FinalCTASection() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TrialFormValues>({
    resolver: zodResolver(trialFormSchema),
    defaultValues: { name: "", email: "", phone: "", goal: "" },
  });

  const onSubmit = (values: TrialFormValues) => {
    setSubmitted(true);
    toast.success("Trial claimed!", {
      description: `Thanks ${values.name.split(" ")[0]} — a coach will reach out within 24 hours.`,
    });
  };

  return (
    <section id={TRIAL_FORM_ID} className={cn("relative kalos-section-alt", SECTION_PY)}>
      <div
        className="pointer-events-none absolute inset-0 kalos-hero-glow opacity-40"
        aria-hidden
      />
      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-kalos-accent">
                Start today
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
                {PRIMARY_CTA}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                One form. A coach calls you. You train free for seven days — no scattered links, no
                confusing sign-up paths.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited classes for 7 days",
                  "Initial coach assessment included",
                  "No commitment required",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-kalos-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3 text-sm text-muted-foreground">
                <a
                  href={KALOS_CONTACT.phoneHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4" aria-hidden />
                  {KALOS_CONTACT.phone}
                </a>
                <p className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {KALOS_CONTACT.address}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="kalos-panel p-6 md:p-8">
              {submitted ? (
                <div className="flex min-h-[20rem] flex-col items-center justify-center text-center py-8">
                  <div className="grid size-14 place-items-center rounded-full border border-kalos-accent/40 bg-kalos-accent/10">
                    <CheckCircle2 className="size-7 text-kalos-accent" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold">You&apos;re in.</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {CTA_AFTER_SUBMIT}
                  </p>
                  <Button asChild variant="outline" className={cn("mt-6", SECONDARY_CTA_CLASS)}>
                    <a href={KALOS_CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
                      Get directions
                      <CtaArrow />
                    </a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="kalos-name">Full name</Label>
                    <Input
                      id="kalos-name"
                      placeholder="Your name"
                      className="h-11 bg-surface-elevated border-border"
                      aria-invalid={!!form.formState.errors.name}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive" role="alert">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kalos-email">Email</Label>
                    <Input
                      id="kalos-email"
                      type="email"
                      placeholder="you@email.com"
                      className="h-11 bg-surface-elevated border-border"
                      aria-invalid={!!form.formState.errors.email}
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive" role="alert">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kalos-phone">Phone</Label>
                    <Input
                      id="kalos-phone"
                      type="tel"
                      placeholder="(661) 555-0123"
                      className="h-11 bg-surface-elevated border-border"
                      aria-invalid={!!form.formState.errors.phone}
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-xs text-destructive" role="alert">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kalos-goal">Primary goal</Label>
                    <Controller
                      name="goal"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            value={field.value || undefined}
                            onValueChange={(v) => {
                              field.onChange(v);
                              form.trigger("goal");
                            }}
                          >
                            <SelectTrigger
                              id="kalos-goal"
                              className="h-11 bg-surface-elevated border-border"
                              aria-invalid={fieldState.invalid}
                            >
                              <SelectValue placeholder="What do you want to work on?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lose-weight">Lose weight</SelectItem>
                              <SelectItem value="build-strength">Build strength</SelectItem>
                              <SelectItem value="improve-health">Improve health</SelectItem>
                              <SelectItem value="feel-better">Feel better</SelectItem>
                              <SelectItem value="train-consistently">Train consistently</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <p className="text-xs text-destructive" role="alert">
                              {fieldState.error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <Button type="submit" size="lg" className={cn("h-12 w-full", PRIMARY_CTA_CLASS)}>
                    {PRIMARY_CTA}
                    <CtaArrow />
                  </Button>

                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    {FORM_REASSURANCE}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function KalosFooter() {
  return (
    <footer className="border-t border-border/60 bg-background py-14 md:py-16">
      <div className={CONTAINER}>
        <div className="kalos-panel mx-auto max-w-3xl px-8 py-10 text-center md:px-12 md:py-12">
          <div className="flex items-center justify-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg border border-kalos-accent/30 bg-kalos-accent/10">
              <KalosLogo className="size-4 text-kalos-accent" />
            </span>
            <KalosWordmark full className="text-base md:text-lg" />
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Coach-led strength &amp; conditioning in Canyon Country. Small groups. Real coaching.
          </p>
          <Button asChild size="lg" className={cn("mt-7 h-12", PRIMARY_CTA_CLASS)}>
            <a href={`#${TRIAL_FORM_ID}`}>
              {PRIMARY_CTA}
              <CtaArrow />
            </a>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">{FOOTER_TAGLINE}</p>
        </div>

        <div className="mt-12 grid gap-8 border-t border-border/50 pt-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={KALOS_CONTACT.phoneHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {KALOS_CONTACT.phone}
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {KALOS_CONTACT.address}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Visit
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {KALOS_CONTACT.shortAddress}
            </p>
            <a
              href={KALOS_CONTACT.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground/80 underline-offset-4 transition-colors hover:text-kalos-accent hover:underline"
            >
              Get directions
              <CtaArrow className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <p>{BRAND_CLARITY}</p>
        </div>
      </div>
    </footer>
  );
}

const STICKY_DISMISS_KEY = "kalos-sticky-trial-dismiss";

function StickyMobileCta() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(STICKY_DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      const form = document.getElementById(TRIAL_FORM_ID);
      const vh = window.innerHeight;
      let pastHero = false;
      if (hero) {
        pastHero = hero.getBoundingClientRect().bottom < vh * 0.25;
      } else {
        pastHero = window.scrollY > vh * 0.5;
      }
      let formOnScreen = false;
      if (form) {
        const fr = form.getBoundingClientRect();
        formOnScreen = fr.top < vh * 0.85 && fr.bottom > vh * 0.15;
      }
      setVisible(pastHero && !formOnScreen);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STICKY_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-[opacity,transform] duration-300 ease-out md:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-lg items-stretch gap-2 rounded-2xl border border-border/70 bg-background/95 p-2 pl-3 shadow-lg backdrop-blur-xl">
        <a
          href={`#${TRIAL_FORM_ID}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-kalos-accent px-3 py-3 text-xs font-semibold leading-tight text-kalos-accent-foreground shadow-kalos transition-all hover:bg-kalos-accent/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:text-sm"
        >
          {PRIMARY_CTA}
          <CtaArrow />
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="grid size-11 shrink-0 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dismiss trial shortcut"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
