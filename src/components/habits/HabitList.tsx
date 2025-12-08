// src/components/habits/HabitList.tsx
"use client";
 
import React from "react";
import { HabitCard } from "./HabitCard";
import type { Habit } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HabitListProps {
  habits: Habit[];
  // পরিবর্তন ১: string এর বদলে React.ReactNode দেওয়া হলো যাতে টেক্সট বা JSX দুটোই সাপোর্ট করে
  emptyMessage?: string | React.ReactNode; 
  onAddHabit?: () => void;
}

export function HabitList({
  habits,
  emptyMessage = "No habits found.",
  onAddHabit,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <PlusCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
        
        {/* পরিবর্তন ২: <p> এর বদলে <div> ব্যবহার করা হয়েছে যাতে আপনি কাস্টম JSX পাস করলে হাইড্রেডশন এরর না হয় */}
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
      {habits.map((habit) => (
        <HabitCard key={habit._id} habit={habit} />
      ))}
    </div>
  );
}