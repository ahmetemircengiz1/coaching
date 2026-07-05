import { randomBytes } from "node:crypto";

export function generateInviteToken(): string {
  return randomBytes(24).toString("base64url");
}

export function buildInviteUrl(domain: string, token: string, baseUrl?: string): string {
  const base = baseUrl?.replace(/\/$/, "") || "";
  // Apex domain (ör. shred.com.tr) env'den gelir — marka adı sabitlenmez.
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "";
  const isProdDomain =
    !!appDomain && !appDomain.startsWith("localhost") && !appDomain.startsWith("127.0.0.1");

  // Prod: koç sitesi subdomain'de yayınlanır → https://{domain}.{apex}/join/{token}
  if (isProdDomain) {
    return `https://${domain}.${appDomain}/join/${token}`;
  }
  // Lokal/preview (wildcard subdomain yok) → path formu
  if (base) {
    return `${base}/site/${domain}/join/${token}`;
  }
  return `/site/${domain}/join/${token}`;
}
