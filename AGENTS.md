# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Trackinghaus design contract

- The product name is **Trackinghaus**.
- The selected mock in `reference/trackinghaus-selected.png` is the visual source of truth.
- Use the Thinkinghaus “super normal” language: warm off-white `#f7f6f2`, near-black `#1c1c1a`, generous empty space, quiet underlined links, and no cards, shadows, gradients, or decorative UI.
- Typography is Untitled Sans first, with `Helvetica Neue`, Helvetica, and Arial as fallbacks. Default copy is 18px/24px at regular weight.
- Desktop uses an asymmetric two-column composition with the product name at upper left, the weekly reading in the right column, and navigation/privacy language along the bottom edge.
- The product is an anti-dashboard for independent writers: one useful weekly observation, evidence on demand, and no visitor profiles or cookies.

## Public alpha contract

- The first live site is `thinking.haus`; the default site key is `thinkinghaus` and the reporting timezone is `America/New_York`.
- Collection is aggregate-only. Never store or transmit IP addresses, user agents, cookies, visitor IDs, raw referrer URLs, query strings, or URL fragments.
- Returning status is a browser-local boolean only. Session storage prevents duplicate counts for the same page/day; the server never receives the local key.
- Respect Global Privacy Control and Do Not Track.
- Store only daily counters by site, path/title, source category, and returning status in Neon Postgres.
- The dashboard is public so it can be shared alongside Thinkinghaus; only aggregate counters may appear there.
- The footer privacy statement is: “No individual visitors are identified. Trackinghaus stores only aggregate counters.” Do not restore the earlier “No profiles. No cookies.” wording.
- There is no public Settings view or link. “What changed” is always visible beneath the weekly chart; do not collapse it behind a show/hide control.
- The main area has no Writing link; Writing appears only in the footer.
- Match Thinkinghaus typography throughout at 18px/24px. Desktop uses Thinkinghaus’s 24px top inset and aligned two-column start. Chart dates use compact numeric month/day labels such as `8/3`.
- Chart points use centered numeric dates only; do not restore weekday labels or a “Today” label. The evidence note describes the strongest source only, while the privacy promise appears once in the footer. Mobile evidence and footer spacing should remain compact.
- The separate bottom footer mirrors Thinkinghaus: Thinkinghaus links from the left column; Writing and the Trackinghaus GitHub repository sit in the right column, followed by the single privacy statement.
- Keep paragraph groups compact: one 24px line or at most two 24px lines of vertical space between related blocks.
- Weekly language is deterministic for the alpha. Analytics chooses the signal; no LLM is required to operate the product.
- Monday email delivery uses Resend and an idempotency key derived from the reporting week.
