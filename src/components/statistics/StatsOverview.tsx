"use client";

import React from "react";
import { TrendingUp, Target, Flame, Calendar } from "lucide-react";
import { useHabits } from "@/contexts/HabitContext";
import { cn } from "@/lib/utils";

export function StatsOverview() {
  const { habits, getHabitStats } = useHabits();

  // Calculate overall stats
  const totalHabits = habits.filter((h) => !h.archived).length;

  const completionRates = habits
    .filter((h) => !h.archived)
    .map((h) => getHabitStats(h._id)?.completionRate || 0);

  const averageCompletion =
    completionRates.length > 0
      ? Math.round(
          completionRates.reduce((a, b) => a + b, 0) / completionRates.length
        )
      : 0;

  const longestStreak = Math.max(
    0,
    ...habits.map((h) => getHabitStats(h._id)?.longestStreak || 0)
  );

  const totalCompletions = habits.reduce((total, habit) => {
    const stats = getHabitStats(habit._id);
    return total + (stats?.totalCompletions || 0);
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PremiumStatCard
        title="Total Habits"
        value={totalHabits}
        icon={Target}
        description="Active habits"
        gradient="from-blue-500/15 via-cyan-500/10 to-transparent"
        glowColor="blue"
      />
      <PremiumStatCard
        title="Avg. Completion"
        value={`${averageCompletion}%`}
        icon={TrendingUp}
        description="Overall performance"
        gradient="from-emerald-500/15 via-green-500/10 to-transparent"
        glowColor="green"
      />
      <PremiumStatCard
        title="Longest Streak"
        value={longestStreak}
        icon={Flame}
        description="Days in a row"
        gradient="from-orange-500/15 via-red-500/10 to-transparent"
        glowColor="orange"
      />
      <PremiumStatCard
        title="Total Check-ins"
        value={totalCompletions}
        icon={Calendar}
        description="All time"
        gradient="from-purple-500/15 via-violet-500/10 to-transparent"
        glowColor="purple"
      />
    </div>
  );
}

interface PremiumStatCardProps {
  icon: React.ElementType;
  value: number | string;
  title: string;
  description: string;
  gradient: string;
  glowColor: string;
}

function PremiumStatCard({
  icon: Icon,
  value,
  title,
  description,
  gradient,
  glowColor,
}: PremiumStatCardProps) {
  const glowColors = {
    orange: "rgba(249, 115, 22, 0.15)", // orange-500
    yellow: "rgba(234, 179, 8, 0.15)", // yellow-500
    blue: "rgba(59, 130, 246, 0.15)", // blue-500
    green: "rgba(16, 185, 129, 0.15)", // emerald-500
    purple: "rgba(168, 85, 247, 0.15)", // purple-500
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5",
        "bg-white/50 dark:bg-white/5",
        "backdrop-blur-xl",
        "border border-white/60 dark:border-white/10",
        "transition-all duration-300",
        "hover:scale-[1.02] hover:-translate-y-1",
        "hover:shadow-xl",
        "shadow-sm"
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-100 transition-opacity",
          gradient
        )}
      />

      {/* Glow Effect on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          backgroundColor: glowColors[glowColor as keyof typeof glowColors],
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
            <Icon className="w-5 h-5 text-foreground/80" />
          </div>
          <div
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full backdrop-blur-md border border-white/20",
              "bg-white/30 dark:bg-white/5 text-muted-foreground"
            )}
          >
            {title}
          </div>
        </div>

        <div>
          <div className="text-3xl font-black tracking-tight mb-1 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wide">
            {description}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
    </article>
  );
}
