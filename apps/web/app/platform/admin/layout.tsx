"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/platform/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/platform/admin/coaches", label: "Koçlar", icon: "👥" },
  { href: "/platform/admin/subscriptions", label: "Abonelikler", icon: "💳" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/platform/admin/dashboard" className="font-heading text-lg font-bold tracking-wider">
          SHRED<span className="text-[#ccff00]">.</span>
          <span className="text-[10px] text-white/40 ml-2">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={cn("h-0.5 bg-white rounded transition-all", mobileOpen && "rotate-45 translate-y-1.5")} />
            <span className={cn("h-0.5 bg-white rounded transition-all", mobileOpen && "opacity-0")} />
            <span className={cn("h-0.5 bg-white rounded transition-all", mobileOpen && "-rotate-45 -translate-y-1.5")} />
          </div>
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-white/10 flex flex-col z-50 transition-transform duration-300",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/10 hidden lg:block">
          <Link href="/platform/admin/dashboard" className="font-heading text-xl font-bold tracking-wider">
            SHRED<span className="text-[#ccff00]">.</span>
            <span className="text-xs text-white/40 block mt-1">Admin Panel</span>
          </Link>
        </div>
        <div className="lg:hidden h-14" /> {/* Spacer for mobile header */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition",
                  isActive
                    ? "bg-[#ccff00]/10 text-[#ccff00]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ccff00]" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            href="/platform/auth"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition"
          >
            <span>🚪</span>
            <span>Çıkış</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
