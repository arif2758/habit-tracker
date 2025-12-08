// src\components\habits\HabitDetailModal.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Calendar,
  Award,
  Flame,
} from "lucide-react";
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

  // Dynamic color based on habit color
  const habitColor = isHexColor(habit.color)
    ? habit.color
    : "hsl(var(--primary))";
  const bgGradient = isHexColor(habit.color)
    ? `linear-gradient(135deg, ${habit.color}15 0%, ${habit.color}05 100%)`
    : "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.02) 100%)";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ hideCloseButton prop যোগ করুন যদি available থাকে, না থাকলে CSS দিয়ে hide করুন */}
      <DialogContent
        className="max-w-lg max-h-[95vh] overflow-hidden p-0 gap-0 bg-linear-to-br from-background via-background to-muted/20 [&>button]:hidden"
        aria-describedby="habit-detail-description"
      >
        {/* Header Section with Gradient */}
        <div
          className="relative overflow-hidden"
          style={{ background: bgGradient }}
        >
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: "24px 24px",
                color: habitColor,
              }}
            />
          </div>

          <DialogHeader className="relative px-6 pt-6 pb-8 space-y-4">
            {/* ✅ Custom Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Habit Icon & Title */}
            <div className="flex items-start gap-4 pr-12">
              {habit.icon && (
                <div
                  className="relative p-4 rounded-2xl shadow-lg shrink-0 transition-transform hover:scale-105"
                  style={{
                    backgroundColor: habitColor,
                    boxShadow: `0 8px 24px ${habitColor}40`,
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/30 to-transparent" />

                  {React.createElement(getIcon(habit.icon), {
                    className: "h-8 w-8 relative z-10",
                    style: {
                      color: isHexColor(habit.color)
                        ? getContrastingTextColor(habit.color)
                        : "hsl(var(--primary-foreground))",
                    },
                  })}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <DialogTitle className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  {habit.name}
                </DialogTitle>
                {habit.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {habit.description}
                  </p>
                )}

                {/* Category Badge */}
                {habit.category && (
                  <div className="mt-3 inline-flex">
                    <span
                      className="text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm border shadow-sm"
                      style={{
                        backgroundColor: `${habitColor}20`,
                        borderColor: `${habitColor}30`,
                        color: isHexColor(habit.color)
                          ? habit.color
                          : "hsl(var(--primary))",
                      }}
                    >
                      {habit.category.charAt(0).toUpperCase() +
                        habit.category.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Flame className="h-5 w-5" />}
              label="Current Streak"
              value={stats.currentStreak}
              unit="days"
              color="from-orange-500 to-red-500"
              delay="0ms"
            />
            <StatCard
              icon={<Award className="h-5 w-5" />}
              label="Best Streak"
              value={stats.bestStreak}
              unit="days"
              color="from-yellow-500 to-orange-500"
              delay="75ms"
            />
            <StatCard
              icon={<Calendar className="h-5 w-5" />}
              label="This Month"
              value={stats.doneInMonth}
              unit="days"
              color="from-blue-500 to-cyan-500"
              delay="150ms"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Total Done"
              value={stats.totalDone}
              unit="days"
              color="from-green-500 to-emerald-500"
              delay="225ms"
            />
          </div>

          {/* Completion Rate */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-muted/50 to-muted/20 border border-border/50 p-5 backdrop-blur-sm">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground/80">
                  Completion Rate
                </span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: habitColor }}
                >
                  {stats.goalPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${stats.goalPercentage}%`,
                    background: `linear-gradient(90deg, ${habitColor} 0%, ${habitColor}dd 100%)`,
                    boxShadow: `0 0 20px ${habitColor}60`,
                  }}
                >
                  {/* Shine animation */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <TrendingUp className="w-full h-full" strokeWidth={1} />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Activity Calendar
              </h3>
              <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-lg hover:bg-background transition-colors active:scale-95"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm font-bold min-w-[120px] text-center">
                  {format(currentMonth, "MMM yyyy")}
                </span>
                <button
                  onClick={goToNextMonth}
                  className="p-2 rounded-lg hover:bg-background transition-colors active:scale-95"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="rounded-2xl bg-linear-to-br from-muted/30 to-transparent border border-border/50 p-4 backdrop-blur-sm">
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div
                    key={i}
                    className="text-center text-xs font-bold text-muted-foreground/60 pb-2"
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
                        "aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                        completed && "shadow-md hover:scale-110",
                        !completed && "hover:bg-muted/50 hover:scale-105",
                        today &&
                          !completed &&
                          "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
                        isWeekend && !completed && "text-muted-foreground/50"
                      )}
                      style={
                        completed
                          ? {
                              backgroundColor: habitColor,
                              color: isHexColor(habit.color)
                                ? getContrastingTextColor(habit.color)
                                : "hsl(var(--primary-foreground))",
                              boxShadow: `0 4px 12px ${habitColor}40`,
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

            {/* Calendar Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-md shadow-sm"
                  style={{
                    backgroundColor: habitColor,
                    boxShadow: `0 2px 8px ${habitColor}40`,
                  }}
                />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md ring-2 ring-primary/50 bg-background" />
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden description for accessibility */}
        <p id="habit-detail-description" className="sr-only">
          Detailed view of {habit.name} habit including statistics and calendar
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  delay: string;
}

function StatCard({ icon, label, value, unit, color, delay }: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-muted/50 to-muted/20 border border-border/50 p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: delay }}
    >
      {/* Gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
          color
        )}
      />

      <div className="relative z-10 space-y-2">
        <div
          className={cn(
            "inline-flex p-2 rounded-xl bg-linear-to-br text-white shadow-lg",
            color
          )}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {value}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5">
        {icon}
      </div>
    </div>
  );
}
