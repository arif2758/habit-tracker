"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularProgress } from "@/components/ui/circular-progress";
import type { Habit } from "@/lib/types";
import { useStatistics } from "@/hooks/useStatistics";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";

interface HabitDetailModalProps {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HabitDetailModal({
  habit,
  open,
  onOpenChange,
}: HabitDetailModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Call hooks unconditionally at the top
  const stats = useStatistics(habit || ({} as Habit));

  // Early return after all hooks
  if (!habit) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Create empty cells for days before the month starts
  const emptyCells = Array(firstDayOfWeek).fill(null);

  const isDateCompleted = (date: Date) => {
    return habit.completions.some(
      (c) => c.completed && isSameDay(new Date(c.date), date)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const statItems = [
    {
      icon: "🔥",
      label: "Current streak",
      value: `${stats.currentStreak} times`,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: "🏆",
      label: "Best streak",
      value: `${stats.bestStreak} times`,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: "📅",
      label: "Done in month",
      value: `${stats.doneInMonth} days`,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: "✅",
      label: "Total done",
      value: `${stats.totalDone} days`,
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{habit.icon}</span>
              <DialogTitle>{habit.name}</DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {format(currentMonth, "MMM yyyy")}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-medium text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells */}
              {emptyCells.map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Date cells */}
              {daysInMonth.map((day) => {
                const isCompleted = isDateCompleted(day);
                const isToday = isSameDay(day, new Date());
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-lg text-sm transition-colors",
                      isCompleted &&
                        "bg-primary text-primary-foreground font-semibold",
                      isToday && !isCompleted && "ring-2 ring-primary",
                      isWeekend &&
                        !isCompleted &&
                        "text-red-500 dark:text-red-400",
                      !isCompleted && !isWeekend && "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center gap-6">
            <CircularProgress value={stats.goalPercentage} size={100} />

            <div className="flex-1 space-y-3">
              {statItems.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-lg">{stat.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className={cn("font-semibold", stat.color)}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
