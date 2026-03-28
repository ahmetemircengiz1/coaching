"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendBulkMessage } from "@/app/site/[domain]/dashboard/students/assign-actions";
import { toast } from "sonner";
import { EmptyState, EmptySearchState } from "./empty-state";

type StudentItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  packageName: string;
  compliance: number;
  lastCheckIn: string | null;
  unreadMessages: number;
  startDate: string;
  currentProgram: string | null;
  lastMessageDate: string | null;
};

type SortKey = "name" | "lastCheckIn" | "startDate" | "lastMessage";
type StatusFilter = "all" | "active" | "pending" | "inactive";

export function StudentsPageClient({
  domain,
  students,
  maxStudents,
}: {
  domain: string;
  students: StudentItem[];
  maxStudents: number;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMessage, setBulkMessage] = useState("");
  const [showBulkMessage, setShowBulkMessage] = useState(false);
  const [bulkSending, setBulkSending] = useState(false);

  const filtered = useMemo(() => {
    let result = students;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.phone && s.phone.includes(q))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "tr");
        case "lastCheckIn":
          return (b.lastCheckIn || "").localeCompare(a.lastCheckIn || "");
        case "startDate":
          return (b.startDate || "").localeCompare(a.startDate || "");
        case "lastMessage":
          return (b.lastMessageDate || "").localeCompare(a.lastMessageDate || "");
        default:
          return 0;
      }
    });

    return result;
  }, [students, search, statusFilter, sortBy]);

  const statusCounts = useMemo(() => {
    const counts = { all: students.length, active: 0, pending: 0, inactive: 0 };
    for (const s of students) {
      if (s.status === "active") counts.active++;
      else if (s.status === "pending") counts.pending++;
      else counts.inactive++;
    }
    return counts;
  }, [students]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const handleBulkMessage = async () => {
    if (!bulkMessage.trim() || selectedIds.size === 0) return;
    setBulkSending(true);
    try {
      const result = await sendBulkMessage(domain, Array.from(selectedIds), bulkMessage.trim());
      if (result.success) {
        toast.success(`${result.count} öğrenciye mesaj gönderildi`);
        setBulkMessage("");
        setShowBulkMessage(false);
        setSelectedIds(new Set());
      } else {
        toast.error(result.error || "Mesaj gönderilemedi");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setBulkSending(false);
    }
  };

  return (
    <div className="space-y-6" style={{ color: "var(--dashboard-main-text)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Öğrenciler</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {students.filter((s) => s.status === "active").length} aktif /{" "}
            {maxStudents === 999 ? "Sınırsız" : maxStudents} limit
          </p>
        </div>
      </div>

      {/* Arama + Filtre + Sıralama */}
      {students.length > 0 && (
        <div className="space-y-3">
          {/* Arama */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim, email veya telefon ile ara..."
              className="pl-10"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Durum Filtreleri */}
            <div className="flex gap-1">
              {([
                { key: "all" as StatusFilter, label: "Tümü" },
                { key: "active" as StatusFilter, label: "Aktif" },
                { key: "pending" as StatusFilter, label: "Bekliyor" },
                { key: "inactive" as StatusFilter, label: "Pasif" },
              ]).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  style={{
                    backgroundColor: statusFilter === f.key
                      ? "color-mix(in srgb, var(--dashboard-accent) 20%, transparent)"
                      : "var(--dashboard-card-bg)",
                    color: statusFilter === f.key
                      ? "var(--dashboard-accent)"
                      : "var(--dashboard-main-text-muted)",
                    border: `1px solid ${statusFilter === f.key ? "var(--dashboard-accent)" : "var(--dashboard-card-border)"}`,
                  }}
                >
                  {f.label}
                  <span className="ml-1 opacity-60">{statusCounts[f.key]}</span>
                </button>
              ))}
            </div>

            {/* Sıralama */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                border: "1px solid var(--dashboard-card-border)",
                color: "var(--dashboard-main-text-muted)",
              }}
            >
              <option value="name">Ada Göre</option>
              <option value="lastCheckIn">Son Check-in</option>
              <option value="startDate">Kayıt Tarihi</option>
              <option value="lastMessage">Son Mesaj</option>
            </select>
          </div>
        </div>
      )}

      {/* Toplu İşlem Çubuğu */}
      {selectedIds.size > 0 && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl animate-fade-in"
          style={{
            backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))",
            border: "1px solid var(--dashboard-accent)",
          }}
        >
          <span className="text-sm font-medium" style={{ color: "var(--dashboard-accent)" }}>
            {selectedIds.size} öğrenci seçili
          </span>
          <div className="flex-1" />
          {showBulkMessage ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="flex-1 text-sm"
                style={{
                  backgroundColor: "var(--dashboard-card-bg)",
                  borderColor: "var(--dashboard-card-border)",
                  color: "var(--dashboard-main-text)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleBulkMessage();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleBulkMessage}
                disabled={bulkSending || !bulkMessage.trim()}
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
              >
                {bulkSending ? "..." : "Gönder"}
              </Button>
              <button
                onClick={() => setShowBulkMessage(false)}
                className="text-xs px-2 py-1"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                İptal
              </button>
            </div>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBulkMessage(true)}
                className="text-xs"
                style={{ borderColor: "var(--dashboard-accent)", color: "var(--dashboard-accent)" }}
              >
                Toplu Mesaj
              </Button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs px-2 py-1"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                Seçimi Kaldır
              </button>
            </>
          )}
        </div>
      )}

      {students.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Henüz öğrenciniz yok"
          description="Öğrenciler landing page'inizden kayıt olduğunda burada görünecek"
        />
      ) : filtered.length === 0 ? (
        <EmptySearchState message="Aramanızla eşleşen öğrenci bulunamadı." />
      ) : (
        <>
        {/* Tümünü Seç */}
        {filtered.length > 1 && (
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              checked={selectedIds.size === filtered.length && filtered.length > 0}
              onChange={toggleAll}
              className="w-4 h-4 rounded accent-[var(--dashboard-accent)]"
              aria-label="Tümünü seç"
            />
            <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Tümünü Seç
            </span>
          </div>
        )}
        <div className="grid gap-4 stagger-children">
          {filtered.map((student) => (
            <div key={student.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.has(student.id)}
                onChange={() => toggleSelect(student.id)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded shrink-0 accent-[var(--dashboard-accent)]"
                aria-label={`${student.name} seç`}
              />
              <Link
                href={`/site/${domain}/dashboard/students/${student.id}`}
                className="flex-1 min-w-0"
              >
              <Card
                className="transition cursor-pointer hover:opacity-90 animate-fade-in-up dashboard-card-hover"
                style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                      style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))", color: "var(--dashboard-accent)" }}
                    >
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>{student.name}</p>
                      <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {/* Mevcut Program */}
                    {student.currentProgram && (
                      <div className="text-right hidden xl:block">
                        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Program</p>
                        <p className="text-sm truncate max-w-[120px]" style={{ color: "var(--dashboard-main-text)" }}>
                          {student.currentProgram}
                        </p>
                      </div>
                    )}
                    <div className="text-right hidden lg:block">
                      <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Son Check-in</p>
                      <p className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>
                        {student.lastCheckIn
                          ? new Date(student.lastCheckIn).toLocaleDateString("tr-TR")
                          : "-"}
                      </p>
                    </div>
                    {/* Son İletişim */}
                    <div className="text-right hidden md:block">
                      <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Son İletişim</p>
                      <p className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>
                        {student.lastMessageDate
                          ? new Date(student.lastMessageDate).toLocaleDateString("tr-TR")
                          : "-"}
                      </p>
                    </div>
                    {student.unreadMessages > 0 && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                      >
                        {student.unreadMessages}
                      </div>
                    )}
                    <Badge
                      variant={
                        student.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {student.status === "active"
                        ? "Aktif"
                        : student.status === "pending"
                        ? "Bekliyor"
                        : "Pasif"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              </Link>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
