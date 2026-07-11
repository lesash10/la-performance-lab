import { useEffect, useRef, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";

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
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";

import {
  ABOUT,
  BRAND_CLARITY,
  BRAND_NAME,
  CONSULTATION_GOALS,
  CTA_AFTER_SUBMIT,
  CTA_SUPPORT,
  FEATURED_SPECIALS,
  FORM_REASSURANCE,
  HERO,
  HERO_BENEFIT_BADGES,
  HOURS,
  HOW_IT_WORKS_STEPS,
  HOW_IT_WORKS_SUPPORT,
  MEMBER_SPECIALS,
  MICHAEL_CONTACT,
  NAV,
  NAV_CTA,
  PLACEHOLDER_IMAGES,
  PRIMARY_CTA,
  REVIEW_BADGES,
  SERVICES,
  TESTIMONIAL_PROOF,
  TESTIMONIALS,
} from "./michael-content";
import { useMichaelPageMeta } from "./useMichaelPageMeta";

const MOBILE_NAV_PANEL_ID = "michael-mobile-nav-panel";
const CONSULTATION_ID = "consultation";

const consultationFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  goal: z.string().min(1, "Please select a goal"),
  message: z.string().optional(),
});
type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

const PRIMARY_CTA_CLASS =
  "group rounded-xl bg-michael-accent px-7 font-semibold tracking-[0.01em] text-michael-accent-foreground shadow-michael transition-[transform,box-shadow,background-color] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:bg-michael-accent/92";
const GHOST_CTA_CLASS =
  "group rounded-xl border-border bg-background px-5 font-medium text-foreground transition-[transform,border-color,background-color] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:border-michael-accent/35 hover:bg-michael-accent-muted/40";
const SECTION_PY = "py-[3.25rem] md:py-24 lg:py-28";
const CONTAINER = "mx-auto min-w-0 max-w-[77.5rem] px-5 md:px-8 lg:px-10";
const H1_CLASS =
  "mt-4 font-display text-[clamp(1.95rem,5.2vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:mt-5 md:leading-[1.08]";
const H2_CLASS =
  "mt-3 font-display text-[clamp(1.75rem,4.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:mt-4 md:leading-[1.08]";
const H2_ABOUT_CLASS =
  "mt-3 font-display text-[clamp(1.75rem,4.2vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:mt-4 md:leading-[1.08]";
const SECTION_HEAD_GAP = "mt-10 md:mt-12";

function CtaArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn("michael-cta-arrow size-4 transition-transform duration-200", className)}
      aria-hidden
    />
  );
}

function MichaelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3c-2.5 2.2-5 4.8-5 8.2a5 5 0 0 0 10 0c0-3.4-2.5-6-5-8.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 17.5h7M12 14.5v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MichaelWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-sm font-semibold tracking-[0.02em] sm:text-base", className)}>
      Michael&apos;s Wellness Center
    </span>
  );
}

function WellnessPhoto({
  src,
  alt,
  className,
  aspect = "landscape",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: "landscape" | "portrait" | "square";
  priority?: boolean;
}) {
  const aspectClass =
    aspect === "portrait"
      ? "aspect-[3/4] md:aspect-[4/5]"
      : aspect === "square"
        ? "aspect-square"
        : "aspect-[16/9] md:aspect-[16/10]";

  return (
    <div className={cn("michael-photo", aspectClass, className)}>
      <img
        src={src}
        alt={alt}
        width={aspect === "portrait" ? 800 : 1200}
        height={aspect === "portrait" ? 1000 : 750}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        className="size-full object-cover"
      />
      <div className="michael-photo-overlay" aria-hidden />
    </div>
  );
}

