# Trackinghaus alpha status

## Built

- Privacy-safe browser tracker with duplicate suppression, returning/not-returning status, GPC/DNT support, and client-side source categorization.
- Aggregate-only collection function restricted to explicitly configured host origins.
- Lazy Neon schema creation and daily counter upserts.
- Deterministic seven-day insight generation with previous-week comparison.
- Public aggregate-only dashboard designed to be shared alongside its host blog.
- Monday Vercel Cron endpoint and idempotent Resend delivery.
- Live-data weekly, always-visible evidence, writing, and setup states.
- Site-neutral self-hosting configuration with support for multiple allowed origins.
- A reusable Vercel setup path with optional weekly email.

## Verification

- Automated privacy, API, summary, and hosting tests pass.
- Vite production build passes.
- Four Vercel functions build and run successfully.
- Design QA: `final result: passed`.

## Reference deployment

- Public URL: https://trackinghaus-alpha.vercel.app
- The reference instance is configured privately for Thinkinghaus.
- The same public code can be deployed independently for another blog without source changes.

## Deployment services

1. Neon Postgres is required; aggregate tables are created lazily by the application.
2. Resend is optional; when configured it sends the Monday summary.
3. Scheduled summaries are protected by `CRON_SECRET`.
4. The public dashboard requires no account or password.

## Publishing

The Trackinghaus alpha source is published from `github.com/mxpf/trackinghaus` under the MIT License. Each writer deploys that source and loads their own tracker once from their blog’s shared layout.

No secret values should be written to source files or this document.
