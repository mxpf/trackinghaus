import assert from "node:assert/strict";
import test from "node:test";
import collect from "../api/collect.js";
import weeklyCron from "../api/cron/weekly.js";
import weekly from "../api/weekly.js";
import { responseMock, withEnvironment } from "./helpers.mjs";

test("collector rejects events from an unapproved origin before storage", async () => {
  const response = responseMock();
  await collect(
    {
      method: "POST",
      headers: { origin: "https://example.com" },
      body: {
        site: "my-blog",
        path: "/notes",
        title: "Notes",
        source: "direct",
        returning: false,
      },
    },
    response,
  );
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error, "origin_not_allowed");
});

test("collector treats malformed JSON as an invalid event", async () => {
  await withEnvironment(
    {
      TRACKINGHAUS_ALLOWED_ORIGINS: "https://example.test",
      TRACKINGHAUS_ALLOWED_ORIGIN: undefined,
    },
    async () => {
      const response = responseMock();
      await collect(
        {
          method: "POST",
          headers: { origin: "https://example.test" },
          body: "{not-json",
        },
        response,
      );
      assert.equal(response.statusCode, 400);
      assert.equal(response.body.error, "invalid_event");
    },
  );
});

test("weekly endpoint is public and reports missing storage directly", async () => {
  await withEnvironment(
    {
      DATABASE_URL: undefined,
      TRACKINGHAUS_ALLOWED_ORIGINS: "https://example.test",
      TRACKINGHAUS_ALLOWED_ORIGIN: undefined,
    },
    async () => {
      const response = responseMock();
      await weekly({ method: "GET", headers: {} }, response);
      assert.equal(response.statusCode, 503);
      assert.equal(response.body.error, "storage_not_configured");
    },
  );
});

test("weekly endpoint reports a missing host site configuration", async () => {
  await withEnvironment(
    {
      TRACKINGHAUS_ALLOWED_ORIGINS: undefined,
      TRACKINGHAUS_ALLOWED_ORIGIN: undefined,
    },
    async () => {
      const response = responseMock();
      await weekly({ method: "GET", headers: {} }, response);
      assert.equal(response.statusCode, 503);
      assert.equal(response.body.error, "site_not_configured");
    },
  );
});

test("collector accepts any explicitly configured host origin", async () => {
  await withEnvironment(
    {
      DATABASE_URL: undefined,
      TRACKINGHAUS_SITE_KEY: "example-blog",
      TRACKINGHAUS_ALLOWED_ORIGINS: "https://example.test, https://www.example.test",
      TRACKINGHAUS_ALLOWED_ORIGIN: undefined,
    },
    async () => {
      const response = responseMock();
      await collect(
        {
          method: "POST",
          headers: { origin: "https://www.example.test" },
          body: {
            site: "example-blog",
            path: "/notes",
            title: "Notes",
            source: "direct",
            returning: false,
          },
        },
        response,
      );
      assert.equal(response.statusCode, 503);
      assert.equal(response.body.error, "storage_not_configured");
    },
  );
});

test("weekly cron exits cleanly when email is not enabled", async () => {
  await withEnvironment(
    {
      RESEND_API_KEY: undefined,
      TRACKINGHAUS_TO_EMAIL: undefined,
      TRACKINGHAUS_FROM_EMAIL: undefined,
    },
    async () => {
      const response = responseMock();
      await weeklyCron({ method: "GET", headers: {} }, response);
      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, { ok: true, skipped: "email_not_configured" });
    },
  );
});
