import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Menu,
  Phone,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import coachImg from "@/assets/trust-coach.jpg";
import indoorImg from "@/assets/service-indoor.jpg";
import outdoorImg from "@/assets/service-outdoor.jpg";
import customImg from "@/assets/service-custom.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#who", label: "Who It's For" },
  { href: "#process", label: "Consultation" },
  { href: "#training", label: "Training" },
  { href: "#contact", label: "Contact" },
] as const;

const PRIMARY_CTA_CLASS =
  "rounded-lg bg-trident-accent px-7 font-semibold tracking-[0.01em] text-trident-accent-foreground shadow-trident hover:-translate-y-0.5 hover:bg-trident-accent/90";
const SECONDARY_CTA_CLASS =
  "rounded-lg border-border/70 bg-surface/50 px-7 font-semibold tracking-[0.01em] backdrop-blur hover:-translate-y-0.5 hover:border-trident-accent/50 hover:bg-surface-elevated hover:text-foreground";

function TridentLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3v18M7 8l5-5 5 5M9 8v4.5c0 1.5 1.2 2.7 2.7 2.7h.6c1.5 0 2.7-1.2 2.7-2.7V8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TridentFitnessPage() {
  return (
    <main className="trident-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#top"
        className="absolute -top-14 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 focus:top-0 focus:translate-y-4 focus:outline-none focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      <TridentNav />
      <TridentHero />
      <TridentProof />
      <TridentWhoItsFor />
      <TridentProcess />
      <TridentTraining />
      <TridentTrust />
      <TridentContact />
      <TridentFooter />
    </main>
  );
}

function TridentNav() {
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
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-trident-accent to-trident-accent-glow shadow-trident">
            <TridentLogo className="size-4 text-trident-accent-foreground" />
          </span>
          <span className="font-display text-[0.95rem] font-semibold tracking-tight sm:text-lg">
            TRIDENT<span className="text-trident-accent">.</span>FITNESS
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
              Book a Consultation
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
                Book a Consultation
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function TridentHero() {
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
      <div className="hero-glow-top absolute inset-0 trident-hero-glow" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-[54%] h-[min(58vh,540px)] w-[min(72vw,400px)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <img
          src={coachImg}
          alt=""
          width={800}
          height={1000}
          decoding="async"
          fetchPriority="high"
          className="hero-coach-ambient size-full object-cover object-[center_20%] opacity-[0.22] saturate-[0.85] contrast-[1.05]"
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-trident-accent/12 blur-[100px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/92 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_42%,transparent_20%,var(--background)_88%)]" />
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="grain absolute inset-0" aria-hidden />
    </>
  );

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-28 pb-16 text-center md:px-8 md:pt-32 md:pb-20"
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
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center"
      >
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-trident-accent">
          West Los Angeles · 25+ Years
        </p>

        <h1 className="font-display text-[clamp(2.35rem,5.8vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
          Start With One Clear
          <span className="trident-headline-accent mt-2 block">Training Consultation</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg md:leading-[1.75]">
          Functional training, golf performance, and movement coaching in Los Angeles — start with
          one simple consultation.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button asChild size="lg" className={cn("h-12", PRIMARY_CTA_CLASS)}>
            <a href="#contact">
              Book a Consultation
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className={cn("h-12", SECONDARY_CTA_CLASS)}>
            <a href="#training">Explore Training Options</a>
          </Button>
        </div>

        <p className="mt-5 max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
          One conversation to understand your goals, assess movement, and map the right training path
          — no commitment beyond the consult.
        </p>
      </motion.div>
    </section>
  );
}

