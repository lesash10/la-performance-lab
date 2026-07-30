# Sentry setup — LA Performance Lab

Short checklist for error reporting + user feedback on this Vite/React app.

## 1. Create the account & project

1. Go to [sentry.io](https://sentry.io) → sign up (or log in).
2. Create an organization (or use an existing one).
3. Create a project:
   - Platform: **React**
   - Alert frequency: as you prefer (defaults are fine)
4. Name it something clear, e.g. `la-performance-lab`.
5. Copy the **DSN** from Project Settings → Client Keys (DSN).

## 2. Create a build auth token (source maps)

Needed later so production stack traces map to real source.

1. [Organization auth tokens](https://sentry.io/orgredirect/organizations/:orgslug/settings/auth-tokens/)
2. Create a token with at least: `project:releases`, `org:read`
3. Keep it secret — never commit it.

## 3. Env vars

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SENTRY_DSN` | local `.env`, Vercel | Browser SDK |
| `SENTRY_AUTH_TOKEN` | local / CI / Vercel build | Upload source maps |
| `SENTRY_ORG` | local / CI | Org slug |
| `SENTRY_PROJECT` | local / CI | Project slug |

Add `VITE_SENTRY_DSN` in Vercel → Project → Settings → Environment Variables (Production at minimum).

## 4. SDK (app code — after account exists)

```bash
npm i @sentry/react
npm i -D @sentry/vite-plugin
```

- Init Sentry **first** in the app entry (before rendering), using `import.meta.env.VITE_SENTRY_DSN`.
- Enable `browserTracingIntegration`, `replayIntegration`, and `feedbackIntegration` for errors + Session Replay + the feedback widget.
- In `vite.config.ts`, enable `build.sourcemap` (`true` or `"hidden"`) and add `sentryVitePlugin` **last** in `plugins`, with org/project/authToken from env.

Official reference: [Sentry React docs](https://docs.sentry.io/platforms/javascript/guides/react/)

## 5. Verify

1. Deploy or run locally with a real DSN.
2. Trigger a test error (`throw new Error("sentry-test")` once, then remove).
3. Submit a test note via the feedback widget.
4. Confirm both show up under **Issues** and **User Feedback** in Sentry.

## Do not

- Commit DSN auth tokens or `.env.sentry-build-plugin`
- Ship source maps publicly without deleting them after upload (`filesToDeleteAfterUpload` on the Vite plugin)
- Leave test `throw`s in production
