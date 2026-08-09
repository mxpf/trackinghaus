import { Resend } from "resend";

let resendClient = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.TRACKINGHAUS_TO_EMAIL);
}

export function renderWeeklyEmail(summary) {
  const dashboardUrl = process.env.TRACKINGHAUS_DASHBOARD_URL || "https://trackinghaus.vercel.app";
  const writingRows = summary.writing
    .slice(0, 4)
    .map(
      (item) =>
        `<tr><td style="padding:8px 24px 8px 0">${escapeHtml(item.title)}</td><td style="padding:8px 0;text-align:right;white-space:nowrap">${item.readers} reads</td></tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f7f6f2;color:#1c1c1a;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:18px;line-height:1.45">
  <div style="max-width:620px;margin:0 auto;padding:48px 24px 64px">
    <p style="margin:0 0 56px">Trackinghaus</p>
    <p style="margin:0 0 12px">Last week</p>
    <p style="margin:0 0 56px">${escapeHtml(summary.range.label)}</p>
    <h1 style="margin:0 0 32px;font-size:20px;line-height:1.35;font-weight:400">${escapeHtml(summary.insight.headline)}</h1>
    <p style="margin:0 0 48px;font-size:20px;line-height:1.6">${escapeHtml(summary.insight.detail)}</p>
    ${writingRows ? `<table style="width:100%;border-collapse:collapse;margin:0 0 48px">${writingRows}</table>` : ""}
    <p style="margin:0 0 56px"><a href="${escapeHtml(dashboardUrl)}" style="color:#1c1c1a">See the evidence</a></p>
    <p style="margin:0;font-size:15px;line-height:1.5;color:#666">No profiles. No cookies. Aggregate counters only.</p>
  </div>
</body></html>`;

  const text = [
    "Trackinghaus",
    summary.range.label,
    "",
    summary.insight.headline,
    summary.insight.detail,
    "",
    `See the evidence: ${dashboardUrl}`,
    "",
    "No profiles. No cookies. Aggregate counters only.",
  ].join("\n");

  return { html, text };
}

export async function sendWeeklyEmail(summary) {
  if (!emailConfigured()) throw new Error("Weekly email is not configured");
  const resend = getResend();
  const content = renderWeeklyEmail(summary);
  const from =
    process.env.TRACKINGHAUS_FROM_EMAIL || "Trackinghaus <onboarding@resend.dev>";
  const idempotencyKey = `trackinghaus-${summary.range.end}`;
  const { data, error } = await resend.emails.send(
    {
      from,
      to: process.env.TRACKINGHAUS_TO_EMAIL,
      subject: `Trackinghaus — ${summary.insight.headline}`,
      html: content.html,
      text: content.text,
    },
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
  if (error) throw new Error(error.message || "Resend rejected the weekly email");
  return data;
}
