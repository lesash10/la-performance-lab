import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { InquiryDialog } from "./InquiryDialog";
import { useBfitPageMeta } from "./useBfitPageMeta";
import "./bfit.css";

const INSTAGRAM_URL = "https://www.instagram.com/brookfitness_/";

const NAV = [
  { href: "#method", label: "Method" },
  { href: "#about", label: "About" },
  { href: "#results", label: "Results" },
] as const;

const METHOD = [
  {
    index: "01",
    title: "20 minutes",
    body: "Follow-along workouts designed to fit into a busy day.",
  },
  {
    index: "02",
    title: "Structure",
    body: "Dumbbell + bodyweight plans with built-in progression.",
  },
  {
    index: "03",
    title: "Nutrition",
    body: "Simple guidance without making food another full-time job.",
  },
  {
    index: "04",
    title: "Coaching",
    body: "Direct support from Brook when you need direction.",
  },
  {
    index: "05",
    title: "Community",
    body: "Train alongside people working toward the same goal.",
  },
] as const;

const STEPS = [
  {
    index: "01",
    title: "Find your starting point",
    body: "Tell us where you are now and what you're working toward.",
  },
  {
    index: "02",
    title: "Follow the plan",
    body: "Get a structured approach built around efficient training and progression.",
  },
  {
    index: "03",
    title: "Stay consistent",
    body: "Use Brook's coaching and community when you need support.",
  },
  {
    index: "04",
    title: "Get stronger",
    body: "Progress without making fitness your entire life.",
  },
] as const;

