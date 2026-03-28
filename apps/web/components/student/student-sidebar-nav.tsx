"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  Apple,
  Camera,
  TrendingUp,
  MessageCircle,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/app/site/[domain]/auth/logout-action";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
};

const navItems: NavItem[] = [
  { href: "", label: "Ana Sayfa", icon: Home },
  { href: "/training", label: "Antrenman", icon: Dumbbell },
  { href: "/nutrition", label: "Beslenme", icon: Apple },
  { href: "/checkin", label: "Check-in", icon: Camera },
  { href: "/progress", label: "İlerleme", icon: TrendingUp },
  { href: "/messages", label: "Mesajlar", icon: MessageCircle, badge: true },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

export function StudentSidebarNav({
  domain,
  brandName,
  studentName,
  unreadCount: initialUnread = 0,
  studentId,
  position = "left",
  collapsed = false,
  onToggle,
}: {
  domain: string;
  brandName: string;
  studentName: string;
  unreadCount?: number;
  studentId?: string;
  position?: "left" | "right";
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialUnread);
  const pathname = usePathname();
  const basePath = `/site/${domain}/student`;

  useEffect(() => {
    if (!studentId) return;
    const supabase = createClient();
    const channel = supabase
      .channel("student-sidebar-unread")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `studentId=eq.${studentId}`,
        },
        (payload) => {
          const msg = payload.new as Record<string, unknown>;
          if (msg.senderRole === "coach" && !pathname.includes("/messages")) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId, pathname]);

  useEffect(() => {
    if (pathname.includes("/messages")) {
      setUnreadCount(0);
    }
  }, [pathname]);

  const isRight = position === "right";

  const CollapseIcon = isRight
    ? (collapsed ? ChevronLeft : ChevronRight)
    : (collapsed ? ChevronRight : ChevronLeft);

  return (
    <>
      {/* Mobile header */}
      <div
        className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b px-4 lg:hidden"
        style={{
          backgroundColor: "var(--dashboard-mobile-bg)",
          borderColor: "var(--dashboard-sidebar-border)",
        }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ color: "var(--dashboard-sidebar-text)" }}
        >
          <Menu className="h-5 w-5" />
        </button>
        <span
          className="ml-3 text-lg font-semibold"
          style={{ color: "var(--dashboard-sidebar-active-text)" }}
        >
          {brandName}
        </span>
        <span
          className="ml-auto text-xs"
          style={{ color: "var(--dashboard-sidebar-text-muted)" }}
        >
          Öğrenci Paneli
        </span>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "custom-scrollbar fixed z-50 flex h-full flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-56",
          "lg:translate-x-0",
          isRight ? "right-0 lg:right-0" : "left-0",
          mobileOpen
            ? "translate-x-0 !w-56"
            : isRight
              ? "translate-x-full"
              : "-translate-x-full"
        )}
        style={{
          backgroundColor: "var(--dashboard-sidebar-bg)",
        }}
      >
        <div
          className={cn(
            "flex items-center justify-between p-6",
            collapsed && "justify-center px-2"
          )}
          style={{ borderBottom: "1px solid var(--dashboard-sidebar-border)" }}
        >
          {collapsed ? (
            <span
              className="text-xl font-semibold"
              style={{ color: "var(--dashboard-sidebar-active-text)" }}
              title={brandName}
            >
              {brandName.charAt(0)}
            </span>
          ) : (
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--dashboard-sidebar-active-text)" }}
              >
                {brandName}
              </h2>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--dashboard-sidebar-text-muted)" }}
              >
                Öğrenci Paneli
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg lg:hidden"
            style={{ color: "var(--dashboard-sidebar-text-muted)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className={cn(
          "custom-scrollbar flex-1 space-y-1 overflow-y-auto",
          collapsed ? "p-2" : "p-4"
        )}>
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
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-lg text-sm transition-all duration-200",
                  collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
                )}
                style={{
                  backgroundColor: isActive
                    ? "var(--dashboard-sidebar-active)"
                    : "transparent",
                  color: isActive
                    ? "var(--dashboard-sidebar-active-text)"
                    : "var(--dashboard-sidebar-text)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "var(--dashboard-sidebar-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {item.badge && unreadCount > 0 && (
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full text-[10px] font-bold",
                      collapsed ? "absolute -right-0.5 -top-0.5 h-4 w-4 text-[9px]" : "ml-auto h-5 w-5"
                    )}
                    style={{
                      backgroundColor: "var(--dashboard-accent)",
                      color: "var(--dashboard-accent-text)",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {!collapsed && isActive && !item.badge && (
                  <div
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--dashboard-accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(collapsed ? "p-2" : "p-4")}
          style={{ borderTop: "1px solid var(--dashboard-sidebar-border)" }}
        >
          <button
            type="button"
            onClick={() => logoutAction(domain)}
            title={collapsed ? "Çıkış Yap" : undefined}
            className={cn(
              "flex w-full items-center rounded-lg text-left text-sm transition",
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
            )}
            style={{ color: "var(--dashboard-sidebar-text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--dashboard-sidebar-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Çıkış Yap</span>}
          </button>

          {/* Collapse toggle - desktop only */}
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              title={collapsed ? "Genişlet" : "Daralt"}
              className={cn(
                "hidden lg:flex w-full items-center rounded-lg text-sm transition",
                collapsed ? "justify-center px-2 py-2" : "gap-3 px-4 py-2"
              )}
              style={{ color: "var(--dashboard-sidebar-text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--dashboard-sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <CollapseIcon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Daralt</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
