import { MARKETING_FAQS } from "./marketing-faq";

/** Static JSON-LD for the marketing landing (Person + FAQPage). */
export function buildLandingJsonLd(origin: string) {
  const imageUrl = `${origin}/og.jpg`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${origin}/#alex-carter`,
        name: "Alex Carter",
        jobTitle: "Certified Personal Trainer",
        description:
          "Premium indoor and outdoor personal training in Los Angeles for expats and busy professionals. Structured coaching with measurable progression.",
        url: origin,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1920,
          height: 1080,
        },
        areaServed: {
          "@type": "City",
          name: "Los Angeles",
          containedInPlace: {
            "@type": "State",
            name: "California",
            addressCountry: "US",
          },
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
