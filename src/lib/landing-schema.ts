import { MARKETING_FAQS } from "./marketing-faq";

/** Static JSON-LD for the marketing landing (LocalBusiness + FAQPage). */
export function buildLandingJsonLd(origin: string) {
  const imageUrl = `${origin}/og.jpg`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HealthClub",
        "@id": `${origin}/#incinerate`,
        name: "Incinerate Elite Personal Training",
        alternateName: "Incinerate Fitness",
        description:
          "Private elite personal training in San Diego with Roger Rojas. Book your first session or free consultation online.",
        url: origin,
        image: imageUrl,
        telephone: "+1-760-595-5012",
        email: "roger@incineratefitness.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5402 Ruffin Rd Suite 104",
          addressLocality: "San Diego",
          addressRegion: "CA",
          postalCode: "92123",
          addressCountry: "US",
        },
        founder: {
          "@type": "Person",
          name: "Roger Rojas",
          jobTitle: "Master Personal Trainer",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "05:00",
          closes: "21:00",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${origin}/#faq`,
        url: `${origin}/#faq`,
        mainEntity: MARKETING_FAQS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}
