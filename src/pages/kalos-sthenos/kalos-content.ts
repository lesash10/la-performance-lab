import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarCheck,
  ClipboardCheck,
  Dumbbell,
  Flame,
  Heart,
  HeartPulse,
  MessageCircle,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

export const KALOS_CONTACT = {
  phone: "661-373-7430",
  phoneHref: "tel:+16613737430",
  email: "info@kalossthenosfitness.com",
  emailHref: "mailto:info@kalossthenosfitness.com?subject=Free%207-Day%20Trial%20Request",
  address: "26620 Valley Center Drive, Suite 105, Santa Clarita, CA 91351",
  shortAddress: "Canyon Country · Santa Clarita",
  mapsHref: "https://maps.google.com/?q=26620+Valley+Center+Drive+Suite+105+Santa+Clarita+CA+91351",
  website: "https://kalossthenosfitness.com",
} as const;

export const PRIMARY_CTA = "Start My Free 7-Day Trial";
export const SECONDARY_CTA = "See What's Included";
export const CTA_REASSURANCE = "No pressure. No contracts. Just a full week to experience the gym.";
export const FORM_REASSURANCE =
  "No payment. No contracts. A coach will contact you to schedule your first session.";
export const CTA_AFTER_SUBMIT =
  "A coach will reach out within 24 hours to book your first session — no payment required.";
export const BRAND_NAME = "Kalos Sthenos Fitness";
export const BRAND_CLARITY = "One brand · One offer · One path to your first class";
export const FOOTER_TAGLINE = "One clear path from first click to first class.";

export const PAGE_META = {
  title: "Kalos Sthenos Fitness | Free 7-Day Trial in Canyon Country",
  description:
    "One clear path to start: try coach-led strength & conditioning free for 7 days at Kalos Sthenos Fitness in Canyon Country. Unlimited classes, coach assessment, no commitment.",
} as const;

export const NAV = [
  { href: "#trial-includes", label: "What's included" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#who-its-for", label: "Who it's for" },
  { href: "#results", label: "Results" },
  { href: "#programs", label: "Programs" },
  { href: "#faq", label: "FAQ" },
] as const;

export const TRIAL_INCLUDES: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  detail: string;
}> = [
  {
    icon: CalendarCheck,
    title: "Unlimited classes for 7 days",
    detail: "Attend as many coached sessions as you want during your trial week.",
  },
  {
    icon: ClipboardCheck,
    title: "Initial coach assessment",
    detail: "We learn how you move, what you want, and where to start — before your first workout.",
  },
  {
    icon: UserCheck,
    title: "Guidance from experienced coaches",
    detail: "Real coaching on every rep — not a workout thrown on a screen.",
  },
  {
    icon: Target,
    title: "Personalized recommendations",
    detail: "You'll know which classes fit your goals and how to train safely from day one.",
  },
  {
    icon: Users,
    title: "Access to the community",
    detail: "Small groups (max 10). You'll know names by your second session.",
  },
  {
    icon: ShieldCheck,
    title: "No long-term commitment",
    detail: "Seven days. Zero obligation. Decide after you've actually trained here.",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Claim your trial",
    body: "Fill out a short form. No credit card. No payment. Just your name and how to reach you.",
    reassurance: "Takes under 60 seconds.",
  },
  {
    step: "02",
    title: "Book your first session",
    body: "A coach contacts you within 24 hours to schedule your assessment and first class.",
    reassurance: "We'll find a time that works for your schedule.",
  },
  {
    step: "03",
    title: "Train free for seven days",
    body: "Show up, get coached, try different classes. Experience the gym before any membership decision.",
    reassurance: "Unlimited classes. No sales pitch.",
  },
] as const;

