"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createExercise, updateExercise } from "@/app/site/[domain]/dashboard/exercises/actions";

interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
}

const DEFAULT_CATEGORIES = [
  "Göğüs",
  "Sırt",
  "Omuz",
  "Biceps",
  "Triceps",
  "Bacak",
  "Karın",
  "Kalça",
  "Kardio",
  "Esneklik",
  "Fonksiyonel",
];

export default function ExerciseFormModal({
  domain,
  exercise,
  existingCategories,
  onClose,
  onOptimisticSave,
}: {
  domain: string;
  exercise?: Exercise;
  existingCategories: string[];
  onClose: () => void;
  onOptimisticSave?: (data: any, isEdit: boolean) => void;
}) {
  const isEdit = !!exercise;

  const [name, setName] = useState(exercise?.name || "");
  const [category, setCategory] = useState(exercise?.category || "");
  const [description, setDescription] = useState(exercise?.description || "");
  const [imageUrl, setImageUrl] = useState(exercise?.imageUrl || "");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const allCategories = [
    ...new Set([...DEFAULT_CATEGORIES, ...existingCategories]),
  ].sort();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, category: true });
    if (!name.trim() || !category.trim()) {
      setError("İsim ve kategori zorunlu");
      return;
    }

    setError("");

    const data = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };

    // 1. Optimistic Update & Close
    if (onOptimisticSave) {
      onOptimisticSave(data, isEdit);
    }
    onClose();

    // 2. Background Server Action (Fire and forget)
    if (isEdit) {
      updateExercise(domain, exercise!.id, data).catch(console.error);
    } else {
      createExercise(domain, data).catch(console.error);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--dashboard-card-bg)",
    borderColor: "var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="rounded-xl w-full max-w-lg mx-4 p-6 border"
        style={{
          backgroundColor: "var(--dashboard-sidebar-bg, #111827)",
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
      >
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Egzersizi Düzenle" : "Yeni Egzersiz"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Egzersiz Adı *
            </label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); if (touched.name && e.target.value.trim()) setError(""); }}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              placeholder="Bench Press"
              style={{
                ...inputStyle,
                ...(touched.name && !name.trim() ? { borderColor: "#ef4444" } : {}),
              }}
            />
            {touched.name && !name.trim() && (
              <p className="text-red-400 text-xs mt-1">Egzersiz adı zorunlu</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Kategori *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="px-3 py-1 rounded-full text-xs transition"
                  style={
                    category === cat
                      ? { backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)", fontWeight: 600 }
                      : { backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)", border: "1px solid var(--dashboard-card-border)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            <Input
              value={category}
              onChange={(e) => { setCategory(e.target.value); if (touched.category && e.target.value.trim()) setError(""); }}
              onBlur={() => setTouched((p) => ({ ...p, category: true }))}
              placeholder="Veya yeni kategori yaz..."
              className="text-sm"
              style={{
                ...inputStyle,
                ...(touched.category && !category.trim() ? { borderColor: "#ef4444" } : {}),
              }}
            />
            {touched.category && !category.trim() && (
              <p className="text-red-400 text-xs mt-1">Kategori zorunlu</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Egzersiz nasıl yapılır..."
              rows={3}
              className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                border: "1px solid var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Görsel URL
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, imageUrl: true }))}
              placeholder="https://..."
              style={{
                ...inputStyle,
                ...(touched.imageUrl && imageUrl.trim() && !imageUrl.trim().startsWith("http") ? { borderColor: "#ef4444" } : {}),
              }}
            />
            {touched.imageUrl && imageUrl.trim() && !imageUrl.trim().startsWith("http") && (
              <p className="text-red-400 text-xs mt-1">Geçerli bir URL girin (https://...)</p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-md"
              style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="flex-1 font-semibold hover:opacity-90"
              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            >
              {isEdit ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
