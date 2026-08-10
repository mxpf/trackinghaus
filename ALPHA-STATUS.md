# Trackinghaus alpha status

## Built

- Privacy-safe browser tracker with duplicate suppression, returning/not-returning status, GPC/DNT support, and client-side source categorization.
- Aggregate-only collection function restricted to `https://thinking.haus`.
- Lazy Neon schema creation and daily counter upserts.
- Deterministic seven-day insight generation with previous-week comparison.
- Public aggregate-only dashboard designed to be shared alongside Thinkinghaus.
- Monday Vercel Cron endpoint and idempotent Resend delivery.
- Live-data weekly, always-visible evidence, writing, and setup states.

## Verification

- Automated privacy, API, summary, and hosting tests pass.
- Vite production build passes.
- Six Vercel functions build and run successfully.
- Design QA: `final result: passed`.

## Isolated deployment

- Public URL: https://trackinghaus-alpha.vercel.app
- Project: `trackinghaus-alpha` (`prj_JV9E192y4WIJJjkE5sgG5tNOol8W`)
- Health: application, database, and email configured and running.

## Connected services

1. Neon Postgres is connected with aggregate tables created lazily by the application.
2. Resend is connected and `thinking.haus` is verified for sending.
3. Monday summaries are addressed to the configured recipient and protected by `CRON_SECRET`.
4. The public dashboard does not require `ADMIN_PASSWORD` or `SESSION_SECRET`.

## Publishing

The Trackinghaus alpha source is published from `github.com/mxpf/trackinghaus`. Thinkinghaus loads the tracker once from its shared layout.

No secret values should be written to source files or this document.