export const WHO_ITS_FOR = [
  {
    icon: Scale,
    title: "You want to lose weight and feel better",
    goals: ["Lose weight", "Improve health", "Feel better"],
    text: "Structured coaching and simple nutrition guidance — without extreme diets or burnout.",
  },
  {
    icon: Dumbbell,
    title: "You want to build strength and move well",
    goals: ["Build strength", "Train consistently"],
    text: "Quality movement and progressive strength work with coaches who watch your form.",
  },
  {
    icon: HeartPulse,
    title: "You're starting fresh or coming back",
    goals: ["Feel better", "Improve health", "Train consistently"],
    text: "Beginner-friendly environment. No yelling. No competing. Just coaching that meets you where you are.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Best program I've found for overall health and fitness. It's not about competing — it's about quality movement and form. That's what makes this place different.",
    name: "Jeremy P.",
    rating: 5,
  },
  {
    quote:
      "I dropped in from out of town and was welcomed like a regular. Super friendly, well-run, and a solid training environment.",
    name: "Curt T.",
    rating: 5,
  },
  {
    quote:
      "Love this place. Great workouts, always learning something new. Trainers are top-notch.",
    name: "Roxanne B.",
    rating: 5,
  },
] as const;

export const WHY_KALOS = [
  {
    icon: UserCheck,
    title: "Experienced coaches",
    text: "Coach John brings 25+ years of helping people move better, get stronger, and build habits that stick.",
  },
  {
    icon: Heart,
    title: "Supportive community",
    text: "Small groups capped at 10. You get coached — not lost in a crowd.",
  },
  {
    icon: Activity,
    title: "Science-backed programming",
    text: "Planned progressions — not random workouts. Every session has a purpose.",
  },
  {
    icon: Sparkles,
    title: "Beginner friendly",
    text: "Never trained before? Coming back after years off? You'll be coached, not judged.",
  },
  {
    icon: Users,
    title: "Small coaching environment",
    text: "We keep classes small so coaches can actually watch your form and adjust in real time.",
  },
] as const;

export const PROGRAMS = [
  {
    icon: Dumbbell,
    title: "Strength",
    description:
      "Build muscle, improve movement quality, and get stronger with coached barbell and kettlebell work.",
    includes: "Included in your free trial",
  },
  {
    icon: Flame,
    title: "Conditioning",
    description:
      "Metabolic conditioning and athletic circuits designed to improve endurance without destroying your joints.",
    includes: "Included in your free trial",
  },
  {
    icon: MessageCircle,
    title: "Personal Coaching",
    description:
      "1-on-1 attention for specific goals, injury history, or anyone who wants a plan built around their body.",
    includes: "Assessment included in trial",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Is the 7-day trial really free?",
    a: "Yes. No credit card required to start. You get a full week of coached classes and your initial assessment at no cost. If you decide to join after, we'll walk you through membership options — only if you want to.",
  },
  {
    q: "Do I need experience to join?",
    a: "No. Most members started as beginners. Coaches scale every movement to your level and teach form before adding weight or intensity.",
  },
  {
    q: "How many classes can I take during the trial?",
    a: "Unlimited for 7 days. Most trial members attend 3–5 sessions that first week — enough to know if the coaching and community fit.",
  },
  {
    q: "Do I need to reserve a spot?",
    a: "Yes — classes are capped at 10 people so coaching stays personal. After you claim your trial, we'll help you book your first session and show you how to reserve classes for the rest of the week.",
  },
  {
    q: "What happens after the 7 days?",
    a: "You decide. If Kalos Sthenos is the right fit, we'll discuss membership options. If not, no hard feelings and no automatic charges. The trial exists so you can make an informed choice.",
  },
  {
    q: "Is there pressure to join after the trial?",
    a: "No. Coach John and the team want you to experience real coaching first. You'll get honest guidance — not a high-pressure sales pitch.",
  },
  {
    q: "Is nutrition coaching included?",
    a: "Your trial includes introductory nutrition guidance — simple, sustainable habits, not restrictive meal plans. Deeper nutrition coaching is available for members who want it.",
  },
  {
    q: "I see different names online — Kalos Sthenos, CrossFit Kalos Sthenos, KFS. Is this the same gym?",
    a: "Yes — it's all Kalos Sthenos Fitness. This page is your one starting point: claim your free 7-day trial here, and a coach handles booking your first session. No separate opt-ins or confusing paths.",
  },
] as const;

export const HERO_PROOF = [
  "25+ years coaching experience",
  "Small groups · max 10",
  "Canyon Country, CA",
] as const;

export const TRUST_STRIP_PROOF = ["7 days free", "Max 10 per class", "25+ years coaching"] as const;

export const COMMUNITY_STATS = [
  { value: "10", label: "Max per class" },
  { value: "7", label: "Days free" },
  { value: "25+", label: "Years coaching" },
] as const;
