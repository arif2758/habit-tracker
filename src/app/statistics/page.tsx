'use client';

import React from 'react';
import { StatsOverview } from '@/components/statistics/StatsOverview';
import { HabitProgress } from '@/components/statistics/HabitProgress';
import { HeatmapCalendar } from '@/components/statistics/HeatmapCalendar';
import { CategoryBreakdown } from '@/components/statistics/CategoryBreakdown';

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">
          Track your progress and see how you&apos;re doing
        </p>
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