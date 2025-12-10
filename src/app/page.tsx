// src\app\page.tsx - কোন পরিবর্তন নেই, শুধু নিশ্চিত করুন max-w ঠিক আছে
"use client";

import React, { useState } from "react";

import { useHabits } from "@/contexts/HabitContext";
import { HabitList } from "@/components/habits/HabitList";
import { WeekCalendar } from "@/components/calendar/WeekCalendar";

export default function DashboardPage() {
  const { loading, habits } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date properly as YYYY-MM-DD
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const selectedDateString = `${year}-${month}-${day}`;

  // Show all daily habits (like a todo list)
  const dailyHabits = habits.filter(
    (h) => !h.archived && h.frequency === "daily"
  );

  const completedCount = dailyHabits.filter(
    (h: { completions: Array<{ date: string; completed: boolean }> }) => {
      return h.completions.find(
        (c: { date: string; completed: boolean }) =>
          c.date === selectedDateString
      )?.completed;
    }
  ).length;

  const totalCount = dailyHabits.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground animate-pulse">
            Loading your habits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Fixed Week Calendar & Progress - Centered, full width */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/5 dark:via-transparent pointer-events-none" />

        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="relative space-y-3 sm:mt-1">
            {/* Week Calendar */}
            <WeekCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Progress</h2>
                <span className="text-sm font-bold text-primary">
                  {completedCount}/{totalCount}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-gray-300 dark:bg-zinc-700/50 rounded-full overflow-hidden backdrop-blur-sm  ">
                <div
                  className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Spacer to push content down */}
      <div className="h-[140px]" />

      {/* Habits List - Scrollable - Centered */}
      <div className="max-w-2xl mx-auto px-4 pb-24 sm:mt-4">
        <HabitList
          habits={dailyHabits}
          emptyMessage="No daily habits yet. Create your first habit to get started!"
        />
      </div>
    </>
  );
}
