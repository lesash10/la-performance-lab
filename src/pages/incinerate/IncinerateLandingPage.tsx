import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";

import logoImg from "@/assets/incinerate/logo.png";
import rogerCoachImg from "@/assets/incinerate/roger-coach.jpg";
import coachImg from "@/assets/incinerate/coach.jpg";
import trainingImg from "@/assets/incinerate/training.jpg";
import facilityImg from "@/assets/incinerate/facility.jpg";
import boxingImg from "@/assets/incinerate/boxing.jpg";
import gym3 from "@/assets/incinerate/gym3.jpg";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MARKETING_FAQS } from "@/lib/marketing-faq";
import { buildLandingJsonLd } from "@/lib/landing-schema";
import { getSiteOrigin } from "@/lib/site-url";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#why", label: "Why Here" },
  { href: "#programs", label: "Programs" },
  { href: "#results", label: "Results" },
  { href: "#process", label: "How It Works" },
  { href: "#appointments", label: "Times" },
  { href: "#faq", label: "FAQ" },
];

const MOBILE_NAV_PANEL_ID = "site-mobile-nav-panel";
const JSON_LD_SCRIPT_ID = "landing-jsonld";
const PRIMARY_CTA_CLASS =
  "rounded-md bg-flame px-7 font-semibold tracking-[0.01em] text-background shadow-flame hover:-translate-y-0.5 hover:bg-flame/90";
const SECONDARY_CTA_CLASS =
  "rounded-md border-border/70 bg-background/40 px-7 font-semibold tracking-[0.01em] backdrop-blur hover:-translate-y-0.5 hover:border-flame/50 hover:bg-surface-elevated hover:text-foreground";

type BookingMode = "session" | "consult";

type SlotSelection = {
  day: string;
  time: string;
  mode: BookingMode;
};

const GOAL_OPTIONS = [
  { value: "fat-loss", label: "Fat loss & body transformation" },
  { value: "strength", label: "Strength & muscle" },
  { value: "boxing", label: "Boxing & conditioning" },
  { value: "injury", label: "Injury-smart training" },
  { value: "assessment", label: "First session assessment" },
] as const;

const HERO_AVAILABILITY_TEASER = [
  { day: "Mon", time: "7:00 AM" },
  { day: "Tue", time: "5:30 PM" },
  { day: "Wed", time: "9:30 AM" },
] as const;

function useLandingJsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = JSON_LD_SCRIPT_ID;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(buildLandingJsonLd(getSiteOrigin()));
    document.head.appendChild(script);
    return () => script.remove();
  }, []);
}

