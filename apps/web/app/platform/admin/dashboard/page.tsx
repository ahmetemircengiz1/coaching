"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminDashboardStats } from "../actions";

type DashboardData = Awaited<ReturnType<typeof getAdminDashboardStats>>;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4 animate-pulse">
          <div className="h-64 bg-white/5 rounded-xl" />
          <div className="h-64 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  const { stats, tierDistribution, recentCoaches } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-xs text-white/30">{new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-white/50 font-normal">Toplam Koç</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalCoaches}</p>
            <p className="text-xs text-white/30 mt-1">{stats.activeCoaches} aktif</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-white/50 font-normal">Toplam Öğrenci</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalStudents}</p>
            <p className="text-xs text-white/30 mt-1">{stats.activeStudents} aktif</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-white/50 font-normal">Aylık Gelir (Tahmini)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#ccff00]">{stats.monthlyRevenue.toLocaleString("tr-TR")}</p>
            <p className="text-xs text-white/30 mt-1">TRY</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-white/50 font-normal">Coach Paketleri</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalPackages}</p>
            <p className="text-xs text-white/30 mt-1">aktif satış paketi</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution + Recent Coaches */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Tier Distribution */}
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base">Paket Dağılımı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tierDistribution.map((tier) => {
              const percentage = stats.totalCoaches > 0
                ? Math.round((tier.count / stats.totalCoaches) * 100)
                : 0;
              return (
                <div key={tier.packageId}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium">{tier.packageName}</span>
                    <span className="text-sm text-white/50">{tier.count} koç</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: tier.tier === 1 ? "#60a5fa" : tier.tier === 2 ? "#a78bfa" : "#ccff00",
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-white/30 mt-1">{tier.price.toLocaleString("tr-TR")} {tier.currency}/ay</p>
                </div>
              );
            })}
            {tierDistribution.length === 0 && (
              <p className="text-sm text-white/30 text-center py-4">Henüz SaaS paketi yok</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Coaches */}
        <Card className="bg-white/5 border-white/10 text-white lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Son Kayıt Olan Koçlar</CardTitle>
            <Link href="/platform/admin/coaches" className="text-xs text-[#ccff00] hover:underline">Tümünü Gör</Link>
          </CardHeader>
          <CardContent>
            {recentCoaches.length === 0 ? (
              <div className="text-center py-8 text-white/30">
                <p className="text-3xl mb-2">👤</p>
                <p>Henüz kayıtlı koç yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCoaches.slice(0, 6).map((coach) => (
                  <Link
                    key={coach.id}
                    href={`/platform/admin/coaches/${coach.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
                        {coach.brandName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{coach.brandName}</p>
                        <p className="text-xs text-white/40 truncate">{coach.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        className={`text-[10px] ${
                          coach.subscriptionStatus === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {coach.subscriptionStatus === "active" ? "Aktif" : coach.subscriptionStatus}
                      </Badge>
                      <span className="text-xs text-white/30">{coach.studentCount} öğrenci</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
