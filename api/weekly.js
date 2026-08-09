import {
  allowedOrigin,
  siteKey,
  siteName,
  timeZone,
} from "../lib/config.js";
import { databaseConfigured, getAggregateRows } from "../lib/db.js";
import { addDays, isoFromDate } from "../lib/dates.js";
import { json, methodNotAllowed } from "../lib/http.js";
import { buildWeeklySummary } from "../lib/summary.js";

export default async function handler(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
  if (!databaseConfigured()) return json(response, 503, { error: "storage_not_configured" });

  try {
    const today = isoFromDate(new Date(), timeZone());
    const start = addDays(today, -13);
    const rows = await getAggregateRows({ site: siteKey(), start, end: today });
    const summary = buildWeeklySummary(rows, { endDate: today, today });
    return json(response, 200, {
      ...summary,
      site: { key: siteKey(), name: siteName(), origin: allowedOrigin() },
    });
  } catch (error) {
    console.error("trackinghaus_weekly_failed", error);
    return json(response, 500, { error: "weekly_reading_failed" });
  }
}
