"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHabits } from "@/contexts/HabitContext";
import { HabitList } from "@/components/habits/HabitList";
import { WeekCalendar } from "@/components/calendar/WeekCalendar";
import { Settings, Calendar } from "lucide-react";

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
    <div className="space-y-4 max-w-2xl mx-auto pb-24">
      {/* Header - Compact */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/settings">
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold">Today&apos;s Habits</h1>
        <Link href="/calendar">
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <Calendar className="h-5 w-5" />
          </button>
        </Link>
      </div>

      {/* Week Calendar - Compact */}
      <div className="px-2">
        <WeekCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      {/* ✅ Progress Section - Simple but Clear */}
      <div className="space-y-2 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            Progress
          </h2>
          <span className="text-sm font-bold text-primary">
            {completedCount}/{totalCount}
          </span>
        </div>
        {/* ✅ Enhanced Progress Bar - Simple & Clear */}
        <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden ">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Habits List - Compact */}
      <div className="px-2">
        <HabitList
          habits={dailyHabits}
          emptyMessage="No daily habits yet. Create your first habit to get started!"
        />
      </div>
    </div>
  );
}