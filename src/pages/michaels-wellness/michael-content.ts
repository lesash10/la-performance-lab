import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarCheck,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";

/**
 * UX friction addressed: the live homepage stacks competing offers (service tiles,
 * member specials, PDF downloads, newsletter, boot camp promos, and e-books) before
 * visitors understand who Michael's helps or what to do next. This prototype keeps
 * one path — book a wellness assessment — and demotes specials below trust content.
 */

export const MICHAEL_CONTACT = {
  phone: "661-803-6568",
  phoneHref: "tel:+16618036568",
  email: "mpbfitness@gmail.com",
  emailHref: "mailto:mpbfitness@gmail.com?subject=Wellness%20Assessment%20Request",
  address: "211 E Avenue K6, STE C, Lancaster, CA 93535",
  shortAddress: "Lancaster · Antelope Valley",
  mapsHref: "https://maps.google.com/?q=211+E+Avenue+K6+STE+C+Lancaster+CA+93535",
  website: "https://michaelswellnesscenter.com",
} as const;

export const BRAND_NAME = "Michael's Wellness Center";
export const BRAND_CLARITY = "One path · One assessment · A plan built for you";
export const PRIMARY_CTA = "Book Your Wellness Assessment";
export const NAV_CTA = "Book Consultation";
export const CTA_SUPPORT =
  "Every plan is customized to your goals, schedule, and starting point.";
export const CTA_AFTER_SUBMIT =
  "Michael or a team member will reach out within 24 hours to schedule your assessment — no automated booking.";
export const FORM_REASSURANCE =
  "No payment required to request your assessment. We'll discuss options when we connect.";

export const PAGE_META = {
  title: "Michael's Wellness Center | Personalized Wellness & Fitness in Lancaster",
  description:
    "Personalized wellness coaching, functional fitness, personal training, and weight loss support in Lancaster, CA. Book your wellness assessment to get a plan built for you.",
} as const;

export const NAV = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#consultation", label: "Contact" },
] as const;

export const HERO = {
  headline: "Personalized Wellness & Fitness Programs",
  subhead:
    "Helping people lose weight, move better, and build healthier lifestyles — with coaching tailored to your body and your goals.",
  support: CTA_SUPPORT,
} as const;

export const HERO_BENEFIT_BADGES = [
  "Personalized Plans",
  "Functional Wellness",
  "1-on-1 Coaching",
] as const;

export const HOW_IT_WORKS_SUPPORT =
  "A simple path from your first visit to a personalized wellness plan.";

export const SERVICES: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  benefit: string;
  detail: string;
}> = [
  {
    icon: HeartPulse,
    title: "Functional Wellness",
    benefit: "Move better with less pain",
    detail:
      "Functional assessment, corrective exercise, and wellness classes designed around how your body actually moves.",
  },
  {
    icon: Dumbbell,
    title: "Personal Training",
    benefit: "Expert 1-on-1 coaching",
    detail:
      "Hands-on training with certified coaches who adjust every session to your needs, limitations, and goals.",
  },
  {
    icon: Scale,
    title: "Weight Loss Programs",
    benefit: "Sustainable fat loss support",
    detail:
      "Structured training plus nutritional guidance — not crash diets. Build habits you can maintain long term.",
  },
  {
    icon: Users,
    title: "Membership Options",
    benefit: "Flexible ways to train",
    detail:
      "Wellness club memberships, group classes, and boot camp options — we'll help you choose what fits after your assessment.",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    icon: CalendarCheck,
    title: "Schedule your consultation",
    body: "Request a wellness assessment. We'll learn about your goals, health history, and how you want to feel.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Receive your personalized wellness plan",
    body: "Based on a functional assessment, we recommend the right mix of training, classes, and support for you.",
  },
  {
    step: "03",
    icon: Activity,
    title: "Start your transformation",
    body: "Begin coaching with a clear plan, attentive trainers, and accountability — not guesswork.",
  },
] as const;

