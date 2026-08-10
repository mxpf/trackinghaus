# Trackinghaus alpha

Trackinghaus alpha is deliberately small, self-hosted analytics for independent writing. It collects aggregate reading counters and turns them into one useful weekly observation—without visitor profiles, cookies, or an analytics dashboard to manage.

[Thinkinghaus](https://thinking.haus) uses Trackinghaus in practice: [view its public weekly stats](https://trackinghaus-alpha.vercel.app).

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmxpf%2Ftrackinghaus&env=TRACKINGHAUS_SITE_KEY%2CTRACKINGHAUS_SITE_NAME%2CTRACKINGHAUS_ALLOWED_ORIGINS%2CTRACKINGHAUS_TIME_ZONE&envDescription=Tell%20Trackinghaus%20which%20blog%20it%20should%20count.&envLink=https%3A%2F%2Fgithub.com%2Fmxpf%2Ftrackinghaus%23configuration&project-name=trackinghaus&repository-name=trackinghaus)

## How self-hosting works

Use the public repository as the shared product. Create one Vercel deployment for each blog and keep that blog’s database, email account, domain, and recipient in its private environment settings. You do not need to maintain a separate codebase for your own site.

Each deployment provides:

- `/tracker.js` — the small script installed on the blog.
- `/api/collect` — an origin-restricted aggregate counter.
- `/` — the public weekly reading.
- `/api/weekly` — the aggregate weekly data.
- `/api/health` — configuration status without secret values.
- `/api/cron/weekly` — an optional Monday email through Resend.

## Deploy your own

### 1. Create the deployment

Use the Deploy with Vercel link above, or fork this repository and import the fork into Vercel. Enter a short site key, the blog’s public name, its allowed address, and its reporting timezone when prompted.

Examples:

```text
TRACKINGHAUS_SITE_KEY=small-internet
TRACKINGHAUS_SITE_NAME=A Small Internet
TRACKINGHAUS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
TRACKINGHAUS_TIME_ZONE=America/New_York
```

The first allowed origin becomes the blog link shown in the dashboard footer. Additional comma-separated origins can collect into the same counters.

### 2. Connect the database

In the Vercel Marketplace, add a Neon Postgres integration and connect it to the new project. Neon provides `DATABASE_URL`. Trackinghaus creates its aggregate table automatically on the first read, so there is no migration command to run.

Redeploy after adding or changing environment variables. Then open:

```text
https://YOUR-TRACKINGHAUS-DOMAIN/api/health
```

`database` and `site` should both be `true`. `email` may remain `false` if you do not want weekly email.

### 3. Install the tracker

Add this once to the shared layout of your blog, immediately before `</body>`:

```html
<script
  defer
  src="https://YOUR-TRACKINGHAUS-DOMAIN/tracker.js"
  data-site="small-internet"
></script>
```

The `data-site` value must exactly match `TRACKINGHAUS_SITE_KEY`. Open a page on the blog, then visit the Trackinghaus deployment. The first weekly reading appears as aggregate events arrive.

### 4. Add the weekly email (optional)

Install Resend from the Vercel Marketplace, verify a sending domain, and add:

```text
TRACKINGHAUS_TO_EMAIL=you@example.com
TRACKINGHAUS_FROM_EMAIL=Trackinghaus alpha <stats@example.com>
CRON_SECRET=a-long-random-value
```

Resend provides `RESEND_API_KEY`. When all four values are present, Vercel Cron sends the previous week’s reading every Monday. Without them, the public dashboard continues to work and the scheduled endpoint exits quietly.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon Postgres connection supplied by the integration. |
| `TRACKINGHAUS_SITE_KEY` | Yes | Short stable identifier also used by `data-site`. |
| `TRACKINGHAUS_SITE_NAME` | Yes | Public blog name shown in the footer. |
| `TRACKINGHAUS_ALLOWED_ORIGINS` | Yes | One or more comma-separated `https://` origins allowed to send reads. |
| `TRACKINGHAUS_TIME_ZONE` | Yes | IANA timezone used to assign reads to calendar days. Defaults to `UTC`. |
| `TRACKINGHAUS_DASHBOARD_URL` | No | Public dashboard URL. Normally inferred from Vercel. |
| `TRACKINGHAUS_REPOSITORY_URL` | No | GitHub link in the footer. Normally inferred from the Vercel Git repository. |
| `RESEND_API_KEY` | For email | Resend credential supplied by the integration. |
| `TRACKINGHAUS_TO_EMAIL` | For email | Recipient of the Monday reading. |
| `TRACKINGHAUS_FROM_EMAIL` | For email | Verified sender name and address. |
| `CRON_SECRET` | For email | Random value Vercel sends to authenticate scheduled requests. |

The earlier singular variable `TRACKINGHAUS_ALLOWED_ORIGIN` remains supported for existing deployments.

## Privacy contract

The tracker does not send or store an IP address, user agent, cookie, visitor ID, raw referrer URL, query string, or URL fragment.

- The browser stores one local yes/no flag to report whether a read is returning.
- Session storage suppresses repeat counts for the same page on the same day.
- Global Privacy Control and Do Not Track are honored.
- Referrers are reduced in the browser to `direct`, `search`, `social`, or `referral`.
- The server stores only day, page path/title, source category, read count, and returning-read count.
- The dashboard is intentionally public and contains aggregate counters only.

## Local development

```bash
npm install
npm run dev
npm test
```

The test command builds both deployment targets before running the suite, so it also verifies the packaged output from a clean checkout.

The local Vite view uses representative demo data. Copy `.env.example` to `.env.local` and use a Vercel-linked development environment only when testing the live functions. Never commit a populated environment file.

## Scope

Trackinghaus intentionally supports one blog per deployment. It does not include accounts, billing, visitor profiles, real-time activity, or a multi-site admin panel. A separate deployment keeps each writer’s data and service accounts under their own control.

## License

Trackinghaus is available under the [MIT License](./LICENSE).
