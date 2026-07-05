"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "", label: "Ana Sayfa", icon: "🏠" },
  { href: "/training", label: "Antrenman", icon: "💪" },
  { href: "/nutrition", label: "Beslenme", icon: "🥗" },
  { href: "/checkin", label: "Check-in", icon: "📸" },
  { href: "/progress", label: "İlerleme", icon: "📈" },
  { href: "/settings", label: "Ayarlar", icon: "⚙️" },
];

export function BottomNav({
  domain,
}: {
  domain: string;
  /** @deprecated mesajlaşma kaldırıldı — geriye dönük uyum için kabul edilir, kullanılmaz */
  unreadMessages?: number;
  /** @deprecated mesajlaşma kaldırıldı — realtime kanal artık dinlenmiyor */
  studentId?: string;
}) {
  const pathname = usePathname();
  const basePath = `/site/${domain}/student`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
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
                <span className={cn(
                  "text-lg transition-transform duration-300 drop-shadow-md",
                  isActive && "scale-[1.15]"
                )}>
                  {item.icon}
                </span>
                <span className="leading-tight font-medium opacity-90">{item.label}</span>
                {isActive && (
                  <div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full shadow-[0_0_10px_var(--dashboard-accent)]"
                    style={{ backgroundColor: "var(--dashboard-accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
