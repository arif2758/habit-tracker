"use client";

import React from "react";
import { format, subDays, startOfWeek, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useHabits } from "@/contexts/HabitContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HeatmapCalendar() {
  const { habits } = useHabits();

  // Get last 12 weeks (84 days)
  const today = new Date();
  const startDate = subDays(today, 83);
  const weeks: Date[][] = [];

  let currentWeek: Date[] = [];
  let currentDate = startOfWeek(startDate);

  for (let i = 0; i < 84; i++) {
    currentWeek.push(currentDate);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate = addDays(currentDate, 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Calculate completions per day
  const getCompletionCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    let count = 0;

    habits.forEach((habit) => {
      const completion = habit.completions.find((c) => c.date === dateStr);
      if (completion?.completed) {
        count++;
      }
    });

    return count;
  };

  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-emerald-200 dark:bg-emerald-900";
    if (count === 2) return "bg-emerald-300 dark:bg-emerald-800";
    if (count === 3) return "bg-emerald-400 dark:bg-emerald-700";
    return "bg-emerald-500 dark:bg-emerald-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your habit completion over the last 12 weeks
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 pr-2 text-xs text-muted-foreground">
                <div className="h-3"></div>
                <div className="h-3">Mon</div>
                <div className="h-3"></div>
                <div className="h-3">Wed</div>
                <div className="h-3"></div>
                <div className="h-3">Fri</div>
                <div className="h-3"></div>
              </div>

              {/* Weeks */}
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const count = getCompletionCount(day);
                    const isToday = isSameDay(day, today);

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "h-3 w-3 rounded-sm transition-all hover:ring-2 hover:ring-primary",
                          getIntensityColor(count),
                          isToday && "ring-2 ring-primary"
                        )}
                        title={`${format(
                          day,
                          "MMM d, yyyy"
                        )}: ${count} habits completed`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-muted" />
              <div className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
              <div className="h-3 w-3 rounded-sm bg-emerald-300 dark:bg-emerald-800" />
              <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
              <div className="h-3 w-3 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
