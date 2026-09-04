import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("tracker sends aggregate context without visitor identifiers", async () => {
  const tracker = await readFile(new URL("../public/tracker.js", import.meta.url), "utf8");
  assert.match(tracker, /globalPrivacyControl/);
  assert.match(tracker, /doNotTrack/);
  assert.match(tracker, /returning/);
  assert.doesNotMatch(tracker, /document\.cookie/);
  assert.doesNotMatch(tracker, /userAgent/);
  assert.doesNotMatch(tracker, /fingerprint/i);
});

test("public footer links back to the configured blog and source repository", async () => {
  const footer = await readFile(new URL("../src/SiteFooter.jsx", import.meta.url), "utf8");
  const weeklyReading = await readFile(new URL("../src/WeeklyReading.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const summary = await readFile(new URL("../lib/summary.js", import.meta.url), "utf8");
  assert.match(footer, /href=\{site\.origin\}/);
  assert.match(footer, /\{site\.name\}/);
  assert.match(footer, /href=\{site\.repository\}/);
  assert.match(footer, />\s*Code\s*</);
  assert.doesNotMatch(footer, />\s*GitHub\s*</);
  assert.doesNotMatch(footer, /thinking\.haus/);
  assert.match(
    summary,
    /No individual visitors are identified\. Trackinghaus alpha stores only aggregate counters\./,
  );
  assert.match(styles, /\.site-footer \.text-link\s*{[^}]*text-decoration:\s*none;/s);
  assert.doesNotMatch(styles, /color:\s*rgba\(/);
  assert.doesNotMatch(styles, /\.loading-copy\s*{[^}]*opacity:/s);
  assert.doesNotMatch(weeklyReading, /className="privacy"/);
  assert.doesNotMatch(weeklyReading, /fillText\(item\.day/);
  assert.doesNotMatch(weeklyReading, /"Today"/);
});

test("brand uses an accessible reduced-motion letter cascade", async () => {
  const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const cascade = await readFile(new URL("../src/LetterCascade.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(app, /<LetterCascade text="Trackinghaus alpha"/);
  assert.match(cascade, /aria-label=\{text\}/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /--letter-cascade-index/);
});
