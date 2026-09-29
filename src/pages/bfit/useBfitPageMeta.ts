import { useEffect } from "react";

const TITLE = "bFIT | Brook Ryan";
const DESCRIPTION = "Home workout coaching with Brook Ryan.";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400&display=swap";

function replaceMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (existing) {
    const previous = existing.getAttribute("content") ?? "";
    existing.setAttribute("content", content);
    return () => existing.setAttribute("content", previous);
  }

  const created = document.createElement("meta");
  created.setAttribute(attr, key);
  created.setAttribute("content", content);
  document.head.appendChild(created);
  return () => created.remove();
}

export function useBfitPageMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = TITLE;

    const restores = [
      replaceMeta("name", "description", DESCRIPTION),
      replaceMeta("property", "og:title", TITLE),
      replaceMeta("property", "og:description", DESCRIPTION),
      replaceMeta("name", "twitter:title", TITLE),
      replaceMeta("name", "twitter:description", DESCRIPTION),
      replaceMeta("property", "og:url", `${window.location.origin}/brook-bfit`),
    ];

    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) {
      const previousHref = icon.getAttribute("href") ?? "";
      icon.setAttribute("href", "/bfit-favicon.svg");
      restores.push(() => icon.setAttribute("href", previousHref));
    }

    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = FONT_HREF;
    font.setAttribute("data-bfit-font", "");
    document.head.appendChild(font);

    return () => {
      document.title = previousTitle;
      for (const restore of restores) restore();
      font.remove();
    };
  }, []);
}
