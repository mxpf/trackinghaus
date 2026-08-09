# Trackinghaus design QA

## Inputs

- Selected reference: `reference/trackinghaus-selected.png` (1487 × 1058)
- Final weekly view inspected live at 1280 × 720, including a full-page capture.
- Mobile weekly capture: `qa/implementation-mobile.jpg` (390 × 844)
- Side-by-side comparison: `qa/reference-vs-alpha.jpg`

The reference and implementation were reviewed together, followed by a live browser inspection of the final public view. A focused-region comparison was not needed because the screen contains large, high-contrast type and a single legible chart.

## Visual review

- The warm off-white background and near-black ink match the selected Thinkinghaus direction.
- Desktop column start, maximum content width, outer padding, and bottom anchoring align with the source.
- Header, insight copy, chart, evidence, and footer follow the source hierarchy and vertical rhythm.
- The chart preserves the seven-day shape, labels, point treatment, and underlined “Today” marker without introducing dashboard chrome.
- All interface text inherits Thinkinghaus’s 18px / 24px typography, and chart dates use compact month/day labels such as “8/3.”
- The content column begins at the same top edge as the Thinkinghaus wordmark. When the always-visible evidence makes the page taller than the viewport, the footer follows the content without overlap.
- Mobile collapses to one column, keeps all seven days visible, and has no horizontal page overflow.

## Functional review

- “What changed” is present by default without a hide/show control.
- The footer “Writing” control opens the writing list; there is no duplicate Writing link in the main area.
- The public dashboard has no password, sign-in, or Settings view.
- The Trackinghaus wordmark and “This week” controls return to the weekly reading.
- The chart has a screen-reader summary, focus states are visible, and browser logs contain no errors.
- The Vercel production build and all 9 automated tests pass.

## Open findings

- P0: none
- P1: none
- P2: none

final result: passed
