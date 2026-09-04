# Trackinghaus design QA

**Source visual truth**

- `reference/trackinghaus-selected.png` — 1488 × 1044 px, original Trackinghaus composition and content hierarchy, 1× density.
- `/tmp/thinkinghaus-reference.png` — 1280 × 720 px, desktop reference, 1× density.
- `/tmp/portfolio-reference.png` — 862 × 939 px, supporting reference for the shared portfolio typography and palette, 1× density.

**Implementation evidence**

- `/tmp/trackinghaus-final-top.jpg` — 1280 × 720 px, 1280 × 720 CSS viewport, 1× density, home view at the top of the page.
- `/tmp/trackinghaus-mobile-after.jpg` — 390 × 1223 px full-page capture, 390 × 844 CSS viewport, 1× density, home view.
- `/tmp/trackinghaus-reading-link-mobile.jpg` — 390 px wide full-page capture, 390 × 844 CSS viewport, mobile home view with the contextual “reading by piece” link and simplified footer.

**Full-view comparison evidence**

The desktop implementation was opened together with both the original Trackinghaus composition and the 1280 × 720 Thinkinghaus reference. Trackinghaus preserves the selected mock's asymmetric information hierarchy while adopting the sibling site's warm dark ground, off-white ink, 24 px outer margin, Untitled Sans family, 16/24 typographic base, restrained two-column composition, and quiet footer treatment. The chart and evidence rows remain specific to Trackinghaus and preserve the product's analytical purpose.

**Focused-region comparison evidence**

A separate crop was not required: the relevant typography, spacing, chart treatment, rules, and footer were legible in the 1× full-view captures. Computed styles were also checked in the browser: body copy, identity, and evidence are 16 px Untitled Sans Regular at weight 400; the weekly observation alone uses the licensed Italic face. The page uses the shared `#1c1c1a` / `#eeede9` palette.

**Findings**

- No actionable P0, P1, or P2 mismatches remain.
- Typography: the licensed Untitled Sans Regular and Italic files load locally. Italic is reserved for the weekly observation; the 16 px base, 24 px line height, zero tracking, and hierarchy through placement, spacing, and color preserve the quiet visual system.
- Spacing and layout: desktop retains the sparse two-column structure and 24 px frame. Mobile collapses cleanly to one column with no horizontal overflow.
- Colors and tokens: warm dark ground, off-white ink, muted gray links, and low-contrast rules match the shared site system.
- Image quality: no raster image assets are used in this interface. The chart remains a native data visualization and renders sharply.
- Copy and content: analytics data were preserved. The destination is now accurately named “Reading by piece,” and a closing sentence explains the view before linking to it inline.
- Accessibility and interaction: the contextual “reading by piece” control opens the renamed view at `?view=pieces`, legacy `?view=writing` links remain compatible, browser back restores the weekly view, reduced-motion behavior remains covered by tests, and no browser console errors were found.
- Page ending: the mobile footer ends with a 24 px bottom margin and does not create horizontal or excess post-footer overflow.

**Comparison history**

- Earlier state: light background, near-black text, 18 px base typography, and a fallback font made Trackinghaus visibly diverge from the portfolio and Thinkinghaus.
- Fixes made: moved the interface to the shared dark palette, normalized the base to 16/24, aligned spacing, softened rules and links, and updated the chart to inherit the shared ink token. A later licensing pass removed the Light and Medium assets, consolidated the interface on Untitled Sans Regular, and reserved the licensed Italic face for the weekly observation.
- Post-fix evidence: `/tmp/trackinghaus-final-top.jpg` and `/tmp/trackinghaus-mobile-after.jpg`; desktop and mobile comparisons show the shared visual language without compromising the analytics hierarchy.
- Navigation refinement: removed the ambiguous “Writing” footer control, renamed its destination “Reading by piece,” and added an explanatory inline link after the evidence note. `/tmp/trackinghaus-reading-link-mobile.jpg` confirms the revised hierarchy and clean footer.

**Primary interactions tested**

- Home → inline “reading by piece” link → “Reading by piece” view → browser back to Home.
- Desktop 1280 × 720 and mobile 390 × 844 responsive states.
- Browser console errors checked: none.
- Automated suite: passed.
- Production build: passed.

**Implementation checklist**

- [x] Shared palette and type family.
- [x] 16 px Untitled Sans Regular typography, with Italic reserved for the weekly observation and remaining hierarchy carried by placement, spacing, and color.
- [x] Desktop and mobile responsive verification.
- [x] Core navigation verification.
- [x] Console, automated test, and production build verification.

**Follow-up polish**

- No P3 refinements are required for this pass.

final result: passed