export const ABOUT = {
  headline: "Experience you can trust. Guidance that fits you.",
  points: [
    {
      icon: Sparkles,
      title: "Personal guidance",
      text: "Coaches who listen, assess how you move, and scale workouts to your level — not a one-size-fits-all routine.",
    },
    {
      icon: ClipboardList,
      title: "Customized plans",
      text: "From weight loss and corrective exercise to post-rehab and special-needs training — programs built around your body.",
    },
    {
      icon: HeartPulse,
      title: "Sustainable results",
      text: "Our mission is helping members develop and maintain a lifestyle of total health and wellness for the long term.",
    },
  ],
  mission:
    "Michael's Wellness Center is passionate about your long-term success. We train clients according to specialized needs — with personalized commitment to every member.",
} as const;

export const TESTIMONIALS = [
  {
    quote:
      "I've had an excellent experience since joining boot camp. The trainers are extremely attentive, listen to any concerns, and scale workouts to meet my personal needs.",
    name: "Julie R.",
    context: "Boot camp member",
    rating: 5,
  },
  {
    quote:
      "After 4+ months of total body functional training, my foot is 100% pain free. I feel great about my 36 pound weight loss — but most importantly, I can move without pain.",
    name: "Janet L.",
    context: "Functional training client",
    rating: 5,
  },
  {
    quote:
      "After five months of training, I'm now off pain meds, gained 12 pounds of muscle, and lost 18 pounds of fat. Feeling almost completely back to my normal, functional lifestyle.",
    name: "Marc A.",
    context: "Retired firefighter / paramedic",
    rating: 5,
  },
] as const;

export const TESTIMONIAL_PROOF =
  "14 five-star reviews on Yelp · 28 five-star reviews on Facebook";

export const REVIEW_BADGES = [
  { platform: "Yelp", rating: 5, count: 14 },
  { platform: "Facebook", rating: 5, count: 28 },
] as const;

/** Generic wellness photography — owner replaces with real business images. */
export const PLACEHOLDER_IMAGES = {
  hero: {
    src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1400&q=80",
    alt: "Coach guiding a client through functional movement training",
  },
  about: {
    src: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1000&q=80",
    alt: "Personal trainer supporting a client during a strength session",
  },
} as const;

/** Real offers from the live site — presented below the fold as secondary options. */
export const MEMBER_SPECIALS = [
  {
    title: "Functional Wellness Assessment & 1-Month Fitness Class",
    note: "New member special",
  },
  {
    title: "Functional Wellness Assessment & 1-Month Wellness Membership",
    note: "New member special",
  },
  {
    title: "Monthly Wellness Club Membership",
    note: "Ongoing access",
  },
  {
    title: "Personalized 1-on-1 Training Programs",
    note: "Private coaching",
  },
  {
    title: "Full-Body Hands-On Table Stretch / Myofascial Release",
    note: "Recovery support",
  },
] as const;

export const FEATURED_SPECIALS = [
  {
    title: "Functional Fitness Boot Camp",
    detail:
      "$129/month per person, or $99/month with a prepaid 3-month commitment. Designed for optimal fat loss, lean muscle gain, and functional movement.",
  },
  {
    title: "Sweethearts Shape-Up Special",
    detail:
      "Boot camp at $129/month, or $99/month with prepaid 3-month commitment. 2-for-1 first month or 3-month contract for new clients.",
  },
] as const;

export const HOURS = [
  { days: "Mon – Fri", hours: "7:00 AM – 7:00 PM" },
  { days: "Saturday", hours: "9:00 AM – 11:00 AM (or by appointment)" },
  { days: "Sunday", hours: "Closed" },
] as const;

export const CONSULTATION_GOALS = [
  "Lose weight",
  "Move with less pain",
  "Build strength & fitness",
  "Post-rehab / corrective exercise",
  "Not sure — need guidance",
] as const;
