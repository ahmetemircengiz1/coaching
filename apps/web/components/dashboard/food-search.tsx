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
              <div className="p-4 text-center text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Sonuç bulunamadı - Manuel olarak ekleyebilirsiniz
              </div>
            ) : (
              filtered.map((food, i) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
