import { addDays, displayDay, formatRange, isoRange } from "./dates.js";

const SOURCE_ORDER = ["search", "direct", "social", "referral"];
const SOURCE_LABELS = {
  search: "Search",
  direct: "Direct links",
  social: "Social",
  referral: "Other sites",
};
const PRIVACY_NOTE =
  "No individual visitors are identified. Trackinghaus alpha stores only aggregate counters.";

function number(value) {
  return Number.parseInt(value, 10) || 0;
}

function titleFromPath(path) {
  if (!path || path === "/") return "Home";
  return path
    .split("/")
    .filter(Boolean)
    .at(-1)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function sourceLabel(source) {
  return SOURCE_LABELS[source] || source;
}

function percentage(value, total) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function readUnit(value) {
  return value === 1 ? "read" : "reads";
}

export function buildWeeklySummary(rows, { endDate, today = endDate } = {}) {
  if (!endDate) throw new Error("endDate is required");

  const currentDays = isoRange(endDate, 7);
  const currentStart = currentDays[0];
  const previousDays = isoRange(addDays(currentStart, -1), 7);
  const previousStart = previousDays[0];
  const currentSet = new Set(currentDays);
  const previousSet = new Set(previousDays);
  const normalized = rows.map((row) => ({
    day: String(row.day).slice(0, 10),
    path: row.path,
    title: row.title || titleFromPath(row.path),
    source: row.source,
    reads: number(row.reads),
    returning: number(row.returning_reads ?? row.returning),
  }));

  const dayTotals = new Map(currentDays.map((day) => [day, 0]));
  const currentPages = new Map();
  const previousPages = new Map();
  const sources = new Map(SOURCE_ORDER.map((source) => [source, 0]));
  let returning = 0;

  for (const row of normalized) {
    const isCurrent = currentSet.has(row.day);
    const isPrevious = previousSet.has(row.day);
    if (!isCurrent && !isPrevious) continue;

    const pageMap = isCurrent ? currentPages : previousPages;
    const existing = pageMap.get(row.path) || {
      path: row.path,
      title: row.title,
      readers: 0,
      search: 0,
    };
    existing.title = row.title || existing.title;
    existing.readers += row.reads;
    if (row.source === "search") existing.search += row.reads;
    pageMap.set(row.path, existing);

    if (isCurrent) {
      dayTotals.set(row.day, (dayTotals.get(row.day) || 0) + row.reads);
      if (sources.has(row.source)) {
        sources.set(row.source, sources.get(row.source) + row.reads);
      }
      returning += row.returning;
    }
  }

  const writing = [...currentPages.values()]
    .map((page) => {
      const previous = previousPages.get(page.path)?.readers || 0;
      return { ...page, change: page.readers - previous };
    })
    .sort((a, b) => b.readers - a.readers || b.change - a.change);

  const total = [...dayTotals.values()].reduce((sum, value) => sum + value, 0);
  const primary = [...writing].sort((a, b) => b.change - a.change || b.readers - a.readers)[0];
  const search = sources.get("search") || 0;
  const direct = sources.get("direct") || 0;

  let headline = "The week is just getting started.";
  let detail = "The first weekly reading appears after a few reads.";

  if (primary) {
    const searchShare = percentage(primary.search, primary.readers);
    if (primary.change > 0 && searchShare >= 35) {
      headline = "Search brought an essay back into view.";
    } else if (returning >= Math.ceil(total * 0.3)) {
      headline = "Returning reads led the week.";
    } else if (primary.change > 0) {
      headline = "One piece found a little momentum.";
    } else {
      headline = "The week stayed quiet.";
    }

    const secondSentence =
      primary.search > 0
        ? `${primary.search} ${readUnit(primary.search)} came through search.`
        : returning > 0
          ? `${returning} returning ${readUnit(returning)} came from an earlier visit.`
          : `${direct} ${readUnit(direct)} came from direct links.`;
    detail = `${primary.title} received ${primary.readers} ${readUnit(primary.readers)}. ${secondSentence}`;
  }

  const evidence = [
    { label: "Search", value: search, suffix: readUnit(search) },
    { label: "Direct links", value: direct, suffix: readUnit(direct) },
    {
      label: "Returning",
      value: returning,
      suffix: readUnit(returning),
    },
  ];

  const strongestSource = [...sources.entries()].sort((a, b) => b[1] - a[1])[0];
  const evidenceNote = total
    ? `${sourceLabel(strongestSource[0])} accounted for ${percentage(strongestSource[1], total)}% of this week’s reading. ${PRIVACY_NOTE}`
    : PRIVACY_NOTE;

  const days = currentDays.map((iso) => ({
    iso,
    ...displayDay(iso),
    value: dayTotals.get(iso) || 0,
    today: iso === today,
  }));

  return {
    range: {
      start: currentStart,
      end: endDate,
      label: formatRange(currentStart, endDate),
    },
    insight: {
      headline,
      detail,
      primaryTitle: primary?.title || null,
      total,
      search,
      returning,
    },
    days,
    evidence,
    evidenceNote,
    writing,
    queryRange: { start: previousStart, end: endDate },
  };
}
