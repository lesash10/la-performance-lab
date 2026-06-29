import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  ImageIcon,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { SpryReveal } from "./SpryReveal";
import { cn } from "@/lib/utils";

import {
  CERTIFICATIONS,
  COACHING_FOOTNOTE,
  COACHING_PATHS,
  CONSULTATION_GOALS,
  CONSULTATION_TOPICS,
  CTA_AFTER_SUBMIT,
  CTA_SUPPORT,
  EVAN_CREDIBILITY,
  FAQ_ITEMS,
  HOW_IT_WORKS_STEPS,
  NAV,
  PHILOSOPHY_CARDS,
  PRIMARY_CTA,
  RESULTS_PROOF_CHIPS,
  SECONDARY_TESTIMONIAL,
  SERVICE_PILLARS,
  SPRY_CONTACT,
  WHO_ITS_FOR,
} from "./spry-content";
import { useSpryPageMeta } from "./useSpryPageMeta";

const MOBILE_NAV_PANEL_ID = "spry-mobile-nav-panel";
const CONSULTATION_ID = "consultation";

const consultationFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  goal: z.string().min(1, "Please select a goal"),
  message: z.string().optional(),
});
type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

const PRIMARY_CTA_CLASS =
  "group rounded-full bg-spry-accent px-7 font-semibold tracking-[0.01em] text-spry-accent-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_12%,transparent),0_12px_40px_-12px_oklch(0_0_0/0.5)] transition-[transform,box-shadow,background-color] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:bg-spry-accent/95 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_18%,transparent),0_16px_48px_-14px_oklch(0_0_0/0.55)]";
const SECONDARY_CTA_CLASS =
  "group rounded-full border-border/70 bg-surface/40 px-7 font-semibold tracking-[0.01em] backdrop-blur transition-[transform,border-color,background-color] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-surface-elevated hover:text-foreground";
const SECTION_PY = "py-14 md:py-20 lg:py-28";
const CONTAINER = "mx-auto max-w-[77.5rem] px-5 md:px-8 lg:px-10";
const CARD_BODY = "spry-card flex h-full flex-col p-5 md:p-6";

function CtaArrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("spry-cta-arrow size-4", className)} aria-hidden />;
}

function SpryLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 18V6l5 4.5L17 6v12M7 18h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpryWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-semibold tracking-[0.12em]", className)}>
      SPRY<span className="text-foreground/55">.</span>FITNESS
    </span>
  );
}

