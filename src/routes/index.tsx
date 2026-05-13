import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#schedule", label: "Schedule" },
  { href: "#why", label: "Why Alex" },
  { href: "#logistics", label: "Logistics" },
  { href: "#booking", label: "Book" },
];

function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "py-3 bg-background/70 backdrop-blur-xl border-b border-border/60"
          : "py-5 bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="size-8 rounded-md bg-gradient-to-br from-ember to-ember-glow grid place-items-center shadow-ember">
            <Flame className="size-4 text-background" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            ALEX<span className="text-ember">.</span>CARTER
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#booking">
            <Button className="bg-ember hover:bg-ember/90 text-background font-medium rounded-full px-5 h-10 shadow-ember">
              Book Session
              <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>

        <button
          className="md:hidden size-10 grid place-items-center rounded-md border border-border/60"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="px-5 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground py-2"
              >
                {n.label}
              </a>
            ))}
            <a href="#booking" onClick={() => setOpen(false)}>
              <Button className="w-full bg-ember hover:bg-ember/90 text-background rounded-full">
                Book Session
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.5]);

  return (
    <section id="top" className="relative min-h-[100svh] flex items-center pt-28 pb-24">
      <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Personal trainer Alex Carter performing strength training in Los Angeles"
          width={1920}
          height={1080}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground mb-8">
            <span className="size-1.5 rounded-full bg-ember animate-pulse" />
            Now coaching in Los Angeles · Limited spots
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight text-balance">
            Structured Training.
            <br />
            <span className="text-ember">Real Results.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base md:text-lg text-muted-foreground text-pretty leading-relaxed">
            Premium indoor &amp; outdoor coaching for expats and busy
            professionals in Los Angeles. Built around your schedule, your
            goals, and the way you actually live.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href="#booking">
              <Button
                size="lg"
                className="h-12 rounded-full bg-ember hover:bg-ember/90 text-background font-medium px-7 shadow-ember w-full sm:w-auto"
              >
                Book Your Session
                <ArrowRight className="size-4" />
              </Button>
            </a>
            <a href="#booking">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border/80 bg-surface/40 backdrop-blur hover:bg-surface px-7 w-full sm:w-auto"
              >
                Free Consultation
              </Button>
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { k: "100+", v: "Sessions delivered" },
              { k: "12+", v: "Nationalities coached" },
              { k: "1:1", v: "Personalized plans" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-2xl md:text-3xl font-semibold">
                  {s.k}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
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
      quote:
        "Sessions fit around insane meeting weeks. I show up, I leave stronger. That simple.",
    },
    {
      img: t3,
      name: "Daniel R.",
      role: "Investor · Brazil",
      quote:
        "The most professional trainer I've worked with in any city. Worth every minute.",
    },
  ];
  return (
    <section className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <Eyebrow>Trusted globally</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 max-w-xl text-balance">
                Coaching that delivers, season after season.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              From founders to creatives, clients keep training with Alex
              because the system works.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { k: "100+", v: "Sessions completed" },
            { k: "12", v: "Nationalities trained" },
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
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {t.quote}
                  </p>
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
    <section id="services" className="py-24 md:py-32 relative bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
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
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-ember shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a href="#booking" className="block mt-7">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-border/80 bg-transparent hover:bg-ember hover:text-background hover:border-ember transition-colors"
                    >
                      Book this session
                      <ArrowRight className="size-4" />
                    </Button>
                  </a>
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
    { icon: Target, title: "Structured approach", desc: "Every session and week tied to a measurable goal." },
    { icon: Timer, title: "Efficient sessions", desc: "45–75 min training designed around your calendar." },
    { icon: ShieldCheck, title: "Real accountability", desc: "Weekly check-ins. No drift. No excuses." },
    { icon: MapPin, title: "Flexible locations", desc: "Indoor, outdoor, your gym — wherever you train best." },
    { icon: Globe2, title: "Built for expats", desc: "International communication, no local-jargon coaching." },
    { icon: LineChart, title: "Progression tracking", desc: "Numbers, photos, and lifts — measured every block." },
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
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {it.desc}
                </p>
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
    <section id="schedule" className="py-24 md:py-32 relative bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <Eyebrow>Schedule</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 max-w-xl text-balance">
                Pick your session. Pick your slot.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Morning, lunch break, or evening — coaching that fits any day in LA.
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
                      <div className="text-xs text-muted-foreground mt-1">
                        {c.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-semibold">
                      {c.price}
                    </div>
                    <div className="text-xs text-muted-foreground">{c.duration}</div>
                  </div>
                </div>

                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                  {c.desc}
                </p>

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
                    Available slots
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.slots.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-surface-elevated border border-border px-3 py-1.5 text-sm font-medium hover:border-ember/60 hover:text-ember transition-colors cursor-pointer"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <a href="#booking" className="block mt-7">
                  <Button className="w-full rounded-full bg-ember hover:bg-ember/90 text-background h-11 shadow-ember">
                    Book This Session
                    <ArrowRight className="size-4" />
                  </Button>
                </a>
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
              No fads. No gimmicks. Just professional, structured coaching
              tailored to your level — designed to deliver progress you can feel
              and measure.
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
                <h3 className="font-display text-lg font-semibold mt-5">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <a href="#booking">
              <Button
                size="lg"
                className="h-12 rounded-full bg-ember hover:bg-ember/90 text-background px-8 shadow-ember"
              >
                Book Your First Session
                <ArrowRight className="size-4" />
              </Button>
            </a>
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
});
type FormValues = z.infer<typeof formSchema>;

