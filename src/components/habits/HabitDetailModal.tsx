// src\components\habits\HabitDetailModal.tsx
"use client";

import React, { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Grid2x2Check,
  Medal,
  X,
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
  getDay,
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

  // Adjust first day to Saturday (0=Sat, 1=Sun, 2=Mon, ..., 6=Fri)
  const firstDayOfWeek = (monthStart.getDay() + 1) % 7;
  const emptyCells = Array(firstDayOfWeek).fill(null);

  const isDateCompleted = (date: Date) => {
    return habit.completions.some(
      (c) => c.completed && isSameDay(new Date(c.date), date)
    );
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const habitColor = isHexColor(habit.color)
    ? habit.color
    : "hsl(var(--primary))";

  // Check if day is weekend (Friday=5, Saturday=6)
  const isWeekend = (date: Date) => {
    const day = getDay(date);
    return day === 5 || day === 6;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 bg-background/95 dark:bg-background/90 backdrop-blur-2xl border-white/10 dark:border-white/5 [&>button]:hidden"
        aria-describedby="habit-detail-description"
      >
        {/* Header - Glassmorphism */}
        <header className="relative shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${habitColor}40 0%, transparent 100%)`,
            }}
          />

          <DialogHeader className="relative p-5 border-b border-white/10 dark:border-white/5">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors backdrop-blur-sm"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4 pr-10">
              {habit.icon && (
                <div
                  className="p-3 rounded-2xl backdrop-blur-sm border border-white/10 dark:border-white/5"
                  style={{
                    backgroundColor: `${habitColor}20`,
                    boxShadow: `0 8px 24px ${habitColor}15`,
                  }}
                >
                  {React.createElement(getIcon(habit.icon), {
                    className: "h-6 w-6",
                    style: { color: habitColor },
                  })}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <DialogTitle className=" font-bold mb-1">
                  {habit.name}
                </DialogTitle>
                {habit.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {habit.description}
                  </p>
                )}
                {habit.category && (
                  <span
                    className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10 dark:border-white/5"
                    style={{
                      backgroundColor: `${habitColor}15`,
                      color: habitColor,
                    }}
                  >
                    {habit.category.charAt(0).toUpperCase() +
                      habit.category.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>
        </header>

        {/* Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-5 space-y-5">
            <section aria-label="Statistics" className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <PremiumStatCard
                  icon={Grid2x2Check}
                  value={stats.currentStreak}
                  label="Current"
                  sublabel="Streak"
                  gradient="from-orange-500/15 via-red-500/10 to-transparent"
                  glowColor="orange"
                />
                <PremiumStatCard
                  icon={Medal}
                  value={stats.bestStreak}
                  label="Best"
                  sublabel="Streak"
                  gradient="from-yellow-500/15 via-amber-500/10 to-transparent"
                  glowColor="yellow"
                />
                <PremiumStatCard
                  icon={CalendarDays}
                  value={stats.doneInMonth}
                  label="This"
                  sublabel="Month"
                  gradient="from-blue-500/15 via-cyan-500/10 to-transparent"
                  glowColor="blue"
                />
                <PremiumStatCard
                  icon={BadgeCheck}
                  value={stats.totalDone}
                  label="Total"
                  sublabel="Done"
                  gradient="from-green-500/15 via-emerald-500/10 to-transparent"
                  glowColor="green"
                />
              </div>
            </section>

            {/* Calendar Section */}
            <section aria-label="Activity Calendar" className="space-y-3">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Activity</h3>
                <nav className="flex items-center gap-1 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-xl p-1 border border-white/20 dark:border-white/10">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <time className="px-3 py-1 text-sm font-bold min-w-[100px] text-center">
                    {format(currentMonth, "MMM yyyy")}
                  </time>
                  <button
                    onClick={goToNextMonth}
                    className="p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>

              {/* Calendar Grid */}
              <div className="rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-4">
                <div className="grid grid-cols-7 gap-2" role="grid">
                  {/* Day Headers - Starting from Saturday */}
                  {["S", "S", "M", "T", "W", "T", "F"].map((day, i) => (
                    <div
                      key={i}
                      className={cn(
                        "text-center text-xs font-bold pb-2",
                        // Saturday (0) & Friday (6) are weekends
                        i === 0 || i === 6
                          ? "text-muted-foreground/40"
                          : "text-muted-foreground"
                      )}
                      role="columnheader"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Empty Cells */}
                  {emptyCells.map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-square"
                      role="gridcell"
                    />
                  ))}

                  {/* Date Cells */}
                  {daysInMonth.map((day) => {
                    const completed = isDateCompleted(day);
                    const today = isToday(day);
                    const weekend = isWeekend(day);

                    return (
                      <div
                        key={day.toISOString()}
                        role="gridcell"
                        aria-label={`${format(day, "MMMM d, yyyy")}${
                          completed ? " - completed" : ""
                        }${weekend ? " - weekend" : ""}`}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
                          completed && "scale-105 shadow-md",
                          !completed &&
                            "hover:bg-white/10 dark:hover:bg-white/5 hover:scale-105",
                          today &&
                            !completed &&
                            "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
                          // Weekend - gray/low opacity
                          weekend &&
                            !completed &&
                            "opacity-30 text-muted-foreground pointer-events-none",
                          weekend && completed && "opacity-50"
                        )}
                        style={
                          completed
                            ? {
                                backgroundColor: habitColor,
                                color: isHexColor(habit.color)
                                  ? getContrastingTextColor(habit.color)
                                  : "white",
                                boxShadow: `0 4px 12px ${habitColor}30`,
                              }
                            : {}
                        }
                      >
                        <time dateTime={format(day, "yyyy-MM-dd")}>
                          {format(day, "d")}
                        </time>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-md shadow-sm"
                    style={{
                      backgroundColor: habitColor,
                      boxShadow: `0 2px 8px ${habitColor}30`,
                    }}
                  />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md ring-2 ring-primary/50 bg-background" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-muted/50 opacity-30" />
                  <span>Weekend</span>
                </div>
              </div>
            </section>
          </div>
        </main>

        <p id="habit-detail-description" className="sr-only">
          Detailed statistics and activity calendar for {habit.name} habit
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Premium Stat Card - Eye-catching but Minimal
interface PremiumStatCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  sublabel: string;
  gradient: string;
  glowColor: string;
}

function PremiumStatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  gradient,
  glowColor,
}: PremiumStatCardProps) {
  const glowColors = {
    orange: "rgba(249, 115, 22, 0.15)",
    yellow: "rgba(234, 179, 8, 0.15)",
    blue: "rgba(59, 130, 246, 0.15)",
    green: "rgba(34, 197, 94, 0.15)",
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl p-4",
        "bg-white/50 dark:bg-white/5",
        "backdrop-blur-xl",
        "border border-white/60 dark:border-white/10",
        "transition-all duration-300",
        "hover:scale-[1.03] hover:-translate-y-0.5",
        "hover:shadow-xl",
        "active:scale-[0.98]"
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn("absolute inset-0 bg-linear-to-br opacity-100", gradient)}
      />

      {/* Glow Effect on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{
          backgroundColor: glowColors[glowColor as keyof typeof glowColors],
        }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-between">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Icon className="w-6 h-6" />
        </div>

        {/* Value & Label */}
        <div className="flex-1 text-right ml-3">
          <div className="text-3xl font-bold leading-none mb-1.5 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-foreground/80 leading-none">
              {label}
            </div>
            <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide leading-none">
              {sublabel}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 dark:bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
    </article>
  );
}
