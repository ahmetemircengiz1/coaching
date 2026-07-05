"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminCoachDetail, updateCoachSubscription } from "../../actions";

type CoachDetail = NonNullable<Awaited<ReturnType<typeof getAdminCoachDetail>>>;

export default function AdminCoachDetailPage() {
  const params = useParams();
  const coachId = params.coachId as string;
  const [coach, setCoach] = useState<CoachDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getAdminCoachDetail(coachId).then((data) => {
      setCoach(data);
      setLoading(false);
    });
  }, [coachId]);

  const handleStatusChange = async (status: string) => {
    if (!coach) return;
    setUpdating(true);
    await updateCoachSubscription(coachId, { subscriptionStatus: status });
    setCoach({ ...coach, subscriptionStatus: status });
    setUpdating(false);
  };

  if (loading || !coach) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-20 bg-white/5 rounded animate-pulse" />
        <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-4 animate-pulse">
          <div className="h-64 bg-white/5 rounded-xl" />
          <div className="h-64 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    expired: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/platform/admin/coaches" className="text-white/40 hover:text-white transition">Koçlar</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">{coach.brandName}</span>
      </div>

      {/* Header Card */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: `${coach.primaryColor}30`, color: coach.secondaryColor }}
              >
                {coach.brandName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold">{coach.brandName}</h1>
                <p className="text-sm text-white/40">{coach.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-[#ccff00]/60">{coach.subdomain}.shred.com.tr</span>
                  {coach.customDomain && (
                    <>
                      <span className="text-white/20">|</span>
                      <span className="text-xs font-mono text-white/40">{coach.customDomain}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[coach.subscriptionStatus] || statusColors.expired}>
                {coach.subscriptionStatus === "active" ? "Aktif" : coach.subscriptionStatus}
              </Badge>
              <Link
                href={`/site/${coach.subdomain}`}
                target="_blank"
                className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition"
              >
                Siteyi Gör
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Öğrenci", value: coach.counts.students },
          { label: "Program", value: coach.counts.programs },
          { label: "Egzersiz", value: coach.counts.exercises },
          { label: "Dönüşüm", value: coach.counts.transformations },
          { label: "Şablon", value: coach.templateId },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[11px] text-white/40 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Subscription Info */}
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base">Abonelik Bilgisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Paket</span>
              <span className="text-sm font-medium">{coach.package.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Fiyat</span>
              <span className="text-sm">{coach.package.price.toLocaleString("tr-TR")} {coach.package.currency}/ay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Öğrenci Limiti</span>
              <span className="text-sm">{coach.package.maxStudents === 999 ? "Sınırsız" : coach.package.maxStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Kayıt Tarihi</span>
              <span className="text-sm">{new Date(coach.createdAt).toLocaleDateString("tr-TR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Renkler</span>
              <div className="flex gap-1.5">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: coach.primaryColor }} title="Ana Renk" />
                <div className="w-5 h-5 rounded" style={{ backgroundColor: coach.secondaryColor }} title="Vurgu Renk" />
              </div>
            </div>
            <div className="border-t border-white/10 pt-3 flex gap-2 flex-wrap">
              {coach.subscriptionStatus !== "active" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("active")}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                >
                  Aktif Yap
                </Button>
              )}
              {coach.subscriptionStatus !== "cancelled" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={updating}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                >
                  İptal Et
                </Button>
              )}
              {coach.subscriptionStatus !== "expired" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("expired")}
                  disabled={updating}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                >
                  Süre Doldu
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coach Packages */}
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base">Satış Paketleri ({coach.coachPackages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {coach.coachPackages.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">Henüz paket oluşturulmamış</p>
            ) : (
              <div className="space-y-3">
                {coach.coachPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
                    <div>
                      <p className="text-sm font-medium">{pkg.name}</p>
                      <p className="text-xs text-white/40">{pkg.duration} hafta</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: coach.secondaryColor }}>
                        {pkg.price.toLocaleString("tr-TR")} {pkg.currency}
                      </p>
                      <Badge className={`text-[10px] ${pkg.isActive ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>
                        {pkg.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Students */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-base">Öğrenciler ({coach.students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {coach.students.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-6">Henüz öğrenci yok</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/40 border-b border-white/10">
                    <th className="pb-3 font-medium">Ad</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Paket</th>
                    <th className="pb-3 font-medium">Durum</th>
                    <th className="pb-3 font-medium">Başlangıç</th>
                  </tr>
                </thead>
                <tbody>
                  {coach.students.map((student) => (
                    <tr key={student.id} className="border-b border-white/5">
                      <td className="py-3 font-medium">{student.name}</td>
                      <td className="py-3 text-white/50">{student.email}</td>
                      <td className="py-3 text-white/50">{student.packageName}</td>
                      <td className="py-3">
                        <Badge className={`text-[10px] ${
                          student.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-white/5 text-white/30"
                        }`}>
                          {student.status === "active" ? "Aktif" : student.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-white/40">{new Date(student.startDate).toLocaleDateString("tr-TR")}</td>
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