function SpryImagePlaceholder({
  label,
  className,
  aspect = "portrait",
  variant = "default",
  compact = false,
}: {
  label: string;
  className?: string;
  aspect?: "portrait" | "landscape" | "square";
  variant?: "default" | "before-after";
  compact?: boolean;
}) {
  const aspectClass =
    aspect === "landscape"
      ? "aspect-[16/10]"
      : aspect === "square"
        ? "aspect-square"
        : "aspect-[4/5]";

  return (
    <div
      className={cn(
        "spry-image-placeholder spry-image-slot spry-editorial-frame spry-editorial-vignette relative overflow-hidden rounded-[1.5rem] border border-border/50",
        aspectClass,
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--border) 28%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 28%, transparent) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,color-mix(in_oklab,var(--foreground)_4%,transparent),transparent_70%)]"
        aria-hidden
      />
      {variant === "before-after" && (
        <>
          <div
            className="absolute inset-y-0 left-0 w-1/2 border-r border-foreground/10 bg-[linear-gradient(145deg,color-mix(in_oklab,var(--surface-elevated)_75%,transparent),transparent)]"
            aria-hidden
          />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-foreground/12" aria-hidden />
          <div className="absolute bottom-3 left-3 rounded-md border border-border/55 bg-background/75 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
            Before
          </div>
          <div className="absolute bottom-3 right-3 rounded-md border border-border/55 bg-background/75 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
            After
          </div>
        </>
      )}
      <div className="absolute inset-2.5 rounded-[1.05rem] border border-foreground/[0.05]" aria-hidden />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-background/88 via-background/40 to-transparent text-center",
          compact ? "gap-1 px-4 pb-4 pt-10" : "gap-1.5 px-5 pb-5 pt-12",
        )}
      >
        <div className="grid size-7 place-items-center rounded-md border border-border/55 bg-surface-elevated/70">
          <ImageIcon className="size-3 text-muted-foreground/80" strokeWidth={1.5} aria-hidden />
        </div>
        <p
          className={cn(
            "max-w-[14rem] font-medium uppercase tracking-[0.14em] text-foreground/55",
            compact ? "text-[9px]" : "text-[10px]",
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function SectionBackdrop({
  tone = "default",
}: {
  tone?: "default" | "elevated" | "glow" | "glow-left" | "glow-right";
}) {
  return (
    <>
      {tone === "glow" && (
        <div className="pointer-events-none absolute inset-0 spry-section-glow" aria-hidden />
      )}
      {tone === "glow-left" && (
        <div className="pointer-events-none absolute inset-0 spry-section-glow-left" aria-hidden />
      )}
      {tone === "glow-right" && (
        <div className="pointer-events-none absolute inset-0 spry-section-glow-right" aria-hidden />
      )}
      {tone === "elevated" && (
        <div className="pointer-events-none absolute inset-0 bg-surface/20" aria-hidden />
      )}
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
    </>
  );
}

export function SpryPrototypePage() {
  useSpryPageMeta();

  return (
    <main className="spry-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#top"
        className="absolute -top-14 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 focus:top-0 focus:translate-y-4 focus:outline-none focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      <SpryHeader />
      <SpryHero />
      <SocialProofStrip />
      <FitSection />
      <ResultsSection />
      <CoachingPathSection />
      <HowItWorksSection />
      <CoachSection />
      <ConsultationSection />
      <FAQSection />
      <SpryFooter />
      <StickyMobileCta />
    </main>
  );
}

function SpryHeader() {
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-[70rem] items-center gap-3 rounded-full border px-3 py-2 transition-all duration-300 md:gap-4 md:px-4 md:py-2.5",
          scrolled
            ? "border-border/70 bg-background/88 shadow-spry backdrop-blur-xl"
            : "border-border/45 bg-background/62 backdrop-blur-lg",
        )}
      >
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-8 place-items-center rounded-full border border-border/60 bg-surface-elevated transition-colors group-hover:border-foreground/20 group-hover:bg-surface">
            <SpryLogo className="size-3.5 text-foreground/90" />
          </span>
          <SpryWordmark className="hidden text-[0.72rem] sm:inline sm:text-[0.78rem]" />
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 xl:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-2 text-[0.82rem] text-muted-foreground transition-colors hover:bg-surface/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center md:flex">
          <Button asChild className={cn("h-9 px-4 text-xs sm:h-10 sm:px-5 sm:text-sm", PRIMARY_CTA_CLASS)}>
            <a href={`#${CONSULTATION_ID}`}>
              {PRIMARY_CTA}
              <CtaArrow className="size-3.5 sm:size-4" />
            </a>
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="ml-auto grid size-9 place-items-center rounded-full border border-border/60 transition-colors hover:bg-surface/80 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={MOBILE_NAV_PANEL_ID}
        >
          {open ? <X className="size-4.5" aria-hidden /> : <Menu className="size-4.5" aria-hidden />}
        </button>
      </div>

      {open && (
        <div
          id={MOBILE_NAV_PANEL_ID}
          role="navigation"
          aria-label="Mobile site navigation"
          className="pointer-events-auto mx-auto mt-2 max-w-[70rem] overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/96 shadow-spry backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-0.5 p-3">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                ref={i === 0 ? mobileNavFirstLinkRef : undefined}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <Button asChild className={cn("mt-2 w-full", PRIMARY_CTA_CLASS)}>
              <a href={`#${CONSULTATION_ID}`} onClick={() => setOpen(false)}>
                {PRIMARY_CTA}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function SpryHero() {
  const reduceMotion = useReducedMotion();
  const heroProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="top"
      className={cn("relative overflow-hidden pt-24 pb-8 md:pt-28 md:pb-12 lg:pt-32", SECTION_PY)}
    >
      <SectionBackdrop tone="glow-left" />
      <div
        className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl"
        aria-hidden
      />

      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 xl:gap-16">
          <motion.div {...heroProps} className="max-w-2xl lg:max-w-none">
            <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span>Personal Training · Santa Monica</span>
              <span className="hidden text-border sm:inline" aria-hidden>
                ·
              </span>
              <a
                href={SPRY_CONTACT.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="normal-case tracking-normal text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {SPRY_CONTACT.shortAddress}
              </a>
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.35rem,5.2vw,4.25rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-balance">
              Build strength, move better, and stay consistent.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty md:text-[1.05rem] md:leading-[1.68]">
              1-on-1 and small group coaching built around your goals, your body, and your
              lifestyle — without quick fixes or burnout.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className={cn("h-12 min-h-12 px-8", PRIMARY_CTA_CLASS)}>
                <a href={`#${CONSULTATION_ID}`}>
                  {PRIMARY_CTA}
                  <CtaArrow />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className={cn("h-12 min-h-12", SECONDARY_CTA_CLASS)}>
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{CTA_SUPPORT}</p>

            <div className="mt-8 flex flex-wrap gap-2 border-t border-border/40 pt-7">
              {SERVICE_PILLARS.map((pillar) => (
                <span
                  key={pillar}
                  className="rounded-full border border-border/50 bg-surface/35 px-3 py-1 text-[11px] text-foreground/80 md:text-xs"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...(reduceMotion
              ? { initial: false as const }
              : {
                  initial: { opacity: 0, y: 22 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.32, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const },
                })}
            className="relative mx-auto w-full max-w-[16rem] sm:max-w-[18rem] lg:mx-0 lg:max-w-xs xl:max-w-sm"
          >
            <div
              className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-foreground/[0.04] blur-2xl"
              aria-hidden
            />
            <div className="spry-panel group relative overflow-hidden p-1.5">
              <div className="overflow-hidden rounded-[1.35rem]">
                <SpryImagePlaceholder
                  label="Evan coaching client image"
                  aspect="portrait"
                  compact
                  className="!aspect-[5/6] max-h-[22rem] !rounded-none !border-0 sm:!aspect-[4/5] sm:max-h-none transition-transform duration-300 group-hover:scale-[1.012] motion-reduce:transform-none"
                />
              </div>
              <div className="absolute left-3 right-3 top-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/88 px-2.5 py-1 text-[10px] text-foreground/85 backdrop-blur-md">
                  <Star className="size-2.5 fill-current" aria-hidden />
                  5-star reviews
                </span>
                <span className="rounded-full border border-border/60 bg-background/88 px-2.5 py-1 text-[10px] text-foreground/80 backdrop-blur-md">
                  Santa Monica
                </span>
                <span className="rounded-full border border-border/60 bg-background/88 px-2.5 py-1 text-[10px] text-foreground/80 backdrop-blur-md">
                  Free 20-minute consultation
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 left-2 right-2 rounded-xl border border-border/60 bg-background/94 p-3.5 shadow-spry backdrop-blur-md sm:-bottom-3 sm:left-auto sm:right-3 sm:max-w-[14.5rem]">
              <p className="font-display text-[0.8rem] font-semibold leading-snug sm:text-[0.82rem]">
                Goals · Movement · Next step
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
                Start with a conversation — no pressure.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SocialProofStrip() {
  return (
    <section
      className="relative border-y border-border/40 bg-surface/30 py-4 md:py-5"
      aria-label="Client review"
    >
      <div className={CONTAINER}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-10">
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-0.5 text-foreground/85" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3 fill-current" />
              ))}
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Client review
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground md:border-l md:border-border/50 md:pl-10 md:text-[0.9rem]">
            &ldquo;{SECONDARY_TESTIMONIAL.quote}&rdquo;
            <span className="mt-1.5 block text-xs text-muted-foreground/90">
              — {SECONDARY_TESTIMONIAL.name}, {SECONDARY_TESTIMONIAL.date}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function FitSection() {
  return (
    <section id="who-its-for" className={cn("relative", SECTION_PY)}>
      <SectionBackdrop tone="elevated" />
      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="spry-panel overflow-hidden p-6 md:p-10 lg:p-12">
          <SpryReveal>
            <div className="max-w-3xl lg:max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Before you commit
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
                Is Spry the right fit for you?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
                The first step is not a sales call. Your free consultation covers your goals, your
                movement, and the coaching path that makes sense.
              </p>
            </div>
          </SpryReveal>

          <SpryReveal delay={0.05}>
            <p className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground md:mt-12">
              What we&apos;ll cover in your consultation
            </p>
          </SpryReveal>
          <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
            {CONSULTATION_TOPICS.map((card, i) => (
              <SpryReveal key={card.title} delay={0.06 + i * 0.04}>
                <article className={CARD_BODY}>
                  <div className="spry-icon-box size-10">
                    <card.icon className="size-4 text-foreground/75" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold md:text-lg">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
                </article>
              </SpryReveal>
            ))}
          </div>

          <SpryReveal delay={0.1}>
            <p className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              You might be a great fit if&hellip;
            </p>
          </SpryReveal>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {WHO_ITS_FOR.map((item, i) => (
              <SpryReveal key={item.title} delay={0.12 + i * 0.03}>
                <article className={cn(CARD_BODY, "bg-surface/20")}>
                  <div className="spry-icon-box size-9">
                    <item.icon className="size-3.5 text-foreground/70" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-3 font-display text-[0.92rem] font-semibold leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              </SpryReveal>
            ))}
          </div>

          <SpryReveal delay={0.16}>
            <div className="mt-10 flex flex-col items-start gap-3 border-t border-border/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-xs text-muted-foreground">{CTA_AFTER_SUBMIT}</p>
              <Button asChild className={cn("h-11 shrink-0", PRIMARY_CTA_CLASS)}>
                <a href={`#${CONSULTATION_ID}`}>
                  {PRIMARY_CTA}
                  <CtaArrow />
                </a>
              </Button>
            </div>
          </SpryReveal>
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  return (
    <section id="results" className={cn("relative overflow-hidden", SECTION_PY)}>
      <SectionBackdrop tone="glow-right" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent"
        aria-hidden
      />
      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <SpryReveal className="lg:col-span-7">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-foreground/[0.035] blur-2xl"
                aria-hidden
              />
              <div className="spry-panel overflow-hidden p-1.5">
                <div className="group overflow-hidden rounded-[1.35rem]">
                  <SpryImagePlaceholder
                    label="Client transformation before / after"
                    aspect="landscape"
                    variant="before-after"
                    className="!aspect-[4/3] !rounded-none !border-0 max-h-[16rem] sm:max-h-none transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transform-none md:!aspect-[5/4]"
                  />
                </div>
              </div>
            </div>
          </SpryReveal>

          <SpryReveal delay={0.08} className="lg:col-span-5 lg:-ml-6 xl:-ml-10">
            <div className="lg:pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Real client progress
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.85rem,3.6vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
                Progress you can see. Confidence you can feel.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                Built to help you move better and feel stronger — without burnout or extreme
                restrictions.
              </p>

              <blockquote className="mt-8 rounded-[1.35rem] border border-border/55 bg-background/55 p-6 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_5%,transparent)] md:p-7">
                <div className="flex items-center gap-1 text-foreground/90" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" aria-hidden />
                  ))}
                </div>
                <p className="mt-4 font-display text-lg font-medium leading-snug text-foreground md:text-xl">
                  &ldquo;I was a true novice in the gym, but Evan made me feel at home immediately.
                  Sometimes it only takes one person to believe in you, and that can turn your whole
                  life around.&rdquo;
                </p>
                <footer className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <cite className="not-italic font-medium text-foreground">Bayeux Morgan</cite>
                  <span className="text-border" aria-hidden>
                    ·
                  </span>
                  <span>12-week transformation</span>
                </footer>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {RESULTS_PROOF_CHIPS.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-border/55 bg-surface/35 px-2.5 py-0.5 text-[10px] text-foreground/80 md:text-[11px]"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-border/40 pt-6">
                  <Button asChild variant="outline" className={cn("h-11", SECONDARY_CTA_CLASS)}>
                    <a href={`#${CONSULTATION_ID}`}>
                      {PRIMARY_CTA}
                      <CtaArrow />
                    </a>
                  </Button>
                </div>
              </blockquote>
            </div>
          </SpryReveal>
        </div>
      </div>
    </section>
  );
}

function CoachingPathSection() {
  return (
    <section id="coaching" className={cn("relative border-y border-border/35 bg-surface/10", SECTION_PY)}>
      <SectionBackdrop tone="glow-left" />
      <div className={cn(CONTAINER, "relative z-10")}>
        <SpryReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Coaching paths
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
              Choose the coaching path that fits your life.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              All paths include nutrition guidance and ongoing support.
            </p>
          </div>
        </SpryReveal>

        <div className="mt-10 -mx-5 flex gap-3.5 overflow-x-auto px-5 pb-1 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
          {COACHING_PATHS.map((path, i) => (
            <SpryReveal
              key={path.title}
              delay={i * 0.05}
              className="min-w-[82%] snap-center sm:min-w-[62%] md:min-w-0"
            >
              <article className={cn(CARD_BODY, "md:p-7")}>
                <div className="spry-icon-box size-10">
                  <path.icon className="size-[1.15rem] text-foreground/75" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{path.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {path.description}
                </p>
                <div className="mt-5 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Best for
                  </p>
                  <ul className="mt-2.5 space-y-1.5">
                    {path.bestFor.map((item) => (
                      <li key={item} className="text-sm text-foreground/88">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className={cn("mt-6 w-full border-border/65 text-sm", SECONDARY_CTA_CLASS)}
                >
                  <a href={`#${CONSULTATION_ID}`}>
                    {PRIMARY_CTA}
                    <CtaArrow />
                  </a>
                </Button>
              </article>
            </SpryReveal>
          ))}
        </div>

        <SpryReveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
            {COACHING_FOOTNOTE}
          </p>
        </SpryReveal>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className={cn("relative border-y border-border/35 bg-surface/20", SECTION_PY)}
    >
      <SectionBackdrop tone="elevated" />
      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="grid gap-12 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
          <SpryReveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Low pressure process
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
              What happens after you reach out?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              No pressure. No guesswork. Just a clear first step toward coaching that fits your
              life.
            </p>
            <div className="mt-8 hidden lg:block">
              <Button asChild className={cn("h-11", PRIMARY_CTA_CLASS)}>
                <a href={`#${CONSULTATION_ID}`}>
                  {PRIMARY_CTA}
                  <CtaArrow />
                </a>
              </Button>
            </div>
          </SpryReveal>

          <div>
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <SpryReveal key={step.step} delay={i * 0.04}>
                <div className="relative flex gap-5 pb-8 last:pb-0 md:gap-6">
                  {i < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div
                      className="absolute left-[1rem] top-9 bottom-0 w-px bg-border/60 md:left-[1.125rem]"
                      aria-hidden
                    />
                  )}
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border/65 bg-background font-display text-[11px] font-semibold text-muted-foreground md:size-9 md:text-xs">
                    {step.step}
                  </div>
                  <div className="min-w-0 flex-1 rounded-xl border border-border/40 bg-background/30 px-4 py-3.5 md:px-5 md:py-4">
                    <h3 className="font-display text-base font-semibold md:text-lg">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </div>
              </SpryReveal>
            ))}
          </div>
        </div>

        <SpryReveal delay={0.08}>
          <div className="mt-10 text-center lg:hidden">
            <Button asChild size="lg" className={cn("h-12", PRIMARY_CTA_CLASS)}>
              <a href={`#${CONSULTATION_ID}`}>
                {PRIMARY_CTA}
                <CtaArrow />
              </a>
            </Button>
          </div>
        </SpryReveal>
      </div>
    </section>
  );
}

function CoachSection() {
  return (
    <section className={cn("relative", SECTION_PY)}>
      <SectionBackdrop tone="glow" />
      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <SpryReveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-[15rem] sm:max-w-xs lg:mx-0 lg:max-w-none">
              <div
                className="pointer-events-none absolute -left-4 top-8 hidden h-3/4 w-3/4 rounded-full bg-foreground/[0.03] blur-3xl lg:block"
                aria-hidden
              />
              <div className="spry-panel rotate-[-1.5deg] p-1.5 lg:rotate-0">
                <SpryImagePlaceholder
                  label="Evan Spry portrait"
                  aspect="portrait"
                  compact
                  className="!aspect-[4/5] max-h-[18rem] !rounded-[1.2rem] sm:max-h-[22rem] lg:max-h-none"
                />
              </div>
            </div>
          </SpryReveal>

          <SpryReveal delay={0.06} className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Meet your coach
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              Meet Evan Spry
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-[1.02rem]">
              Evan Spry is a personal trainer in Santa Monica helping people build strength, move
              better, and create confidence that lasts beyond the gym.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              A former college football player at Dordt University, Evan brings physical therapy
              principles into strength training, corrective exercise, mobility work, and nutrition
              support — energetic, caring, and built for sustainable results.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground/90 md:text-sm">
              {EVAN_CREDIBILITY}
            </p>

            <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
              {PHILOSOPHY_CARDS.map((card) => (
                <div key={card.title} className="spry-card px-4 py-3.5">
                  <div className="spry-icon-box size-8">
                    <card.icon className="size-3.5 text-foreground/65" strokeWidth={1.5} />
                  </div>
                  <p className="mt-2.5 text-[0.82rem] font-medium leading-snug">{card.title}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {CERTIFICATIONS.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-border/55 bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {cert}
                </span>
              ))}
            </div>
          </SpryReveal>
        </div>
      </div>
    </section>
  );
}

function ConsultationSection() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: { name: "", email: "", goal: "", message: "" },
  });
  const { control } = form;

  const onSubmit = (values: ConsultationFormValues) => {
    setSubmitted(true);
    toast.success("Request received", {
      description: `Thanks ${values.name.split(" ")[0]} — Evan will follow up to confirm your consultation.`,
    });
  };

  return (
    <section
      id={CONSULTATION_ID}
      className={cn("relative scroll-mt-[5.75rem] border-t border-border/40 md:scroll-mt-[6.25rem]", SECTION_PY)}
    >
      <div className="pointer-events-none absolute inset-0 spry-section-glow" aria-hidden />
      <div className={cn(CONTAINER, "relative z-10")}>
        <SpryReveal>
          <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-surface/40 shadow-spry">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-border/45 bg-background/30 px-6 py-8 md:px-9 md:py-10 lg:border-b-0 lg:border-r">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Final step
                </p>
                <h2 className="mt-3 font-display text-[clamp(1.85rem,3.4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
                  Start with one simple conversation.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Tell us what you want to improve. We&apos;ll help you understand the best next step
                  — whether that&apos;s 1-on-1 coaching, small group training, or simply a better
                  plan.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">{CTA_SUPPORT}</p>

                <div className="mt-8 space-y-3">
                  <a
                    href={SPRY_CONTACT.emailHref}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-sm transition-colors hover:border-border hover:bg-background/60"
                  >
                    <Mail className="size-4 shrink-0 text-foreground/70" aria-hidden />
                    <span className="truncate text-foreground/90">{SPRY_CONTACT.email}</span>
                  </a>
                  <a
                    href={SPRY_CONTACT.phoneHref}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-sm transition-colors hover:border-border hover:bg-background/60"
                  >
                    <Phone className="size-4 shrink-0 text-foreground/70" aria-hidden />
                    <span className="text-foreground/90">{SPRY_CONTACT.phone}</span>
                  </a>
                  <a
                    href={SPRY_CONTACT.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-sm transition-colors hover:border-border hover:bg-background/60"
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 text-foreground/70" aria-hidden />
                    <span className="leading-snug text-foreground/90">{SPRY_CONTACT.address}</span>
                  </a>
                </div>
              </div>

              <div className="bg-background/20 px-6 py-8 md:px-9 md:py-10">
                {submitted ? (
                  <div className="flex h-full min-h-[18rem] flex-col items-center justify-center py-6 text-center">
                    <div className="grid size-12 place-items-center rounded-full border border-border/60 bg-surface-elevated">
                      <CheckCircle2 className="size-6 text-foreground/80" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold">Request received</h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">{CTA_AFTER_SUBMIT}</p>
                    <Button asChild className={cn("mt-6", SECONDARY_CTA_CLASS)}>
                      <a href={SPRY_CONTACT.emailHref}>Email Evan directly</a>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold">Request your consultation</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Share a few details — Evan will follow up to schedule your free consultation.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spry-name">Full name</Label>
                      <Input
                        id="spry-name"
                        placeholder="Your name"
                        className="h-11 border-border/60 bg-background/50"
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
                      <Label htmlFor="spry-email">Email</Label>
                      <Input
                        id="spry-email"
                        type="email"
                        placeholder="you@email.com"
                        className="h-11 border-border/60 bg-background/50"
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
                      <Label htmlFor="spry-goal">Primary goal</Label>
                      <Controller
                        name="goal"
                        control={control}
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
                                id="spry-goal"
                                className="h-11 border-border/60 bg-background/50"
                                aria-invalid={fieldState.invalid}
                              >
                                <SelectValue placeholder="What do you want to work on?" />
                              </SelectTrigger>
                              <SelectContent>
                                {CONSULTATION_GOALS.map((g) => (
                                  <SelectItem key={g.value} value={g.value}>
                                    {g.label}
                                  </SelectItem>
                                ))}
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

                    <div className="space-y-2">
                      <Label htmlFor="spry-message">Anything else? (optional)</Label>
                      <Textarea
                        id="spry-message"
                        rows={3}
                        placeholder="Schedule constraints, injuries, training history…"
                        className="resize-none border-border/60 bg-background/50"
                        {...form.register("message")}
                      />
                    </div>

                    <Button type="submit" size="lg" className={cn("h-12 w-full", PRIMARY_CTA_CLASS)}>
                      {PRIMARY_CTA}
                      <CtaArrow />
                    </Button>
                    <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                      Prototype form — submits locally for demo. Email and phone above always work.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </SpryReveal>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className={cn("relative bg-surface/10 pb-16 pt-14 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20")}>
      <div className={cn(CONTAINER, "relative z-10")}>
        <SpryReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-[-0.03em]">
              Frequently asked questions
            </h2>
          </div>
        </SpryReveal>

        <SpryReveal delay={0.05}>
          <Accordion
            type="single"
            collapsible
            className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-[1.5rem] border border-border/55 bg-background/60"
          >
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="border-border/55 px-5 last:border-0 md:px-6"
              >
                <AccordionTrigger className="py-4 text-left font-display text-[0.95rem] font-medium hover:no-underline hover:text-foreground md:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SpryReveal>
      </div>
    </section>
  );
}

function SpryFooter() {
  return (
    <footer className="relative border-t border-border/50 bg-surface/15 pb-8 pt-14 md:pt-16">
      <div className="pointer-events-none absolute inset-0 spry-section-glow opacity-60" aria-hidden />
      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full border border-border/55 bg-surface-elevated shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_5%,transparent)]">
                <SpryLogo className="size-4 text-foreground/85" />
              </span>
              <SpryWordmark className="text-[0.75rem] md:text-[0.8rem]" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Personal training in Santa Monica focused on strength, mobility, and sustainable
              results.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={SPRY_CONTACT.emailHref}
                  className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-3.5 shrink-0" aria-hidden />
                  {SPRY_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={SPRY_CONTACT.phoneHref}
                  className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-3.5 shrink-0" aria-hidden />
                  {SPRY_CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Studio
            </p>
            <a
              href={SPRY_CONTACT.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
            >
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              {SPRY_CONTACT.address}
            </a>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Follow
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={SPRY_CONTACT.website}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-10 place-items-center rounded-full border border-border/55 bg-background/40 text-muted-foreground transition-all duration-200 hover:border-foreground/15 hover:text-foreground motion-reduce:transition-none"
                aria-label="Spry Fitness website"
              >
                <Globe className="size-3.5" />
              </a>
              <a
                href={SPRY_CONTACT.website}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-10 place-items-center rounded-full border border-border/55 bg-background/40 text-muted-foreground transition-all duration-200 hover:border-foreground/15 hover:text-foreground motion-reduce:transition-none"
                aria-label="Spry Fitness on Instagram"
              >
                <Instagram className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border/45 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Spry Fitness. All rights reserved.</p>
          <p>Santa Monica, California</p>
        </div>
      </div>
    </footer>
  );
}

function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      const consultation = document.getElementById(CONSULTATION_ID);
      const vh = window.innerHeight;
      let pastHero = false;
      if (hero) {
        pastHero = hero.getBoundingClientRect().bottom < vh * 0.28;
      } else {
        pastHero = window.scrollY > vh * 0.5;
      }
      let consultationOnScreen = false;
      if (consultation) {
        const rect = consultation.getBoundingClientRect();
        consultationOnScreen = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      }
      setVisible(pastHero && !consultationOnScreen);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-[opacity,transform] duration-300 ease-out md:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={!visible}
    >
      <a
        href={`#${CONSULTATION_ID}`}
        className={cn(
          "group mx-auto flex max-w-lg min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold backdrop-blur-xl transition-all duration-200 motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          PRIMARY_CTA_CLASS,
        )}
      >
        {PRIMARY_CTA}
        <CtaArrow />
      </a>
    </div>
  );
}