function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("7:00 AM");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", goal: "", type: "", message: "" },
  });

  const days = (() => {
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
  })();
  const slots = ["6:30 AM", "7:00 AM", "12:30 PM", "5:30 PM", "6:30 PM", "7:00 PM"];

  const onSubmit = (values: FormValues) => {
    setSubmitted(true);
    toast.success("Request received", {
      description: `Thanks ${values.name.split(" ")[0]} — Alex will reply within 24 hours.`,
    });
  };

  return (
    <section id="booking" className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <Eyebrow>Book your session</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-balance">
              Pick a time. Tell Alex your goal. Start training.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Response within 24 hours, every time. No bots, no chasing.
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
                    Pick a day
                  </div>
                  <div className="font-display text-lg font-semibold mt-1">
                    Next 7 days
                  </div>
                </div>
                <Calendar className="size-5 text-ember" />
              </div>

              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {days.map((d) => (
                  <button
                    key={d.i}
                    type="button"
                    onClick={() => setSelectedDay(d.i)}
                    className={cn(
                      "rounded-xl py-3 flex flex-col items-center border transition-all",
                      selectedDay === d.i
                        ? "bg-ember border-ember text-background shadow-ember"
                        : "bg-surface-elevated border-border hover:border-ember/40",
                    )}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-80">
                      {d.weekday}
                    </span>
                    <span className="font-display text-lg font-semibold mt-0.5">
                      {d.day}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-7">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Available times
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={cn(
                        "rounded-lg py-2.5 text-sm font-medium border transition-all",
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
                  Selected:{" "}
                  <span className="text-foreground font-medium">
                    {days[selectedDay].weekday} {days[selectedDay].day}
                  </span>{" "}
                  ·{" "}
                  <span className="text-foreground font-medium">
                    {selectedSlot}
                  </span>
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
                  <h3 className="font-display text-2xl font-semibold mt-5">
                    You're on Alex's calendar.
                  </h3>
                  <p className="mt-2 text-muted-foreground max-w-sm">
                    Confirmation sent. Alex will reach out within 24 hours to
                    lock the time and location.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        placeholder="Alex Smith"
                        className="h-11 bg-surface-elevated border-border"
                        {...form.register("name")}
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive">
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
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary goal</Label>
                      <Select
                        onValueChange={(v) => form.setValue("goal", v, { shouldValidate: true })}
                      >
                        <SelectTrigger className="h-11 bg-surface-elevated border-border">
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fat-loss">Fat loss</SelectItem>
                          <SelectItem value="strength">Strength & muscle</SelectItem>
                          <SelectItem value="performance">Athletic performance</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle & health</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.goal && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.goal.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred training type</Label>
                      <Select
                        onValueChange={(v) => form.setValue("type", v, { shouldValidate: true })}
                      >
                        <SelectTrigger className="h-11 bg-surface-elevated border-border">
                          <SelectValue placeholder="Select training type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indoor">Indoor 1-on-1</SelectItem>
                          <SelectItem value="outdoor">Outdoor strength</SelectItem>
                          <SelectItem value="group">Small group class</SelectItem>
                          <SelectItem value="custom">Custom program</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.type && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.type.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Anything Alex should know? (optional)</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Injuries, schedule constraints, training history…"
                      className="bg-surface-elevated border-border resize-none"
                      {...form.register("message")}
                    />
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
                    Response within 24 hours. Your details stay private.
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
  const faqs = [
    {
      q: "Do you train beginners?",
      a: "Yes — most clients start as beginners or returning to training. Every program is built around your current level with safe, structured progression.",
    },
    {
      q: "Indoor or outdoor sessions?",
      a: "Both. You can train indoors at a private gym, your building's gym, or outdoors at parks, beaches, and tracks. Choose what fits your week.",
    },
    {
      q: "Which areas in LA do you cover?",
      a: "West Hollywood, Beverly Hills, Santa Monica, Venice, and Downtown LA. Other locations available on request.",
    },
    {
      q: "Do you offer custom plans?",
      a: "Yes. Custom 4–12 week programs include programming, weekly check-ins, video feedback, and progression tracking.",
    },
    {
      q: "How fast can I start?",
      a: "Most clients book their first session within the same week. Reach out and Alex will confirm availability within 24 hours.",
    },
  ];

  return (
    <section className="py-24 md:py-32 relative bg-surface/30">
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
            {faqs.map((f, i) => (
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
          <a href="#booking" className="inline-block mt-8">
            <Button
              size="lg"
              className="h-12 rounded-full bg-ember hover:bg-ember/90 text-background px-8 shadow-ember"
            >
              Book Your Session
              <ArrowRight className="size-4" />
            </Button>
          </a>
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
              Premium personal training in Los Angeles. Indoor, outdoor, and
              custom coaching for expats and busy professionals.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Explore
            </div>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-ember transition-colors">
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
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-ember transition-colors"
                >
                  <Instagram className="size-4" /> @alex.carter
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@alexcarter.la"
                  className="inline-flex items-center gap-2 hover:text-ember transition-colors"
                >
                  <Mail className="size-4" /> hello@alexcarter.la
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> Los Angeles, CA
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
