"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FoodSearch from "./food-search";
import type { FoodData } from "@/lib/data/food-database";
import { updateMeal } from "@/app/site/[domain]/dashboard/nutrition/actions";
import {
  MEAL_NAME_OPTIONS,
  getMealTotals,
  foodDataToItem,
  updateFoodGrams,
  replaceFood,
  toFoodPayload,
  type FoodItem,
} from "@/lib/nutrition/food-item";

export interface EditableMeal {
  name: string;
  time: string;
  foods: FoodItem[];
}

const inputStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
  color: "var(--dashboard-main-text)",
};

/**
 * Tek bir öğünün tam düzenleyicisi: öğün adı/saati, besin gramajı, besin
 * değiştirme/silme/ekleme.
 *
 * Üç yerde kullanılır:
 *  - Plan sihirbazında listeye eklenmiş öğünler (mode="local")
 *  - Kaydedilmiş kütüphane planındaki öğünler (mode="persist")
 *  - Öğrenciye atanmış plandaki öğünler (mode="persist")
 *
 * Önceden yalnızca "henüz kaydedilmemiş taslak öğün" düzenlenebiliyordu; öğün
 * bir kez kaydedilince tek çare silip baştan kurmaktı.
 */
export function MealEditor({
  domain,
  mealId,
  initial,
  onSaved,
  onCancel,
}: {
  domain: string;
  /** Verilirse değişiklikler updateMeal ile sunucuya yazılır; verilmezse yalnız yerel. */
  mealId?: string;
  initial: EditableMeal;
  onSaved: (meal: EditableMeal) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [time, setTime] = useState(initial.time);
  const [foods, setFoods] = useState<FoodItem[]>(initial.foods);
  const [replacingIdx, setReplacingIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const totals = getMealTotals(foods);

  const handleSave = async () => {
    if (!name.trim() || foods.length === 0) return;
    const next: EditableMeal = { name: name.trim(), time: time.trim(), foods };

    if (!mealId) {
      onSaved(next);
      return;
    }

    setSaving(true);
    const result = await updateMeal(domain, mealId, {
      name: next.name,
      time: next.time || undefined,
      foods: toFoodPayload(foods),
    });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error || "Öğün güncellenemedi");
      return;
    }
    toast.success("Öğün güncellendi");
    onSaved(next);
  };

  return (
    <div className="space-y-3">
      {/* Öğün adı + saat */}
      <div className="flex gap-3">
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-md px-3 py-2 text-sm"
          style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
        >
          {/* Serbest yazılmış/eski öğün adları listede olmayabilir — kaybolmasın */}
          {!MEAL_NAME_OPTIONS.includes(name as (typeof MEAL_NAME_OPTIONS)[number]) && name && (
            <option value={name}>{name}</option>
          )}
          {MEAL_NAME_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <Input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Saat (08:00)"
          className="w-28"
          style={inputStyle}
        />
      </div>

      {/* Besin satırları */}
      {foods.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[430px] space-y-1.5">
            <div className="grid grid-cols-10 px-1 text-[10px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
              <span className="col-span-4">Besin</span>
              <span className="text-right">Kalori</span>
              <span className="text-right text-blue-300/60">P</span>
              <span className="text-right text-orange-300/60">K</span>
              <span className="text-right text-yellow-300/60">Y</span>
              <span className="col-span-2" />
            </div>

            {foods.map((food, idx) => (
              <div key={idx}>
                <div className="grid grid-cols-10 items-center rounded px-1 py-0.5 text-xs" style={{ color: "var(--dashboard-main-text)" }}>
                  <span className="col-span-4 flex min-w-0 items-center gap-1">
                    <span className="truncate">{food.name}</span>
                    {food.caloriesPer100g != null ? (
                      <span className="flex shrink-0 items-center gap-0.5">
                        <input
                          type="number"
                          min={1}
                          value={food.grams ?? ""}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (v > 0) setFoods(updateFoodGrams(foods, idx, v));
                          }}
                          className="w-12 rounded px-1 py-0 text-center text-[10px]"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))",
                            border: "1px solid var(--dashboard-card-border)",
                            color: "var(--dashboard-accent)",
                          }}
                          aria-label={`${food.name} gramaj`}
                        />
                        <span className="text-[10px]" style={{ opacity: 0.5 }}>g</span>
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px]" style={{ opacity: 0.5 }}>{food.portion}</span>
                    )}
                  </span>
                  <span className="text-right font-medium">{food.calories}</span>
                  <span className="text-right text-blue-300">{food.protein}</span>
                  <span className="text-right text-orange-300">{food.carbs}</span>
                  <span className="text-right text-yellow-300">{food.fat}</span>
                  <span className="col-span-2 flex justify-end gap-2 text-[10px]">
                    <button
                      onClick={() => setReplacingIdx(replacingIdx === idx ? null : idx)}
                      style={{ color: "var(--dashboard-accent)" }}
                    >
                      {replacingIdx === idx ? "Vazgeç" : "Değiştir"}
                    </button>
                    <button
                      onClick={() => setFoods(foods.filter((_, i) => i !== idx))}
                      className="text-red-400/60 hover:text-red-400"
                    >
                      Kaldır
                    </button>
                  </span>
                </div>

                {replacingIdx === idx && (
                  <div className="mt-1 mb-2 px-1">
                    <p className="mb-1 text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      Yerine gelecek besini seç (gramaj korunur):
                    </p>
                    <FoodSearch
                      onSelect={(f: FoodData) => {
                        setFoods(replaceFood(foods, idx, f));
                        setReplacingIdx(null);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="grid grid-cols-10 px-1 pt-1.5 text-xs font-medium" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
              <span className="col-span-4" style={{ color: "var(--dashboard-main-text-muted)" }}>Toplam</span>
              <span className="text-right" style={{ color: "var(--dashboard-accent)" }}>{totals.calories}</span>
              <span className="text-right text-blue-300">{totals.protein.toFixed(0)}</span>
              <span className="text-right text-orange-300">{totals.carbs.toFixed(0)}</span>
              <span className="text-right text-yellow-300">{totals.fat.toFixed(0)}</span>
              <span className="col-span-2" />
            </div>
          </div>
        </div>
      )}

      {/* Besin ekle */}
      <div>
        <label className="mb-1 block text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Besin ekle:</label>
        <FoodSearch onSelect={(f: FoodData) => setFoods([...foods, foodDataToItem(f)])} />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={saving || !name.trim() || foods.length === 0}
          className="text-sm font-semibold hover:opacity-90"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        >
          {saving ? "..." : "Kaydet"}
        </Button>
        <Button
          onClick={onCancel}
          className="rounded-md border px-4 py-2 text-sm"
          style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
        >
          İptal
        </Button>
      </div>
    </div>
  );
}
