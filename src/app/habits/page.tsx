'use client';

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';

import { HabitList } from '@/components/habits/HabitList';
import type { HabitCategory } from '@/lib/types';
import { HabitFilters } from '@/components/habits/HabitFilters';

export default function HabitsPage() {
  const { habits } = useHabits();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  // Filter habits
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      // Filter archived
      if (habit.archived) return false;

      // Filter by search
      if (searchQuery && !habit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'all' && habit.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [habits, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Habits</h1>
          <p className="text-muted-foreground">
            Manage and track all your habits in one place
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredHabits.length} of {habits.filter(h => !h.archived).length} habits
        </div>
      </div>

      {/* Filters */}
      <HabitFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Habits List */}
      <HabitList
        habits={filteredHabits}
        emptyMessage={
          searchQuery || selectedCategory !== 'all'
            ? 'No habits match your filters.'
            : 'No habits yet.'
        }
      />
    </div>
  );
}