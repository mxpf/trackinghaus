# Trackinghaus alpha

Trackinghaus alpha is a deliberately small analytics product for independent writing. It collects aggregate reading counters and turns them into one useful weekly observation.

## Privacy contract

The tracker does not send or store an IP address, user agent, cookie, or visitor ID.

- The browser stores one local yes/no flag to report whether a read is returning.
- Session storage suppresses repeat counts for the same page on the same day.
- Global Privacy Control and Do Not Track are honored.
- Referrers are reduced in the browser to `direct`, `search`, `social`, or `referral`.
- The server stores only day, page path/title, source category, read count, and returning-read count.

## Production services

The Vercel project needs two Marketplace integrations:

1. Neon Postgres, providing `DATABASE_URL`.
2. Resend, providing `RESEND_API_KEY`.

Copy `.env.example` to `.env.local` for local work. Never commit the populated file.

The scheduled email endpoint is protected by `CRON_SECRET`. The weekly recipient is configured with `TRACKINGHAUS_TO_EMAIL`.

## Thinkinghaus installation

Add this once to the global layout, immediately before `</body>`:

```html
<script
  defer
  src="https://trackinghaus-alpha.vercel.app/tracker.js"
  data-site="thinkinghaus"
  data-endpoint="https://trackinghaus-alpha.vercel.app/api/collect"
></script>
```

## Weekly loop

- Collection happens through `/api/collect`.
- The public dashboard reads aggregate data from `/api/weekly` without visitor-level information or a password gate.
- Vercel Cron calls `/api/cron/weekly` every Monday at 12:00 UTC.
- Resend delivers the same weekly observation by email with a deterministic idempotency key.

## Commands

```bash
npm run dev
npm run test
npm run build:vercel
```

Vite uses realistic demo data locally unless `VITE_USE_LIVE_API=true` is set and the API is run through Vercel.
