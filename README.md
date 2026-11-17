# Trackinghaus alpha

Trackinghaus alpha gives independent writers a weekly look at how their work is read. You run it in your own Vercel project and keep the counts in your own database.

The weekly reading compares the seven days through today with the seven days before them. On a quiet week, it leads with a plain count, such as “7 reads across 4 pages,” and shows the previous week’s total underneath. When a clear change stands out, it gives one short observation with the counts behind it. The chart shows daily reads. **Reading by piece** shows the change for pages with reads in the current period.

See how it works on Thinkinghaus. [Weekly reading](https://trackinghaus-alpha.vercel.app/) · [Reading by piece](https://trackinghaus-alpha.vercel.app/?view=pieces)

## What it counts

The tracker counts eligible page loads as reads. It sends the page path and title, a broad source category (direct, search, social, or referral), and whether the browser has visited before. The browser skips repeat loads of the same page within the same session and UTC day when session storage is available. The tracker respects Global Privacy Control and Do Not Track. [Tracker code](./public/tracker.js)

In the weekly reading, **No external source recorded** includes clicks within the publication and page loads where the browser did not provide a source.

The server adds each accepted read to the day’s totals for that page and source. The tracker leaves visitor IDs, query strings, URL fragments, and the full referring URL out of the data it sends. Trackinghaus keeps no IP addresses, visitor profiles, or individual reading histories. [Database schema](./db/schema.sql)

No individual visitors are identified. Trackinghaus alpha stores only aggregate counters.

## Set up your publication

Each deployment tracks one publication. Its weekly reading is public so you can link to it from your blog. [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmxpf%2Ftrackinghaus&env=TRACKINGHAUS_SITE_KEY%2CTRACKINGHAUS_SITE_NAME%2CTRACKINGHAUS_ALLOWED_ORIGINS%2CTRACKINGHAUS_TIME_ZONE&envDescription=Tell%20Trackinghaus%20which%20blog%20it%20should%20count.&envLink=https%3A%2F%2Fgithub.com%2Fmxpf%2Ftrackinghaus%23configuration&project-name=trackinghaus&repository-name=trackinghaus)

Set your publication’s details in Vercel. Replace these examples with your own values.

```text
TRACKINGHAUS_SITE_KEY=small-internet
TRACKINGHAUS_SITE_NAME=A Small Internet
TRACKINGHAUS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
TRACKINGHAUS_TIME_ZONE=America/New_York
```

The site key identifies your publication. The footer uses the site name and links to the first allowed origin. All listed origins feed the same counts. List only the live addresses that should contribute to those counts. The time zone sets the calendar day used for reporting.

### Connect the database

Connect a Neon Postgres database to your Vercel project and make sure its connection string is available as `DATABASE_URL`. Trackinghaus creates the table automatically the first time it uses the database. [Neon on Vercel](https://vercel.com/marketplace/neon)

Redeploy after setting the environment variables. Open this path on your deployment to check the configuration.

```text
https://YOUR-TRACKINGHAUS-DOMAIN/api/health
```

Look for `configured.database` and `configured.site` to be `true`. Then open the weekly reading to check that the app can read from the database. `configured.email` can be `false` if you skip email setup.

### Add the tracker

Add this script once in your publication’s shared layout, just before `</body>`.

```html
<script
  defer
  src="https://YOUR-TRACKINGHAUS-DOMAIN/tracker.js"
  data-site="small-internet"
></script>
```

Use your deployment’s address for `src` and the same site key you set in Vercel for `data-site`. Open a page on your publication, then check your Trackinghaus reading for the first count. A browser with Global Privacy Control or Do Not Track enabled will skip that test visit.

### Send the Monday reading

To get the weekly reading by email, connect Resend to your Vercel project and verify the domain you’ll send from. The integration adds `RESEND_API_KEY`. Set these three values in Vercel and redeploy. [Resend on Vercel](https://vercel.com/marketplace/resend)

```text
TRACKINGHAUS_TO_EMAIL=you@example.com
TRACKINGHAUS_FROM_EMAIL=Trackinghaus alpha <stats@example.com>
CRON_SECRET=replace-with-a-long-random-secret
```

Vercel schedules the job for Mondays at 12:00 UTC. The email covers the seven days ending yesterday in your publication’s time zone and follows the same rules for choosing what to highlight. Retries reuse the same send key for that reporting period. The public reading works without email. [Vercel Cron documentation](https://vercel.com/docs/schedules/cron-jobs)

## Configuration

| Variable | Default or requirement | What it does |
| --- | --- | --- |
| `DATABASE_URL` | Required | Neon Postgres connection string. |
| `TRACKINGHAUS_SITE_KEY` | `my-blog` | Publication key. It must match the tracker’s `data-site`. |
| `TRACKINGHAUS_SITE_NAME` | `My blog` | Publication name in the footer. |
| `TRACKINGHAUS_ALLOWED_ORIGINS` | Required | Comma-separated publication origins, such as `https://example.com`. |
| `TRACKINGHAUS_TIME_ZONE` | `UTC` | Time zone for reporting, such as `America/New_York`. |
| `TRACKINGHAUS_DASHBOARD_URL` | Inferred on Vercel | Overrides the link to the public reading in the weekly email. |
| `TRACKINGHAUS_REPOSITORY_URL` | Inferred from GitHub on Vercel | Overrides the Code link in the footer. Falls back to this repository when GitHub details are unavailable. |
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

Use Node.js 24 or later for local development. Start the app with demo data using these commands.

```bash
npm ci
npm run dev
```

Open the local URL printed in the terminal. The demo needs no database or email account.

Run `npm test` to check the code, build the app and its Sites package, and run the tests. The Sites package includes the frontend and a static worker. The database and email functions run on Vercel.

Use `.env.example` as a reference when testing the API with a linked Vercel environment. Keep real credentials out of Git. [Example environment file](./.env.example)

## License

Trackinghaus is available under the [MIT License](./LICENSE).
