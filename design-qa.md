# Trackinghaus design QA

**Source visual truth**

- `reference/trackinghaus-selected.png` — 1488 × 1044 px, original Trackinghaus composition and content hierarchy, 1× density.
- `/tmp/thinkinghaus-reference.png` — 1280 × 720 px, desktop reference, 1× density.
- `/tmp/portfolio-reference.png` — 862 × 939 px, supporting reference for the shared portfolio typography and palette, 1× density.

**Implementation evidence**

- `/tmp/trackinghaus-final-top.jpg` — 1280 × 720 px, 1280 × 720 CSS viewport, 1× density, home view at the top of the page.
- `/tmp/trackinghaus-mobile-after.jpg` — 390 × 1223 px full-page capture, 390 × 844 CSS viewport, 1× density, home view.

**Full-view comparison evidence**

The desktop implementation was opened together with both the original Trackinghaus composition and the 1280 × 720 Thinkinghaus reference. Trackinghaus preserves the selected mock's asymmetric information hierarchy while adopting the sibling site's warm dark ground, off-white ink, 24 px outer margin, Untitled Sans family, 16/24 typographic base, restrained two-column composition, and quiet footer treatment. The chart and evidence rows remain specific to Trackinghaus and preserve the product's analytical purpose.

**Focused-region comparison evidence**

A separate crop was not required: the relevant typography, spacing, chart treatment, rules, and footer were legible in the 1× full-view captures. Computed styles were also checked in the browser: body copy is 16 px at weight 300, identity and headings use weight 500, and the page uses the shared `#1c1c1a` / `#eeede9` palette.

**Findings**

- No actionable P0, P1, or P2 mismatches remain.
- Typography: real Untitled Sans Light, Regular, and Medium files load locally. The 16 px base, 24 px line height, zero tracking, and restrained weight hierarchy match the sibling sites.
- Spacing and layout: desktop retains the sparse two-column structure and 24 px frame. Mobile collapses cleanly to one column with no horizontal overflow.
- Colors and tokens: warm dark ground, off-white ink, muted gray links, and low-contrast rules match the shared site system.
- Image quality: no raster image assets are used in this interface. The chart remains a native data visualization and renders sharply.
- Copy and content: existing Trackinghaus copy and analytics data were preserved.
- Accessibility and interaction: the Writing control opens the all-writing view, browser back restores the weekly view, reduced-motion behavior remains covered by tests, and no browser console errors were found.
- Page ending: the mobile footer ends with a 24 px bottom margin and does not create horizontal or excess post-footer overflow.

**Comparison history**

- Earlier state: light background, near-black text, 18 px base typography, and a fallback font made Trackinghaus visibly diverge from the portfolio and Thinkinghaus.
- Fixes made: installed the same Untitled Sans Light/Regular/Medium webfonts, moved the interface to the shared dark palette, normalized the base to 16/24, aligned weights and 24 px spacing, softened rules and links, and updated the chart to inherit the shared ink token.
- Post-fix evidence: `/tmp/trackinghaus-final-top.jpg` and `/tmp/trackinghaus-mobile-after.jpg`; desktop and mobile comparisons show the shared visual language without compromising the analytics hierarchy.

**Primary interactions tested**

- Home → Writing → browser back to Home.
- Desktop 1280 × 720 and mobile 390 × 844 responsive states.
- Browser console errors checked: none.
- Automated tests: 19 passed.
- Production build: passed.

**Implementation checklist**

- [x] Shared palette and type family.
- [x] 16 px base typography and intentional weight hierarchy.
- [x] Desktop and mobile responsive verification.
- [x] Core navigation verification.
- [x] Console, automated test, and production build verification.

**Follow-up polish**

- No P3 refinements are required for this pass.

final result: passed
