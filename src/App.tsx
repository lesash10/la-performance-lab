import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Globe2,
  Instagram,
  LineChart,
  Mail,
  MapPin,
  Menu,
  Mountain,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Users,
  X,
  Zap,
} from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import indoorImg from "@/assets/service-indoor.jpg";
import outdoorImg from "@/assets/service-outdoor.jpg";
import customImg from "@/assets/service-custom.jpg";
import coachImg from "@/assets/trust-coach.jpg";
import t1 from "@/assets/transformation-1.jpg";
import t2 from "@/assets/transformation-2.jpg";
import t3 from "@/assets/transformation-3.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MARKETING_FAQS } from "@/lib/marketing-faq";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#schedule", label: "Schedule" },
  { href: "#why", label: "Why Alex" },
  { href: "#logistics", label: "Logistics" },
  { href: "#booking", label: "Book" },
];

const MOBILE_NAV_PANEL_ID = "site-mobile-nav-panel";

export default function App() {
  return (
    <>
      <LandingPage />
      <Toaster theme="dark" position="top-center" richColors />
    </>
  );
}

function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <a
        href="#top"
        className="absolute left-1/2 top-0 z-[100] -translate-x-1/2 -translate-y-full rounded-md bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-lg ring-2 ring-ring transition-transform duration-200 focus:translate-y-4 focus:outline-none motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      <Nav />
      <Hero />
      <StickyMobileBookingCta />
      <SocialProof />
      <Services />
      <WhyAlex />
      <Schedule />
      <Trust />
      <Logistics />
      <Booking />
      <FAQSection />
      <Footer />
    </main>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
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
      <motion.div
        layout
        className={cn(
          "mx-auto flex h-14 max-w-[84rem] items-center gap-4 px-5 md:px-8 lg:px-10",
          scrolled && "md:h-[3.25rem]",
        )}
      >
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-ember to-ember-glow shadow-ember">
            <Flame className="size-4 text-background" strokeWidth={2.5} />
          </span>
          <span className="font-display text-[0.95rem] font-semibold tracking-tight sm:text-lg">
            ALEX<span className="text-ember">.</span>CARTER
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
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <motion.div className="ml-auto hidden items-center gap-3 md:flex">
          <Button
            asChild
            className="h-10 rounded-full bg-ember px-5 font-medium text-background shadow-ember hover:bg-ember/90"
          >
            <a href="#booking">
              Book Session
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </motion.div>

        <button
          ref={menuButtonRef}
          type="button"
          className="grid size-10 place-items-center rounded-md border border-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={MOBILE_NAV_PANEL_ID}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </motion.div>

      {open && (
        <div
          id={MOBILE_NAV_PANEL_ID}
          role="navigation"
          aria-label="Mobile site navigation"
          className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl"
        >
          <div className="px-5 py-4 flex flex-col gap-3">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                ref={i === 0 ? mobileNavFirstLinkRef : undefined}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {n.label}
              </a>
            ))}
            <Button
              asChild
              className="w-full bg-ember hover:bg-ember/90 text-background rounded-full"
            >
              <a href="#booking" onClick={() => setOpen(false)}>
                Book Session
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
const HERO_STATS = [
  { k: "100+", v: "Sessions delivered" },
  { k: "12+", v: "Nationalities coached" },
  { k: "1:1", v: "Personalized plans" },
] as const;