function ReviewPlatformIcon({ platform }: { platform: string }) {
  if (platform === "Yelp") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#d32323" />
        <path
          d="M8.2 8.5h2.1l.6 3.2.7-3.2h1.9l-1.4 7h-2.1l-.6-3.1-.7 3.1H7.1l1.1-7Z"
          fill="#fff"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#1877f2" />
      <path
        d="M13.2 8.5h2.1v1.2c.3-.9 1.1-1.4 2.1-1.4 1.6 0 2.5 1 2.5 2.9V15.5h-2.1v-4.6c0-1-.4-1.5-1.2-1.5-.8 0-1.3.6-1.3 1.6v4.5H13.2V8.5Z"
        fill="#fff"
      />
    </svg>
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
  tone?: "base" | "alt" | "muted";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        SECTION_PY,
        tone === "alt" && "michael-section-alt",
        tone === "muted" && "michael-section-muted",
        className,
      )}
    >
      {tone !== "base" && <div className="michael-section-divider" aria-hidden />}
      <div className={cn(CONTAINER, "relative z-10")}>{children}</div>
    </section>
  );
}

export function MichaelsWellnessPage() {
  useMichaelPageMeta();

  return (
    <main className="michael-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#top"
        className="absolute -top-14 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 focus:top-0 focus:translate-y-4 focus:outline-none focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      <MichaelHeader />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <AboutSection />
      <TestimonialsSection />
      <SpecialsSection />
      <FinalCTASection />
      <MichaelFooter />
      <StickyMobileCta />
    </main>
  );
}

