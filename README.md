# Trackinghaus alpha

Trackinghaus alpha counts reads without keeping readers.

It is a small, self-hosted analytics tool for one independent publication. A [small script](./public/tracker.js) notices that a page was read. Before anything leaves the browser, the referrer has become a broad source category and the URL has lost its query string and fragment. The server folds what remains directly into daily counters. It does not create a raw event log.

The result is a weekly reading rather than a dashboard to operate: one observation, the evidence beneath it, and a comparison with the previous week. The language is deterministic. Trackinghaus does not need an LLM to understand the numbers.

[Thinkinghaus](https://thinking.haus) is the reference installation. Its public reading lives at [trackinghaus-alpha.vercel.app](https://trackinghaus-alpha.vercel.app).

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmxpf%2Ftrackinghaus&env=TRACKINGHAUS_SITE_KEY%2CTRACKINGHAUS_SITE_NAME%2CTRACKINGHAUS_ALLOWED_ORIGINS%2CTRACKINGHAUS_TIME_ZONE&envDescription=Tell%20Trackinghaus%20which%20blog%20it%20should%20count.&envLink=https%3A%2F%2Fgithub.com%2Fmxpf%2Ftrackinghaus%23configuration&project-name=trackinghaus&repository-name=trackinghaus)

![Trackinghaus weekly reading view](docs/preview.png)

## What it knows

Each accepted read adds one to an [aggregate counter](./db/schema.sql). Trackinghaus keeps only:

- the publication key
- the calendar day
- the page path and title
- a source category: direct, search, social, or referral
- the read count
- the returning-read count

That is enough to see that search brought an older piece back into view, or that a page found a little momentum. It is not enough to reconstruct an individual reading history.

The tracker does not send a user agent, cookie, visitor ID, raw referrer, query string, or URL fragment. Trackinghaus does not store IP addresses or visitor profiles. It respects [Global Privacy Control](https://globalprivacycontrol.org/) and [Do Not Track](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/DNT).

The browser keeps two small facts to itself. Session storage prevents the same page from being counted twice in one day. Local storage remembers only whether this browser has visited before. Neither local key is sent to the server.

The public dashboard therefore contains only aggregate counters. No individual visitors are identified. Trackinghaus alpha stores only aggregate counters.

## How the week appears

The public view reads the current seven-day window and compares it with the seven days before it. The [summary code](./lib/summary.js) chooses the strongest useful signal. “Reading by piece” shows the same comparison page by page.

There are no accounts, real-time activity feeds, audience profiles, or controls waiting to be managed. Monday email is optional. Without email configuration, the public reading continues to work.

## One deployment, one publication

Trackinghaus is public code, but each installation belongs to the writer running it. One Vercel project tracks one publication and connects to that publication’s own database, domain, and optional email account. Another writer uses the same repository with different environment values; there is no site-specific fork.

Start with these values:

```text
TRACKINGHAUS_SITE_KEY=small-internet
TRACKINGHAUS_SITE_NAME=A Small Internet
TRACKINGHAUS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
TRACKINGHAUS_TIME_ZONE=America/New_York
```

The site key is a stable identifier. The site name appears in the footer. The first allowed origin becomes the footer link; any additional comma-separated origins contribute to the same aggregate reading. The timezone determines which calendar day receives a read.

### Connect the database

Add [Neon Postgres](https://vercel.com/marketplace/neon) from the Vercel Marketplace. The integration supplies `DATABASE_URL`. Trackinghaus creates its aggregate table on the first read, so there is no separate migration step.

After setting the environment values, redeploy and visit:

```text
https://YOUR-TRACKINGHAUS-DOMAIN/api/health
```

`database` and `site` should be `true`. `email` may remain `false`.

### Add the tracker

Place the script once in the publication’s shared layout, immediately before `</body>`:

```html
<script
  defer
  src="https://YOUR-TRACKINGHAUS-DOMAIN/tracker.js"
  data-site="small-internet"
></script>
```

`data-site` must match `TRACKINGHAUS_SITE_KEY`. Open a page on the publication, then open the Trackinghaus deployment. The first reading will appear as aggregate counts arrive.

### Send the Monday reading

This part is optional. Add [Resend](https://vercel.com/marketplace/resend) from the Vercel Marketplace, verify a sending domain, and set:

```text
TRACKINGHAUS_TO_EMAIL=you@example.com
TRACKINGHAUS_FROM_EMAIL=Trackinghaus alpha <stats@example.com>
CRON_SECRET=a-long-random-value
```

Resend supplies `RESEND_API_KEY`. When all four email values are present, [Vercel Cron](https://vercel.com/docs/cron-jobs) sends the previous week’s reading each Monday. The reporting week is also used as the idempotency key, so retrying the job does not intentionally send the same reading twice.

## Configuration

| Variable | Required | What it changes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon Postgres connection supplied by the integration. |
| `TRACKINGHAUS_SITE_KEY` | Yes | Stable publication key; must match the tracker’s `data-site`. |
| `TRACKINGHAUS_SITE_NAME` | Yes | Publication name shown in the footer. |
| `TRACKINGHAUS_ALLOWED_ORIGINS` | Yes | Comma-separated `https://` origins permitted to send reads. |
| `TRACKINGHAUS_TIME_ZONE` | Yes | IANA timezone used for calendar days; defaults to `UTC`. |
| `TRACKINGHAUS_DASHBOARD_URL` | No | Public reading URL; normally inferred by Vercel. |
| `TRACKINGHAUS_REPOSITORY_URL` | No | Source link shown in the footer; normally inferred from Vercel Git metadata. |
| `RESEND_API_KEY` | For email | Resend credential supplied by the integration. |
| `TRACKINGHAUS_TO_EMAIL` | For email | Recipient of the Monday reading. |
| `TRACKINGHAUS_FROM_EMAIL` | For email | Verified sender name and address. |
| `CRON_SECRET` | For email | Secret used to authenticate the scheduled request. |

`TRACKINGHAUS_ALLOWED_ORIGIN` remains supported for existing single-origin deployments.

## Inside the repository

```text
src/       the public weekly reading
api/       collection, weekly data, health, and the optional email job
lib/       summaries, dates, configuration, storage, and mail
db/        the aggregate Postgres schema
public/    the tracker loaded by the host publication
worker/    the static-hosting handoff
tests/     privacy, API, summary, email, date, visual, and hosting checks
```

## Local work

```bash
npm ci
npm run dev
npm test
```

The local view uses representative demo data. `npm test` builds the Vercel and Sites targets before running the [complete suite](./tests). Copy [`.env.example`](./.env.example) to `.env.local` only when testing live functions with a linked Vercel environment. Never commit a populated environment file.

## The useful limit

Trackinghaus supports one publication per deployment. It does not include accounts, billing, a multi-site control panel, or a private store of individual activity. That limit keeps each writer’s data and service accounts under their own control, and keeps Trackinghaus focused on aggregate weekly reading.

## License

Trackinghaus is available under the [MIT License](./LICENSE).
