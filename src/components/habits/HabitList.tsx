// src/components/habits/HabitList.tsx
"use client";

import React from "react";
import type { Habit } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToday } from "@/lib/utils";
import { HabitCard } from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
  emptyMessage?: string | React.ReactNode;
  onAddHabit?: () => void;
}

export function HabitList({
  habits,
  emptyMessage = "No habits found.",
  onAddHabit,
}: HabitListProps) {
  const today = getToday(); 

  // Sort habits logic updated
  const sortedHabits = [...habits].sort((a, b) => {
    const aCompletion = a.completions.find((c) => c.date === today);
    const bCompletion = b.completions.find((c) => c.date === today);

    const aCompleted = aCompletion?.completed || false;
    const bCompleted = bCompletion?.completed || false;

    // 1. Primary Sort: Unchecked first, then Checked
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }

    // 2. Secondary Sort: If both have same status (both checked OR both unchecked)
    // Sort by Creation Date (Oldest to Newest) -> New habits go to bottom
    // আগে এখানে updatedAt ছিল, এখন createdAt ব্যবহার করা হচ্ছে
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    return dateA - dateB;
  });

  if (habits.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <PlusCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No habits yet</h3>

        <div className="text-muted-foreground max-w-sm mb-6">
          {emptyMessage}
        </div>

        {onAddHabit && (
          <Button onClick={onAddHabit} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Habit
          </Button>
        )}
      </div> 
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 animate-slide-up">
      {sortedHabits.map((habit) => (
        <HabitCard key={habit._id} habit={habit} />
      ))}
    </div>
  );
}  