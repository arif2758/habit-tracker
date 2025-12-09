// src\components\habits\HabitDetailModal.tsx
"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Habit } from "@/lib/types";
import { useStatistics } from "@/hooks/useStatistics";
import { getIcon } from "@/components/icons";
import { isHexColor, getContrastingTextColor } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
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
  const stats = useStatistics(habit || ({} as Habit));

  if (!habit) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = monthStart.getDay();
  const emptyCells = Array(firstDayOfWeek).fill(null);

  const isDateCompleted = (date: Date) => {
    return habit.completions.some(
      (c) => c.completed && isSameDay(new Date(c.date), date)
    );
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const habitColor = isHexColor(habit.color) ? habit.color : "hsl(var(--primary))";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
        aria-describedby="habit-detail-description"
      >
        {/* Compact Header - Fixed */}
        <DialogHeader className="relative p-4 border-b bg-muted/30 shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            {habit.icon && (
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: `${habitColor}20` }}
              >
                {React.createElement(getIcon(habit.icon), {
                  className: "h-5 w-5",
                  style: { color: habitColor },
                })}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold truncate">
                {habit.name}
              </DialogTitle>
              {habit.category && (
                <span className="text-xs text-muted-foreground capitalize">
                  {habit.category}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-5 space-y-5">
            {/* Compact Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              <StatBox
                label="Streak"
                value={stats.currentStreak}
                icon="🔥"
                color={habitColor}
              />
              <StatBox
                label="Best"
                value={stats.bestStreak}
                icon="🏆"
                color={habitColor}
              />
              <StatBox
                label="Month"
                value={stats.doneInMonth}
                icon="📅"
                color={habitColor}
              />
              <StatBox
                label="Total"
                value={stats.totalDone}
                icon="✅"
                color={habitColor}
              />
            </div>

            {/* Compact Progress */}
            <div className="rounded-xl bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Progress</span>
                <span className="font-bold" style={{ color: habitColor }}>
                  {stats.goalPercentage}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${stats.goalPercentage}%`,
                    backgroundColor: habitColor,
                  }}
                />
              </div>
            </div>

            {/* Compact Calendar */}
            <div className="space-y-3">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Activity</span>
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-1.5 rounded hover:bg-background"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold min-w-[90px] text-center">
                    {format(currentMonth, "MMM yyyy")}
                  </span>
                  <button
                    onClick={goToNextMonth}
                    className="p-1.5 rounded hover:bg-background"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div
                      key={i}
                      className="text-center text-xs font-bold text-muted-foreground pb-2"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Empty Cells */}
                  {emptyCells.map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Date Cells */}
                  {daysInMonth.map((day) => {
                    const completed = isDateCompleted(day);
                    const today = isToday(day);
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                    return (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all",
                          completed && "scale-105",
                          !completed && "hover:bg-muted/50",
                          today && !completed && "ring-2 ring-primary/50",
                          isWeekend && !completed && "text-muted-foreground/50"
                        )}
                        style={
                          completed
                            ? {
                                backgroundColor: habitColor,
                                color: isHexColor(habit.color)
                                  ? getContrastingTextColor(habit.color)
                                  : "white",
                              }
                            : {}
                        }
                      >
                        {format(day, "d")}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compact Legend */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: habitColor }}
                  />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded ring-2 ring-primary/50" />
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p id="habit-detail-description" className="sr-only">
          {habit.name} details
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Compact Stat Box
interface StatBoxProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function StatBox({ label, value, icon, color }: StatBoxProps) {
  return (
    <div className="rounded-xl bg-muted/50 p-3 text-center space-y-1">
      <div className="text-xl">{icon}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground font-semibold">
        {label}
      </div>
    </div>
  );
}