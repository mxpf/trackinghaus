export function siteKey() {
  return process.env.TRACKINGHAUS_SITE_KEY || "thinkinghaus";
}

export function siteName() {
  return process.env.TRACKINGHAUS_SITE_NAME || "Thinkinghaus";
}

export function allowedOrigin() {
  return (process.env.TRACKINGHAUS_ALLOWED_ORIGIN || "https://thinking.haus").replace(
    /\/$/,
    "",
  );
}

export function timeZone() {
  return process.env.TRACKINGHAUS_TIME_ZONE || "America/New_York";
}
