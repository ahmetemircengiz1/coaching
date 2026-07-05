"use client";

import { useState, useEffect, useCallback } from "react";
import { StudentSidebarNav } from "./student-sidebar-nav";

const STORAGE_KEY = "sidebar-collapsed";

export function StudentSidebarLayoutWrapper({
  domain,
  brandName,
  studentName,
  position,
  children,
}: {
  domain: string;
  brandName: string;
  studentName: string;
  position: "left" | "right";
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {}
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const isCollapsed = mounted ? collapsed : false;

  const marginClass =
    position === "right"
      ? isCollapsed ? "lg:mr-16" : "lg:mr-56"
      : isCollapsed ? "lg:ml-16" : "lg:ml-56";

  const paddingClass =
    position === "right"
      ? "pr-0 lg:pr-0 pl-2 lg:pl-4"
      : "pl-0 lg:pl-0 pr-2 lg:pr-4";

  return (
    <>
      <StudentSidebarNav
        domain={domain}
        brandName={brandName}
        studentName={studentName}
        position={position}
        collapsed={isCollapsed}
        onToggle={toggle}
      />
      <div
        className={`flex-1 ${marginClass} ${paddingClass} p-2 lg:p-4 transition-all duration-300`}
      >
        {children}
      </div>
    </>
  );
}
