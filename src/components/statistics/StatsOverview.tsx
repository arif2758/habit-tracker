'use client';

import React from 'react';
import { TrendingUp, Target, Flame, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/contexts/HabitContext';

export function StatsOverview() {
  const { habits, getHabitStats } = useHabits();

  // Calculate overall stats
  const totalHabits = habits.filter(h => !h.archived).length;
  
  const completionRates = habits
    .filter(h => !h.archived)
    .map(h => getHabitStats(h.id)?.completionRate || 0);
  
  const averageCompletion = completionRates.length > 0
    ? Math.round(completionRates.reduce((a, b) => a + b, 0) / completionRates.length)
    : 0;

  const longestStreak = Math.max(
    0,
    ...habits.map(h => getHabitStats(h.id)?.longestStreak || 0)
  );

  const totalCompletions = habits.reduce((total, habit) => {
    const stats = getHabitStats(habit.id);
    return total + (stats?.totalCompletions || 0);
  }, 0);

  const stats = [
    {
      title: 'Total Habits',
      value: totalHabits,
      icon: Target,
      description: 'Active habits',
      color: 'text-blue-500',
    },
    {
      title: 'Avg. Completion',
      value: `${averageCompletion}%`,
      icon: TrendingUp,
      description: 'Overall performance',
      color: 'text-emerald-500',
    },
    {
      title: 'Longest Streak',
      value: longestStreak,
      icon: Flame,
      description: 'Days in a row',
      color: 'text-orange-500',
    },
    {
      title: 'Total Check-ins',
      value: totalCompletions,
      icon: Calendar,
      description: 'All time',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}