// Client-side Sentry init — sadece NEXT_PUBLIC_SENTRY_DSN tanımlıysa çalışır.
// `npm install @sentry/nextjs` çalıştırılmadıysa import hatası vermesin diye
// dinamik import + try/catch ile koruyoruz.

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN && typeof window !== "undefined") {
  import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.init({
        dsn: DSN,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0.1,
        environment: process.env.NODE_ENV,
      });
    })
    .catch(() => {
      // @sentry/nextjs henüz yüklü değil — sessizce atla.
    });
}

export {};
