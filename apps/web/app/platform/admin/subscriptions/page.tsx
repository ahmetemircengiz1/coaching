"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminSubscriptionStats } from "../actions";

type SubsData = Awaited<ReturnType<typeof getAdminSubscriptionStats>>;

export default function AdminSubscriptionsPage() {
  const [data, setData] = useState<SubsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminSubscriptionStats().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Abonelikler</h1>
        <div className="grid lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  const { packages, coaches } = data;
  const totalRevenue = packages.reduce((sum, p) => sum + p.activeCoaches * p.price, 0);

  const tierColors: Record<number, string> = {
    1: "#60a5fa",
    2: "#a78bfa",
    3: "#ccff00",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Abonelikler</h1>
        <div className="text-right">
          <p className="text-xs text-white/40">Aylık Toplam Gelir</p>
          <p className="text-xl font-bold text-[#ccff00]">{totalRevenue.toLocaleString("tr-TR")} TRY</p>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-white/5 border-white/10 text-white overflow-hidden">
            <div className="h-1" style={{ backgroundColor: tierColors[pkg.tier] || "#60a5fa" }} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{pkg.name}</CardTitle>
                <span className="text-lg font-bold" style={{ color: tierColors[pkg.tier] }}>
                  {pkg.price.toLocaleString("tr-TR")} {pkg.currency}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                  <p className="text-xl font-bold">{pkg.totalCoaches}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Toplam</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-500/5">
                  <p className="text-xl font-bold text-green-400">{pkg.activeCoaches}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Aktif</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-500/5">
                  <p className="text-xl font-bold text-red-400">{pkg.cancelledCoaches}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">İptal</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Paket Geliri</span>
                  <span className="font-medium">{(pkg.activeCoaches * pkg.price).toLocaleString("tr-TR")} {pkg.currency}/ay</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Subscriptions Table */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-base">Tüm Abonelikler ({coaches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {coaches.length === 0 ? (
            <div className="text-center py-8 text-white/30">
              <p className="text-3xl mb-2">💳</p>
              <p>Henüz abonelik yok</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/40 border-b border-white/10">
                    <th className="pb-3 font-medium">Koç</th>
                    <th className="pb-3 font-medium">Paket</th>
                    <th className="pb-3 font-medium">Fiyat</th>
                    <th className="pb-3 font-medium">Öğrenci</th>
                    <th className="pb-3 font-medium">Durum</th>
                    <th className="pb-3 font-medium">Kayıt</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3">
                        <Link
                          href={`/platform/admin/coaches/${coach.id}`}
                          className="hover:text-[#ccff00] transition"
                        >
                          <p className="font-medium">{coach.brandName}</p>
                          <p className="text-xs text-white/30">{coach.email}</p>
                        </Link>
                      </td>
                      <td className="py-3">
                        <Badge
                          className="text-[10px]"
                          style={{
                            backgroundColor: `${tierColors[coach.packageTier]}15`,
                            color: tierColors[coach.packageTier],
                            borderColor: `${tierColors[coach.packageTier]}30`,
                          }}
                        >
                          {coach.packageName}
                        </Badge>
                      </td>
                      <td className="py-3 text-white/60">
                        {coach.packagePrice.toLocaleString("tr-TR")} {coach.currency}
                      </td>
                      <td className="py-3 text-white/60">{coach.studentCount}</td>
                      <td className="py-3">
                        <Badge className={`text-[10px] ${
                          coach.subscriptionStatus === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : coach.subscriptionStatus === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}>
                          {coach.subscriptionStatus === "active" ? "Aktif" : coach.subscriptionStatus === "cancelled" ? "İptal" : coach.subscriptionStatus}
                        </Badge>
                      </td>
                      <td className="py-3 text-white/40 text-xs">
                        {new Date(coach.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
