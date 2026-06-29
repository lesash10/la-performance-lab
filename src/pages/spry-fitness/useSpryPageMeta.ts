import { useEffect } from "react";

import { PAGE_META, SPRY_CONTACT } from "./spry-content";

const META_TAGS = [
  { attr: "name", key: "description", content: PAGE_META.description },
  { attr: "property", key: "og:title", content: PAGE_META.title },
  { attr: "property", key: "og:description", content: PAGE_META.description },
  { attr: "property", key: "og:type", content: "website" },
  { attr: "property", key: "og:url", content: SPRY_CONTACT.website },
  { attr: "name", key: "twitter:title", content: PAGE_META.title },
  { attr: "name", key: "twitter:description", content: PAGE_META.description },
] as const;

export function useSpryPageMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_META.title;

    const created: HTMLMetaElement[] = [];
    for (const tag of META_TAGS) {
      const el = document.createElement("meta");
      el.setAttribute(tag.attr, tag.key);
      el.content = tag.content;
      document.head.appendChild(el);
      created.push(el);
    }

    return () => {
      document.title = previousTitle;
      for (const el of created) el.remove();
    };
  }, []);
}
