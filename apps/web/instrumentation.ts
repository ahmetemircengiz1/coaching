// Next.js instrumentation entry — runtime'a göre Sentry config'ini yükler.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// React Server Components'ten fırlatılan hatalar için Sentry yakalama.
// @sentry/nextjs yüklüyse otomatik çalışır, yoksa no-op.
export const onRequestError = async (
  err: unknown,
  request: { path: string; method: string; headers: { [key: string]: string | string[] | undefined } },
  context: { routerKind: "Pages Router" | "App Router"; routePath: string; routeType: "render" | "route" | "action" | "middleware" },
) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs").catch(() => null);
    if (Sentry?.captureRequestError) {
      Sentry.captureRequestError(err, request, context);
    }
  } catch {
    // ignore
  }
};
