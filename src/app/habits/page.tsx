"use client";

import React, { useState, useMemo } from "react";
import { useHabits } from "@/contexts/HabitContext";
import { HabitList } from "@/components/habits/HabitList";
import type { HabitCategory } from "@/lib/types";
import { HabitFilters } from "@/components/habits/HabitFilters";

export default function HabitsPage() {
  const { habits } = useHabits();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    HabitCategory | "all"
  >("all");

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (habit.archived) return false;
      if (
        searchQuery &&
        !habit.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedCategory !== "all" && habit.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [habits, searchQuery, selectedCategory]);

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden pb-28">
      {/* Responsive container - wider on desktop */}
      <div className="container mx-auto px-4 pt-6 space-y-5 max-w-2xl lg:max-w-4xl">
        {/* Header - Responsive */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-2xl font-bold tracking-tight">
            All Habits
          </h1>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Manage your goals</p>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground whitespace-nowrap">
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

        {/* List or Empty State */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-6xl">🎯</div>
            <h3 className="text-lg font-semibold text-foreground">
              {searchQuery || selectedCategory !== "all"
                ? "No habits found"
                : "No habits yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? "Try a different search term"
                : selectedCategory !== "all"
                ? "Try another category"
                : "Create your first habit to start tracking"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-sm font-medium px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors inline-block"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <HabitList habits={filteredHabits} emptyMessage={null} />
        )}
      </div>
    </div>
  );
}
