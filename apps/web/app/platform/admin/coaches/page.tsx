"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminCoachesList } from "../actions";

type Coach = Awaited<ReturnType<typeof getAdminCoachesList>>[number];

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    getAdminCoachesList().then((data) => {
      setCoaches(data);
      setLoading(false);
    });
  }, []);

  const filtered = coaches.filter((c) => {
    const matchesSearch =
      c.brandName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subdomain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || c.subscriptionStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Koçlar</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const tierColors: Record<number, string> = {
    1: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    2: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    3: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Koçlar</h1>
        <p className="text-sm text-white/40">{coaches.length} toplam</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Koç ara (isim, email, subdomain)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 sm:max-w-xs"
        />
        <div className="flex gap-2">
          {["all", "active", "cancelled", "expired"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterStatus === status
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {status === "all" ? "Tümü" : status === "active" ? "Aktif" : status === "cancelled" ? "İptal" : "Süresi Dolmuş"}
            </button>
          ))}
        </div>
      </div>

      {/* Coach List */}
      {filtered.length === 0 ? (
        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="py-12 text-center text-white/30">
            <p className="text-3xl mb-2">🔍</p>
            <p>Koç bulunamadı</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((coach) => (
            <Link
              key={coach.id}
              href={`/platform/admin/coaches/${coach.id}`}
              className="block"
            >
              <Card className="bg-white/5 border-white/10 text-white hover:bg-white/[0.07] hover:border-white/20 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Avatar */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                        style={{ backgroundColor: `${coach.primaryColor}30`, color: coach.secondaryColor }}
                      >
                        {coach.brandName.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm truncate">{coach.brandName}</p>
                          <Badge className={`text-[10px] ${tierColors[coach.packageTier] || tierColors[1]}`}>
                            {coach.packageName}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-white/40 truncate">{coach.email}</p>
                          <span className="text-white/20">|</span>
                          <p className="text-xs text-[#ccff00]/60 font-mono">{coach.subdomain}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold">{coach.studentCount}</p>
                        <p className="text-[10px] text-white/30">Öğrenci</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{coach.packageCount}</p>
                        <p className="text-[10px] text-white/30">Paket</p>
                      </div>
                      <Badge
                        className={`text-[10px] ${
                          coach.subscriptionStatus === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : coach.subscriptionStatus === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {coach.subscriptionStatus === "active" ? "Aktif" : coach.subscriptionStatus === "cancelled" ? "İptal" : coach.subscriptionStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
