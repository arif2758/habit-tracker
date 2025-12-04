'use client';

import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { HabitList } from '@/components/habits/HabitList';

export default function ArchivedPage() {
  const { habits } = useHabits();
  const archivedHabits = habits.filter(h => h.archived);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archived Habits</h1>
        <p className="text-muted-foreground">
          View and restore your archived habits
        </p>
      </div>

      <HabitList
        habits={archivedHabits}
        emptyMessage="No archived habits."
      />
    </div>
  );
}