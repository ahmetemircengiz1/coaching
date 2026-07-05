"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Apple,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/site/[domain]/auth/logout-action";
import { TourButton } from "./onboarding-tour";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tourId?: string;
};

const navItems: NavItem[] = [
  { href: "", label: "Ana Sayfa", icon: LayoutDashboard, tourId: "sidebar-home" },
  { href: "/students", label: "Öğrenciler", icon: Users, tourId: "sidebar-students" },
  { href: "/programs", label: "Programlar", icon: ClipboardList, tourId: "sidebar-programs" },
  { href: "/nutrition", label: "Beslenme", icon: Apple, tourId: "sidebar-nutrition" },
  { href: "/settings", label: "Ayarlar", icon: Settings, tourId: "sidebar-settings" },
];

export function SidebarNav({
  domain,
  coachName: _coachName,
  brandName,
  position = "left",
  collapsed = false,
  onToggle,
}: {
  domain: string;
  coachName: string;
  brandName: string;
  /** @deprecated mesajlaşma kaldırıldı — geriye dönük uyum için kabul edilir, kullanılmaz */
  unreadCount?: number;
  position?: "left" | "right";
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const basePath = `/site/${domain}/dashboard`;

  const CollapseIcon = position === "right"
    ? (collapsed ? ChevronLeft : ChevronRight)
    : (collapsed ? ChevronRight : ChevronLeft);

  return (
    <>
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
          className="flex h-10 w-10 items-center justify-center rounded-lg transition"
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
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "custom-scrollbar fixed z-50 flex h-full flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-56",
          "lg:translate-x-0",
          position === "right" ? "right-0" : "left-0",
          mobileOpen
            ? "translate-x-0 !w-56"
            : position === "right"
              ? "translate-x-full"
              : "-translate-x-full"
        )}
        style={{
          backgroundColor: "var(--dashboard-sidebar-bg)",
        }}
      >
        <div
          className={cn(
            "flex h-[80px] items-center pt-4",
            collapsed ? "justify-center px-2" : "justify-between px-6"
          )}
        >
          {collapsed ? (
            <span
              className="text-xl font-semibold"
              style={{ color: "var(--dashboard-sidebar-active-text)" }}
              title={brandName}
              data-tour="sidebar-brand"
            >
              {brandName.charAt(0)}
            </span>
          ) : (
            <div data-tour="sidebar-brand">
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
                Koç Paneli
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition lg:hidden"
            style={{ color: "var(--dashboard-sidebar-text-muted)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className={cn(
          "custom-scrollbar flex-1 space-y-1 overflow-y-auto stagger-children",
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
                data-tour={item.tourId}
                className={cn(
                  "flex items-center rounded-lg text-sm transition-all duration-200 animate-fade-in",
                  collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3",
                  isActive && "accent-glow"
                )}
                style={{
                  backgroundColor: isActive
                    ? "var(--dashboard-sidebar-active)"
                    : "transparent",
                  color: isActive
                    ? "var(--dashboard-sidebar-active-text)"
                    : "var(--dashboard-sidebar-text)",
                }}
                onMouseEnter={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.backgroundColor =
                      "var(--dashboard-sidebar-hover)";
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && isActive && (
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
          className={cn("space-y-1", collapsed ? "p-2" : "p-4")}
          style={{ borderTop: "1px solid var(--dashboard-sidebar-border)" }}
        >
          {!collapsed && (
            <div className="pb-1">
              <TourButton />
            </div>
          )}
          {!collapsed && (
            <Link
              href={`/site/${domain}`}
              data-tour="sidebar-site"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition"
              style={{ color: "var(--dashboard-sidebar-text)" }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  "var(--dashboard-sidebar-hover)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Globe className="h-4 w-4" />
              <span>Siteyi Aç</span>
            </Link>
          )}
          {collapsed && (
            <Link
              href={`/site/${domain}`}
              data-tour="sidebar-site"
              className="flex items-center justify-center rounded-lg px-2 py-3 text-sm transition"
              style={{ color: "var(--dashboard-sidebar-text)" }}
              title="Siteyi Aç"
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  "var(--dashboard-sidebar-hover)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Globe className="h-4 w-4" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => logoutAction(domain)}
            title={collapsed ? "Çıkış Yap" : undefined}
            className={cn(
              "flex w-full items-center rounded-lg text-left text-sm transition",
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
            )}
            style={{ color: "var(--dashboard-sidebar-text-muted)" }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor =
                "var(--dashboard-sidebar-hover)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = "transparent";
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
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  "var(--dashboard-sidebar-hover)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
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