export default function IncinerateLandingPage() {
  useLandingJsonLd();
  const [bookingMode, setBookingMode] = useState<BookingMode>("session");
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const [preferredGoal, setPreferredGoal] = useState("");

  const goBook = (mode: BookingMode, goal?: string) => {
    setBookingMode(mode);
    if (goal) setPreferredGoal(goal);
    setSelection(null);
    document.getElementById("appointments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#top"
        className="absolute -top-14 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 focus:top-0 focus:translate-y-4 focus:outline-none focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      <Nav onBook={goBook} />
      <Hero onBook={goBook} />
      <StickyMobileBookingCta
        onBook={() => goBook("session")}
        selection={selection}
        onContinue={() => {
          document.getElementById("booking-panel")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <WhyTrainHere onBook={goBook} />
      <Programs onBook={goBook} />
      <Testimonials />
      <BookingProcess onBook={goBook} />
      <AvailableAppointments
        mode={bookingMode}
        onModeChange={setBookingMode}
        selection={selection}
        onSelect={setSelection}
        preferredGoal={preferredGoal}
        onPreferredGoalChange={setPreferredGoal}
      />
      <FAQSection />
      <FinalCta onBook={goBook} />
      <Footer />
    </main>
  );
}

/* ---------------- Nav ---------------- */
function Nav({ onBook }: { onBook: (mode: BookingMode) => void }) {
  const { user, profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavFirstLinkRef = useRef<HTMLAnchorElement>(null);
  const homePath = profile?.role === "admin" ? "/admin" : "/dashboard";

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
          ? "border-b border-border/50 bg-background/80 py-2 backdrop-blur-xl"
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
          className="group flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <img
            src={logoImg}
            alt="Incinerate Elite Personal Training"
            className="h-7 w-auto sm:h-8"
            width={401}
            height={68}
          />
        </a>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
          aria-label="Primary"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" className="h-10 px-4 text-sm text-muted-foreground hover:text-foreground">
                <Link to={homePath}>Dashboard</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-md border-border/70 px-4"
                onClick={() => void signOut()}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="h-10 rounded-md border-border/70 px-4">
              <Link to="/login">Log in</Link>
            </Button>
          )}
          <Button asChild className={cn("h-10 px-5", PRIMARY_CTA_CLASS)}>
            <a
              href="#appointments"
              onClick={(e) => {
                e.preventDefault();
                onBook("session");
              }}
            >
              Book Your First Session
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-md border border-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:ml-0 md:hidden"
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
          <div className="flex flex-col gap-3 px-5 py-4">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                ref={i === 0 ? mobileNavFirstLinkRef : undefined}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md py-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {n.label}
              </a>
            ))}
            {user ? (
              <>
                <Button asChild variant="outline" className="w-full rounded-md border-border/70">
                  <Link to={homePath} onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" className="w-full rounded-md border-border/70">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>
            )}
            <Button asChild className={cn("w-full", PRIMARY_CTA_CLASS)}>
              <a
                href="#appointments"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  onBook("session");
                }}
              >
                Book Your First Session
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ onBook }: { onBook: (mode: BookingMode) => void }) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 70]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.55]);

  const heroTextProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
      };

  const background = (
    <>
      <img
        src={rogerCoachImg}
        alt=""
        width={1024}
        height={1536}
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover object-[center_22%] scale-[1.02]"
      />
      {/* Keep Roger faintly visible in the center; vignette the sides */}
      <div className="absolute inset-0 bg-background/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_42%,transparent_0%,color-mix(in_oklab,var(--background)_55%,transparent)_55%,var(--background)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
      <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-background to-transparent" />
      <div className="grain absolute inset-0" aria-hidden />
    </>
  );

  return (
    <section
      id="top"
      className="hero-section relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32"
    >
      {reduceMotion ? (
        <div className="absolute inset-0 -z-10" aria-hidden>
          {background}
        </div>
      ) : (
        <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10" aria-hidden>
          {background}
        </motion.div>
      )}

      <motion.div
        {...heroTextProps}
        className="hero-content relative z-10"
        style={{
          width: "100%",
          maxWidth: 950,
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        }}
      >
        <p className="font-display text-[0.7rem] font-medium uppercase tracking-[0.28em] text-flame sm:text-xs">
          Incinerate Elite Personal Training · San Diego
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.75rem,7.5vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-balance">
          <span className="block text-foreground">Keep Your Body</span>
          <span className="hero-headline-accent block">Burning.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
          One-on-one coaching with Roger Rojas in a private Kearny Mesa gym. Choose a time and
          reserve your first session in under a minute.
        </p>
        <div className="hero-ctas mt-10">
          <Button
            size="lg"
            className={cn("h-12 w-full sm:w-auto", PRIMARY_CTA_CLASS)}
            onClick={() => onBook("session")}
          >
            Book Your First Session
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={cn("h-12 w-full sm:w-auto", SECONDARY_CTA_CLASS)}
            onClick={() => onBook("consult")}
          >
            Book Your Free Consultation
          </Button>
        </div>

        <button
          type="button"
          onClick={() => onBook("session")}
          className="mt-8 flex w-full max-w-lg flex-col items-center justify-center gap-2 rounded-md border border-border/50 bg-background/35 px-4 py-3 text-center backdrop-blur-sm transition-colors hover:border-flame/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:gap-3"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-flame">
            Available this week
          </span>
          <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            {HERO_AVAILABILITY_TEASER.map((slot, i) => (
              <span key={`${slot.day}-${slot.time}`} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span className="hidden text-border sm:inline" aria-hidden>
                    ·
                  </span>
                )}
                <span>
                  <span className="font-medium text-foreground">{slot.day}</span> {slot.time}
                </span>
              </span>
            ))}
          </span>
        </button>

        <p className="mt-5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          No phone tag. No waiting days for a reply. Roger confirms every booking personally.
        </p>
      </motion.div>
    </section>
  );
}

