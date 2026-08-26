# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Trackinghaus alpha design contract

- The product name is **Trackinghaus alpha**.
- The selected mock in `reference/trackinghaus-selected.png` is the visual source of truth.
- Use the shared permanently dark “super normal” language from the portfolio and Thinkinghaus: warm near-black `#1c1c1a`, warm off-white `#eeede9`, generous empty space, quiet text links, and no cards, shadows, gradients, or decorative UI.
- Typography uses the real Untitled Sans web family. Default copy is Light at 16px/24px, ordinary labels and actions are Regular, and primary identity/headings use Medium.
- All resting copy uses the same warm off-white ink color, `#eeede9`; do not mute evidence labels, values, writing metadata, or loading copy with reduced opacity. Hover may use the shared quiet gray `#8f8f93`, while disabled-state opacity may still communicate interaction state.
- Desktop uses an asymmetric two-column composition with the product name at upper left, the weekly reading in the right column, and navigation/privacy language along the bottom edge.
- The product is an anti-dashboard for independent writers: one useful weekly observation, evidence on demand, and no visitor profiles or cookies.

## Public self-hosting contract

- The first reference deployment is configured for `thinking.haus`, but the public codebase is site-neutral. A blog’s key, name, allowed origins, timezone, dashboard URL, repository URL, database, and email settings belong in environment variables rather than source.
- One deployment tracks one blog. A writer’s personal instance uses the same public codebase; do not create or document a separate Thinkinghaus-only version.
- Collection is aggregate-only. Never store or transmit IP addresses, user agents, cookies, visitor IDs, raw referrer URLs, query strings, or URL fragments.
- Returning status is a browser-local boolean only. Session storage prevents duplicate counts for the same page/day; the server never receives the local key.
- Respect Global Privacy Control and Do Not Track.
- Store only daily counters by site, path/title, source category, and returning status in Neon Postgres.
- The dashboard is public so it can be shared alongside Thinkinghaus; only aggregate counters may appear there.
- The closing evidence paragraph ends with: “No individual visitors are identified. Trackinghaus alpha stores only aggregate counters.” Do not duplicate that statement in the footer or restore the earlier “No profiles. No cookies.” wording.
- There is no public Settings view or link. “What changed” is always visible beneath the weekly chart; do not collapse it behind a show/hide control.
- The weekly reading closes with a separate plain-language paragraph linking inline to the “Reading by piece” view. Do not call this destination “Writing”; Trackinghaus measures reading but does not contain or publish the work.
- Match the current portfolio and Thinkinghaus typography throughout at 16px/24px. Desktop uses the shared 24px top inset and aligned two-column start. Chart dates use compact numeric month/day labels such as `8/3`.
- The visible product name uses the shared letter-cascade entrance also used by Thinkinghaus and the portfolio: letters rise 5px and resolve left-to-right at 40ms intervals with the existing typography unchanged. It runs once when the header appears and becomes static immediately for reduced-motion users.
- Chart points use centered numeric dates only; do not restore weekday labels or a “Today” label. The evidence note describes the strongest source only, while the privacy promise appears once in the footer. Mobile evidence and footer spacing should remain compact.
- The separate bottom footer mirrors Thinkinghaus: the configured host blog links from the left column and the deployment’s GitHub repository sits in the right column. Footer links have no underlines; contextual inline links in body copy are underlined.
- Keep paragraph groups compact: one 24px line or at most two 24px lines of vertical space between related blocks.
- Weekly language is deterministic for the alpha. Analytics chooses the signal; no LLM is required to operate the product.
- Monday email delivery is optional, uses Resend, and has an idempotency key derived from the reporting week. A deployment without email configuration remains healthy and serves the public dashboard.

## Current visual-system mapping

- The weekly reading at `/` is the index view. The separate `/?view=pieces` Reading by piece document is the article-style view: it uses the 62% reading column and its footer is revealed only at the absolute end of the document. These are ordinary same-origin document links so native cross-document View Transitions can apply when supported.
- The Trackinghaus footer follows the same 38/62 column split as the main frame. Ordinary links use Thinkinghaus behavior: inherited foreground color, no underline, and 160ms opacity reduction on hover or focus; contextual body links, including article-body and inline evidence links, begin at the body-copy color (`#ada59b`) and brighten to the full foreground color.
- Homepage elements build in reading order with 20ms stagger increments: the brand starts at 0ms, then the weekly reading elements follow, with the footer last. The article-style footer-end reveal remains independent of this index entrance sequence.
- Homepage reporting language describes aggregate reads and source categories, never people, individual readers, or identifiable returnees.
