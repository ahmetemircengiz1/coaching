"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/dashboard/validated-input";
import FoodSearch from "./food-search";
import type { FoodData } from "@/lib/data/food-database";
import { supplementDatabase, supplementCategories } from "@/lib/data/supplement-database";
import {
  createNutritionPlan,
  deleteNutritionPlan,
  duplicateNutritionPlan,
  addMeal,
  deleteMeal,
  setMealAlternatives,
  updateNutritionPlan,
  updatePlanNotes,
  updatePlanSupplements,
  importNutritionFromFile,
} from "@/app/site/[domain]/dashboard/nutrition/actions";
import { ImportDialog, NUTRITION_FORMAT_EXAMPLE } from "@/components/dashboard/import-dialog";
import { ConfirmDialog, useConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { AssignToStudentsModal } from "@/components/dashboard/assign-to-students-modal";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronDown, ChevronRight, Check, Pencil } from "lucide-react";

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
  grams?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
  sugarPer100g?: number;
  fiberPer100g?: number;
}

interface SupplementItem {
  name: string;
  dosage: string;
  timing: string;
  notes?: string;
}

interface MealData {
  id: string;
  name: string;
  time: string | null;
  foods: unknown;
  alternatives?: unknown;
  orderIndex: number;
}

interface PlanData {
  id: string;
  name: string;
  targetCalories: number | null;
  targetProtein: number | null;
  targetCarbs: number | null;
  targetFat: number | null;
  coachNotes?: string | null;
  supplements?: unknown;
  assignedCount: number;
  assignedStudentsPreview: { id: string; name: string }[];
  meals: MealData[];
  createdAt: string;
}

interface WizardMeal {
  name: string;
  time: string;
  foods: FoodItem[];
}

