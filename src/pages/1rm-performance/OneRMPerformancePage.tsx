import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Award, CheckCircle2, MapPin, Menu, Phone, Target, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";

import indoorImg from "@/assets/service-indoor.jpg";

const NAV = [
  { href: "#programs", label: "Programs" },
  { href: "#reviews", label: "Reviews" },
  { href: "#athletes", label: "Athletes" },
  { href: "#contact", label: "Contact" },
] as const;

const PRIMARY_CTA_CLASS =
  "rounded-lg bg-onerm-accent px-7 font-semibold tracking-[0.01em] text-onerm-accent-foreground shadow-onerm hover:-translate-y-0.5 hover:bg-onerm-accent/90";
const SECONDARY_CTA_CLASS =
  "rounded-lg border-border/70 bg-surface/50 px-7 font-semibold tracking-[0.01em] backdrop-blur hover:-translate-y-0.5 hover:border-onerm-accent/50 hover:bg-surface-elevated hover:text-foreground";

function OneRMLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 8h12M6 12h12M6 16h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function OneRMPerformancePage() {
  return (
    <main className="onerm-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#top"
        className="absolute -top-14 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 focus:top-0 focus:translate-y-4 focus:outline-none focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      <OneRMNav />
      <OneRMHero />
      <OneRMTrustStrip />
      <OneRMMeetBobby />
      <OneRMChoosePath />
      <OneRMHowToStart />
      <OneRMContact />
      <OneRMFooter />
    </main>
  );
}

function OneRMNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavFirstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
          ? "border-b border-border/50 bg-background/75 py-2 backdrop-blur-xl"
          : "bg-transparent py-4",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[84rem] items-center gap-4 px-5 md:px-8 lg:px-10",
          scrolled && "md:h-[3.25rem]",
        )}
      >
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-onerm-accent to-onerm-accent-glow shadow-onerm">
            <OneRMLogo className="size-4 text-onerm-accent-foreground" />
          </span>
          <span className="font-display text-[0.95rem] font-semibold tracking-tight sm:text-lg">
            1RM<span className="text-onerm-accent">.</span>PERFORMANCE
          </span>
        </a>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
          aria-label="Primary"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Button asChild className={cn("h-10 px-5", PRIMARY_CTA_CLASS)}>
            <a href="#contact">
              Book Assessment
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="grid size-10 place-items-center rounded-md border border-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <div
          role="navigation"
          aria-label="Mobile site navigation"
          className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-3 px-5 py-4">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                ref={i === 0 ? mobileNavFirstLinkRef : undefined}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <Button asChild className={cn("w-full", PRIMARY_CTA_CLASS)}>
              <a href="#contact" onClick={() => setOpen(false)}>
                Book Assessment
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function OneRMHero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 60]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  const heroTextProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 32 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  const background = (
    <>
      <div className="absolute inset-0 bg-background" />
      <div className="hero-glow-top absolute inset-0 onerm-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-onerm-accent/10 blur-[100px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/92 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_42%,transparent_20%,var(--background)_88%)]" />
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="grain absolute inset-0" aria-hidden />
    </>
  );

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-28 pb-16 md:px-8 md:pt-32 md:pb-20"
    >
      {reduceMotion ? (
        <div className="absolute inset-0 -z-10">{background}</div>
      ) : (
        <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
          {background}
        </motion.div>
      )}

      <motion.div
        {...heroTextProps}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
      >
        <div className="text-center lg:text-left">
          <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance">
            San Diego Strength &amp; Conditioning Built Around{" "}
            <span className="onerm-headline-accent">Athlete Development</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg md:leading-[1.75] lg:mx-0">
            1RM Performance helps youth, high school, college, and adult athletes build strength,
            improve movement, and train with a clear plan.
          </p>

          <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" className={cn("h-12", PRIMARY_CTA_CLASS)}>
              <a href="#contact">
                Book an Assessment
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className={cn("h-12", SECONDARY_CTA_CLASS)}>
              <a href="#programs">View Programs</a>
            </Button>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Strength coaching • Athlete development • San Diego, CA
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-onerm-accent/25 bg-surface shadow-elevated">
            <img
              src={indoorImg}
              alt=""
              width={800}
              height={1000}
              decoding="async"
              className="absolute inset-0 size-full object-cover opacity-35 saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-onerm-accent/10 via-transparent to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-7 md:p-8">
              <div className="flex justify-end">
                <span className="rounded-full border border-onerm-accent/40 bg-onerm-accent/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-onerm-accent">
                  First step
                </span>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Athlete Assessment
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Movement • Strength • Training Plan
                </p>
                <div className="mt-6 flex items-center gap-2 border-t border-border/50 pt-5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 text-onerm-accent" aria-hidden />
                  San Diego, CA
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const TRUST_ITEMS = [
  "Trusted by athletes across San Diego",
  "Strength & conditioning expertise",
  "Performance-focused coaching",
  "Reviews and athlete results",
] as const;

