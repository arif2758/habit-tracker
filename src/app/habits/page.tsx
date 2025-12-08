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

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (habit.archived) return false;
      if (searchQuery && !habit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'all' && habit.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [habits, searchQuery, selectedCategory]);

  return (
    // overflow-x-hidden এবং w-full অত্যন্ত জরুরি
    <div className="w-full min-h-screen bg-background overflow-x-hidden pb-28">
      
      {/* max-w-lg এবং mx-auto ব্যবহার করে কন্টেন্ট মাঝখানে রাখা হয়েছে */}
      <div className="container mx-auto px-4 pt-6 space-y-6 max-w-lg">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">All Habits</h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Manage your goals</p>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {filteredHabits.length} shown
            </span>
          </div>
        </div>

        {/* Filters */}
        <HabitFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* List */}
        <HabitList
          habits={filteredHabits}
          emptyMessage={
            <div className="text-center py-8 text-muted-foreground text-sm">
               No habits found.
            </div>
          }
        />
      </div>
    </div>
  );
}