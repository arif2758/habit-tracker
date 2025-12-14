"use client";

import React from "react";
import { StatsOverview } from "@/components/statistics/StatsOverview";
import { HabitProgress } from "@/components/statistics/HabitProgress";
import { HeatmapCalendar } from "@/components/statistics/HeatmapCalendar";
import { CategoryBreakdown } from "@/components/statistics/CategoryBreakdown";

export default function StatisticsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-white/20 dark:border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Statistics
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Track your progress, analyze your performance, and see how
            you&apos;re building better habits over time.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Heatmap */}
      <HeatmapCalendar />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HabitProgress />
        <CategoryBreakdown />
      </div>
    </div>
  );
}