// ─── Collapsible Section ───
function CollapsibleSection({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg"
      style={{ border: "1px solid var(--dashboard-card-border)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left transition-colors"
        style={{
          backgroundColor: open
            ? "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))"
            : "var(--dashboard-card-bg)",
        }}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-4 w-4" style={{ color: "var(--dashboard-accent)" }} />
          ) : (
            <ChevronRight className="h-4 w-4" style={{ color: "var(--dashboard-main-text-muted)" }} />
          )}
          <span className="text-sm font-medium">{title}</span>
          {subtitle && (
            <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {subtitle}
            </span>
          )}
        </div>
      </button>
      {open && (
        <div className="p-3 pt-2 space-y-3" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Helper: update food grams ───
function updateFoodGrams(foods: FoodItem[], idx: number, newGrams: number): FoodItem[] {
  return foods.map((f, i) => {
    if (i !== idx) return f;
    const per100Cal = f.caloriesPer100g ?? 0;
    const per100P = f.proteinPer100g ?? 0;
    const per100C = f.carbsPer100g ?? 0;
    const per100F = f.fatPer100g ?? 0;
    const per100S = f.sugarPer100g ?? 0;
    const per100Fib = f.fiberPer100g ?? 0;
    const ratio = newGrams / 100;
    return {
      ...f,
      grams: newGrams,
      portion: `${newGrams}g`,
      calories: Math.round(per100Cal * ratio),
      protein: Math.round(per100P * ratio * 10) / 10,
      carbs: Math.round(per100C * ratio * 10) / 10,
      fat: Math.round(per100F * ratio * 10) / 10,
      sugar: Math.round(per100S * ratio * 10) / 10,
      fiber: Math.round(per100Fib * ratio * 10) / 10,
    };
  });
}

export default function NutritionPageClient({
  domain,
  plans,
}: {
  domain: string;
  plans: PlanData[];
}) {
  const router = useRouter();

  // Optimistic local state
  const [localPlans, setLocalPlans] = useState<PlanData[]>(plans);
  useEffect(() => {
    setLocalPlans(plans);
  }, [plans]);

  const [showCreate, setShowCreate] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [assignTarget, setAssignTarget] = useState<{ id: string; name: string } | null>(null);
  const { confirm, dialogProps } = useConfirmDialog();
  const [loading, setLoading] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  // ─── Create Form State ───
  const [planName, setPlanName] = useState("");
  // Sections open/close
  const [macrosOpen, setMacrosOpen] = useState(false);
  const [mealsOpen, setMealsOpen] = useState(false);
  const [supplementsOpen, setSupplementsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  // Macros
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fat, setFat] = useState<number | "">("");
  // Notes
  const [coachNotes, setCoachNotes] = useState("");
  // Meals
  const [wizardMeals, setWizardMeals] = useState<WizardMeal[]>([]);
  const [currentMealName, setCurrentMealName] = useState("");
  const [currentMealTime, setCurrentMealTime] = useState("");
  const [currentMealFoods, setCurrentMealFoods] = useState<FoodItem[]>([]);
  // Supplements
  const [wizardSupplements, setWizardSupplements] = useState<SupplementItem[]>([]);
  const [supSearch, setSupSearch] = useState("");
  const [supCategory, setSupCategory] = useState("");

  // ─── Existing plan editing state ───
  const [addingMealTo, setAddingMealTo] = useState<string | null>(null);
  const [mealName, setMealName] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [editingNotesFor, setEditingNotesFor] = useState<string | null>(null);
  // Plan adı rename state'i
  const [renamingPlanId, setRenamingPlanId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  const savePlanRename = async (plan: PlanData) => {
    const next = renameDraft.trim();
    if (!next || next === plan.name) {
      setRenamingPlanId(null);
      return;
    }
    // Optimistic
    setLocalPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, name: next } : p)));
    setRenamingPlanId(null);
    const supplementsData = (plan.supplements as SupplementItem[] | null) || undefined;
    const result = await updateNutritionPlan(domain, plan.id, {
      name: next,
      targetCalories: plan.targetCalories ?? undefined,
      targetProtein: plan.targetProtein ?? undefined,
      targetCarbs: plan.targetCarbs ?? undefined,
      targetFat: plan.targetFat ?? undefined,
      coachNotes: plan.coachNotes ?? undefined,
      supplements: supplementsData,
    });
    if (!result.success) {
      toast.error(("error" in result && result.error) || "Plan adı güncellenemedi");
      setLocalPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, name: plan.name } : p)));
    } else {
      router.refresh();
    }
  };
  const [notesText, setNotesText] = useState("");
  const [addingSupTo, setAddingSupTo] = useState<string | null>(null);
  const [existingSupSearch, setExistingSupSearch] = useState("");
  const [existingSupCategory, setExistingSupCategory] = useState("");

  // ─── Helpers ───
  const inputStyle = {
    backgroundColor: "var(--dashboard-card-bg)",
    borderColor: "var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };
  const selectStyle = "w-full rounded-md px-3 py-2 text-sm";

  const getMealTotals = (mealFoods: FoodItem[]) => {
    return mealFoods.reduce(
      (acc, f) => ({
        calories: acc.calories + (f.calories || 0),
        protein: acc.protein + (f.protein || 0),
        carbs: acc.carbs + (f.carbs || 0),
        fat: acc.fat + (f.fat || 0),
        sugar: acc.sugar + (f.sugar || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 }
    );
  };

  const getAllMealsTotals = () => {
    const allFoods = wizardMeals.flatMap((m) => m.foods);
    return getMealTotals(allFoods);
  };

  // ─── Reset ───
  const resetForm = () => {
    setPlanName("");
    setMacrosOpen(false);
    setMealsOpen(false);
    setSupplementsOpen(false);
    setNotesOpen(false);
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setCoachNotes("");
    setWizardMeals([]);
    setCurrentMealName("");
    setCurrentMealTime("");
    setCurrentMealFoods([]);
    setWizardSupplements([]);
    setSupSearch("");
    setSupCategory("");
  };

  // ─── Food Select (create form) ───
  const handleWizardFoodSelect = (food: FoodData) => {
    const ratio = food.portionGrams / 100;
    setCurrentMealFoods([
      ...currentMealFoods,
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

  // ─── Add meal to list ───
  const addMealToWizard = () => {
    if (!currentMealName.trim() || currentMealFoods.length === 0) return;
    setWizardMeals([
      ...wizardMeals,
      { name: currentMealName.trim(), time: currentMealTime, foods: currentMealFoods },
    ]);
    setCurrentMealName("");
    setCurrentMealTime("");
    setCurrentMealFoods([]);
  };

  const removeWizardMeal = (idx: number) => {
    setWizardMeals(wizardMeals.filter((_, i) => i !== idx));
  };

  // ─── Save Plan ───
  const handleSave = async () => {
    if (!planName.trim()) return;
    setLoading(true);

    const result = await createNutritionPlan(domain, {
      name: planName.trim(),
      targetCalories: calories || undefined,
      targetProtein: protein || undefined,
      targetCarbs: carbs || undefined,
      targetFat: fat || undefined,
    });

    if (result.success && result.planId) {
      for (const meal of wizardMeals) {
        await addMeal(domain, result.planId, {
          name: meal.name,
          time: meal.time || undefined,
          foods: meal.foods,
        });
      }

      if (wizardSupplements.length > 0) {
        await updatePlanSupplements(domain, result.planId, wizardSupplements);
      }

      if (coachNotes.trim()) {
        await updatePlanNotes(domain, result.planId, coachNotes.trim());
      }

      setShowCreate(false);
      resetForm();
    }

    setLoading(false);
  };

  // ─── Existing Plan Handlers ───
  const handleDelete = async (planId: string) => {
    const plan = localPlans.find(p => p.id === planId);
    const confirmed = await confirm({
      title: "Beslenme Planini Sil",
      description: `"${plan?.name || "Bu plan"}" kalici olarak silinecek. Bu islem geri alinamaz.`,
      confirmText: "Sil",
      variant: "danger",
    });
    if (!confirmed) return;
    setLocalPlans(prev => prev.filter(p => p.id !== planId));
    await deleteNutritionPlan(domain, planId);
  };

  const handleDuplicate = async (planId: string) => {
    const result = await duplicateNutritionPlan(domain, planId);
    if (result.success) {
      router.refresh();
    } else {
      toast.error("error" in result ? result.error : "Kopyalama hatası");
    }
  };

  const handleAddMeal = async (planId: string) => {
    if (!mealName.trim() || foods.length === 0) return;
    setLoading(true);

    const newMeal: MealData = {
      id: `temp-${Date.now()}`,
      name: mealName.trim(),
      time: mealTime || null,
      foods: foods,
      orderIndex: 999,
    };

    setLocalPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, meals: [...p.meals, newMeal] };
      }
      return p;
    }));

    setMealName("");
    setMealTime("");
    setFoods([]);
    setAddingMealTo(null);
    setLoading(false);

    await addMeal(domain, planId, {
      name: newMeal.name,
      time: newMeal.time || undefined,
      foods: newMeal.foods as FoodItem[],
    });
  };

  const handleDeleteMeal = async (planId: string, mealId: string) => {
    setLocalPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, meals: p.meals.filter(m => m.id !== mealId) };
      }
      return p;
    }));
    await deleteMeal(domain, mealId);
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

  const removeFood = (idx: number) => {
    setFoods(foods.filter((_, i) => i !== idx));
  };

  const handleSaveNotes = async (planId: string) => {
    setLocalPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, coachNotes: notesText };
      }
      return p;
    }));
    setEditingNotesFor(null);
    await updatePlanNotes(domain, planId, notesText);
  };

  const handleAddSupplement = async (planId: string, supp: SupplementItem) => {
    const plan = localPlans.find((p) => p.id === planId);
    const existing = (plan?.supplements as SupplementItem[] | null) || [];
    const updated = [...existing, supp];

    setLocalPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, supplements: updated };
      }
      return p;
    }));

    await updatePlanSupplements(domain, planId, updated);
  };

  const handleRemoveSupplement = async (planId: string, idx: number) => {
    const plan = localPlans.find((p) => p.id === planId);
    const existing = (plan?.supplements as SupplementItem[] | null) || [];
    const updated = existing.filter((_, i) => i !== idx);

    setLocalPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, supplements: updated };
      }
      return p;
    }));

    await updatePlanSupplements(domain, planId, updated);
  };

  const filteredSupplements = supplementDatabase.filter((s) => {
    const matchSearch = !supSearch || s.name.toLowerCase().includes(supSearch.toLowerCase());
    const matchCat = !supCategory || s.category === supCategory;
    return matchSearch && matchCat;
  });

  const existingFilteredSupplements = supplementDatabase.filter((s) => {
    const matchSearch = !existingSupSearch || s.name.toLowerCase().includes(existingSupSearch.toLowerCase());
    const matchCat = !existingSupCategory || s.category === existingSupCategory;
    return matchSearch && matchCat;
  });

  const allTotals = getAllMealsTotals();

  // ─── Render food table with editable grams ───
  const renderFoodTable = (
    foodList: FoodItem[],
    onRemove?: (idx: number) => void,
    onUpdateGrams?: (idx: number, grams: number) => void
  ) => {
    const totals = getMealTotals(foodList);
    const hasActions = !!onRemove;
    const cols = hasActions ? "grid-cols-9" : "grid-cols-8";
    return (
      <div className="space-y-1">
        <div className={`grid ${cols} text-[10px] px-1`} style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
          <span className="col-span-3">Besin</span>
          <span className="text-right">Kalori</span>
          <span className="text-right text-blue-300/60">P</span>
          <span className="text-right text-orange-300/60">K</span>
          <span className="text-right text-yellow-300/60">Y</span>
          <span className="text-right text-red-300/60">S</span>
          {hasActions && <span></span>}
        </div>
        {foodList.map((food, idx) => (
          <div key={idx} className={`grid ${cols} items-center text-xs px-1 py-0.5 rounded`} style={{ color: "var(--dashboard-main-text)", opacity: 0.8 }}>
            <span className="col-span-3 truncate flex items-center gap-1">
              <span className="truncate">{food.name}</span>
              {onUpdateGrams && food.caloriesPer100g != null ? (
                <input
                  type="number"
                  value={food.grams || ""}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (v > 0) onUpdateGrams(idx, v);
                  }}
                  className="w-12 text-[10px] px-1 py-0 rounded text-center"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))",
                    border: "1px solid var(--dashboard-card-border)",
                    color: "var(--dashboard-accent)",
                  }}
                  min={1}
                />
              ) : (
                <span className="text-[10px]" style={{ opacity: 0.5 }}>{food.portion}</span>
              )}
            </span>
            <span className="text-right">{food.calories}</span>
            <span className="text-right text-blue-300">{food.protein}</span>
            <span className="text-right text-orange-300">{food.carbs}</span>
            <span className="text-right text-yellow-300">{food.fat}</span>
            <span className="text-right text-red-300">{food.sugar || "-"}</span>
            {onRemove && (
              <button onClick={() => onRemove(idx)}
                className="text-red-400/50 hover:text-red-400 text-right text-[10px]">
                Kaldır
              </button>
            )}
          </div>
        ))}
        <div className={`grid ${cols} text-xs font-medium px-1 pt-1.5`} style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
          <span className="col-span-3" style={{ color: "var(--dashboard-main-text-muted)" }}>Toplam</span>
          <span className="text-right" style={{ color: "var(--dashboard-accent)" }}>{totals.calories}</span>
          <span className="text-right text-blue-300">{totals.protein.toFixed(0)}</span>
          <span className="text-right text-orange-300">{totals.carbs.toFixed(0)}</span>
          <span className="text-right text-yellow-300">{totals.fat.toFixed(0)}</span>
          <span className="text-right text-red-300">{totals.sugar.toFixed(0)}</span>
          {hasActions && <span></span>}
        </div>
      </div>
    );
  };

  // ─── Meal select options ───
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

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Beslenme Planlari</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{localPlans.length} plan</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowImportDialog(true)}
            className="font-medium text-sm border rounded-md px-4 py-2"
            style={{
              backgroundColor: "transparent",
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
          >
            Dosyadan Aktar
          </Button>
          <Button
            onClick={() => { setShowCreate(!showCreate); if (showCreate) resetForm(); }}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90"
          >
            + Yeni Plan
          </Button>
        </div>
      </div>

      {/* ═══ Create Form (Single Page with Collapsible Sections) ═══ */}
      {showCreate && (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-center">Yeni Beslenme Plani</h3>

            {/* Plan Adı */}
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Plan Adi *</label>
              <ValidatedInput
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Plan adi (orn: Kilo Verme Plani)"
                error={!planName.trim() ? "Plan adi zorunludur" : undefined}
                style={inputStyle}
              />
            </div>

            {/* Bölüm A: Makro Hedefler */}
            <CollapsibleSection
              title="Makro Hedefler"
              subtitle="(opsiyonel)"
              open={macrosOpen}
              onToggle={() => setMacrosOpen(!macrosOpen)}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Kalori</label>
                  <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : "")} placeholder="2000" style={inputStyle} />
                </div>
                <div>
                  <label className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Protein (g)</label>
                  <Input type="number" value={protein} onChange={(e) => setProtein(e.target.value ? Number(e.target.value) : "")} placeholder="150" style={inputStyle} />
                </div>
                <div>
                  <label className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Karbonhidrat (g)</label>
                  <Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value ? Number(e.target.value) : "")} placeholder="200" style={inputStyle} />
                </div>
                <div>
                  <label className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Yag (g)</label>
                  <Input type="number" value={fat} onChange={(e) => setFat(e.target.value ? Number(e.target.value) : "")} placeholder="70" style={inputStyle} />
                </div>
              </div>
            </CollapsibleSection>

            {/* Bölüm B: Öğün Planı */}
            <CollapsibleSection
              title="Ogun Plani"
              subtitle={`(${wizardMeals.length} ogun)`}
              open={mealsOpen}
              onToggle={() => setMealsOpen(!mealsOpen)}
            >
              {/* Macro comparison bar */}
              {wizardMeals.length > 0 && calories && (
                <div className="grid grid-cols-4 gap-2 p-3 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))" }}>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: allTotals.calories > (calories || 0) ? "#ef4444" : "var(--dashboard-accent)" }}>
                      {allTotals.calories} / {calories}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>kcal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: allTotals.protein > (protein || 0) ? "#ef4444" : "#93c5fd" }}>
                      {allTotals.protein.toFixed(0)} / {protein || "-"}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Protein (g)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: allTotals.carbs > (carbs || 0) ? "#ef4444" : "#fdba74" }}>
                      {allTotals.carbs.toFixed(0)} / {carbs || "-"}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Karb (g)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: allTotals.fat > (fat || 0) ? "#ef4444" : "#fde047" }}>
                      {allTotals.fat.toFixed(0)} / {fat || "-"}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Yag (g)</p>
                  </div>
                </div>
              )}

              {/* Added meals */}
              {wizardMeals.map((meal, idx) => {
                const mTotals = getMealTotals(meal.foods);
                return (
                  <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{meal.name}</span>
                        {meal.time && <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{meal.time}</span>}
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                          {mTotals.calories} kcal
                        </span>
                      </div>
                      <button onClick={() => removeWizardMeal(idx)}
                        className="text-xs text-red-400/50 hover:text-red-400 flex items-center gap-1">
                        <Trash2 className="h-3 w-3" /> Kaldır
                      </button>
                    </div>
                    {renderFoodTable(meal.foods)}
                  </div>
                );
              })}

              {/* Add meal form */}
              <div className="p-3 rounded-lg space-y-3" style={{ border: "1px dashed var(--dashboard-card-border)", backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 2%, var(--dashboard-card-bg))" }}>
                <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  {wizardMeals.length === 0 ? "Ogun Ekle" : "+ Baska Ogun Ekle"}
                </p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <select
                      value={currentMealName}
                      onChange={(e) => setCurrentMealName(e.target.value)}
                      className={selectStyle}
                      style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
                    >
                      {mealOptions}
                    </select>
                  </div>
                  <Input
                    value={currentMealTime}
                    onChange={(e) => setCurrentMealTime(e.target.value)}
                    placeholder="Saat (08:00)"
                    className="w-28"
                    style={inputStyle}
                  />
                </div>

                {currentMealName && (
                  <>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Besin ekle:</label>
                      <FoodSearch onSelect={handleWizardFoodSelect} />
                    </div>

                    {currentMealFoods.length > 0 && (
                      <div className="rounded-lg p-3" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                        {renderFoodTable(
                          currentMealFoods,
                          (idx) => setCurrentMealFoods(currentMealFoods.filter((_, i) => i !== idx)),
                          (idx, grams) => setCurrentMealFoods(updateFoodGrams(currentMealFoods, idx, grams))
                        )}
                      </div>
                    )}

                    <Button
                      onClick={addMealToWizard}
                      disabled={!currentMealName.trim() || currentMealFoods.length === 0}
                      className="font-semibold hover:opacity-90 text-sm"
                      style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ogunu Ekle ({currentMealFoods.length} besin)
                    </Button>
                  </>
                )}
              </div>
            </CollapsibleSection>

            {/* Bölüm C: Takviyeler */}
            <CollapsibleSection
              title="Takviyeler"
              subtitle={`(${wizardSupplements.length} takviye)`}
              open={supplementsOpen}
              onToggle={() => setSupplementsOpen(!supplementsOpen)}
            >
              {wizardSupplements.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Eklenen Takviyeler ({wizardSupplements.length})
                  </p>
                  {wizardSupplements.map((supp, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 text-sm" style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}>
                      <div>
                        <span className="font-medium">{supp.name}</span>
                        <span className="text-xs ml-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {supp.dosage} &bull; {supp.timing}
                        </span>
                      </div>
                      <button onClick={() => setWizardSupplements(wizardSupplements.filter((_, i) => i !== idx))}
                        className="text-xs text-red-400/50 hover:text-red-400 px-1">Kaldir</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={supSearch}
                    onChange={(e) => setSupSearch(e.target.value)}
                    placeholder="Takviye ara..."
                    className="flex-1"
                    style={inputStyle}
                  />
                  <select
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value)}
                    className="rounded-md px-2 py-1 text-xs"
                    style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
                  >
                    <option value="">Tum Kategoriler</option>
                    {supplementCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                  {filteredSupplements.slice(0, 15).map((supp, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setWizardSupplements([...wizardSupplements, {
                          name: supp.name,
                          dosage: supp.dosage,
                          timing: supp.timing,
                          notes: supp.notes,
                        }]);
                      }}
                      className="w-full text-left p-2 rounded text-sm transition"
                      style={{ color: "var(--dashboard-main-text)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--dashboard-card-bg)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{supp.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                          {supp.category}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        {supp.dosage} &bull; {supp.timing}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Bölüm D: Koç Notları */}
            <CollapsibleSection
              title="Koc Notlari"
              subtitle="(opsiyonel)"
              open={notesOpen}
              onToggle={() => setNotesOpen(!notesOpen)}
            >
              <textarea
                value={coachNotes}
                onChange={(e) => setCoachNotes(e.target.value)}
                className="w-full rounded-md px-3 py-2 text-sm min-h-[80px]"
                style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
                placeholder="Ogrenciye gosterilecek notlar, ozel talimatlar..."
              />
            </CollapsibleSection>

            {/* Save / Cancel */}
            <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
              <Button
                onClick={() => { setShowCreate(false); resetForm(); }}
                className="border rounded-md px-4 py-2 text-sm"
                style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
              >
                Iptal
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !planName.trim()}
                className="font-semibold hover:opacity-90 text-sm"
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
              >
                {loading ? "Kaydediliyor..." : "Plani Kaydet"}
                {!loading && <Check className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ Plans List ═══ */}
      {localPlans.length === 0 && !showCreate ? (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">🥗</p>
            <p className="text-lg mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>Henuz beslenme plani yok</p>
            <p className="text-sm mb-6" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Ogrencileriniz icin beslenme planlari olusturun
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 stagger-children">
          {localPlans.map((plan) => {
            const planSupplements = (plan.supplements as SupplementItem[] | null) || [];

            return (
              <Card key={plan.id} className="animate-fade-in-up dashboard-card-hover" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
                <CardHeader className="pb-2 cursor-pointer" onClick={() =>
                  setExpandedPlan(expandedPlan === plan.id ? null : plan.id)
                }>
                  <div className="flex items-center justify-between">
                    <div>
                      {renamingPlanId === plan.id ? (
                        <Input
                          autoFocus
                          value={renameDraft}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          onBlur={() => savePlanRename(plan)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") savePlanRename(plan);
                            if (e.key === "Escape") setRenamingPlanId(null);
                          }}
                          className="text-base font-semibold h-auto py-1 px-2"
                          style={{
                            backgroundColor: "var(--dashboard-main-bg)",
                            borderColor: "var(--dashboard-card-border)",
                            color: "var(--dashboard-main-text)",
                          }}
                        />
                      ) : (
                        <CardTitle
                          className="text-base inline-flex items-center gap-2 group"
                          style={{ color: "var(--dashboard-main-text)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameDraft(plan.name);
                            setRenamingPlanId(plan.id);
                          }}
                          title="Tıklayıp adı değiştir"
                        >
                          {plan.name}
                          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </CardTitle>
                      )}
                      <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        {plan.meals.length} ogun
                        {planSupplements.length > 0 && ` • ${planSupplements.length} takviye`}
                      </p>
                      {plan.assignedCount > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex -space-x-2">
                            {plan.assignedStudentsPreview.map((s) => (
                              <div
                                key={s.id}
                                title={s.name}
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold"
                                style={{
                                  backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 20%, var(--dashboard-card-bg))",
                                  color: "var(--dashboard-accent)",
                                  borderColor: "var(--dashboard-card-bg)",
                                }}
                              >
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                            ))}
                          </div>
                          {plan.assignedCount > plan.assignedStudentsPreview.length && (
                            <span className="text-[11px] opacity-80" style={{ color: "var(--dashboard-main-text-muted)" }}>
                              +{plan.assignedCount - plan.assignedStudentsPreview.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs hidden md:flex gap-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        {plan.targetCalories && <span>{plan.targetCalories} kcal</span>}
                        {plan.targetProtein && <span className="text-blue-300">P:{plan.targetProtein}g</span>}
                        {plan.targetCarbs && <span className="text-orange-300">K:{plan.targetCarbs}g</span>}
                        {plan.targetFat && <span className="text-yellow-300">Y:{plan.targetFat}g</span>}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setAssignTarget({ id: plan.id, name: plan.name }); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded transition hover:opacity-90"
                        style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                      >
                        Ata
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDuplicate(plan.id); }}
                        className="text-xs px-2 py-1 transition" style={{ color: "var(--dashboard-main-text-muted)" }}>Kopyala</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}
                        className="text-xs text-red-400/50 hover:text-red-400 px-2 py-1">Sil</button>
                      <span style={{ color: "var(--dashboard-main-text-muted)" }}>{expandedPlan === plan.id ? "▲" : "▼"}</span>
                    </div>
                  </div>
                </CardHeader>

                {expandedPlan === plan.id && (
                  <CardContent className="pt-0 space-y-3">
                    {/* Makro Hedefler */}
                    <div className="grid grid-cols-4 gap-2 p-3 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))" }}>
                      <div className="text-center">
                        <p className="text-lg font-bold" style={{ color: "var(--dashboard-accent)" }}>{plan.targetCalories || "-"}</p>
                        <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>kcal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-300">{plan.targetProtein || "-"}</p>
                        <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Protein (g)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-300">{plan.targetCarbs || "-"}</p>
                        <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Karb (g)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-yellow-300">{plan.targetFat || "-"}</p>
                        <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Yag (g)</p>
                      </div>
                    </div>

                    {/* Koc Notlari */}
                    <div className="p-3 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Koc Notlari</span>
                        {editingNotesFor !== plan.id && (
                          <button
                            onClick={() => { setEditingNotesFor(plan.id); setNotesText(plan.coachNotes || ""); }}
                            className="text-xs px-2 py-1 rounded"
                            style={{ color: "var(--dashboard-accent)" }}
                          >
                            {plan.coachNotes ? "Duzenle" : "+ Not Ekle"}
                          </button>
                        )}
                      </div>
                      {editingNotesFor === plan.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            className="w-full rounded-md px-3 py-2 text-sm min-h-[80px]"
                            style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
                            placeholder="Ogrenciye gosterilecek notlar..."
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleSaveNotes(plan.id)} disabled={loading}
                              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                              className="font-semibold hover:opacity-90 text-xs h-8">
                              {loading ? "..." : "Kaydet"}
                            </Button>
                            <Button onClick={() => setEditingNotesFor(null)}
                              className="border rounded-md px-3 text-xs h-8"
                              style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                              Iptal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {plan.coachNotes || "Henuz not eklenmedi"}
                        </p>
                      )}
                    </div>

                    {/* Takviyeler */}
                    <div className="p-3 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Takviyeler ({planSupplements.length})</span>
                        <button
                          onClick={() => setAddingSupTo(addingSupTo === plan.id ? null : plan.id)}
                          className="text-xs px-2 py-1 rounded"
                          style={{ color: "var(--dashboard-accent)" }}
                        >
                          {addingSupTo === plan.id ? "Kapat" : "+ Takviye Ekle"}
                        </button>
                      </div>

                      {planSupplements.length > 0 && (
                        <div className="space-y-1.5 mb-2">
                          {planSupplements.map((supp, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1.5 text-sm" style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}>
                              <div>
                                <span className="font-medium">{supp.name}</span>
                                <span className="text-xs ml-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                                  {supp.dosage} &bull; {supp.timing}
                                </span>
                                {supp.notes && (
                                  <span className="text-xs ml-1" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
                                    ({supp.notes})
                                  </span>
                                )}
                              </div>
                              <button onClick={() => handleRemoveSupplement(plan.id, idx)}
                                className="text-xs text-red-400/50 hover:text-red-400 px-1">Kaldir</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {addingSupTo === plan.id && (
                        <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
                          <div className="flex gap-2">
                            <Input
                              value={existingSupSearch}
                              onChange={(e) => setExistingSupSearch(e.target.value)}
                              placeholder="Takviye ara..."
                              className="flex-1"
                              style={inputStyle}
                            />
                            <select
                              value={existingSupCategory}
                              onChange={(e) => setExistingSupCategory(e.target.value)}
                              className="rounded-md px-2 py-1 text-xs"
                              style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
                            >
                              <option value="">Tum Kategoriler</option>
                              {supplementCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                            {existingFilteredSupplements.slice(0, 15).map((supp, i) => (
                              <button
                                key={i}
                                onClick={() => handleAddSupplement(plan.id, {
                                  name: supp.name,
                                  dosage: supp.dosage,
                                  timing: supp.timing,
                                  notes: supp.notes,
                                })}
                                className="w-full text-left p-2 rounded text-sm transition"
                                style={{ color: "var(--dashboard-main-text)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--dashboard-card-bg)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{supp.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                                    {supp.category}
                                  </span>
                                </div>
                                <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>
                                  {supp.dosage} &bull; {supp.timing}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {planSupplements.length === 0 && addingSupTo !== plan.id && (
                        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Henuz takviye eklenmedi</p>
                      )}
                    </div>

                    {/* Ogunler */}
                    {plan.meals.map((meal) => {
                      const mealFoods = Array.isArray(meal.foods) ? (meal.foods as FoodItem[]) : [];
                      const totals = getMealTotals(mealFoods);
                      return (
                        <div key={meal.id} className="p-3 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>{meal.name}</span>
                              {meal.time && <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{meal.time}</span>}
                              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                                {totals.calories} kcal
                              </span>
                            </div>
                            <button onClick={() => handleDeleteMeal(plan.id, meal.id)}
                              className="text-xs text-red-400/50 hover:text-red-400">Sil</button>
                          </div>
                          {mealFoods.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="grid grid-cols-8 text-[10px] px-1" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
                                <span className="col-span-3">Besin</span>
                                <span className="text-right">Kalori</span>
                                <span className="text-right text-blue-300/60">P</span>
                                <span className="text-right text-orange-300/60">K</span>
                                <span className="text-right text-yellow-300/60">Y</span>
                                <span className="text-right text-red-300/60">S</span>
                              </div>
                              {mealFoods.map((food, i) => (
                                <div key={i} className="grid grid-cols-8 text-xs px-1 py-0.5 rounded" style={{ color: "var(--dashboard-main-text)", opacity: 0.7 }}>
                                  <span className="col-span-3 truncate">
                                    {food.name}
                                    <span className="text-[10px] ml-1" style={{ opacity: 0.5 }}>{food.portion}</span>
                                  </span>
                                  <span className="text-right font-medium">{food.calories}</span>
                                  <span className="text-right text-blue-300/70">{food.protein}</span>
                                  <span className="text-right text-orange-300/70">{food.carbs}</span>
                                  <span className="text-right text-yellow-300/70">{food.fat}</span>
                                  <span className="text-right text-red-300/70">{food.sugar || "-"}</span>
                                </div>
                              ))}
                              <div className="grid grid-cols-8 text-xs font-medium px-1 pt-1.5" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
                                <span className="col-span-3" style={{ color: "var(--dashboard-main-text-muted)" }}>Toplam</span>
                                <span className="text-right" style={{ color: "var(--dashboard-accent)" }}>{totals.calories}</span>
                                <span className="text-right text-blue-300">{totals.protein.toFixed(0)}</span>
                                <span className="text-right text-orange-300">{totals.carbs.toFixed(0)}</span>
                                <span className="text-right text-yellow-300">{totals.fat.toFixed(0)}</span>
                                <span className="text-right text-red-300">{totals.sugar.toFixed(0)}</span>
                              </div>
                            </div>
                          )}
                          <MealAlternativesEditor
                            domain={domain}
                            mealId={meal.id}
                            initialAlternatives={Array.isArray(meal.alternatives) ? (meal.alternatives as string[]) : []}
                          />
                        </div>
                      );
                    })}

                    {/* Ogun Ekle */}
                    {addingMealTo === plan.id ? (
                      <div className="pt-3 space-y-3" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <select
                              value={mealName}
                              onChange={(e) => setMealName(e.target.value)}
                              className={selectStyle}
                              style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
                            >
                              {mealOptions}
                            </select>
                          </div>
                          <Input value={mealTime} onChange={(e) => setMealTime(e.target.value)}
                            placeholder="Saat (08:00)"
                            className="w-28"
                            style={inputStyle} />
                        </div>

                        <div>
                          <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Besin ekle (arayin veya listeden secin):</label>
                          <FoodSearch onSelect={handleFoodSelect} />
                        </div>

                        {foods.length > 0 && (
                          <div className="rounded-lg p-3 space-y-1" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                            {renderFoodTable(
                              foods,
                              removeFood,
                              (idx, grams) => setFoods(updateFoodGrams(foods, idx, grams))
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button onClick={() => handleAddMeal(plan.id)} disabled={loading || !mealName.trim() || foods.length === 0}
                            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                            className="font-semibold hover:opacity-90 text-sm">
                            {loading ? "..." : `Ogunu Kaydet (${foods.length} besin)`}
                          </Button>
                          <Button onClick={() => { setAddingMealTo(null); setFoods([]); setMealName(""); }}
                            className="border rounded-md px-4 py-2 text-sm"
                            style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                            Iptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAddingMealTo(plan.id)}
                        className="w-full py-2 border border-dashed rounded-lg text-sm transition"
                        style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}>
                        + Ogun Ekle
                      </button>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <ImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={async (raw) => {
          const result = await importNutritionFromFile(domain, raw);
          if (result.success) router.refresh();
          return result;
        }}
        title="Beslenme Planı İçe Aktar"
        description="Düz metin, Excel/CSV veya JSON formatında hazır planını kütüphanene ekle."
        formatExample={NUTRITION_FORMAT_EXAMPLE}
        kind="nutrition"
      />
      <ConfirmDialog {...dialogProps} />

      <AssignToStudentsModal
        domain={domain}
        kind="nutrition"
        planId={assignTarget?.id ?? ""}
        planName={assignTarget?.name ?? ""}
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        onAssigned={() => {
          router.refresh();
        }}
      />
    </div>
  );
}

// ── Alternatif Öğün Editörü ──────────────────────────────────────────────
function MealAlternativesEditor({
  domain,
  mealId,
  initialAlternatives,
}: {
  domain: string;
  mealId: string;
  initialAlternatives: string[];
}) {
  const [open, setOpen] = useState(false);
  const [alts, setAlts] = useState<string[]>(initialAlternatives);
  const [newAlt, setNewAlt] = useState("");
  const [saving, setSaving] = useState(false);

  const persist = async (next: string[]) => {
    const prev = alts;
    setAlts(next);
    setSaving(true);
    const result = await setMealAlternatives(domain, mealId, next);
    setSaving(false);
    if (!result.success) {
      setAlts(prev);
      toast.error(("error" in result && result.error) || "Alternatif güncellenemedi");
    }
  };

  const addAlt = () => {
    const v = newAlt.trim();
    if (!v) return;
    if (alts.length >= 10) return;
    persist([...alts, v]);
    setNewAlt("");
  };

  const removeAlt = (idx: number) => {
    persist(alts.filter((_, i) => i !== idx));
  };

  return (
    <div className="mt-2 pt-2" style={{ borderTop: "1px dashed var(--dashboard-card-border)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] underline transition-opacity hover:opacity-80"
        style={{ color: "var(--dashboard-main-text-muted)" }}
      >
        Alternatif öğünler {alts.length > 0 && `(${alts.length})`} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {alts.length === 0 ? (
            <p className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Henüz alternatif yok. Öğrenci öğünü yiyemediğinde seçebileceği seçenekler ekle.
            </p>
          ) : (
            <ul className="space-y-1">
              {alts.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2 px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 8%, transparent)",
                    color: "var(--dashboard-main-text)",
                  }}
                >
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => removeAlt(i)}
                    className="text-red-400/70 hover:text-red-400"
                    aria-label={`${a} alternatifini kaldır`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAlt();
                }
              }}
              placeholder="Örn: Omlet + 2 dilim ekmek"
              className="text-xs h-7"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
              disabled={saving || alts.length >= 10}
            />
            <button
              type="button"
              onClick={addAlt}
              disabled={saving || !newAlt.trim() || alts.length >= 10}
              className="shrink-0 text-xs font-semibold px-3 py-1 rounded hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            >
              Ekle
            </button>
          </div>
          {alts.length >= 10 && (
            <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Max 10 alternatif.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
