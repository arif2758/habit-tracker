"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHabits } from "@/contexts/HabitContext";
import { CATEGORY_CONFIG } from "@/lib/constants";

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
    <Card>
      <CardHeader>
        <CardTitle>Top Habits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeHabits.map((habit) => (
          <div key={habit._id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{habit.name}</span>
                <span className="text-xs text-muted-foreground">
                  {CATEGORY_CONFIG[habit.category].label}
                </span>
              </div>
              <span className="font-semibold">
                {Math.round(habit.stats?.completionRate || 0)}%
              </span>
            </div>
            <Progress
              value={habit.stats?.completionRate || 0}
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
