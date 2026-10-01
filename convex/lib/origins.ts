// Extra allowed browser origins beyond the site URL itself, from a
// comma-separated CORS_ORIGINS var (e.g. client-owned domains, or an old
// domain during a migration). Feeds both the Convex HTTP CORS config
// (convex/http.ts) and Better Auth trustedOrigins (convex/auth.ts).
export const getExtraOrigins = (): string[] =>
  (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

// The deployment's own URL, localhost for dev, plus any extra origins.
export const getAllowedOrigins = (): string[] => {
  const origins = [process.env.SITE_URL, ...getExtraOrigins(), "http://localhost:3000"].filter(
    (origin): origin is string => Boolean(origin),
  );
  return [...new Set(origins)];
};
