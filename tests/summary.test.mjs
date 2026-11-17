import assert from "node:assert/strict";
import test from "node:test";
import { buildWeeklySummary } from "../lib/summary.js";

const endDate = "2026-08-09";
const previousDay = "2026-08-02";

function row(day, reads, { path = "/notes", source = "direct", returning = 0 } = {}) {
  return { day, path, source, reads, returning_reads: returning };
}

test("builds a seven-day reading and compares it with the previous week", () => {
  const rows = [
    {
      day: "2026-08-01",
      path: "/quiet-software",
      title: "Quiet Software",
      source: "search",
      reads: 3,
      returning_reads: 0,
    },
    {
      day: "2026-08-05",
      path: "/quiet-software",
      title: "Quiet Software",
      source: "search",
      reads: 9,
      returning_reads: 2,
    },
    {
      day: "2026-08-06",
      path: "/quiet-software",
      title: "Quiet Software",
      source: "direct",
      reads: 4,
      returning_reads: 1,
    },
    {
      day: "2026-07-01",
      path: "/quiet-software",
      title: "Quiet Software",
      source: "search",
      reads: 1000,
      returning_reads: 1000,
    },
  ];

  const summary = buildWeeklySummary(rows, {
    endDate: "2026-08-09",
    today: "2026-08-09",
  });

  assert.equal(summary.days.length, 7);
  assert.equal(summary.insight.total, 13);
  assert.equal(summary.insight.search, 9);
  assert.equal(summary.insight.returning, 3);
  assert.equal(summary.writing[0].change, 10);
  assert.equal(summary.insight.headline, "Search brought attention to one page.");
  assert.equal(summary.insight.detail, "Quiet Software received 13 reads, up from 3. 9 reads came through search.");
  assert.equal(summary.days.at(-1).today, true);
  assert.equal(summary.days[0].date, "8/3");
  assert.equal(summary.days.at(-1).date, "8/9");
  assert.equal(
    summary.evidenceNote,
    "Search accounted for 69% of this week’s reading. No individual visitors are identified. Trackinghaus alpha stores only aggregate counters.",
  );
});

test("returns a quiet first-run reading when there is no data", () => {
  const summary = buildWeeklySummary([], { endDate });
  assert.equal(summary.insight.total, 0);
  assert.equal(summary.writing.length, 0);
  assert.equal(summary.insight.headline, "The week is just getting started.");
  assert.equal(summary.insight.detail, "The first weekly reading appears after a few reads.");
  assert.equal(
    summary.evidenceNote,
    "No individual visitors are identified. Trackinghaus alpha stores only aggregate counters.",
  );
});

test("reports the seven-read example plainly and labels the existing direct bucket", () => {
  const summary = buildWeeklySummary([
    row(previousDay, 7, { path: "/" }),
    row(previousDay, 1, { path: "/about" }),
    row(endDate, 4, { path: "/" }),
    row(endDate, 1, { path: "/ai" }),
    row(endDate, 1, { path: "/work" }),
    row(endDate, 1, { path: "/about" }),
  ], { endDate });

  assert.equal(summary.insight.headline, "7 reads across 4 pages.");
  assert.equal(summary.insight.detail, "The previous seven days recorded 8 reads.");
  assert.deepEqual(summary.evidence[1], { label: "No external source recorded", value: 7, suffix: "reads" });
  assert.equal(summary.evidenceNote, "7 of 7 reads had no external source recorded. No individual visitors are identified. Trackinghaus alpha stores only aggregate counters.");
});

test("distinguishes an empty week after earlier reads from a first reading", () => {
  const empty = buildWeeklySummary([row(previousDay, 1)], { endDate });
  assert.equal(empty.insight.headline, "No reads recorded.");
  assert.equal(empty.insight.detail, "The previous seven days recorded 1 read.");

  const first = buildWeeklySummary([row(endDate, 1)], { endDate });
  assert.equal(first.insight.headline, "1 read across 1 page.");
  assert.equal(first.insight.detail, "The previous seven days recorded no reads.");
});

test("requires ten weekly reads and a gain of five to highlight a page", () => {
  const cases = [
    { current: 9, previous: 0, headline: "9 reads across 1 page." },
    { current: 10, previous: 9, headline: "10 reads across 1 page." },
    { current: 10, previous: 6, headline: "10 reads across 1 page." },
    { current: 10, previous: 5, headline: "One page picked up." },
  ];

  for (const { current, previous, headline } of cases) {
    const summary = buildWeeklySummary([row(previousDay, previous), row(endDate, current)], { endDate });
    assert.equal(summary.insight.headline, headline, `${previous} to ${current} reads`);
  }
});

test("search needs at least five reads and an unrounded share of at least 35 percent", () => {
  const cases = [
    { search: 4, direct: 6, headline: "One page picked up." },
    { search: 5, direct: 5, headline: "Search brought attention to one page." },
    { search: 8, direct: 15, headline: "One page picked up." },
    { search: 7, direct: 13, headline: "Search brought attention to one page." },
  ];

  for (const { search, direct, headline } of cases) {
    const summary = buildWeeklySummary([row(endDate, search, { source: "search" }), row(endDate, direct)], { endDate });
    assert.equal(summary.insight.headline, headline, `${search} of ${search + direct} search reads`);
  }
});

test("highlights returning reads only above half and only after checking for a page gain", () => {
  const cases = [
    { reads: 9, returning: 8, previous: 9, headline: "9 reads across 1 page." },
    { reads: 10, returning: 5, previous: 9, headline: "10 reads across 1 page." },
    { reads: 10, returning: 6, previous: 9, headline: "Returning reads made up most of the total.",
      detail: "6 of 10 reads were recorded as returning." },
    { reads: 10, returning: 6, previous: 5, headline: "One page picked up.",
      detail: "Notes received 10 reads, up from 5." },
  ];

  for (const { reads, returning, previous, headline, detail } of cases) {
    const summary = buildWeeklySummary([row(previousDay, previous), row(endDate, reads, { returning })], { endDate });
    assert.equal(summary.insight.headline, headline, `${returning} of ${reads} returning reads, up from ${previous} total`);
    if (detail) assert.equal(summary.insight.detail, detail);
  }
});
