"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { useHabits } from "@/contexts/HabitContext";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function HabitProgress() {
  const { habits, getHabitStats } = useHabits();

  const activeHabits = habits
    .filter((h) => !h.archived)
    .map((h) => ({
      ...h,
      stats: getHabitStats(h._id),
    }))
    .sort(
      (a, b) => (b.stats?.completionRate || 0) - (a.stats?.completionRate || 0)
    )
    .slice(0, 5);

  if (activeHabits.length === 0) {
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
            Top Habits
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5">
            Highest completion rates
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {activeHabits.map((habit, index) => (
          <div key={habit._id} className="space-y-2 group">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 dark:bg-white/10 text-xs font-bold text-muted-foreground">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {habit.name}
                  </div>
                  <div className="text-xs text-muted-foreground/80">
                    {CATEGORY_CONFIG[habit.category].label}
                  </div>
                </div>
              </div>
              <span className="font-bold text-lg bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {Math.round(habit.stats?.completionRate || 0)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-primary to-primary/60 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${habit.stats?.completionRate || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
