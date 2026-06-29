import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRightLeft,
  CalendarCheck,
  Dumbbell,
  Footprints,
  HeartPulse,
  RefreshCw,
  Scale,
  Target,
  Users,
} from "lucide-react";

export const SPRY_CONTACT = {
  email: "evanspryfitness@gmail.com",
  phone: "949-290-8515",
  phoneHref: "tel:+19492908515",
  emailHref: "mailto:evanspryfitness@gmail.com?subject=Free%20Consultation%20Request",
  address: "2815 Pico Blvd, Santa Monica, CA 90405",
  shortAddress: "2815 Pico Blvd · Santa Monica",
  mapsHref: "https://maps.google.com/?q=2815+Pico+Blvd,+Santa+Monica,+CA+90405",
  website: "https://spry-fitness.com",
} as const;

export const PRIMARY_CTA = "Book your free consultation";
export const CTA_SUPPORT = "Free 20-minute consultation · No pressure · Santa Monica";
export const CTA_AFTER_SUBMIT =
  "Evan replies personally to confirm your consultation — no automated booking.";

export const PAGE_META = {
  title: "Spry Fitness | Personal Training in Santa Monica",
  description:
    "Strength, mobility, and corrective exercise coaching in Santa Monica. Book your free consultation with Evan Spry — 1-on-1 and small group training.",
} as const;

export const NAV = [
  { href: "#who-its-for", label: "Who it's for" },
  { href: "#results", label: "Results" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#coaching", label: "Coaching" },
  { href: "#consultation", label: "Book" },
  { href: "#faq", label: "FAQ" },
] as const;

export const SERVICE_PILLARS = [
  "Strength + Conditioning",
  "Corrective Exercise",
  "Mobility Focus",
  "Nutrition Support",
] as const;

export const HERO_PROOF_CHIPS = [
  "5-star client reviews",
  "12-week transformations",
  "Santa Monica studio",
] as const;

export const CONSULTATION_TOPICS = [
  {
    icon: Target,
    title: "Your goal",
    text: "Fat loss, strength, mobility, injury recovery, or long-term consistency — we start with what matters to you.",
  },
  {
    icon: Footprints,
    title: "Your starting point",
    text: "We look at your schedule, training history, limitations, and confidence level so the plan feels realistic.",
  },
  {
    icon: ArrowRightLeft,
    title: "Your next step",
    text: "You'll leave knowing whether 1-on-1, small group, or another path is the best fit.",
  },
] as const;

export const WHO_ITS_FOR = [
  {
    icon: Dumbbell,
    title: "You want to build strength without guessing",
    text: "Structured coaching that teaches form, progression, and confidence — not random workouts.",
  },
  {
    icon: HeartPulse,
    title: "You're coming back from pain, stiffness, or injury",
    text: "Training that respects your body and builds durability with corrective exercise principles.",
  },
  {
    icon: Activity,
    title: "You want better mobility for everyday life",
    text: "Move easier, feel stronger, and stay active without feeling limited by tightness or discomfort.",
  },
  {
    icon: RefreshCw,
    title: "You need consistency, not quick fixes",
    text: "Realistic habits, nutrition support, and coaching built for the long run — not burnout.",
  },
] as const;

export const RESULTS_PROOF_CHIPS = [
  "12-week transformation",
  "5-star review",
  "Sustainable progress",
] as const;

export const COACHING_PATHS = [
  {
    icon: Dumbbell,
    title: "1-on-1 Coaching",
    description:
      "For personalized attention, form correction, and a plan built around your body.",
    bestFor: ["Beginners", "Injury history", "Specific goals"],
  },
  {
    icon: Users,
    title: "Small Group Training",
    description: "Train face-to-face with coaching, structure, and community support.",
    bestFor: ["Accountability", "Strength building", "Consistency"],
  },
  {
    icon: Activity,
    title: "Mobility + Corrective Focus",
    description:
      "Improve movement quality, reduce limitations, and build strength with better mechanics.",
    bestFor: ["Pain or stiffness", "Returning to training", "Long-term durability"],
  },
] as const;

export const COACHING_FOOTNOTE =
  "Large group options are also available — we'll recommend the right fit during your free consultation.";

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Free consultation",
    body: "We talk through your goals, training history, schedule, and what you want to change.",
  },
  {
    step: "02",
    title: "Movement + lifestyle assessment",
    body: "We identify what your body needs and what kind of coaching will actually fit your life.",
  },
  {
    step: "03",
    title: "Personalized plan",
    body: "You get a realistic training approach built around strength, mobility, nutrition, and consistency.",
  },
  {
    step: "04",
    title: "Weekly coaching",
    body: "You train with structure, feedback, and adjustments so progress feels clear and sustainable.",
  },
] as const;

export const PHILOSOPHY_CARDS = [
  { title: "A stronger life is a longer life", icon: Scale },
  { title: "Consistency over motivation", icon: CalendarCheck },
  { title: "Habits over quick fixes", icon: RefreshCw },
] as const;

export const EVAN_CREDIBILITY =
  "Previously coached at Sweat 60 · Santa Monica, Embassy Fitness, and Together Sports Academy.";

export const SECONDARY_TESTIMONIAL = {
  quote:
    "Evan is such a knowledgeable and supportive trainer. He really understands the individual and simultaneously brings community together.",
  name: "Charlotte Munn",
  date: "December 2025",
} as const;

export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What does the consultation include?",
    a: "We'll talk through your goals, training history, schedule, limitations, and what kind of coaching would make the most sense for you.",
  },
  {
    q: "Is the consultation free?",
    a: "Yes. It's a free first conversation to see what you need and whether Spry Fitness is the right fit.",
  },
  {
    q: "Do I need to be in shape before starting?",
    a: "No. Coaching is built around your current starting point, whether you're new to training, returning after time off, or working around limitations.",
  },
  {
    q: "Can I train if I have pain or an injury history?",
    a: "Yes, the coaching can account for limitations and focuses on better movement, strength, and long-term durability. For medical concerns, clients should follow guidance from their healthcare provider.",
  },
  {
    q: "Should I book a consultation if I am currently injured?",
    a: "Yes — the consultation is a good place to discuss limitations, training history, and whether coaching is appropriate right now. Always follow guidance from your healthcare provider for medical concerns.",
  },
  {
    q: "How many times a week should I strength train?",
    a: "It depends on your goals, schedule, and recovery. Most clients train 2–4 times per week. Evan will recommend a realistic frequency during your consultation.",
  },
  {
    q: "Am I too old to work out at Spry Fitness?",
    a: "No. Coaching is tailored to your starting point, movement quality, and goals — whether you're new to training or returning after time away.",
  },
  {
    q: "Do you offer nutrition support?",
    a: "Yes. Nutrition support is included to help create realistic habits that support your goals without extreme restrictions.",
  },
  {
    q: "Where is Spry Fitness located?",
    a: "2815 Pico Blvd, Santa Monica, CA 90405.",
  },
];

export const CERTIFICATIONS = ["NASM", "ACE", "AFAA", "ISSA"] as const;

export const CONSULTATION_GOALS = [
  { value: "strength", label: "Build strength" },
  { value: "mobility", label: "Improve mobility" },
  { value: "fat-loss", label: "Fat loss / body composition" },
  { value: "injury-return", label: "Return after injury or pain" },
  { value: "consistency", label: "Build consistency" },
  { value: "other", label: "Not sure yet" },
] as const;

export type IconCard = {
  icon: LucideIcon;
  title: string;
  text?: string;
};
