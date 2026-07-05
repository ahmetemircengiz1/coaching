// Server-side Sentry init — Node.js runtime için.
const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.init({
        dsn: DSN,
        tracesSampleRate: 0.1,
        environment: process.env.NODE_ENV,
      });
    })
    .catch(() => {
      // @sentry/nextjs henüz yüklü değil — sessizce atla.
    });
}

export {};