const PROOF_STATS = [
  { k: "25+", v: "Years in West LA" },
  { k: "40+", v: "Specialized coaching" },
  { k: "1:1", v: "Personal attention" },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "After years of nagging back pain, Michael helped me move freely again. The approach is thoughtful, not aggressive.",
    name: "David K.",
    role: "Executive · Golf · 52",
  },
  {
    quote:
      "I wanted distance off the tee without risking injury. The golf-specific work actually translated to my game.",
    name: "Susan M.",
    role: "Recreational golfer · 48",
  },
  {
    quote:
      "Small gym, no intimidation, real expertise. This is coaching — not a membership pitch.",
    name: "Robert T.",
    role: "Professional · West LA",
  },
] as const;

function TridentProof() {
  return (
    <section className="relative overflow-hidden border-y border-border/50 py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 border-b border-border/50 pb-12">
            {PROOF_STATS.map((s) => (
              <div key={s.k} className="min-w-[6rem] text-center">
                <div className="font-display text-2xl font-semibold tracking-tight text-trident-accent sm:text-3xl">
                  {s.k}
                </div>
                <div className="mt-1 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="flex h-full flex-col rounded-2xl border border-border/60 bg-surface/40 p-7"
              >
                <p className="flex-1 text-sm leading-relaxed text-foreground/90 md:text-[0.95rem]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-border/50 pt-5">
                  <cite className="not-italic">
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{t.role}</div>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const AUDIENCE = [
  {
    icon: Users,
    title: "Professionals 40+",
    body: "Long-term fitness that fits demanding schedules — strength, energy, and consistency without burnout.",
  },
  {
    icon: Target,
    title: "Golf players",
    body: "Power, mobility, and stability for a better swing — with less risk of golf-related injury.",
  },
  {
    icon: TrendingUp,
    title: "Movement & recovery",
    body: "Rebuild mobility, address nagging aches, and move with confidence in daily life and sport.",
  },
  {
    icon: Clock,
    title: "Busy West LA locals",
    body: "An intimate Sawtelle gym where coaching and accountability replace guesswork.",
  },
] as const;

function TridentWhoItsFor() {
  return (
    <section id="who" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-trident-accent">
              Who this is for
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
              Built for adults who want results that last.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Trident Fitness is not a box gym. It is a private West LA facility for people who value
              coaching, clarity, and training that respects where their body is today.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {AUDIENCE.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border/60 bg-surface/30 p-7 transition-colors hover:border-trident-accent/35">
                <div className="grid size-10 place-items-center rounded-lg border border-trident-accent/30 bg-trident-accent/10">
                  <item.icon className="size-5 text-trident-accent" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Book your consultation",
    body: "Share your goals, schedule, and any movement concerns. Michael responds personally.",
  },
  {
    step: "02",
    title: "Movement analysis & conversation",
    body: "Assess how you move, discuss your history, and identify what matters most right now.",
  },
  {
    step: "03",
    title: "Your personalized game plan",
    body: "Leave with a clear training direction — functional work, golf performance, movement, or a blend.",
  },
] as const;

function TridentProcess() {
  return (
    <section id="process" className="relative bg-surface/30 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-trident-accent">
              Your starting point
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
              One consultation. One clear path forward.
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Every client begins here — whether you are training for golf, rebuilding mobility, or
              investing in long-term performance.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-border/60 bg-background p-8">
                <span className="font-display text-3xl font-semibold text-trident-accent/80">
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
                Book a Consultation
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const TRAINING_AREAS = [
  {
    img: indoorImg,
    title: "Functional Training",
    desc: "Movement-based strength for daily life and sport — multi-joint, practical, and built to reduce injury risk.",
    outcomes: ["Mobility & balance", "Practical strength", "Long-term durability"],
  },
  {
    img: outdoorImg,
    title: "Golf Performance",
    desc: "Programs that add power and distance while improving hip drive, rotation, and swing stability.",
    outcomes: ["Club head speed", "Rotational power", "Injury prevention"],
  },
  {
    img: customImg,
    title: "Movement Training",
    desc: "Corrective and performance movement work for people recovering mobility or refining how they move.",
    outcomes: ["Pain reduction", "Better coordination", "Confidence in motion"],
  },
  {
    img: coachImg,
    title: "Performance Coaching",
    desc: "Structured 1:1 coaching with accountability — for athletes and professionals who want a dedicated plan.",
    outcomes: ["Personalized programming", "Consistent progress", "Direct coaching"],
  },
] as const;

function TridentTraining() {
  return (
    <section id="training" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-trident-accent">
              Training areas
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
              Four specialties. One place to start.
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              These are the paths we build after your consultation — not four separate doors to walk
              through alone. Your consult determines the right focus.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {TRAINING_AREAS.map((area, i) => (
            <Reveal key={area.title} delay={i * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface/20 transition-colors hover:border-trident-accent/30">
                <div className="relative aspect-[16/7] overflow-hidden">
                  <img
                    src={area.img}
                    alt=""
                    width={1024}
                    height={448}
                    loading="lazy"
                    className="size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {area.outcomes.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-4 shrink-0 text-trident-accent" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Not sure which area fits? That is exactly what the consultation is for.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TridentTrust() {
  return (
    <section className="relative border-t border-border/50 bg-surface/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="relative overflow-hidden rounded-2xl border border-border/70">
              <img
                src={coachImg}
                alt="Michael Shenkman, owner of Trident Fitness"
                width={900}
                height={700}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[center_15%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-trident-accent">
                About Trident Fitness
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
                25 years of coaching in West Los Angeles.
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Owner Michael Shenkman has spent more than three decades in personal training and
                over 25 years building Trident Fitness — a spacious, private gym at Olympic &amp;
                Sepulveda for clients who prefer expertise over crowds.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The work is functional, sport-specific, and results-oriented — designed for people
                who want to move better, play better, and feel better for the long run.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-trident-accent" />
                  Sawtelle · West LA
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-trident-accent" />
                  Open 7 days
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TridentContact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-trident-accent">
                Next step
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold text-balance md:text-5xl">
                Book your consultation.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Share a few details and Michael will follow up to schedule your consultation and
                answer any questions.
              </p>

              <div className="mt-8 space-y-4 rounded-2xl border border-border/60 bg-surface/30 p-6">
                <a
                  href="tel:+13102315195"
                  className="flex items-center gap-3 text-sm transition-colors hover:text-trident-accent"
                >
                  <Phone className="size-4 text-trident-accent" />
                  (310) 231-5195
                </a>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-trident-accent" />
                  <span>
                    11111 W Olympic Blvd, Ste 101
                    <br />
                    Los Angeles, CA 90064
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="size-4 text-trident-accent" />
                  Mon – Sun · 5:00 AM – 10:30 PM
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-border/60 bg-surface/40 p-7 md:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto size-10 text-trident-accent" />
                  <h3 className="mt-4 font-display text-xl font-semibold">Request received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Michael will be in touch shortly to confirm your consultation.
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
                      <Label htmlFor="trident-first">First name</Label>
                      <Input id="trident-first" required placeholder="First" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trident-last">Last name</Label>
                      <Input id="trident-last" required placeholder="Last" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trident-email">Email</Label>
                    <Input id="trident-email" type="email" required placeholder="you@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trident-phone">Phone</Label>
                    <Input id="trident-phone" type="tel" required placeholder="(310) 555-0100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trident-message">What would you like to work on?</Label>
                    <Textarea
                      id="trident-message"
                      rows={3}
                      placeholder="Golf performance, mobility, general fitness — whatever brought you here."
                    />
                  </div>
                  <Button type="submit" size="lg" className={cn("h-12 w-full", PRIMARY_CTA_CLASS)}>
                    Book a Consultation
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

function TridentFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:px-8 md:text-left">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-trident-accent to-trident-accent-glow">
            <TridentLogo className="size-3.5 text-trident-accent-foreground" />
          </span>
          <span className="font-display text-sm font-semibold">TRIDENT.FITNESS</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Concept mockup · Based on{" "}
          <a
            href="https://tridentfitness.com/"
            className="underline-offset-2 hover:text-foreground hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            tridentfitness.com
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
