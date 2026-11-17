import { buildWeeklySummary } from "../lib/summary.js";

const demoRows = [
  { day: "2026-07-29", path: "/", title: "Example blog", source: "direct", reads: 7 },
  { day: "2026-08-02", path: "/about", title: "About", source: "direct", reads: 1 },
  { day: "2026-08-03", path: "/", title: "Example blog", source: "direct", reads: 1 },
  { day: "2026-08-04", path: "/", title: "Example blog", source: "direct", reads: 1 },
  { day: "2026-08-05", path: "/notes-on-quiet-software", title: "Notes on Quiet Software", source: "direct", reads: 1 },
  { day: "2026-08-06", path: "/", title: "Example blog", source: "direct", reads: 2 },
  { day: "2026-08-06", path: "/a-small-internet", title: "A Small Internet", source: "direct", reads: 1 },
  { day: "2026-08-08", path: "/about", title: "About", source: "direct", reads: 1 },
];

export function buildDemoWeekly() {
  return {
    ...buildWeeklySummary(demoRows, { endDate: "2026-08-09" }),
    site: {
      key: "example-blog",
      name: "Example blog",
      origin: "https://example.com",
      repository: "https://github.com/mxpf/trackinghaus",
    },
  };
}
