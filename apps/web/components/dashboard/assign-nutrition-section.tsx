"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { assignNutritionPlanToStudent } from "@/app/site/[domain]/dashboard/students/assign-actions";
import {
  updateNutritionPlan,
  addMeal,
  deleteMeal,
} from "@/app/site/[domain]/dashboard/nutrition/actions";
import FoodSearch from "./food-search";
import type { FoodData } from "@/lib/data/food-database";
import { Plus, Trash2, Edit3 } from "lucide-react";

interface NutritionPlanOption {
  id: string;
  name: string;
  targetCalories: number | null;
  mealCount: number;
}

interface MealData {
  id: string;
  name: string;
  time: string | null;
  foods: unknown;
  orderIndex: number;
}

interface CurrentNutritionData {
  id: string;
  name: string;
  targetCalories: number | null;
  targetProtein: number | null;
  targetCarbs: number | null;
  targetFat: number | null;
  coachNotes: string | null;
  meals: MealData[];
}

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  grams?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
  sugarPer100g?: number;
  fiberPer100g?: number;
}

const inputStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
  color: "var(--dashboard-main-text)",
};

export function AssignNutritionSection({
  domain,
  studentId,
  nutritionPlans,
  currentNutrition,
}: {
  domain: string;
  studentId: string;
  nutritionPlans: NutritionPlanOption[];
  currentNutrition: CurrentNutritionData | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [editing, setEditing] = useState(false);

  const [localCurrentNutrition, setLocalCurrentNutrition] = useState<CurrentNutritionData | null>(currentNutrition);
  useEffect(() => {
    setLocalCurrentNutrition(currentNutrition);
  }, [currentNutrition]);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editCalories, setEditCalories] = useState<number | "">("");
  const [editProtein, setEditProtein] = useState<number | "">("");
  const [editCarbs, setEditCarbs] = useState<number | "">("");
  const [editFat, setEditFat] = useState<number | "">("");

  // Add meal state
  const [addingMeal, setAddingMeal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const handleAssign = async () => {
    if (!selectedPlanId) return;
    setLoading(true);

    const sel = nutritionPlans.find(p => p.id === selectedPlanId);
    if (sel) {
      setLocalCurrentNutrition({
        id: sel.id,
        name: sel.name,
        targetCalories: sel.targetCalories,
        targetProtein: null,
        targetCarbs: null,
        targetFat: null,
        coachNotes: null,
        meals: [],
      });
    }

    setShowAssign(false);
    setSelectedPlanId("");
    setLoading(false);

    assignNutritionPlanToStudent(domain, studentId, selectedPlanId).then(() => {
      router.refresh();
    });
  };

  const startEditing = () => {
    if (!localCurrentNutrition) return;
    setEditName(localCurrentNutrition.name);
    setEditCalories(localCurrentNutrition.targetCalories || "");
    setEditProtein(localCurrentNutrition.targetProtein || "");
    setEditCarbs(localCurrentNutrition.targetCarbs || "");
    setEditFat(localCurrentNutrition.targetFat || "");
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!localCurrentNutrition || !editName.trim()) return;
    setLoading(true);

    setLocalCurrentNutrition({
      ...localCurrentNutrition,
      name: editName.trim(),
      targetCalories: editCalories || null,
      targetProtein: editProtein || null,
      targetCarbs: editCarbs || null,
      targetFat: editFat || null,
    });

    setEditing(false);
    setLoading(false);

    updateNutritionPlan(domain, localCurrentNutrition.id, {
      name: editName.trim(),
      targetCalories: editCalories || undefined,
      targetProtein: editProtein || undefined,
      targetCarbs: editCarbs || undefined,
      targetFat: editFat || undefined,
    }).then(() => {
      router.refresh();
    });
  };

  const handleFoodSelect = (food: FoodData) => {
    const ratio = food.portionGrams / 100;
    setFoods([
      ...foods,
      {
        name: food.name,
        portion: `${food.portion} (${food.portionGrams}g)`,
        grams: food.portionGrams,
        calories: Math.round(food.calories * ratio),
        protein: Math.round(food.protein * ratio * 10) / 10,
        carbs: Math.round(food.carbs * ratio * 10) / 10,
        fat: Math.round(food.fat * ratio * 10) / 10,
        sugar: Math.round(food.sugar * ratio * 10) / 10,
        fiber: Math.round(food.fiber * ratio * 10) / 10,
        caloriesPer100g: food.calories,
        proteinPer100g: food.protein,
        carbsPer100g: food.carbs,
        fatPer100g: food.fat,
        sugarPer100g: food.sugar,
        fiberPer100g: food.fiber,
      },
    ]);
  };

  const handleAddMeal = async () => {
    if (!localCurrentNutrition || !mealName.trim() || foods.length === 0) return;
    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    const newMeal = {
      id: tempId,
      name: mealName.trim(),
      time: mealTime || null,
      foods,
      orderIndex: (localCurrentNutrition.meals?.length || 0) + 1
    };

    setLocalCurrentNutrition(prev => prev ? {
      ...prev,
      meals: [...prev.meals, newMeal]
    } : prev);

    setMealName("");
    setMealTime("");
    setFoods([]);
    setAddingMeal(false);
    setLoading(false);

    addMeal(domain, localCurrentNutrition.id, {
      name: mealName.trim(),
      time: mealTime || undefined,
      foods,
    }).then(() => {
      router.refresh();
    });
  };

  const handleDeleteMeal = async (mealId: string) => {
    setLoading(true);
    setLocalCurrentNutrition(prev => prev ? {
      ...prev,
      meals: prev.meals.filter(m => m.id !== mealId)
    } : prev);
    setLoading(false);

    deleteMeal(domain, mealId).then(() => {
      router.refresh();
    });
  };

  const mealOptions = (
    <>
      <option value="">Ogun sec...</option>
      <option value="Kahvalti">Kahvalti</option>
      <option value="Ara Ogun (Sabah)">Ara Ogun (Sabah)</option>
      <option value="Ogle Yemegi">Ogle Yemegi</option>
      <option value="Ara Ogun (Ogleden Sonra)">Ara Ogun (Ogleden Sonra)</option>
      <option value="Aksam Yemegi">Aksam Yemegi</option>
      <option value="Gece Atistirmasi">Gece Atistirmasi</option>
      <option value="Antrenman Oncesi">Antrenman Oncesi</option>
      <option value="Antrenman Sonrasi">Antrenman Sonrasi</option>
    </>
  );

  // Aktif plan varken gösterim
  if (localCurrentNutrition && !editing) {
    return (
      <div className="space-y-3">
        {/* Aktif plan bilgisi */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Aktif plan: <strong style={{ color: "var(--dashboard-main-text)" }}>{localCurrentNutrition.name}</strong>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAssign(!showAssign)}
              className="text-xs px-3 py-1 rounded border"
              style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}
            >
              Degistir
            </button>
            <button
              onClick={startEditing}
              className="text-xs px-3 py-1 rounded flex items-center gap-1"
              style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))", color: "var(--dashboard-accent)" }}
            >
              <Edit3 className="h-3 w-3" /> Duzenle
            </button>
          </div>
        </div>

        {/* Makro bilgisi */}
        {(localCurrentNutrition.targetCalories || localCurrentNutrition.targetProtein) && (
          <div className="flex gap-3">
            {localCurrentNutrition.targetCalories && (
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))" }}>
                {localCurrentNutrition.targetCalories} kcal
              </span>
            )}
            {localCurrentNutrition.targetProtein && (
              <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                P: {localCurrentNutrition.targetProtein}g
              </span>
            )}
            {localCurrentNutrition.targetCarbs && (
              <span className="text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-400">
                K: {localCurrentNutrition.targetCarbs}g
              </span>
            )}
            {localCurrentNutrition.targetFat && (
              <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">
                Y: {localCurrentNutrition.targetFat}g
              </span>
            )}
          </div>
        )}

        {/* Öğünler */}
        {localCurrentNutrition.meals.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Ogunler ({localCurrentNutrition.meals.length})
            </p>
            {localCurrentNutrition.meals.map((meal) => {
              const mealFoods = Array.isArray(meal.foods) ? (meal.foods as FoodItem[]) : [];
              const totalCal = mealFoods.reduce((sum, f) => sum + (f.calories || 0), 0);
              return (
                <div key={meal.id} className="flex items-center justify-between py-1.5 px-2 rounded text-sm"
                  style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                  <div className="flex items-center gap-2">
                    <span>{meal.name}</span>
                    {meal.time && <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{meal.time}</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                      {totalCal} kcal • {mealFoods.length} besin
                    </span>
                  </div>
                  <button onClick={() => handleDeleteMeal(meal.id)}
                    className="text-[10px] text-red-400/50 hover:text-red-400">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Öğün Ekle */}
        {addingMeal ? (
          <div className="space-y-3 pt-2" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
            <div className="flex gap-3">
              <select
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="flex-1 rounded-md px-3 py-2 text-sm"
                style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
              >
                {mealOptions}
              </select>
              <Input value={mealTime} onChange={(e) => setMealTime(e.target.value)}
                placeholder="Saat (08:00)" className="w-28" style={inputStyle} />
            </div>
            {mealName && (
              <>
                <FoodSearch onSelect={handleFoodSelect} />
                {foods.length > 0 && (
                  <div className="space-y-1 p-2 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                    {foods.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span>{f.name} <span style={{ color: "var(--dashboard-main-text-muted)" }}>{f.portion}</span></span>
                        <div className="flex items-center gap-2">
                          <span>{f.calories} kcal</span>
                          <button onClick={() => setFoods(foods.filter((_, i) => i !== idx))}
                            className="text-red-400/50 hover:text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleAddMeal} disabled={loading || !mealName.trim() || foods.length === 0}
                    style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                    className="font-semibold text-xs h-8 hover:opacity-90">
                    <Plus className="h-3 w-3 mr-1" /> Ogunu Kaydet
                  </Button>
                  <Button onClick={() => { setAddingMeal(false); setFoods([]); setMealName(""); }}
                    className="border rounded-md px-3 text-xs h-8"
                    style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                    Iptal
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={() => setAddingMeal(true)}
            className="w-full py-1.5 border border-dashed rounded text-xs"
            style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}>
            + Ogun Ekle
          </button>
        )}

        {/* Değiştir dropdown */}
        {showAssign && (
          <div className="pt-3 space-y-2" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>Kutuphaneden plan sec:</p>
            <div className="flex gap-2">
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="flex-1 rounded-md px-3 py-2 text-sm"
                style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
              >
                <option value="">Plan sec...</option>
                {nutritionPlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.targetCalories ? `(${p.targetCalories} kcal)` : ""} - {p.mealCount} ogun
                  </option>
                ))}
              </select>
              <Button onClick={handleAssign} disabled={loading || !selectedPlanId}
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                className="font-semibold text-sm hover:opacity-90">
                {loading ? "..." : "Ata"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Düzenleme modu
  if (editing && localCurrentNutrition) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium">Plani Duzenle</p>
        <Input value={editName} onChange={(e) => setEditName(e.target.value)}
          placeholder="Plan adi" style={inputStyle} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Kalori</label>
            <Input type="number" value={editCalories} onChange={(e) => setEditCalories(e.target.value ? Number(e.target.value) : "")}
              placeholder="2000" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Protein (g)</label>
            <Input type="number" value={editProtein} onChange={(e) => setEditProtein(e.target.value ? Number(e.target.value) : "")}
              placeholder="150" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Karb (g)</label>
            <Input type="number" value={editCarbs} onChange={(e) => setEditCarbs(e.target.value ? Number(e.target.value) : "")}
              placeholder="200" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Yag (g)</label>
            <Input type="number" value={editFat} onChange={(e) => setEditFat(e.target.value ? Number(e.target.value) : "")}
              placeholder="70" style={inputStyle} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveEdit} disabled={loading || !editName.trim()}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold text-sm hover:opacity-90">
            {loading ? "..." : "Kaydet"}
          </Button>
          <Button onClick={() => setEditing(false)}
            className="border rounded-md px-4 py-2 text-sm"
            style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            Iptal
          </Button>
        </div>
      </div>
    );
  }

  // Plan yokken - atama dropdown
  return (
    <div className="space-y-3">
      {nutritionPlans.length > 0 ? (
        <>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Kutuphaneden bir beslenme plani secip atayabilirsiniz.
          </p>
          <div className="flex gap-2">
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="flex-1 rounded-md px-3 py-2 text-sm"
              style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
            >
              <option value="">Plan sec...</option>
              {nutritionPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.targetCalories ? `(${p.targetCalories} kcal)` : ""} - {p.mealCount} ogun
                </option>
              ))}
            </select>
            <Button onClick={handleAssign} disabled={loading || !selectedPlanId}
              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
              className="font-semibold text-sm hover:opacity-90">
              {loading ? "..." : "Ata"}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Henuz kutuphanede beslenme plani yok. Beslenme sayfasindan plan olusturun.
        </p>
      )}
    </div>
  );
}