function MichaelHeader() {
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
          ? "border-b border-border/60 bg-background/94 py-2 shadow-[0_8px_30px_-12px_oklch(0.35_0.03_55/0.08)] backdrop-blur-xl"
          : "bg-background/85 py-4 backdrop-blur-sm",
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
          <span className="grid size-9 place-items-center rounded-lg border border-michael-accent/20 bg-michael-accent-muted/50">
            <MichaelLogo className="size-4 text-michael-accent" />
          </span>
          <MichaelWordmark className="hidden sm:inline" />
        </a>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center md:flex">
          <Button asChild className={cn("h-10 px-5", PRIMARY_CTA_CLASS)}>
            <a href={`#${CONSULTATION_ID}`}>
              {NAV_CTA}
              <CtaArrow />
            </a>
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-md border border-border/70 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          className="border-t border-border/70 bg-background/98 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1.5 px-5 py-4">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                ref={i === 0 ? mobileNavFirstLinkRef : undefined}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md py-3 text-sm text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <Button asChild className={cn("mt-2 min-h-11 w-full", PRIMARY_CTA_CLASS)}>
              <a href={`#${CONSULTATION_ID}`} onClick={() => setOpen(false)}>
                {NAV_CTA}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-24 pb-[3.25rem] md:pt-32 md:pb-24 lg:pt-36 lg:pb-28"
    >
      <div className="michael-hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className={CONTAINER}>
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-michael-accent">
                {BRAND_CLARITY}
              </p>
              <h1 className={H1_CLASS}>{HERO.headline}</h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty md:mt-6 md:text-lg md:leading-[1.75]">
                {HERO.subhead}
              </p>
              <div className="mt-7 md:mt-9">
                <Button asChild size="lg" className={cn("h-12 min-h-12 w-full touch-manipulation sm:w-auto", PRIMARY_CTA_CLASS)}>
                  <a href={`#${CONSULTATION_ID}`}>
                    {PRIMARY_CTA}
                    <CtaArrow />
                  </a>
                </Button>
              </div>
              <ul
                className="mt-4 flex flex-wrap gap-2 md:mt-5"
                aria-label="Program highlights"
              >
                {HERO_BENEFIT_BADGES.map((badge) => (
                  <li
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/55 bg-michael-accent-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <Check className="size-3 shrink-0 text-michael-accent" strokeWidth={2.5} aria-hidden />
                    {badge}
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {HERO.support}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <WellnessPhoto
              src={PLACEHOLDER_IMAGES.hero.src}
              alt={PLACEHOLDER_IMAGES.hero.alt}
              aspect="landscape"
              priority
              className="w-full"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <SectionShell id="services" tone="alt">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How we help
          </p>
          <h2 className={H2_CLASS}>
            Programs built around your goals
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground md:mt-4">
            Every service starts with understanding you — then we recommend the right path forward.
          </p>
        </div>
      </Reveal>

      <div className={cn("grid w-full gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4", SECTION_HEAD_GAP)}>
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.05}>
            <article className={cn("michael-card flex h-full w-full flex-col p-5 md:p-7", `michael-card-tone-${i % 3}`)}>
              <div className="michael-icon-box size-11">
                <service.icon className="size-5 text-michael-accent" strokeWidth={1.25} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm font-medium text-michael-accent">{service.benefit}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.detail}
              </p>
              <Button asChild variant="ghost" className={cn("mt-5 min-h-11 w-full touch-manipulation justify-between md:mt-6", GHOST_CTA_CLASS)}>
                <a href={`#${CONSULTATION_ID}`}>
                  Discuss in your assessment
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

function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Simple next steps
          </p>
          <h2 className={H2_CLASS}>
            How it works
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground md:mt-4">
            {HOW_IT_WORKS_SUPPORT}
          </p>
        </div>
      </Reveal>

      <div className={cn("grid w-full gap-4 md:grid-cols-3 md:gap-6", SECTION_HEAD_GAP)}>
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.06}>
            <article className={cn("michael-card h-full w-full p-6 md:p-8", `michael-card-tone-${i % 3}`)}>
              <div className="flex items-start justify-between gap-4">
                <div className="michael-icon-box size-12">
                  <step.icon className="size-5 text-michael-accent" strokeWidth={1.25} />
                </div>
                <span className="michael-step-number font-display text-3xl font-semibold opacity-40">
                  {step.step}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold md:mt-6">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <div className="mt-10 text-center md:mt-12">
          <Button asChild size="lg" className={cn("h-12 min-h-12 w-full touch-manipulation px-8 sm:w-auto", PRIMARY_CTA_CLASS)}>
            <a href={`#${CONSULTATION_ID}`}>
              {PRIMARY_CTA}
              <CtaArrow />
            </a>
          </Button>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function AboutSection() {
  return (
    <SectionShell id="about" tone="alt">
      <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal>
          <WellnessPhoto
            src={PLACEHOLDER_IMAGES.about.src}
            alt={PLACEHOLDER_IMAGES.about.alt}
            aspect="portrait"
            className="mx-auto w-full max-w-md"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              About {BRAND_NAME}
            </p>
            <h2 className={H2_ABOUT_CLASS}>
              {ABOUT.headline}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground md:mt-4">{ABOUT.mission}</p>
          </Reveal>

          <div className="mt-6 space-y-3 md:mt-8 md:space-y-4">
            {ABOUT.points.map((point, i) => (
              <Reveal key={point.title} delay={0.04 + i * 0.04}>
                <div className="flex gap-4 rounded-xl border border-border/60 bg-background/75 p-5 shadow-[0_8px_28px_-16px_oklch(0.35_0.03_55/0.08)]">
                  <div className="michael-icon-box size-10 shrink-0">
                    <point.icon className="size-4 text-michael-accent" strokeWidth={1.25} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{point.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
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

function TestimonialsSection() {
  return (
    <SectionShell id="testimonials">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Client stories
          </p>
          <h2 className={cn(H2_CLASS, "md:mt-5")}>
            Real results from real members
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:mt-5">{TESTIMONIAL_PROOF}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:mt-5 md:gap-2.5">
            {REVIEW_BADGES.map((badge) => (
              <span key={badge.platform} className="michael-trust-badge">
                <ReviewPlatformIcon platform={badge.platform} />
                <span className="font-medium text-foreground/85">{badge.platform}</span>
                <span className="flex items-center gap-0.5 text-michael-accent" aria-hidden>
                  {Array.from({ length: badge.rating }).map((_, i) => (
                    <Star key={i} className="size-3 fill-current" />
                  ))}
                </span>
                <span>({badge.count})</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className={cn("grid w-full gap-4 md:grid-cols-3 md:gap-5", SECTION_HEAD_GAP)}>
        {TESTIMONIALS.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.06}>
            <article className={cn("michael-card flex h-full w-full flex-col p-6 md:p-7", `michael-card-tone-${i % 3}`)}>
              <div className="flex gap-0.5 text-michael-accent/90" aria-label={`${item.rating} star rating`}>
                {Array.from({ length: item.rating }).map((_, star) => (
                  <Star key={star} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-[1.72] text-foreground/90 md:mt-5 md:text-sm md:leading-[1.7]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 border-t border-border/70 pt-5">
                <div className="font-display text-sm font-semibold">{item.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.context}</div>
              </footer>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function SpecialsSection() {
  return (
    <SectionShell id="specials" tone="muted" className="!py-12 md:!py-20">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Current offers
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.625rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-foreground/90 md:mt-3">
            Member specials
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3">
            Available after your wellness assessment — ask which option fits your goals.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid w-full gap-3 md:mt-10 md:grid-cols-2 md:gap-4">
        {FEATURED_SPECIALS.map((special, i) => (
          <Reveal key={special.title} delay={i * 0.04}>
            <article className="michael-card-secondary w-full p-5 md:p-6">
              <h3 className="font-display text-lg font-semibold text-foreground/90">{special.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{special.detail}</p>
              <a
                href={`#${CONSULTATION_ID}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-michael-accent hover:underline"
              >
                Ask about this during your assessment
                <CtaArrow className="size-3.5" />
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid w-full gap-3 md:mt-6 md:grid-cols-2 lg:grid-cols-3">
        {MEMBER_SPECIALS.map((special, i) => (
          <Reveal key={special.title} delay={0.08 + i * 0.03}>
            <article className="michael-card-secondary w-full p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {special.note}
              </p>
              <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground/85">
                {special.title}
              </h3>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function FinalCTASection() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: { name: "", email: "", phone: "", goal: "", message: "" },
  });

  const onSubmit = (values: ConsultationFormValues) => {
    setSubmitted(true);
    toast.success("Request received", {
      description: `Thanks ${values.name.split(" ")[0]} — we'll reach out within 24 hours.`,
    });
  };

  return (
    <section id={CONSULTATION_ID} className={cn("relative michael-section-alt", SECTION_PY)}>
      <div className="michael-section-divider" aria-hidden />
      <div className="michael-hero-glow pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className={cn(CONTAINER, "relative z-10")}>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-michael-accent">
                Take the first step
              </p>
              <h2 className={H2_CLASS}>
                Ready to Take the First Step?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:mt-4 md:text-lg">
                Request your wellness assessment. We&apos;ll discuss your goals and recommend a
                personalized plan — no pressure, no confusing sign-up paths.
              </p>

              <ul className="mt-6 space-y-3 md:mt-8">
                {[
                  "Functional assessment included",
                  "Personalized program recommendations",
                  "Speak with a coach within 24 hours",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-michael-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-4 text-sm text-muted-foreground md:mt-10">
                <a
                  href={MICHAEL_CONTACT.phoneHref}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4" aria-hidden />
                  {MICHAEL_CONTACT.phone}
                </a>
                <a
                  href={MICHAEL_CONTACT.emailHref}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4" aria-hidden />
                  {MICHAEL_CONTACT.email}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {MICHAEL_CONTACT.address}
                </p>
                <div className="rounded-xl border border-border/60 bg-background/80 p-4 shadow-[0_8px_28px_-16px_oklch(0.35_0.03_55/0.06)]">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />
                    Hours
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {HOURS.map((row) => (
                      <li key={row.days} className="flex justify-between gap-4 text-sm">
                        <span>{row.days}</span>
                        <span className="text-right text-foreground/80">{row.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="michael-panel min-w-0 p-5 md:p-8">
              {submitted ? (
                <div className="flex min-h-[20rem] flex-col items-center justify-center py-8 text-center">
                  <div className="grid size-14 place-items-center rounded-full border border-michael-accent/30 bg-michael-accent-muted/50">
                    <CheckCircle2 className="size-7 text-michael-accent" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold">Request received.</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {CTA_AFTER_SUBMIT}
                  </p>
                  <Button asChild variant="outline" className={cn("mt-6", GHOST_CTA_CLASS)}>
                    <a href={MICHAEL_CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
                      Get directions
                      <CtaArrow />
                    </a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-semibold">{PRIMARY_CTA}</h3>
                    <p className="text-sm text-muted-foreground">{FORM_REASSURANCE}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="michael-name">Full name</Label>
                    <Input
                      id="michael-name"
                      placeholder="Your name"
                      className="h-11 border-border bg-background"
                      aria-invalid={!!form.formState.errors.name}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive" role="alert">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 max-md:grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="michael-email">Email</Label>
                      <Input
                        id="michael-email"
                        type="email"
                        placeholder="you@email.com"
                        className="h-11 border-border bg-background"
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
                      <Label htmlFor="michael-phone">Phone</Label>
                      <Input
                        id="michael-phone"
                        type="tel"
                        placeholder="(661) 555-0123"
                        className="h-11 border-border bg-background"
                        aria-invalid={!!form.formState.errors.phone}
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-xs text-destructive" role="alert">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="michael-goal">Primary goal</Label>
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
                              id="michael-goal"
                              className="h-11 border-border bg-background"
                              aria-invalid={fieldState.invalid}
                            >
                              <SelectValue placeholder="What do you want to work on?" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONSULTATION_GOALS.map((goal) => (
                                <SelectItem key={goal} value={goal}>
                                  {goal}
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
                    <Label htmlFor="michael-message">Anything we should know? (optional)</Label>
                    <Textarea
                      id="michael-message"
                      rows={3}
                      placeholder="Injuries, schedule, or questions about programs…"
                      className="resize-none border-border bg-background"
                      {...form.register("message")}
                    />
                  </div>

                  <Button type="submit" size="lg" className={cn("h-12 min-h-12 w-full touch-manipulation", PRIMARY_CTA_CLASS)}>
                    {PRIMARY_CTA}
                    <CtaArrow />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">{CTA_SUPPORT}</p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MichaelFooter() {
  return (
    <footer className="michael-footer border-t border-border/60 py-10 md:py-16">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg border border-michael-accent/25 bg-michael-accent-muted/60">
                <MichaelLogo className="size-3.5 text-michael-accent" />
              </span>
              <MichaelWordmark />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Personalized wellness coaching, functional fitness, and personal training in Lancaster,
              CA. One clear path to your first assessment.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Navigate
              </div>
              <ul className="mt-3 space-y-2">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Contact
              </div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <a href={MICHAEL_CONTACT.phoneHref} className="hover:text-foreground">
                    {MICHAEL_CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a href={MICHAEL_CONTACT.emailHref} className="hover:text-foreground">
                    {MICHAEL_CONTACT.email}
                  </a>
                </li>
                <li>{MICHAEL_CONTACT.shortAddress}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <div>© {new Date().getFullYear()} {BRAND_NAME}. Prototype for conversion review.</div>
          <div>Wellness · Personal Training · Lancaster, CA</div>
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
        pastHero = hero.getBoundingClientRect().bottom < vh * 0.25;
      } else {
        pastHero = window.scrollY > vh * 0.5;
      }
      let formOnScreen = false;
      if (consultation) {
        const rect = consultation.getBoundingClientRect();
        formOnScreen = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
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
        className="mx-auto flex min-h-12 max-w-lg touch-manipulation items-center justify-center gap-2 rounded-xl bg-michael-accent px-5 py-3.5 text-sm font-semibold text-michael-accent-foreground shadow-michael"
      >
        {NAV_CTA}
        <CtaArrow />
      </a>
    </div>
  );
}
