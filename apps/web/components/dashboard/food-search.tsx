"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { FOOD_DATABASE, type FoodData } from "@/lib/data/food-database";

interface FoodSearchProps {
  onSelect: (food: FoodData) => void;
  placeholder?: string;
}

export default function FoodSearch({ onSelect, placeholder = "Besin ara veya listeden seç..." }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Custom besin formu state'i — listede olmayan besinler için
  const [customOpen, setCustomOpen] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    portion: "1 porsiyon",
    portionGrams: 100,
  });

  const categories = useMemo(
    () => [...new Set(FOOD_DATABASE.map((f) => f.category))],
    []
  );

  const filtered = useMemo(() => {
    let items = FOOD_DATABASE;

    if (selectedCategory) {
      items = items.filter((f) => f.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    return items.slice(0, 50);
  }, [query, selectedCategory]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (food: FoodData) => {
    onSelect(food);
    setQuery("");
    setShowDropdown(false);
  };

  const openCustomForm = () => {
    setCustomForm((prev) => ({
      ...prev,
      name: query.trim(),
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }));
    setCustomOpen(true);
  };

  const handleAddCustom = () => {
    const name = customForm.name.trim();
    if (!name) return;
    const grams = customForm.portionGrams > 0 ? customForm.portionGrams : 100;
    // Custom besin: girilen değerler porsiyon başına. FoodData "per 100g" ister,
    // bu yüzden grams'a göre 100g'lık birim değerlere çeviriyoruz.
    const factor = 100 / grams;
    const custom: FoodData = {
      name,
      category: "Özel",
      calories: customForm.calories * factor,
      protein: customForm.protein * factor,
      carbs: customForm.carbs * factor,
      fat: customForm.fat * factor,
      sugar: 0,
      fiber: 0,
      portion: customForm.portion || "1 porsiyon",
      portionGrams: grams,
    };
    onSelect(custom);
    setCustomOpen(false);
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.5 }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="pl-9 text-sm"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            borderColor: "var(--dashboard-card-border)",
            color: "var(--dashboard-main-text)",
          }}
        />
      </div>

      {showDropdown && (
        <div
          className="absolute z-50 top-full mt-1 w-full max-h-80 overflow-y-auto rounded-xl shadow-2xl border"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            borderColor: "var(--dashboard-card-border)",
          }}
        >
          {/* Category chips */}
          <div
            className="sticky top-0 p-2 flex gap-1.5 flex-wrap z-10"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              borderBottom: "1px solid var(--dashboard-card-border)",
            }}
          >
            <button
              onClick={() => setSelectedCategory("")}
              className="px-2 py-1 rounded-md text-[11px] transition"
              style={
                !selectedCategory
                  ? { backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)", fontWeight: 600 }
                  : { backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }
              }
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? "" : cat)
                }
                className="px-2 py-1 rounded-md text-[11px] transition"
                style={
                  selectedCategory === cat
                    ? { backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)", fontWeight: 600 }
                    : { backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          <div>
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-sm space-y-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                <p>Sonuç bulunamadı</p>
                <button
                  type="button"
                  onClick={openCustomForm}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold border border-dashed"
                  style={{ borderColor: "var(--dashboard-accent)", color: "var(--dashboard-accent)" }}
                >
                  + Yeni besin ekle{query.trim() ? `: “${query.trim()}”` : ""}
                </button>
              </div>
            ) : (
              <>
              {/* Sonuçlar varken de en üste "+ Yeni besin" eklemeyi kolaylaştır */}
              <button
                type="button"
                onClick={openCustomForm}
                className="w-full px-3 py-2 text-left text-xs font-semibold transition"
                style={{
                  borderBottom: "1px solid var(--dashboard-card-border)",
                  color: "var(--dashboard-accent)",
                }}
              >
                + Listede yok mu? Manuel besin ekle{query.trim() ? `: “${query.trim()}”` : ""}
              </button>
              {filtered.map((food, i) => (
                <button
                  key={`${food.name}-${i}`}
                  onClick={() => handleSelect(food)}
                  className="w-full px-3 py-2.5 transition text-left"
                  style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--dashboard-main-text)" }}>{food.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
                        {food.portion} ({food.portionGrams}g)
                      </p>
                    </div>
                    <div className="text-right ml-3 shrink-0">
                      <p className="text-xs font-medium" style={{ color: "var(--dashboard-accent)" }}>
                        {Math.round(food.calories * food.portionGrams / 100)} kcal
                      </p>
                      <div className="flex gap-2 text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        <span className="text-blue-300">P:{(food.protein * food.portionGrams / 100).toFixed(0)}g</span>
                        <span className="text-orange-300">K:{(food.carbs * food.portionGrams / 100).toFixed(0)}g</span>
                        <span className="text-yellow-300">Y:{(food.fat * food.portionGrams / 100).toFixed(0)}g</span>
                        {food.sugar > 0 && (
                          <span className="text-red-300">Ş:{(food.sugar * food.portionGrams / 100).toFixed(0)}g</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom besin formu — basit modal */}
      {customOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setCustomOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border p-5 space-y-4"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="font-semibold text-base">Manuel Besin Ekle</h3>
              <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Değerleri 1 porsiyon (girdiğin gram) için yaz.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Besin adı</label>
                <Input
                  value={customForm.name}
                  onChange={(e) => setCustomForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ör: Ev yapımı omlet"
                  style={{
                    backgroundColor: "var(--dashboard-main-bg)",
                    borderColor: "var(--dashboard-card-border)",
                    color: "var(--dashboard-main-text)",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Porsiyon adı</label>
                  <Input
                    value={customForm.portion}
                    onChange={(e) => setCustomForm((p) => ({ ...p, portion: e.target.value }))}
                    placeholder="1 porsiyon"
                    style={{
                      backgroundColor: "var(--dashboard-main-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Porsiyon gram</label>
                  <Input
                    type="number"
                    min={1}
                    value={customForm.portionGrams}
                    onChange={(e) => setCustomForm((p) => ({ ...p, portionGrams: Number(e.target.value) || 0 }))}
                    style={{
                      backgroundColor: "var(--dashboard-main-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Kalori</label>
                  <Input
                    type="number"
                    min={0}
                    value={customForm.calories}
                    onChange={(e) => setCustomForm((p) => ({ ...p, calories: Number(e.target.value) || 0 }))}
                    style={{
                      backgroundColor: "var(--dashboard-main-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Protein (g)</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={customForm.protein}
                    onChange={(e) => setCustomForm((p) => ({ ...p, protein: Number(e.target.value) || 0 }))}
                    style={{
                      backgroundColor: "var(--dashboard-main-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Karb. (g)</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={customForm.carbs}
                    onChange={(e) => setCustomForm((p) => ({ ...p, carbs: Number(e.target.value) || 0 }))}
                    style={{
                      backgroundColor: "var(--dashboard-main-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Yağ (g)</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={customForm.fat}
                    onChange={(e) => setCustomForm((p) => ({ ...p, fat: Number(e.target.value) || 0 }))}
                    style={{
                      backgroundColor: "var(--dashboard-main-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setCustomOpen(false)}
                className="px-3 py-1.5 rounded-md text-sm border"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  backgroundColor: "transparent",
                  color: "var(--dashboard-main-text)",
                }}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleAddCustom}
                disabled={!customForm.name.trim()}
                className="px-3 py-1.5 rounded-md text-sm font-semibold disabled:opacity-50"
                style={{
                  backgroundColor: "var(--dashboard-accent)",
                  color: "var(--dashboard-accent-text)",
                }}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
