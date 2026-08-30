import assert from "node:assert/strict";
import test from "node:test";
import { renderWeeklyEmail } from "../lib/email.js";
import { withEnvironment } from "./helpers.mjs";

test("weekly email escapes publication data and preserves the privacy statement", async () => {
  await withEnvironment(
    { TRACKINGHAUS_DASHBOARD_URL: "https://stats.example.com" },
    async () => {
      const summary = {
        range: { label: "August 3–9, 2026" },
        insight: {
          headline: "A quiet <week>",
          detail: "One & only one useful signal.",
        },
        writing: [{ title: '<script>alert("no")</script>', readers: 3 }],
      };

      const content = renderWeeklyEmail(summary);
      assert.doesNotMatch(content.html, /<script>/);
      assert.match(content.html, /&lt;script&gt;alert\(&quot;no&quot;\)&lt;\/script&gt;/);
      assert.match(content.html, /A quiet &lt;week&gt;/);
      assert.match(content.html, /One &amp; only one useful signal\./);
      assert.match(content.html, /href="https:\/\/stats\.example\.com"/);
      assert.match(
        content.text,
        /No individual visitors are identified\. Trackinghaus alpha stores only aggregate counters\./,
      );
    },
  );
});
