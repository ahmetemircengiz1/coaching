import { randomBytes } from "node:crypto";

export function generateInviteToken(): string {
  return randomBytes(24).toString("base64url");
}

export function buildInviteUrl(domain: string, token: string, baseUrl?: string): string {
  const base = baseUrl?.replace(/\/$/, "") || "";
  if (base) {
    if (base.includes("coachsite.com")) {
      return `https://${domain}.coachsite.com/join/${token}`;
    }
    return `${base}/site/${domain}/join/${token}`;
  }
  return `/site/${domain}/join/${token}`;
}
