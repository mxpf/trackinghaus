import assert from "node:assert/strict";
import test from "node:test";
import collect from "../api/collect.js";
import weekly from "../api/weekly.js";

function responseMock() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
  };
}

test("collector rejects events from an unapproved origin before storage", async () => {
  const response = responseMock();
  await collect(
    {
      method: "POST",
      headers: { origin: "https://example.com" },
      body: {
        site: "thinkinghaus",
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

test("weekly endpoint is public and reports missing storage directly", async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  const response = responseMock();
  await weekly({ method: "GET", headers: {} }, response);
  assert.equal(response.statusCode, 503);
  assert.equal(response.body.error, "storage_not_configured");

  if (previousDatabaseUrl !== undefined) process.env.DATABASE_URL = previousDatabaseUrl;
});
