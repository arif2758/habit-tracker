'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/contexts/HabitContext';

export function StreakCard() {
  const { habits, getHabitStats } = useHabits();

  const bestStreak = habits
    .filter(h => !h.archived)
    .map(h => ({
      habit: h,
      streak: getHabitStats(h.id)?.currentStreak || 0,
    }))
    .sort((a, b) => b.streak - a.streak)[0];

  if (!bestStreak || bestStreak.streak === 0) {
    return null;
  }

  return (
    <Card className="bg-linear-to-br from-orange-500 to-red-500 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5" />
          Best Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-4xl font-bold">{bestStreak.streak} Days</p>
          <p className="text-sm opacity-90">{bestStreak.habit.name}</p>
        </div>
      </CardContent>
    </Card>
  );
}