function HeroShowcase({ reduceMotion }: { reduceMotion: boolean | null }) {
  const float = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -10, 0] },
          transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  return (
    <motion.div
      {...float(0)}
      className="relative mx-auto w-full max-w-[28rem] lg:max-w-none"
    >
      <motion.div
        className="pointer-events-none absolute -inset-10 rounded-[2.5rem] bg-gradient-to-br from-ember/30 via-ember/5 to-transparent blur-3xl"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-1/4 h-56 w-56 rounded-full bg-ember/20 blur-[90px]"
        aria-hidden
      />

      <motion.div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 glass-strong shadow-elevated ring-1 ring-white/5">
        <img
          src={coachImg}
          alt="Alex Carter coaching a strength session"
          width={800}
          height={1000}
          loading="eager"
          className="aspect-[4/5] w-full object-cover object-[center_18%]"
        />
        <motion.div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        <motion.div className="absolute inset-x-0 bottom-0 border-t border-border/50 bg-background/55 p-4 backdrop-blur-md">
          <motion.div className="flex items-center justify-between gap-3">
            <motion.div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                This week
              </p>
              <p className="font-display text-sm font-semibold">Strength block · Week 3</p>
            </motion.div>
            <motion.div className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-2.5 py-1 text-xs font-medium text-ember">
              <LineChart className="size-3.5" aria-hidden />
              +12% volume
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        {...float(0.4)}
        className="absolute -left-3 top-10 z-10 max-w-[11.5rem] rounded-2xl border border-border/60 bg-background/90 p-3.5 shadow-lg backdrop-blur-xl sm:-left-6"
      >
        <motion.div className="flex items-start gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ember/15 text-ember">
            <CheckCircle2 className="size-4" aria-hidden />
          </span>
          <motion.div>
            <p className="text-xs font-medium text-foreground">Session confirmed</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              Tue 6:30 PM · Outdoor strength
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        {...float(0.8)}
        className="absolute -right-2 top-[38%] z-10 rounded-2xl border border-border/60 bg-surface/90 px-3.5 py-3 shadow-lg backdrop-blur-xl sm:-right-5"
      >
        <motion.div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border border-border/60 bg-background">
            <Timer className="size-4 text-ember" aria-hidden />
          </span>
          <motion.div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg session</p>
            <p className="font-display text-sm font-semibold">60 min</p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        {...float(1.2)}
        className="absolute -bottom-4 left-4 right-4 z-10 rounded-2xl border border-border/60 bg-background/90 p-3 shadow-lg backdrop-blur-xl sm:left-8 sm:right-8"
      >
        <motion.div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-ember" aria-hidden />
          <span className="text-foreground/90">Request</span>
          <ArrowRight className="size-3 opacity-50" aria-hidden />
          <span className="text-foreground/90">Confirm</span>
          <ArrowRight className="size-3 opacity-50" aria-hidden />
          <span>Train</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 90]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.55]);

  const heroLayers = (
    <>
      <img
        src={heroImg}
        alt=""
        width={1920}
        height={1080}
        sizes="100vw"
        decoding="async"
        fetchPriority="high"
        className="size-full object-cover object-[center_30%] opacity-55 saturate-[0.85] lg:opacity-45"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_0%,color-mix(in_oklab,var(--ember)_14%,transparent),transparent_58%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/88 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/55 lg:via-background/78 lg:to-background/35" />
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="grain absolute inset-0" aria-hidden />
    </>
  );

  const heroTextProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
      };

  const showcaseProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 32, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const, delay: 0.12 },
      };

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28"
    >
      {reduceMotion ? (
        <div className="absolute inset-0 -z-10">{heroLayers}</div>
      ) : (
        <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
          {heroLayers}
        </motion.div>
      )}

      <div className="relative mx-auto w-full max-w-[84rem] px-5 md:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 xl:gap-14 2xl:gap-16">
          <motion.div
            {...heroTextProps}
            className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:max-w-[38rem] lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-ember/25 bg-surface/55 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-ember motion-safe:animate-pulse" />
              Now coaching in Los Angeles · Limited spots
            </div>

            <h1 className="font-display text-[clamp(2.65rem,5.4vw,4.85rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance">
              <span className="block text-foreground">Structured Training.</span>
              <span className="hero-headline-accent mt-2 block">Real Results.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-[1.0625rem] md:leading-[1.7] lg:mx-0">
              Premium indoor &amp; outdoor coaching for expats and busy professionals in Los
              Angeles. Built around your schedule, your goals, and the way you actually live.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-full bg-ember px-7 font-medium text-background shadow-ember hover:bg-ember/90 sm:w-auto"
              >
                <a href="#booking">
                  Book Your Session
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full border-border/70 bg-surface/45 px-7 backdrop-blur hover:bg-surface sm:w-auto"
              >
                <a href="#booking-consult">Free Consultation</a>
              </Button>
            </div>
            <p className="mx-auto mt-4 max-w-md text-center text-xs leading-relaxed text-muted-foreground sm:text-sm lg:mx-0 lg:text-left">
              Request your preferred day and time — Alex confirms personally within 24 hours.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
              {HERO_STATS.map((s, i) => (
                <div
                  key={s.k}
                  className={cn(
                    "rounded-2xl border border-border/55 bg-surface/45 px-3 py-4 text-center backdrop-blur-sm lg:text-left",
                    i === 1 && "lg:translate-y-2",
                  )}
                >
                  <div className="font-display text-xl font-semibold tracking-tight sm:text-2xl md:text-[1.65rem]">
                    {s.k}
                  </div>
                  <div className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-xs">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...showcaseProps}
            className="hidden md:block lg:justify-self-end lg:pl-4 xl:pl-8"
          >
            <HeroShowcase reduceMotion={reduceMotion} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const STICKY_BOOKING_DISMISS_KEY = "lab-sticky-booking-dismiss";

/** Compact mobile-only CTA after the hero; hides near #booking or when dismissed. */
function StickyMobileBookingCta() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(STICKY_BOOKING_DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      const booking = document.getElementById("booking");
      const vh = window.innerHeight;
      let pastHero = false;
      if (hero) {
        pastHero = hero.getBoundingClientRect().bottom < vh * 0.22;
      } else {
        pastHero = window.scrollY > vh * 0.55;
      }
      let bookingOnScreen = false;
      if (booking) {
        const br = booking.getBoundingClientRect();
        bookingOnScreen = br.top < vh * 0.88 && br.bottom > vh * 0.12;
      }
      setVisible(pastHero && !bookingOnScreen);
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
      sessionStorage.setItem(STICKY_BOOKING_DISMISS_KEY, "1");
    } catch {
      /* ignore quota / private mode */
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-[opacity,transform] duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-lg flex items-stretch gap-2 rounded-2xl border border-border/70 bg-background/95 backdrop-blur-xl shadow-lg shadow-black/20 p-2 pl-3">
        <a
          href="#booking"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-ember px-4 py-3 text-sm font-medium text-background shadow-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Book session
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 grid place-items-center size-11 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Dismiss booking shortcut"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Reveal helper ---------------- */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-ember">
      <span className="h-px w-6 bg-ember/60" />
      {children}
    </div>
  );
}

/* ---------------- Social Proof ---------------- */
function SocialProof() {
  const testimonials = [
    {
      img: t1,
      name: "Jordan M.",
      role: "Tech founder · UK",
      quote:
        "Lost 9kg and finally feel athletic again. Alex's structure made it impossible to drift.",
    },
    {
      img: t2,
      name: "Camille L.",
      role: "Marketing lead · France",
      quote: "Sessions fit around insane meeting weeks. I show up, I leave stronger. That simple.",
    },
    {
      img: t3,
      name: "Daniel R.",
      role: "Investor · Brazil",
      quote: "The most professional trainer I've worked with in any city. Worth every minute.",
    },
  ];
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <Eyebrow>Trusted globally</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 max-w-xl text-balance">
                Coaching that delivers, season after season.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              From founders to creatives, clients keep training with Alex because the system works.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { k: "100+", v: "Sessions delivered" },
            { k: "12+", v: "Nationalities coached" },
            { k: "4.9★", v: "Average client rating" },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 0.05}>
              <div className="glass rounded-2xl border border-border/60 p-7">
                <div className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
                  {s.k}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{s.v}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="group glass rounded-2xl border border-border/60 overflow-hidden h-full hover:border-ember/40 transition-colors">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.name}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
                <div className="p-6">
                  <Quote className="size-5 text-ember mb-3" />
                  <p className="text-sm leading-relaxed text-foreground/90">{t.quote}</p>
                  <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                    <div className="text-ember text-sm">★★★★★</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
function Services() {
  const services = [
    {
      img: indoorImg,
      icon: Dumbbell,
      title: "Indoor Personal Training",
      desc: "Private 1-on-1 strength sessions inside premium LA gyms or your building.",
      benefits: ["Strength & hypertrophy", "Fat loss programming", "Form-perfect coaching"],
    },
    {
      img: outdoorImg,
      icon: Mountain,
      title: "Outdoor Training Sessions",
      desc: "Beach, park, or track sessions built around conditioning and athleticism.",
      benefits: ["Athletic performance", "Conditioning blocks", "LA's best locations"],
    },
    {
      img: customImg,
      icon: Sparkles,
      title: "Custom Coaching Programs",
      desc: "Fully personalized 4–12 week programs with weekly check-ins and tracking.",
      benefits: ["Bespoke programming", "Weekly accountability", "Lifestyle coaching"],
    },
  ];

  return (
    <section id="services" className="relative overflow-hidden bg-surface/30 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <Eyebrow>Services</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-balance">
              Three ways to train. One standard of work.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="group relative h-full rounded-3xl overflow-hidden border border-border/60 bg-surface hover:border-ember/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-ember">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    width={1024}
                    height={820}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  <div className="absolute top-5 left-5 size-11 rounded-xl glass-strong border border-border/60 grid place-items-center">
                    <s.icon className="size-5 text-ember" />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-ember shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-7 w-full rounded-full border-border/80 bg-transparent hover:bg-ember hover:text-background hover:border-ember transition-colors"
                  >
                    <a href="#booking">
                      Book this session
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why Alex ---------------- */
function WhyAlex() {
  const items = [
    {
      icon: Target,
      title: "Structured approach",
      desc: "Every session and week tied to a measurable goal.",
    },
    {
      icon: Timer,
      title: "Efficient sessions",
      desc: "45–75 min training designed around your calendar.",
    },
    {
      icon: ShieldCheck,
      title: "Real accountability",
      desc: "Weekly check-ins. No drift. No excuses.",
    },
    {
      icon: MapPin,
      title: "Flexible locations",
      desc: "Indoor, outdoor, your gym — wherever you train best.",
    },
    {
      icon: Globe2,
      title: "Built for expats",
      desc: "International communication, no local-jargon coaching.",
    },
    {
      icon: LineChart,
      title: "Progression tracking",
      desc: "Numbers, photos, and lifts — measured every block.",
    },
  ];
  return (
    <section id="why" className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <Eyebrow>Why train with Alex</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-balance">
              Premium coaching, engineered for the way you live.
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-3xl overflow-hidden border border-border/60">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.04}>
              <div className="group bg-background hover:bg-surface transition-colors p-8 h-full">
                <div className="size-11 rounded-xl bg-surface border border-border grid place-items-center group-hover:bg-ember/10 group-hover:border-ember/40 transition-colors">
                  <it.icon className="size-5 text-ember" />
                </div>
                <h3 className="font-display text-xl font-semibold mt-5">{it.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Schedule ---------------- */
function Schedule() {
  const classes = [
    {
      icon: Dumbbell,
      title: "1-on-1 Indoor Session",
      desc: "Private strength & physique work, programmed week to week.",
      duration: "60 min",
      location: "Private / Partner Gym",
      intensity: "Moderate–High",
      price: "From $140",
      slots: ["7:00 AM", "12:30 PM", "6:30 PM"],
    },
    {
      icon: Mountain,
      title: "Outdoor Strength Session",
      desc: "Sled, kettlebells, sprints — built for athleticism and conditioning.",
      duration: "60 min",
      location: "Park / Beach / Track",
      intensity: "High",
      price: "From $130",
      slots: ["6:30 AM", "5:30 PM", "7:00 PM"],
    },
    {
      icon: Users,
      title: "Small Group Class",
      desc: "Train with 2–4 people at a similar level. Same coaching, lower price.",
      duration: "60 min",
      location: "Outdoor · Santa Monica",
      intensity: "Moderate",
      price: "From $65",
      slots: ["7:30 AM", "8:30 AM", "5:30 PM"],
    },
    {
      icon: Zap,
      title: "Mobility & Conditioning",
      desc: "Recovery, mobility, and metabolic work to keep your body resilient.",
      duration: "45 min",
      location: "Indoor / Outdoor",
      intensity: "Low–Moderate",
      price: "From $110",
      slots: ["12:00 PM", "1:30 PM", "8:00 PM"],
    },
  ];

  return (
    <section id="schedule" className="relative overflow-hidden bg-surface/30 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <Eyebrow>Schedule</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 max-w-xl text-balance">
                Session types and example time windows.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Times shown are typical options; Alex confirms real availability when you book.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {classes.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="group rounded-3xl border border-border/60 bg-background hover:border-ember/40 hover:shadow-ember p-7 md:p-8 h-full transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-ember/10 border border-ember/30 grid place-items-center">
                      <c.icon className="size-5 text-ember" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight">
                        {c.title}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-1">{c.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-semibold">{c.price}</div>
                    <div className="text-xs text-muted-foreground">{c.duration}</div>
                  </div>
                </div>

                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-surface border border-border px-3 py-1 text-muted-foreground">
                    Intensity · {c.intensity}
                  </span>
                  <span className="rounded-full bg-surface border border-border px-3 py-1 text-muted-foreground">
                    {c.duration}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Example time windows
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.slots.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-surface-elevated border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  asChild
                  className="mt-7 w-full rounded-full bg-ember hover:bg-ember/90 text-background h-11 shadow-ember"
                >
                  <a href="#booking">
                    Book This Session
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust ---------------- */
function Trust() {
  const points = [
    "Certified personal trainer",
    "Experience coaching expats & busy professionals",
    "Personalized programs for your goals",
    "Safe, structured progression system",
    "Clear, direct communication",
    "Client-first coaching ethic",
  ];
  const badges = [
    { icon: Target, label: "Structured Programs" },
    { icon: MapPin, label: "Flexible Locations" },
    { icon: ShieldCheck, label: "Beginner Friendly" },
    { icon: Flame, label: "Results Focused" },
    { icon: Clock, label: "24h Response" },
  ];

  return (
    <section className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-border/60 ember-glow">
              <img
                src={coachImg}
                alt="Alex Carter, certified personal trainer"
                width={1024}
                height={1280}
                loading="lazy"
                className="size-full object-cover aspect-[4/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-strong rounded-2xl border border-border/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-ember/20 border border-ember/40 grid place-items-center">
                    <ShieldCheck className="size-5 text-ember" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Alex Carter</div>
                    <div className="text-xs text-muted-foreground">
                      Certified Personal Trainer · Los Angeles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Eyebrow>Why you can trust the work</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-balance">
              A coach built around clarity, safety, and real progress.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
              No fads. No gimmicks. Just professional, structured coaching tailored to your level —
              designed to deliver progress you can feel and measure.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-ember mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-2">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs"
                >
                  <b.icon className="size-3.5 text-ember" />
                  {b.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Logistics ---------------- */
function Logistics() {
  const cards = [
    {
      icon: Dumbbell,
      title: "Indoor sessions",
      body: "Private studio, partner gyms, or your building's gym — Alex brings the programming, you bring yourself.",
    },
    {
      icon: Mountain,
      title: "Outdoor sessions",
      body: "Parks, beaches, running tracks, or any agreed location across the city.",
    },
    {
      icon: MapPin,
      title: "Areas covered",
      body: "West Hollywood · Beverly Hills · Santa Monica · Venice · Downtown LA",
    },
    {
      icon: Clock,
      title: "Session duration",
      body: "Choose 45, 60, or 75 minutes — whatever fits your schedule and goal block.",
    },
    {
      icon: CheckCircle2,
      title: "What to bring",
      body: "Water, towel, training shoes. Equipment and programming handled by Alex.",
    },
    {
      icon: Calendar,
      title: "Cancellation & payment",
      body: "Flexible 24h cancellation policy. Card, transfer, or package billing — all supported.",
    },
  ];

  return (
    <section id="logistics" className="py-24 md:py-32 relative bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <Eyebrow>Logistics</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-balance">
              Everything practical, before you book.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.04}>
              <div className="rounded-2xl border border-border/60 bg-background p-7 h-full hover:border-ember/40 transition-colors">
                <div className="size-11 rounded-xl bg-ember/10 border border-ember/30 grid place-items-center">
                  <c.icon className="size-5 text-ember" />
                </div>
                <h3 className="font-display text-lg font-semibold mt-5">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-ember hover:bg-ember/90 text-background px-8 shadow-ember"
            >
              <a href="#booking">
                Book Your First Session
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Booking ---------------- */
const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  goal: z.string().min(1, "Pick a goal"),
  type: z.string().min(1, "Pick a training type"),
  message: z.string().optional(),
  preferredDaySummary: z.string().min(1, "Pick a preferred day"),
  preferredTimeSlot: z.string().min(1, "Pick a preferred time"),
});
type FormValues = z.infer<typeof formSchema>;

function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("7:00 AM");

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        i,
        weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
        day: d.getDate(),
      };
    });
  }, []);

  const initialPreferredDay = `${days[selectedDay]!.weekday} ${days[selectedDay]!.day}`;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      goal: "",
      type: "",
      message: "",
      preferredDaySummary: initialPreferredDay,
      preferredTimeSlot: selectedSlot,
    },
  });

  const { control, setValue } = form;
  const slots = ["6:30 AM", "7:00 AM", "12:30 PM", "5:30 PM", "6:30 PM", "7:00 PM"];

  useEffect(() => {
    const d = days[selectedDay];
    if (!d) return;
    setValue("preferredDaySummary", `${d.weekday} ${d.day}`, {
      shouldValidate: true,
    });
    setValue("preferredTimeSlot", selectedSlot, { shouldValidate: true });
  }, [selectedDay, selectedSlot, days, setValue]);

  useEffect(() => {
    if (submitted) return;
    const focusMessageIfConsult = () => {
      if (window.location.hash !== "#booking-consult") return;
      const el = document.getElementById("message");
      if (!(el instanceof HTMLTextAreaElement)) return;
      queueMicrotask(() => {
        el.focus({ preventScroll: false });
      });
    };
    focusMessageIfConsult();
    window.addEventListener("hashchange", focusMessageIfConsult);
    return () => window.removeEventListener("hashchange", focusMessageIfConsult);
  }, [submitted]);

  const onSubmit = (values: FormValues) => {
    setSubmitted(true);
    toast.success("Request received", {
      description: `Thanks ${values.name.split(" ")[0]} — Alex will confirm by email within 24 hours.`,
    });
  };

  return (
    <section id="booking" className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <Eyebrow>Book your session</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-balance">
              Send a request with your goals and preferred times.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Alex confirms every booking personally — no instant holds or automated confirmation
              emails.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Calendar mock */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-3xl border border-border/60 glass p-6 md:p-7 h-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Preferred day
                  </div>
                  <div className="font-display text-lg font-semibold mt-1">Next 7 days</div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 max-w-[14rem] leading-snug">
                    Illustrative week — final time is confirmed with Alex.
                  </p>
                </div>
                <Calendar className="size-5 text-ember shrink-0" />
              </div>

              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {days.map((d) => (
                  <button
                    key={d.i}
                    type="button"
                    onClick={() => setSelectedDay(d.i)}
                    className={cn(
                      "rounded-xl py-3 flex flex-col items-center border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      selectedDay === d.i
                        ? "bg-ember border-ember text-background shadow-ember"
                        : "bg-surface-elevated border-border hover:border-ember/40",
                    )}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-80">
                      {d.weekday}
                    </span>
                    <span className="font-display text-lg font-semibold mt-0.5">{d.day}</span>
                  </button>
                ))}
              </div>

              <div className="mt-7">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Typical session times
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={cn(
                        "rounded-lg py-2.5 text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        selectedSlot === s
                          ? "bg-ember/15 border-ember text-ember"
                          : "bg-surface-elevated border-border hover:border-ember/40",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex items-center gap-3 rounded-xl bg-surface-elevated border border-border p-4">
                <div className="size-9 rounded-lg bg-ember/15 grid place-items-center shrink-0">
                  <Clock className="size-4 text-ember" />
                </div>
                <div className="text-xs text-muted-foreground">
                  Included with your request:{" "}
                  <span className="text-foreground font-medium">
                    {days[selectedDay]!.weekday} {days[selectedDay]!.day}
                  </span>{" "}
                  · <span className="text-foreground font-medium">{selectedSlot}</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.05} className="lg:col-span-3">
            <div className="rounded-3xl border border-border/60 bg-surface p-6 md:p-8 h-full">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="size-14 rounded-full bg-ember/15 border border-ember/40 grid place-items-center">
                    <CheckCircle2 className="size-7 text-ember" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mt-5">Request received.</h3>
                  <p className="mt-2 text-muted-foreground max-w-sm">
                    Alex will confirm by email within 24 hours with availability and next steps. No
                    automated confirmation has been sent yet.
                  </p>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        placeholder="Alex Smith"
                        className="h-11 bg-surface-elevated border-border"
                        aria-invalid={!!form.formState.errors.name}
                        aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                        {...form.register("name")}
                      />
                      {form.formState.errors.name && (
                        <p id="name-error" className="text-xs text-destructive" role="alert">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@email.com"
                        className="h-11 bg-surface-elevated border-border"
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p id="email-error" className="text-xs text-destructive" role="alert">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Primary goal</Label>
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
                                id="goal"
                                className="h-11 bg-surface-elevated border-border"
                                aria-invalid={fieldState.invalid}
                                aria-describedby={fieldState.error ? "goal-error" : undefined}
                              >
                                <SelectValue placeholder="Select your goal" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fat-loss">Fat loss</SelectItem>
                                <SelectItem value="strength">Strength & muscle</SelectItem>
                                <SelectItem value="performance">Athletic performance</SelectItem>
                                <SelectItem value="lifestyle">Lifestyle & health</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <p id="goal-error" className="text-xs text-destructive" role="alert">
                                {fieldState.error.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Preferred training type</Label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              value={field.value || undefined}
                              onValueChange={(v) => {
                                field.onChange(v);
                                form.trigger("type");
                              }}
                            >
                              <SelectTrigger
                                id="type"
                                className="h-11 bg-surface-elevated border-border"
                                aria-invalid={fieldState.invalid}
                                aria-describedby={fieldState.error ? "type-error" : undefined}
                              >
                                <SelectValue placeholder="Select training type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="indoor">Indoor 1-on-1</SelectItem>
                                <SelectItem value="outdoor">Outdoor strength</SelectItem>
                                <SelectItem value="group">Small group class</SelectItem>
                                <SelectItem value="custom">Custom program</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <p id="type-error" className="text-xs text-destructive" role="alert">
                                {fieldState.error.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div id="booking-consult" className="space-y-2 scroll-mt-24 md:scroll-mt-28">
                    <Label htmlFor="message">Anything Alex should know? (optional)</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Injuries, schedule constraints, training history…"
                      className="bg-surface-elevated border-border resize-none"
                      {...form.register("message")}
                    />
                  </div>

                  <div className="rounded-xl border border-border/80 bg-surface-elevated/50 p-4 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your preferred start window (updates when you change the calendar). This is
                      sent with your request — it does not reserve a slot until Alex confirms.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDaySummary">Preferred day</Label>
                        <Input
                          id="preferredDaySummary"
                          readOnly
                          tabIndex={-1}
                          className="h-11 bg-background/80 border-border text-foreground cursor-default"
                          {...form.register("preferredDaySummary")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTimeSlot">Preferred time</Label>
                        <Input
                          id="preferredTimeSlot"
                          readOnly
                          tabIndex={-1}
                          className="h-11 bg-background/80 border-border text-foreground cursor-default"
                          {...form.register("preferredTimeSlot")}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 rounded-full bg-ember hover:bg-ember/90 text-background font-medium shadow-ember"
                  >
                    Request My Session
                    <ArrowRight className="size-4" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Alex replies personally within 24 hours. Your details stay private.
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

/* ---------------- FAQ ---------------- */
function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 relative bg-surface/30">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-balance">
              Quick answers.
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border/60 bg-background overflow-hidden"
          >
            {MARKETING_FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-border/60 last:border-0"
              >
                <AccordionTrigger className="px-6 py-5 text-left hover:no-underline hover:text-ember font-display text-base md:text-lg font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="relative border-t border-border/60 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-3xl border border-ember/40 bg-gradient-to-br from-surface to-background p-8 md:p-14 text-center ember-glow">
          <Eyebrow>Ready when you are</Eyebrow>
          <h3 className="font-display text-3xl md:text-5xl font-semibold mt-5 max-w-2xl mx-auto text-balance">
            Your next training block starts this week.
          </h3>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-full bg-ember hover:bg-ember/90 text-background px-8 shadow-ember"
          >
            <a href="#booking">
              Book Your Session
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <p className="mt-5 text-sm text-muted-foreground">
            Not ready to book?{" "}
            <a
              href="#schedule"
              className="text-foreground/80 underline underline-offset-4 decoration-border hover:text-ember hover:decoration-ember transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View schedule
            </a>
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-md bg-gradient-to-br from-ember to-ember-glow grid place-items-center">
                <Flame className="size-4 text-background" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-semibold">
                ALEX<span className="text-ember">.</span>CARTER
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Premium personal training in Los Angeles. Indoor, outdoor, and custom coaching for
              expats and busy professionals.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Explore
            </div>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="hover:text-ember transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Contact
            </div>
            <ul className="space-y-3 text-sm">
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <Instagram className="size-4 shrink-0 mt-0.5" aria-hidden />
                <span>
                  Find us on Instagram as <span className="text-foreground">@alex.carter</span>
                  {" — "}
                  <span className="text-muted-foreground">public profile link coming soon</span>
                </span>
              </li>
              <li>
                <a
                  href="mailto:hello@alexcarter.la"
                  className="inline-flex items-center gap-2 rounded-md hover:text-ember transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Mail className="size-4" />
                  <span>hello@alexcarter.la</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                <span>Los Angeles, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border/60 flex flex-col md:flex-row gap-3 justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Alex Carter. All rights reserved.</div>
          <div>Premium personal training · Los Angeles</div>
        </div>
      </div>
    </footer>
  );
}
