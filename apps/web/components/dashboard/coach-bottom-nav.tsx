"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  Apple,
  Sparkles,
  MessageCircle,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
};

const navItems: NavItem[] = [
  { href: "", label: "Ana Sayfa", icon: LayoutDashboard },
  { href: "/students", label: "Öğrenciler", icon: Users },
  { href: "/exercises", label: "Egzersizler", icon: Dumbbell },
  { href: "/programs", label: "Programlar", icon: ClipboardList },
  { href: "/nutrition", label: "Beslenme", icon: Apple },
  { href: "/transformations", label: "Dönüşüm", icon: Sparkles },
  { href: "/messages", label: "Mesajlar", icon: MessageCircle, badge: true },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

export function CoachBottomNav({
  domain,
  unreadCount: initialUnread = 0,
}: {
  domain: string;
  unreadCount?: number;
}) {
  const [unreadCount, setUnreadCount] = useState(initialUnread);
  const pathname = usePathname();
  const basePath = `/site/${domain}/dashboard`;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("coach-bottom-unread")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: "senderRole=eq.student",
        },
        () => {
          if (!pathname.includes("/messages")) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname.includes("/messages")) {
      setUnreadCount(0);
    }
  }, [pathname]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w=[calc(100%-2rem)] w-full max-w-lg z-50 px-4">
      <nav
        className="backdrop-blur-xl px-2 py-2 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border transition-all duration-300"
        style={{
          backgroundColor: "color-mix(in srgb, var(--dashboard-sidebar-bg) 85%, transparent)",
          borderColor: "var(--dashboard-sidebar-border)",
        }}
      >
        <div className="flex overflow-x-auto no-scrollbar justify-between items-center w-full gap-1">
          {navItems.map((item) => {
            const fullHref = `${basePath}${item.href}`;
            const isActive =
              item.href === ""
                ? pathname === basePath || pathname === `${basePath}/`
                : pathname.startsWith(fullHref);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={fullHref}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 py-1.5 rounded-xl text-[10px] transition-all duration-300 relative min-w-[50px] flex-1 hover:bg-white/5",
                  !isActive && "active:scale-95",
                  isActive && "bg-white/5 shadow-inner"
                )}
                style={{
                  color: isActive
                    ? "var(--dashboard-accent)"
                    : "var(--dashboard-sidebar-text-muted)",
                }}
              >
                <Icon className={cn("h-5 w-5 transition-transform duration-300 drop-shadow-md", isActive && "scale-[1.15]")} />
                <span className="leading-tight font-medium opacity-90">{item.label}</span>
                {isActive && (
                  <div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full shadow-[0_0_10px_var(--dashboard-accent)]"
                    style={{ backgroundColor: "var(--dashboard-accent)" }}
                  />
                )}
                {item.badge && unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse-glow shadow-lg"
                    style={{
                      backgroundColor: "var(--dashboard-accent)",
                      color: "var(--dashboard-accent-text)",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
