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

  const selectedDateString = selectedDate.toISOString().split("T")[0];

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
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/settings">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="h-6 w-6" />
          </button>
        </Link>
        <h1 className="text-xl font-semibold">Today</h1>
        <Link href="/calendar">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Calendar className="h-6 w-6" />
          </button>
        </Link>
      </div>

      {/* Week Calendar */}
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Progress Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Progress</h2>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        <HabitList
          habits={dailyHabits}
          emptyMessage="No daily habits yet. Create your first habit to get started!"
        />
      </div>
    </div>
  );
}