const PROOF = [
  {
    label: "Client result photo",
    note: "Add a real Brook transformation here.",
    className: "min-h-[28rem] md:row-span-2 md:min-h-[40rem]",
  },
  {
    label: "Client review",
    note: "Add a real review or screenshot here.",
    className: "min-h-[16rem]",
  },
  {
    label: "Training photo",
    note: "Add real client or coaching footage here.",
    className: "min-h-[16rem]",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function BfitPage() {
  useBfitPageMeta();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openInquiry = () => {
    setMenuOpen(false);
    setInquiryOpen(true);
  };

  return (
    <div className="bfit overflow-x-clip">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-[#141414] focus:px-4 focus:py-2 focus:text-[#f3f1ec]"
      >
        Skip to content
      </a>
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onNavigate={() => setMenuOpen(false)}
        onStart={openInquiry}
      />
      <main id="content">
        <Hero onStart={openInquiry} />
        <Positioning />
        <Method />
        <BrandStatement />
        <About />
        <Proof />
        <HowItWorks />
        <FinalCta onStart={openInquiry} />
      </main>
      <Footer />
      <InquiryDialog open={inquiryOpen} onOpenChange={setInquiryOpen} />
    </div>
  );
}

function Header({
  menuOpen,
  onToggleMenu,
  onNavigate,
  onStart,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: () => void;
  onStart: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f3f1ec]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-[90rem] items-center justify-between gap-4 px-5 md:px-8">
        <a href="#content" className="leading-none" onClick={onNavigate}>
          <span className="block text-[1.45rem] font-medium tracking-[-0.05em]">bFIT</span>
          <span className="mt-1 block text-[0.62rem] tracking-[0.18em] text-[#8a8178] uppercase">
            Brook Ryan
          </span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Page">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.78rem] tracking-[0.14em] text-[#3c3934] uppercase"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onStart}
            className="hidden min-h-11 items-center bg-[#141414] px-4 text-[0.68rem] font-medium tracking-[0.14em] text-[#f3f1ec] uppercase md:inline-flex"
          >
            See If bFIT Is Right for You
          </button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center border border-black/15 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="bfit-mobile-nav"
            onClick={onToggleMenu}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className="flex w-4 flex-col gap-1.5" aria-hidden>
              <span
                className={cn(
                  "h-px origin-center bg-[#141414] transition-transform duration-200 motion-reduce:transition-none",
                  menuOpen && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px origin-center bg-[#141414] transition-transform duration-200 motion-reduce:transition-none",
                  menuOpen && "-translate-y-[3.5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav
          id="bfit-mobile-nav"
          className="border-t border-black/10 px-5 py-4 lg:hidden"
          aria-label="Page"
        >
          <div className="grid gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex min-h-12 items-center text-sm tracking-[0.14em] uppercase"
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={onStart}
            className="mt-3 min-h-12 w-full bg-[#141414] px-4 text-[0.72rem] font-medium tracking-[0.14em] text-[#f3f1ec] uppercase"
          >
            See If bFIT Is Right for You
          </button>
        </nav>
      ) : null}
    </header>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="grid min-h-[calc(100svh-4.25rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="flex flex-col justify-start px-5 pt-6 pb-10 md:px-8 md:pt-12 lg:justify-end lg:py-16 lg:pr-12 lg:pl-10 xl:pl-16">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[0.72rem] font-medium tracking-[0.22em] text-[#8a8178] uppercase"
        >
          Brook Ryan
          <span className="mx-2 text-black/25">/</span>
          Home Workout Coach
        </motion.p>
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
          className="mt-5 max-w-[11ch] text-[clamp(2.75rem,9vw,6.6rem)] leading-[0.84] font-medium tracking-[-0.055em] uppercase lg:mt-6"
        >
          Get stronger.
          <span className="block">Get leaner.</span>
          <span className="block">From home.</span>
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          className="mt-7 max-w-[38ch] text-base leading-relaxed text-[#3c3934] md:text-[1.05rem]"
        >
          Progressive 20-minute training, simple nutrition guidance and direct coaching for busy
          people who want to get stronger without rearranging their life around fitness.
        </motion.p>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          className="mt-8"
        >
          <StartButton onClick={onStart} className="w-full sm:w-auto" />
          <p className="mt-6 text-[0.78rem] tracking-[0.12em] text-[#5c574f] uppercase">
            15 years coaching
            <span className="mx-3 text-black/20">·</span>
            3× Powerlifting Champion
          </p>
        </motion.div>
      </div>
      <motion.div
        className="bfit-hero-media"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <PhotoSlot
          label="Placeholder for a real photograph of Brook Ryan."
          detail="Brook Ryan"
          caption="Hero photo"
          className="h-full min-h-[34svh] lg:min-h-full"
        />
      </motion.div>
    </section>
  );
}

function Positioning() {
  return (
    <section className="border-t border-black/10 px-5 py-20 md:px-8 md:py-28 lg:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <h2 className="max-w-[12ch] text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.88] font-medium tracking-[-0.05em] uppercase">
            You don't need more time.
            <span className="mt-3 block">You need a plan you can actually follow.</span>
          </h2>
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:pt-6" delay={0.08}>
          <p className="text-lg leading-relaxed text-[#3c3934]">
            Most busy people don't need another complicated workout plan.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#3c3934]">
            They need to know what to do, be able to fit it into their day, and have a structure
            they can stay consistent with.
          </p>
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-20 max-w-[90rem] border-t border-black/10 pt-12 md:mt-28">
        <blockquote>
          <p className="bfit-serif max-w-[16ch] text-[clamp(2.5rem,6vw,5rem)] leading-[0.96] tracking-[-0.03em] italic">
            Fitness should fit around your life, not take it over.
          </p>
          <footer className="mt-6 text-[0.72rem] tracking-[0.2em] text-[#8a8178] uppercase">
            Brook Ryan
          </footer>
        </blockquote>
      </Reveal>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="border-t border-black/10 bg-[#ebe6de]">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <div className="px-5 py-16 md:px-8 lg:sticky lg:top-24 lg:col-span-5 lg:h-fit lg:py-24 lg:pr-10">
          <p className="text-[0.72rem] font-medium tracking-[0.22em] text-[#8a8178] uppercase">
            The bFIT method
          </p>
          <h2 className="mt-5 max-w-[10ch] text-[clamp(3rem,6vw,5.4rem)] leading-[0.86] font-medium tracking-[-0.05em] uppercase">
            Built for consistency.
          </h2>
          <p className="mt-6 max-w-[32ch] text-base leading-relaxed text-[#3c3934]">
            Short sessions. A plan that progresses. Coaching when you need it. Enough structure to
            keep going.
          </p>
        </div>
        <ol className="border-black/10 lg:col-span-7 lg:border-l">
          {METHOD.map((item) => (
            <li
              key={item.index}
              className="border-t border-black/10 px-5 py-10 first:border-t-0 md:px-8 lg:px-12 lg:py-14"
            >
              <Reveal>
                <p className="text-[0.72rem] tracking-[0.2em] text-[#8a8178]">{item.index}</p>
                <h3 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-none font-medium tracking-[-0.045em] uppercase">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-[#3c3934] md:text-lg">
                  {item.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BrandStatement() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#111111] text-[#f3f1ec]">
      <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <motion.div
          className="px-5 py-24 md:px-8 md:py-32 lg:px-12 lg:py-40 xl:px-16"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[0.72rem] tracking-[0.22em] text-[#f3f1ec]/50 uppercase">bFIT</p>
          <h2 className="mt-8 max-w-[10ch] text-[clamp(3.4rem,8vw,7rem)] leading-[0.84] font-medium tracking-[-0.055em] uppercase">
            Train smart.
            <span className="block">Stay consistent.</span>
            <span className="block">Get stronger.</span>
          </h2>
        </motion.div>
        <PhotoSlot
          label="Placeholder for a full-length training photo of Brook."
          detail="Train."
          caption="Brand photo"
          className="min-h-[22rem] lg:min-h-full"
          quiet
        />
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-t border-black/10">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-2">
        <PhotoSlot
          label="Placeholder for a portrait of Brook Ryan coaching or training at home."
          detail="The coach."
          caption="About photo"
          className="min-h-[28rem] lg:min-h-[44rem]"
        />
        <div className="flex flex-col justify-center px-5 py-16 md:px-8 lg:px-14 lg:py-24">
          <Reveal>
            <p className="text-[0.72rem] font-medium tracking-[0.22em] text-[#8a8178] uppercase">
              Brook Ryan
            </p>
            <h2 className="mt-5 max-w-[12ch] text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.88] font-medium tracking-[-0.05em] uppercase">
              Coaching built from experience.
            </h2>
            <p className="mt-5 text-[0.78rem] tracking-[0.14em] text-[#5c574f] uppercase">
              Home Workout Coach
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-y border-black/10 py-6">
              <p>
                <span className="block text-[clamp(2rem,4vw,3rem)] leading-none font-medium tracking-[-0.04em]">
                  15
                </span>
                <span className="mt-2 block text-[0.72rem] tracking-[0.16em] text-[#8a8178] uppercase">
                  Years coaching
                </span>
              </p>
              <p>
                <span className="block text-[clamp(2rem,4vw,3rem)] leading-none font-medium tracking-[-0.04em]">
                  3×
                </span>
                <span className="mt-2 block text-[0.72rem] tracking-[0.16em] text-[#8a8178] uppercase">
                  Powerlifting Champion
                </span>
              </p>
            </div>
            <div className="mt-8 max-w-[42ch] space-y-4 text-base leading-relaxed text-[#3c3934] md:text-lg">
              <p>
                After years in fitness, Brook's approach isn't about making training more
                complicated. It's about removing the reasons people stop.
              </p>
              <p>Clear workouts. Real progression. A plan that fits real life.</p>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-11 items-center text-[0.78rem] tracking-[0.16em] uppercase underline decoration-black/25 underline-offset-4"
            >
              Instagram @brookfitness_
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section
      id="results"
      className="border-t border-black/10 bg-[#e7e1d7] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[90rem]">
        <Reveal>
          <p className="text-[0.72rem] font-medium tracking-[0.22em] text-[#8a8178] uppercase">
            Proof
          </p>
          <h2 className="mt-5 max-w-[14ch] text-[clamp(2.6rem,6vw,5rem)] leading-[0.88] font-medium tracking-[-0.05em] uppercase">
            The plan only matters if you can stick to it.
          </h2>
          <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-[#3c3934] md:text-lg">
            This is where Brook's real results, reviews, and client training belong. No sample
            clients are shown.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-3 md:grid-cols-2 md:grid-rows-2">
          {PROOF.map((item) => (
            <PhotoSlot
              key={item.label}
              label={item.note}
              detail={item.label}
              caption="Awaiting Brook asset"
              className={item.className}
              light
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-t border-black/10 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[90rem]">
        <Reveal>
          <h2 className="max-w-[12ch] text-[clamp(2.8rem,6vw,5rem)] leading-[0.88] font-medium tracking-[-0.05em] uppercase">
            Simple on purpose.
          </h2>
        </Reveal>
        <ol className="mt-14 grid border-t border-black/15 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.index}
              className="border-b border-black/15 py-8 xl:border-r xl:border-b-0 xl:px-6 xl:first:pl-0 xl:last:border-r-0 xl:last:pr-0"
            >
              <Reveal>
                <p className="bfit-serif text-5xl leading-none text-[#8a8178]">{step.index}</p>
                <h3 className="mt-5 max-w-[14ch] text-xl leading-tight font-medium tracking-[-0.03em] uppercase">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-[#3c3934] md:text-base">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-[#111111] text-[#f3f1ec]">
      <div className="mx-auto grid max-w-[90rem] items-end gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.6fr)]">
        <Reveal>
          <h2 className="max-w-[10ch] text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.86] font-medium tracking-[-0.055em] uppercase">
            Make fitness fit your life.
          </h2>
          <p className="mt-8 text-base tracking-[0.04em] text-[#f3f1ec]/75 md:text-lg">
            20-minute training.
            <span className="mx-3 text-white/25">/</span>
            Simple progression.
            <span className="mx-3 text-white/25">/</span>
            Real coaching.
          </p>
          <div className="mt-10">
            <StartButton onClick={onStart} tone="light" className="w-full sm:w-auto" />
          </div>
        </Reveal>
        <PhotoSlot
          label="Placeholder for a closing photograph of Brook."
          detail="bFIT"
          caption="Closing photo"
          className="min-h-[18rem]"
          quiet
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/10 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl font-medium tracking-[-0.05em]">bFIT</p>
          <p className="mt-2 text-sm text-[#5c574f]">Brook Ryan</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-sm tracking-[0.12em] uppercase">
              {item.label}
            </a>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm tracking-[0.12em] uppercase"
          >
            Instagram
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-[90rem] text-xs leading-relaxed text-[#8a8178]">
        Prototype for Brook Ryan. The inquiry is a demonstration. Answers stay in this browser and
        are not submitted.
      </p>
    </footer>
  );
}

function StartButton({
  onClick,
  tone = "dark",
  className,
}: {
  onClick: () => void;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-left text-[0.74rem] font-medium tracking-[0.14em] uppercase transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        tone === "dark" ? "bg-[#141414] text-[#f3f1ec]" : "bg-[#f3f1ec] text-[#141414]",
        className,
      )}
    >
      See If bFIT Is Right for You
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </button>
  );
}

function PhotoSlot({
  label,
  detail,
  caption,
  className,
  light = false,
  quiet = false,
}: {
  label: string;
  detail: string;
  caption: string;
  className?: string;
  light?: boolean;
  quiet?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`${caption}. ${label}`}
      className={cn(
        "relative flex h-full flex-col justify-between p-6 md:p-8",
        light ? "bfit-slot-light text-[#141414]" : "bfit-slot text-[#f3f1ec]",
        quiet && "bg-[#1a1a1a]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-4 border border-current/20 md:inset-5"
        aria-hidden
      />
      <p className="relative text-[0.68rem] tracking-[0.2em] uppercase opacity-60">{caption}</p>
      <div className="relative">
        <p className="bfit-serif text-[clamp(2.4rem,4vw,3.8rem)] leading-none tracking-[-0.03em]">
          {detail}
        </p>
        <p className="mt-3 max-w-[24ch] text-sm leading-relaxed opacity-70">{label}</p>
      </div>
    </div>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
