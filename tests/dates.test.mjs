import assert from "node:assert/strict";
import test from "node:test";
import { addDays, displayDay, formatRange, isoFromDate, isoRange } from "../lib/dates.js";

test("uses the deployment timezone for the reporting day", () => {
  const instant = new Date("2026-08-10T02:00:00.000Z");
  assert.equal(isoFromDate(instant, "America/New_York"), "2026-08-09");
  assert.equal(isoFromDate(instant, "UTC"), "2026-08-10");
});

test("moves through calendar ranges without local-time drift", () => {
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.deepEqual(isoRange("2026-01-02", 4), [
    "2025-12-30",
    "2025-12-31",
    "2026-01-01",
    "2026-01-02",
  ]);
});

test("formats compact chart dates and readable reporting ranges", () => {
  assert.deepEqual(displayDay("2026-08-09"), { day: "Sun", date: "8/9" });
  assert.equal(formatRange("2026-08-03", "2026-08-09"), "August 3–9, 2026");
  assert.equal(
    formatRange("2025-12-29", "2026-01-04"),
    "December 29, 2025–January 4, 2026",
  );
});