const STICKY_BOOKING_DISMISS_KEY = "incinerate-sticky-booking-dismiss";

function StickyMobileBookingCta({
  onBook,
  selection,
  onContinue,
}: {
  onBook: () => void;
  selection: SlotSelection | null;
  onContinue: () => void;
}) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(STICKY_BOOKING_DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(false);
  const [panelOnScreen, setPanelOnScreen] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      const booking = document.getElementById("appointments");
      const panel = document.getElementById("booking-panel");
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
      let panelVisible = false;
      if (panel) {
        const pr = panel.getBoundingClientRect();
        panelVisible = pr.top < vh * 0.75 && pr.bottom > vh * 0.2;
      }
      setPanelOnScreen(panelVisible);
      // Show when past hero; if a slot is selected, stay visible until the form panel is on screen
      setVisible(pastHero && (selection ? !panelVisible : !bookingOnScreen));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [selection]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STICKY_BOOKING_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  const hasSelection = !!selection;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-[opacity,transform] duration-300 ease-out md:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-lg items-stretch gap-2 rounded-2xl border border-border/70 bg-background/95 p-2 pl-3 shadow-lg shadow-black/30 backdrop-blur-xl">
        <button
          type="button"
          onClick={hasSelection ? onContinue : onBook}
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-flame px-4 py-3 text-sm font-semibold tracking-[0.01em] text-background shadow-flame transition-all hover:-translate-y-0.5 hover:bg-flame/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {hasSelection ? (
            <span className="truncate">
              Selected: {selection.day.slice(0, 3)} {selection.time}
            </span>
          ) : (
            <span>Book Your First Session</span>
          )}
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </button>
        {!hasSelection && (
          <button
            type="button"
            onClick={dismiss}
            className="grid size-11 shrink-0 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Dismiss booking shortcut"
          >
            <X className="size-5" aria-hidden />
          </button>
        )}
      </div>
      {hasSelection && !panelOnScreen && (
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          Tap to finish reserving
        </p>
      )}
    </div>
  );
}

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

