"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/site/[domain]/auth/logout-action";

export function LogoutButton({ domain }: { domain: string }) {
  return (
    <button
      onClick={() => logoutAction(domain)}
      className="p-2 rounded-md transition hover:opacity-80"
      style={{ color: "var(--dashboard-main-text-muted)" }}
      title="Çıkış"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
