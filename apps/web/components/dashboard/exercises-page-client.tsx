"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ExerciseFormModal from "./exercise-form-modal";
import { deleteExercise } from "@/app/site/[domain]/dashboard/exercises/actions";
import { useRouter } from "next/navigation";

interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  isSystem: boolean;
  _count: { workoutExercises: number };
}

type TabFilter = "all" | "system" | "custom";


export default function ExercisesPageClient({
  domain,
  exercises,
  categories,
}: {
  domain: string;
  exercises: Exercise[];
  categories: string[];
}) {
  const router = useRouter();

  // Optimistic local state
  const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises);

  useEffect(() => {
    setLocalExercises(exercises);
  }, [exercises]);

  const [showModal, setShowModal] = useState(false);
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const systemCount = localExercises.filter((e) => e.isSystem).length;
  const customCount = localExercises.filter((e) => !e.isSystem).length;

  const filtered = useMemo(() => {
    return localExercises.filter((e) => {
      const matchSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        (e.description || "").toLowerCase().includes(search.toLowerCase());
      const matchCategory = !filterCategory || e.category === filterCategory;
      const matchTab =
        activeTab === "all" ||
        (activeTab === "system" && e.isSystem) ||
        (activeTab === "custom" && !e.isSystem);
      return matchSearch && matchCategory && matchTab;
    });
  }, [localExercises, search, filterCategory, activeTab]);

  // Kategoriye göre grupla
  const grouped = useMemo(() => {
    const g: Record<string, Exercise[]> = {};
    for (const ex of filtered) {
      if (!g[ex.category]) g[ex.category] = [];
      g[ex.category].push(ex);
    }
    return g;
  }, [filtered]);

  const handleDelete = async (ex: Exercise) => {
    if (ex.isSystem) {
      alert("Sistem egzersizleri silinemez");
      return;
    }
    const msg = ex._count.workoutExercises > 0
      ? `"${ex.name}" egzersizi ${ex._count.workoutExercises} antrenmanda kullanılıyor. Silmek istediğine emin misin?`
      : `"${ex.name}" egzersizini silmek istediğine emin misin?`;
    if (!confirm(msg))
      return;

    // Optimistic delete
    setLocalExercises(prev => prev.filter(e => e.id !== ex.id));

    try {
      const result = await deleteExercise(domain, ex.id);
      if (!result.success) {
        alert(result.error);
        setLocalExercises(exercises); // revert
      }
    } catch {
      alert("Bir hata oluştu");
      setLocalExercises(exercises); // revert
    }
  };

  const handleOptimisticSave = (data: any, isEdit: boolean) => {
    const optimisticEx: Exercise = {
      id: isEdit && editExercise ? editExercise.id : `temp-${Date.now()}`,
      name: data.name,
      category: data.category,
      description: data.description || null,
      videoUrl: data.videoUrl || null,
      imageUrl: data.imageUrl || null,
      isSystem: false,
      _count: { workoutExercises: isEdit && editExercise ? editExercise._count.workoutExercises : 0 }
    };

    if (isEdit) {
      setLocalExercises(prev => prev.map(e => e.id === optimisticEx.id ? optimisticEx : e));
    } else {
      setLocalExercises(prev => [...prev, optimisticEx]);
    }
  };

  const uniqueCategories = [...new Set(localExercises.map((e) => e.category))].sort();

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Egzersiz Kütüphanesi</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {localExercises.length} egzersiz ({systemCount} hazır, {customCount} özel)
          </p>
        </div>
        <Button
          onClick={() => {
            setEditExercise(null);
            setShowModal(true);
          }}
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
          className="font-semibold hover:opacity-90"
        >
          + Yeni Egzersiz
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
        {[
          { key: "all" as TabFilter, label: "Tümü", count: localExercises.length },
          { key: "system" as TabFilter, label: "Hazır Kütüphane", count: systemCount },
          { key: "custom" as TabFilter, label: "Kendi Egzersizlerim", count: customCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? "var(--dashboard-accent)" : "transparent",
              color: activeTab === tab.key ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text-muted)",
            }}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-60">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Egzersiz ara... (ör: bench press, squat)"
            className="pl-10"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory("")}
            className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{
              backgroundColor: !filterCategory ? "color-mix(in srgb, var(--dashboard-accent) 20%, transparent)" : "var(--dashboard-card-bg)",
              color: !filterCategory ? "var(--dashboard-accent)" : "var(--dashboard-main-text-muted)",
              border: `1px solid ${!filterCategory ? "var(--dashboard-accent)" : "var(--dashboard-card-border)"}`,
              opacity: !filterCategory ? 1 : 0.8,
            }}
          >
            Tümü
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilterCategory(filterCategory === cat ? "" : cat)
              }
              className="px-3 py-2 rounded-lg text-xs font-medium transition"
              style={{
                backgroundColor: filterCategory === cat ? "color-mix(in srgb, var(--dashboard-accent) 20%, transparent)" : "var(--dashboard-card-bg)",
                color: filterCategory === cat ? "var(--dashboard-accent)" : "var(--dashboard-main-text-muted)",
                border: `1px solid ${filterCategory === cat ? "var(--dashboard-accent)" : "var(--dashboard-card-border)"}`,
                opacity: filterCategory === cat ? 1 : 0.8,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="animate-fade-in" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-16 text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {localExercises.length === 0 ? (
              <>
                <p className="text-4xl mb-3">💪</p>
                <p className="text-lg font-medium mb-1">
                  Egzersiz Kütüphanesi
                </p>
                <p className="text-sm max-w-md mx-auto" style={{ opacity: 0.7 }}>
                  Hazır egzersizler yükleniyor... Henüz egzersiz bulunamazsa
                  &quot;Yeni Egzersiz&quot; ile ekleyebilirsin.
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm">Aramanızla eşleşen egzersiz bulunamadı.</p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b, "tr"))
          .map(([category, exs]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold" style={{ color: "var(--dashboard-main-text)", opacity: 0.7 }}>
                  {category}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: "var(--dashboard-main-text-muted)", backgroundColor: "var(--dashboard-card-bg)" }}>
                  {exs.length}
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 stagger-children">
                {exs.map((ex) => (
                  <div
                    key={ex.id}
                    className="group relative rounded-xl border p-4 transition-all animate-fade-in-up dashboard-card-hover"
                    style={{
                      backgroundColor: ex.isSystem ? "var(--dashboard-card-bg)" : "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))",
                      borderColor: ex.isSystem ? "var(--dashboard-card-border)" : "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-border))",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate" style={{ color: "var(--dashboard-main-text)" }}>
                            {ex.name}
                          </h3>
                          {ex.isSystem && (
                            <span className="shrink-0 text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">
                              Hazır
                            </span>
                          )}
                        </div>
                        {ex.description && (
                          <p className="text-xs mt-1 line-clamp-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                            {ex.description}
                          </p>
                        )}
                      </div>

                      {/* Actions - only for custom exercises */}
                      {!ex.isSystem && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={() => {
                              setEditExercise(ex);
                              setShowModal(true);
                            }}
                            className="text-xs px-2 py-1 rounded transition-colors"
                            style={{ color: "var(--dashboard-main-text-muted)" }}
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(ex)}
                            className="text-red-400/60 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-400/10"
                            aria-label={`${ex.name} egzersizini sil`}
                          >
                            Sil
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom meta */}
                    <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
                      {ex.videoUrl && (
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Video
                        </span>
                      )}
                      {ex._count.workoutExercises > 0 && (
                        <span>{ex._count.workoutExercises} antrenmanda</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}

      {/* Modal */}
      {showModal && (
        <ExerciseFormModal
          domain={domain}
          exercise={editExercise || undefined}
          existingCategories={categories}
          onClose={() => {
            setShowModal(false);
            setEditExercise(null);
          }}
          onOptimisticSave={handleOptimisticSave}
        />
      )}
    </div>
  );
}
