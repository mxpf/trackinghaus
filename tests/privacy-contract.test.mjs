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