/* ---------------- Why Train Here ---------------- */
function WhyTrainHere({ onBook }: { onBook: (mode: BookingMode) => void }) {
  const credentials = [
    "18+ years of elite coaching",
    "United States Marine veteran",
    "Master personal trainer",
    "Private gym owner · Kearny Mesa",
  ];

  const points = [
    {
      icon: Users,
      title: "One-on-one, not one-of-many",
      desc: "Every session is built around your body, schedule, goals, and training history.",
    },
    {
      icon: Target,
      title: "Personalized results",
      desc: "Fat loss, strength, boxing, posture, or academy prep — programmed for you, not a template.",
    },
    {
      icon: ShieldCheck,
      title: "A private San Diego gym",
      desc: "Train in a focused facility with sauna, cold plunge, boxing, and outdoor space — no crowded floors.",
    },
  ];

  return (
    <section id="why" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-[84rem] px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm md:aspect-[5/6]">
              <img
                src={trainingImg}
                alt="Roger Rojas coaching a client at Incinerate Fitness"
                width={683}
                height={1024}
                loading="lazy"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-flame">
                  Roger Rojas
                </p>
                <p className="mt-1 text-sm text-foreground/90">
                  Founder · Incinerate Elite Personal Training
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                Train directly with Roger Rojas.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                An experienced private coach who builds every program around your body, schedule,
                goals, and training history.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {credentials.map((c) => (
                  <li
                    key={c}
                    className="rounded-md border border-border/70 bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              <ul className="mt-10 space-y-7">
                {points.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-md border border-flame/30 bg-flame/10">
                      <p.icon className="size-5 text-flame" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {p.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={cn("mt-10 h-12 w-full sm:w-auto", PRIMARY_CTA_CLASS)}
                onClick={() => onBook("session")}
              >
                Book Your First Session
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Programs ---------------- */
function Programs({ onBook }: { onBook: (mode: BookingMode, goal?: string) => void }) {
  const programs = [
    {
      img: coachImg,
      title: "Fat Loss & Body Transformation",
      desc: "Structured training and nutrition guidance to burn fat, tone up, and reshape your body with accountability.",
      detail: "Private sessions · packages available",
      goal: "fat-loss",
    },
    {
      img: trainingImg,
      title: "Strength & Muscle Building",
      desc: "Progressive strength work and bodybuilding-style programming tailored to your level and recovery.",
      detail: "1-on-1 · 60 min sessions",
      goal: "strength",
    },
    {
      img: boxingImg,
      title: "Boxing & Conditioning",
      desc: "Boxing, HIIT, and athletic conditioning in a private gym — built for power, endurance, and confidence.",
      detail: "Boxing area · agility training",
      goal: "boxing",
    },
    {
      img: gym3,
      title: "First Session Assessment",
      desc: "Start with an assessment and coaching that meets you where you are — including injury-smart modifications when needed.",
      detail: "Starter package from $500",
      goal: "assessment",
    },
  ];

  return (
    <section id="programs" className="relative overflow-hidden bg-surface/40 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-[84rem] px-5 md:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              What do you want to achieve?
            </h2>
            <p className="mt-5 text-muted-foreground">
              Pick the goal that fits you. Every path starts the same way — reserve a time with
              Roger.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {programs.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <article className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-sm border border-border/50 md:min-h-[26rem]">
                <img
                  src={p.img}
                  alt=""
                  width={900}
                  height={1100}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/15" />
                <div className="relative z-10 p-7 md:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-flame">{p.detail}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 w-full border-border/80 bg-transparent hover:border-flame hover:bg-flame hover:text-background sm:w-auto"
                    onClick={() => onBook("session", p.goal)}
                  >
                    Reserve Your Spot
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const testimonials = [
    {
      quote:
        "Roger completely tailored a plan that included fitness and nutrition. There is no reason you can't achieve your fitness goals — even at my age.",
      name: "Kevin",
      fullName: "Kevin Jay McCalley",
      outcome: "Down weight · stronger knees · accountable",
      initials: "KJ",
    },
    {
      quote:
        "It's been four months and I'm down roughly 14lbs, and have not experienced any back pain since working with him.",
      name: "Vanessa",
      fullName: "Vanessa",
      outcome: "14 lbs down · back pain gone",
      initials: "V",
    },
    {
      quote:
        "Roger is charismatic, fun, personable, and highly skilled. He makes working out enjoyable — and he goes above and beyond for his clients.",
      name: "Gabrielle",
      fullName: "Gabrielle",
      outcome: "Beginner → confident & consistent",
      initials: "G",
    },
  ];

  return (
    <section id="results" className="relative overflow-hidden py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-[84rem] px-5 md:px-8">
        <Reveal>
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Real clients. Real San Diego results.
            </h2>
            <p className="max-w-sm text-muted-foreground">
              From athletes to beginners — people stay because the coaching works and the gym feels
              like theirs.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {testimonials.map((t) => (
              <article
                key={t.fullName}
                className="flex flex-col rounded-sm border border-border/60 bg-surface/40 p-6 md:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="grid size-11 place-items-center rounded-full border border-flame/30 bg-flame/15 font-display text-sm font-semibold text-flame"
                    aria-hidden
                  >
                    {t.initials}
                  </div>
                  <div className="text-xs tracking-[0.18em] text-flame" aria-label="5 star rating">
                    ★★★★★
                  </div>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-flame">
                  {t.outcome}
                </p>
                <p className="mt-3 flex-1 text-base leading-relaxed text-foreground/90 text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-border/60 pt-4">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Incinerate client</div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Simple Booking Process ---------------- */
function BookingProcess({ onBook }: { onBook: (mode: BookingMode) => void }) {
  const steps = [
    {
      n: "01",
      title: "Pick a time",
      desc: "Browse open slots this week and tap the one that fits your schedule.",
    },
    {
      n: "02",
      title: "Reserve your spot",
      desc: "Leave your name, contact, and goal. Takes under a minute.",
    },
    {
      n: "03",
      title: "Show up and train",
      desc: "Roger confirms, you walk into the private gym, and the work begins.",
    },
  ];

  return (
    <section id="process" className="relative overflow-hidden bg-surface/40 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div className="relative z-10 mx-auto max-w-[84rem] px-5 md:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Booking takes minutes, not days.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Choose a time below and start this week — no generic contact form required.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <div className="relative h-full border-t border-flame/40 pt-6">
                <div className="font-display text-sm font-medium tracking-[0.2em] text-flame">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14">
            <Button
              size="lg"
              className={cn("h-12 w-full sm:w-auto", PRIMARY_CTA_CLASS)}
              onClick={() => onBook("session")}
            >
              Choose a Time
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Available Appointments ---------------- */
const WEEK_SCHEDULE = [
  { day: "Monday", times: ["7:00 AM", "12:00 PM", "5:30 PM"] },
  { day: "Tuesday", times: ["8:00 AM", "1:00 PM", "6:00 PM"] },
  { day: "Wednesday", times: ["9:30 AM", "4:30 PM"] },
  { day: "Thursday", times: ["7:00 AM", "5:00 PM"] },
  { day: "Friday", times: ["8:00 AM", "12:00 PM", "4:30 PM"] },
] as const;

const formSchema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    contact: z.string().min(5, "Enter an email or phone number"),
    goal: z.string().min(1, "Pick a primary goal"),
  })
  .superRefine((data, ctx) => {
    const value = data.contact.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const looksLikePhone =
      /^[\d\s()+.-]{7,}$/.test(value) && /\d{7,}/.test(value.replace(/\D/g, ""));
    if (!looksLikeEmail && !looksLikePhone) {
      ctx.addIssue({
        code: "custom",
        path: ["contact"],
        message: "Enter a valid email or phone number",
      });
    }
  });
type FormValues = z.infer<typeof formSchema>;

function AvailableAppointments({
  mode,
  onModeChange,
  selection,
  onSelect,
  preferredGoal,
  onPreferredGoalChange,
}: {
  mode: BookingMode;
  onModeChange: (m: BookingMode) => void;
  selection: SlotSelection | null;
  onSelect: (s: SlotSelection | null) => void;
  preferredGoal: string;
  onPreferredGoalChange: (goal: string) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", contact: "", goal: preferredGoal || "" },
  });

  const { control, setValue } = form;
  const modeLabel = mode === "session" ? "First Session" : "Free Consultation";

  useEffect(() => {
    if (!preferredGoal) return;
    setValue("goal", preferredGoal, { shouldValidate: true });
  }, [preferredGoal, setValue]);

  const pickSlot = (day: string, time: string) => {
    onSelect({ day, time, mode });
    setSubmitted(false);
    setSubmittedValues(null);
    queueMicrotask(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const onSubmit = (values: FormValues) => {
    if (!selection) return;
    setSubmittedValues(values);
    setSubmitted(true);
    onPreferredGoalChange(values.goal);
    toast.success("Session reserved", {
      description: `${selection.day} at ${selection.time} · Roger will confirm personally.`,
    });
  };

  const summary = useMemo(() => {
    if (!selection) return null;
    return `${selection.day} · ${selection.time}`;
  }, [selection]);

  const goalLabel = useMemo(() => {
    const value = submittedValues?.goal || preferredGoal;
    return GOAL_OPTIONS.find((g) => g.value === value)?.label;
  }, [submittedValues, preferredGoal]);

  return (
    <section id="appointments" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <img
          src={facilityImg}
          alt=""
          width={1067}
          height={1600}
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-[84rem] px-5 md:px-8">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-flame">
              Available this week
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Choose Your First Session
            </h2>
            <p className="mt-5 text-muted-foreground">
              Select an available time and reserve your spot in under a minute.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="inline-flex w-full max-w-md rounded-md border border-border/70 bg-surface p-1 sm:w-auto"
              role="tablist"
              aria-label="Booking type"
            >
              {(
                [
                  { id: "session" as const, label: "First Session" },
                  { id: "consult" as const, label: "Free Consultation" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.id}
                  onClick={() => {
                    onModeChange(tab.id);
                    if (selection) onSelect({ ...selection, mode: tab.id });
                  }}
                  className={cn(
                    "flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none",
                    mode === tab.id
                      ? "bg-flame text-background shadow-flame"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Sample availability for this week — choose any slot to see how booking works. Roger
              confirms personally.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mb-6 flex items-start gap-3 rounded-sm border border-border/60 bg-surface/50 px-4 py-3 md:px-5">
            <div
              className="grid size-9 shrink-0 place-items-center rounded-full border border-flame/30 bg-flame/15 font-display text-xs font-semibold text-flame"
              aria-hidden
            >
              V
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Vanessa</span>
              {" — "}
              Down roughly 14 lbs with no back pain since training with Roger.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="rounded-sm border border-border/60 bg-background/80 p-5 backdrop-blur md:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold">Open times</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tap a slot to continue — Roger confirms personally.
                  </p>
                </div>
                <Clock className="size-5 shrink-0 text-flame" aria-hidden />
              </div>

              <div className="space-y-5">
                {WEEK_SCHEDULE.map((d) => (
                  <div
                    key={d.day}
                    className="grid gap-3 border-t border-border/50 pt-5 first:border-0 first:pt-0 sm:grid-cols-[7.5rem_1fr] sm:items-start"
                  >
                    <div className="font-display text-sm font-semibold tracking-tight sm:pt-2">
                      {d.day}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {d.times.map((t) => {
                        const active = selection?.day === d.day && selection?.time === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => pickSlot(d.day, t)}
                            className={cn(
                              "min-h-11 rounded-md border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              active
                                ? "border-flame bg-flame text-background shadow-flame"
                                : "border-border bg-surface-elevated text-foreground hover:-translate-y-0.5 hover:border-flame/50",
                            )}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-2">
            <div
              id="booking-panel"
              ref={formRef}
              className="h-full scroll-mt-28 rounded-sm border border-border/60 bg-surface p-6 md:p-7"
            >
              {submitted && selection ? (
                <div className="flex h-full flex-col justify-center py-6">
                  <div className="grid size-12 place-items-center rounded-full border border-flame/40 bg-flame/15">
                    <CheckCircle2 className="size-6 text-flame" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
                    Booking request received
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Here&apos;s what Roger will confirm:
                  </p>
                  <dl className="mt-6 space-y-3 rounded-md border border-border/70 bg-background/60 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium text-foreground">{modeLabel}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">When</dt>
                      <dd className="font-medium text-foreground">{summary}</dd>
                    </div>
                    {goalLabel && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Goal</dt>
                        <dd className="text-right font-medium text-foreground">{goalLabel}</dd>
                      </div>
                    )}
                    {submittedValues?.name && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd className="font-medium text-foreground">{submittedValues.name}</dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                    No commitment yet. Roger confirms the session personally.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 w-full border-border/80 sm:w-auto"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedValues(null);
                      onSelect(null);
                      form.reset({ name: "", contact: "", goal: preferredGoal || "" });
                    }}
                  >
                    Choose another time
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
                  <div className="flex items-start gap-3 rounded-md border border-flame/25 bg-flame/10 p-4">
                    <Flame className="mt-0.5 size-5 shrink-0 text-flame" />
                    <div>
                      <div className="text-sm font-semibold">
                        {selection
                          ? `Reserving · ${modeLabel}`
                          : `Select a time for your ${modeLabel.toLowerCase()}`}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {selection ? (
                          <>
                            <span className="font-medium text-foreground">{summary}</span>
                            {" · "}
                            almost done
                          </>
                        ) : (
                          "Your details unlock after you choose a slot."
                        )}
                      </div>
                    </div>
                  </div>

                  <fieldset
                    disabled={!selection}
                    className={cn("mt-6 space-y-4", !selection && "opacity-45")}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="h-11 border-border bg-surface-elevated"
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
                      <Label htmlFor="contact">Email or phone</Label>
                      <Input
                        id="contact"
                        placeholder="you@email.com or (760) 000-0000"
                        className="h-11 border-border bg-surface-elevated"
                        aria-invalid={!!form.formState.errors.contact}
                        {...form.register("contact")}
                      />
                      {form.formState.errors.contact && (
                        <p className="text-xs text-destructive" role="alert">
                          {form.formState.errors.contact.message}
                        </p>
                      )}
                    </div>
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
                                onPreferredGoalChange(v);
                                form.trigger("goal");
                              }}
                            >
                              <SelectTrigger
                                id="goal"
                                className="h-11 border-border bg-surface-elevated"
                                aria-invalid={fieldState.invalid}
                              >
                                <SelectValue placeholder="Select your goal" />
                              </SelectTrigger>
                              <SelectContent>
                                {GOAL_OPTIONS.map((g) => (
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
                  </fieldset>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!selection}
                    className={cn("mt-6 h-12 w-full", PRIMARY_CTA_CLASS)}
                  >
                    {selection ? "Reserve My Session" : "Choose a Time"}
                    <ArrowRight className="size-4" />
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    No commitment. Roger confirms the session personally.
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
    <section id="faq" className="relative bg-surface/40 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <div className="mb-14 text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Before you book.
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="overflow-hidden rounded-sm border border-border/60 bg-background"
          >
            {MARKETING_FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-border/60 last:border-0"
              >
                <AccordionTrigger className="px-6 py-5 text-left font-display text-base font-medium hover:text-flame hover:no-underline md:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 leading-relaxed text-muted-foreground">
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

/* ---------------- Final CTA ---------------- */
function FinalCta({ onBook }: { onBook: (mode: BookingMode) => void }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-[84rem] px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-sm border border-flame/35 p-8 text-center flame-glow md:p-16">
            <img
              src={rogerCoachImg}
              alt=""
              className="pointer-events-none absolute inset-0 size-full object-cover object-[center_30%] opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/88 to-background/95" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Ready to start training?
              </h2>
              <p className="mt-4 font-display text-xl text-flame md:text-2xl">
                Choose your first session today.
              </p>
              <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2 text-sm text-muted-foreground sm:max-w-none sm:flex-row sm:justify-center sm:gap-6">
                <li>No phone tag.</li>
                <li>No waiting days for a reply.</li>
                <li>No generic contact form.</li>
              </ul>
              <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className={cn("h-12 w-full sm:w-auto", PRIMARY_CTA_CLASS)}
                  onClick={() => onBook("session")}
                >
                  Book Your First Session
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn("h-12 w-full sm:w-auto", SECONDARY_CTA_CLASS)}
                  onClick={() => onBook("consult")}
                >
                  Book Your Free Consultation
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                Roger personally confirms every booking.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="relative border-t border-border/60 pb-10 pt-16">
      <div className="mx-auto max-w-[84rem] px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src={logoImg} alt="Incinerate" className="h-8 w-auto" width={401} height={68} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Elite personal training with Roger Rojas. Private gym in Kearny Mesa — sauna, cold
              plunge, boxing, and coaching that treats you like a human being.
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              Explore
            </div>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="rounded-md transition-colors hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              Contact
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://instagram.com/incineratefitness/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Instagram className="size-4" />
                  @incineratefitness
                </a>
              </li>
              <li>
                <a
                  href="mailto:roger@incineratefitness.com"
                  className="inline-flex items-center gap-2 rounded-md hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Mail className="size-4" />
                  roger@incineratefitness.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+17605955012"
                  className="inline-flex items-center gap-2 rounded-md hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Phone className="size-4" />
                  (760) 595-5012
                </a>
              </li>
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>5402 Ruffin Rd Suite 104, San Diego, CA 92123</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Incinerate Fitness Inc. All rights reserved.</div>
          <div>Elite Personal Training · San Diego</div>
        </div>
      </div>
    </footer>
  );
}
