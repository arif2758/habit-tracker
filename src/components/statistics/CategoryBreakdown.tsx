"use client";

import React from "react";
import { useHabits } from "@/contexts/HabitContext";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { HabitCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBreakdown() {
  const { habits } = useHabits();

  // Count habits by category
  const categoryCounts = habits
    .filter((h) => !h.archived)
    .reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<HabitCategory, number>);

  const totalHabits = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const categoryData = Object.entries(CATEGORY_CONFIG)
    .map(([key, config]) => ({
      category: key as HabitCategory,
      label: config.label,
      count: categoryCounts[key as HabitCategory] || 0,
      percentage:
        totalHabits > 0
          ? Math.round(
              ((categoryCounts[key as HabitCategory] || 0) / totalHabits) * 100
            )
          : 0,
      color: config.color || "bg-primary", // Fallback color if not in config
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  if (categoryData.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6",
        "bg-white/40 dark:bg-white/5",
        "backdrop-blur-xl",
        "border border-white/40 dark:border-white/10",
        "transition-all duration-300",
        "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold leading-none tracking-tight text-xl">
            Categories
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5">
            Distribution by type
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {categoryData.map((item) => (
          <div key={item.category} className="space-y-2 group">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <span className="text-muted-foreground font-medium text-xs bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000 ease-out rounded-full opacity-80 group-hover:opacity-100",
                  item.color?.replace("text-", "bg-")
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
