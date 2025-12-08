"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularProgress } from "@/components/ui/circular-progress";
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
      value: `${stats.currentStreak}`,
      unit: "days",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: "🏆",
      label: "Best streak",
      value: `${stats.bestStreak}`,
      unit: "days",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: "📅",
      label: "This month",
      value: `${stats.doneInMonth}`,
      unit: "days",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: "✅",
      label: "Total done",
      value: `${stats.totalDone}`,
      unit: "days",
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        style={
          isHexColor(habit.color)
            ? {
                borderColor: habit.color,
                borderTopColor: habit.color,
                borderTopWidth: "4px",
              }
            : {}
        }
      >
        <DialogHeader
          style={
            isHexColor(habit.color)
              ? {
                  backgroundColor: `${habit.color}15`,
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                }
              : {
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                }
          }
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {habit.icon && (
                <div
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={
                    isHexColor(habit.color)
                      ? {
                          backgroundColor: habit.color,
                        }
                      : {}
                  }
                >
                  <span
                    style={
                      isHexColor(habit.color)
                        ? {
                            color: getContrastingTextColor(habit.color),
                          }
                        : {}
                    }
                  >
                    {React.createElement(getIcon(habit.icon), {
                      className: "h-6 w-6",
                      style: isHexColor(habit.color)
                        ? {
                            color: getContrastingTextColor(habit.color),
                          }
                        : {},
                    })}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <DialogTitle className="text-2xl">{habit.name}</DialogTitle>
                {habit.description && (
                  <p className="text-sm text-muted-foreground mt-1.5">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>
            {habit.category && (
              <div className="flex gap-2">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {habit.category}
                </span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Calendar
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-muted">
                  {format(currentMonth, "MMM yyyy")}
                </span>
                <button
                  onClick={goToNextMonth}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
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
                  className="text-center text-xs font-semibold text-muted-foreground p-2 uppercase"
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

                const getCompletedStyle = () => {
                  if (isCompleted && isHexColor(habit.color)) {
                    return {
                      backgroundColor: habit.color,
                      color: getContrastingTextColor(habit.color),
                    };
                  }
                  return {};
                };

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all",
                      isCompleted &&
                        !isHexColor(habit.color) &&
                        "bg-primary text-primary-foreground shadow-sm",
                      isCompleted && isHexColor(habit.color) && "shadow-sm",
                      isToday &&
                        !isCompleted &&
                        "ring-2 ring-primary ring-opacity-50",
                      isWeekend &&
                        !isCompleted &&
                        "text-red-500/70 dark:text-red-400/70",
                      !isCompleted && !isWeekend && "text-foreground/70",
                      !isCompleted && "hover:bg-muted/50"
                    )}
                    style={getCompletedStyle()}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {statItems.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                  <div className={cn("text-2xl font-bold mt-1", stat.color)}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Completion Rate */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Completion Rate</span>
                <span className="text-lg font-bold text-primary">
                  {stats.goalPercentage}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${stats.goalPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
