'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHabits } from '@/contexts/HabitContext';
import { CATEGORY_CONFIG } from '@/lib/constants';
import type { HabitCategory } from '@/lib/types';

export function CategoryBreakdown() {
  const { habits } = useHabits();

  // Count habits by category
  const categoryCounts = habits
    .filter(h => !h.archived)
    .reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<HabitCategory, number>);

  const totalHabits = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const categoryData = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
    category: key as HabitCategory,
    label: config.label,
    count: categoryCounts[key as HabitCategory] || 0,
    percentage: totalHabits > 0 
      ? Math.round(((categoryCounts[key as HabitCategory] || 0) / totalHabits) * 100)
      : 0,
  })).filter(item => item.count > 0);

  if (categoryData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habits by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryData.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}