function OneRMTrustStrip() {
  return (
    <section id="reviews" className="relative border-y border-border/50 py-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <ul className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
          {TRUST_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-onerm-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function OneRMMeetBobby() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="grid gap-10 rounded-2xl border border-border/60 bg-surface/30 p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12 md:p-10">
            <div
              className="mx-auto grid size-28 shrink-0 place-items-center rounded-2xl border border-onerm-accent/30 bg-gradient-to-br from-onerm-accent/20 to-surface font-display text-3xl font-semibold tracking-tight text-onerm-accent md:mx-0 md:size-32 md:text-4xl"
              aria-hidden
            >
              BC
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-onerm-accent">
                Meet Bobby
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Bobby Congalton
              </h2>
              <p className="mt-2 text-sm font-medium text-foreground/90">
                Strength &amp; Conditioning Coach
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:mx-0 md:text-base">
                Bobby helps athletes build strength, improve movement, and train with a structured
                plan built around their sport, goals, and development stage.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const PATH_CARDS = [
  {
    title: "Youth Athletes",
    body: "Build strength, movement quality, and confidence with age-appropriate coaching.",
  },
  {
    title: "High School & College Athletes",
    body: "Train for performance, durability, and sport-specific development.",
  },
  {
    title: "Adult Performance Training",
    body: "Get stronger, move better, and train with a structured plan.",
  },
] as const;

function OneRMChoosePath() {
  return (
    <section id="programs" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-onerm-accent">
              Choose your path
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
              Training built for where you are today.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Every athlete has different demands. Start with the path that fits your stage — then
              book an assessment to build your plan.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PATH_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-2xl border border-border/60 bg-surface/30 p-8 transition-colors hover:border-onerm-accent/35">
                <div className="grid size-10 place-items-center rounded-lg border border-onerm-accent/30 bg-onerm-accent/10">
                  <Target className="size-5 text-onerm-accent" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-7 w-full border-border/80 bg-transparent hover:border-onerm-accent hover:bg-onerm-accent hover:text-onerm-accent-foreground"
                >
                  <a href="#contact">
                    Learn More
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const START_STEPS = [
  {
    step: "01",
    title: "Book an assessment",
    body: "Share your sport, goals, and schedule. We respond to get you on the calendar.",
  },
  {
    step: "02",
    title: "Get evaluated",
    body: "Movement, strength, and training history reviewed so your plan starts with clarity.",
  },
  {
    step: "03",
    title: "Start your training plan",
    body: "Begin structured coaching with a program matched to your level and season.",
  },
] as const;

function OneRMHowToStart() {
  return (
    <section id="athletes" className="relative bg-surface/30 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-onerm-accent">
              How to start
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
              Three steps to get training.
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              No guesswork about what comes first — the assessment is the clear entry point for
              every athlete.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {START_STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-border/60 bg-background p-8">
                <span className="font-display text-3xl font-semibold text-onerm-accent/80">
                  {step.step}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className={cn("h-12", PRIMARY_CTA_CLASS)}>
              <a href="#contact">
                Book Assessment
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OneRMContact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-onerm-accent">
                Next step
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
                Book your assessment.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Tell us about the athlete and we will follow up to schedule an assessment and answer
                questions about programs.
              </p>

              <div className="mt-8 space-y-4 rounded-2xl border border-border/60 bg-surface/30 p-6">
                <a
                  href="tel:+16197864078"
                  className="flex items-center gap-3 text-sm transition-colors hover:text-onerm-accent"
                >
                  <Phone className="size-4 text-onerm-accent" />
                  (619) 786-4078
                </a>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-onerm-accent" />
                  <span>
                    4040 Sorrento Valley Blvd STE I
                    <br />
                    San Diego, CA
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Award className="size-4 text-onerm-accent" />
                  Strength &amp; conditioning · Athlete development
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-border/60 bg-surface/40 p-7 md:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto size-10 text-onerm-accent" />
                  <h3 className="mt-4 font-display text-xl font-semibold">Request received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We will be in touch shortly to confirm your assessment.
                  </p>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="onerm-first">First name</Label>
                      <Input id="onerm-first" required placeholder="First" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="onerm-last">Last name</Label>
                      <Input id="onerm-last" required placeholder="Last" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="onerm-email">Email</Label>
                    <Input id="onerm-email" type="email" required placeholder="you@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="onerm-athlete">Athlete type</Label>
                    <Input id="onerm-athlete" placeholder="Youth, high school, college, adult…" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="onerm-message">Goals or questions</Label>
                    <Textarea
                      id="onerm-message"
                      rows={3}
                      placeholder="Sport, training history, what you want to improve…"
                    />
                  </div>
                  <Button type="submit" size="lg" className={cn("h-12 w-full", PRIMARY_CTA_CLASS)}>
                    Book Assessment
                    <ArrowRight className="size-4" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Concept mockup — form does not submit to a live backend.
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

function OneRMFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:px-8 md:text-left">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-onerm-accent to-onerm-accent-glow">
            <OneRMLogo className="size-3.5 text-onerm-accent-foreground" />
          </span>
          <span className="font-display text-sm font-semibold">1RM.PERFORMANCE</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Concept mockup · Based on{" "}
          <a
            href="https://www.1rmperformance.com/"
            className="underline-offset-2 hover:text-foreground hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            1rmperformance.com
          </a>
        </p>
        <a
          href="/"
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          View original demo site
        </a>
      </div>
    </footer>
  );
}
