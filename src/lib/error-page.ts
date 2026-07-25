export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Unbounded:wght@500;600&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg: #14110f;
        --fg: #f7f4f0;
        --muted: #a39e96;
        --flame: #d67119;
        --flame-hover: #b85d12;
        --border: #2e2924;
        --surface: #1c1916;
      }
      * { box-sizing: border-box; }
      body {
        font: 15px/1.55 "Manrope", system-ui, -apple-system, sans-serif;
        background: var(--bg);
        color: var(--fg);
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .wrap { position: relative; max-width: 28rem; width: 100%; text-align: center; padding: 2rem 1rem; }
      .grain::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.03;
        mix-blend-mode: overlay;
        transform: translateZ(0);
        background-image: radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px);
        background-size: 3px 3px;
        z-index: 0;
      }
      .card { position: relative; z-index: 1; }
      .eyebrow {
        font-family: "Unbounded", system-ui, sans-serif;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--flame);
        margin: 0 0 0.75rem;
      }
      h1 {
        font-family: "Unbounded", system-ui, sans-serif;
        font-size: 1.35rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        margin: 0 0 0.35rem;
      }
      h1 span { color: var(--flame); }
      p { color: var(--muted); margin: 0 0 1.75rem; max-width: 22rem; margin-left: auto; margin-right: auto; }
      .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
      a, button {
        font: inherit;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
        padding: 0.625rem 1.35rem;
        border-radius: 0.5rem;
      }
      .primary { background: var(--flame); color: #14110f; }
      .primary:hover { background: var(--flame-hover); }
      .secondary { background: color-mix(in srgb, var(--surface) 85%, transparent); color: var(--fg); border-color: var(--border); }
      .secondary:hover { background: var(--surface); }
    </style>
  </head>
  <body class="grain">
    <div class="wrap card">
      <p class="eyebrow">Incinerate Fitness</p>
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button type="button" class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
