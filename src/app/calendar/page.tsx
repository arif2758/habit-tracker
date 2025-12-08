// src\app\calendar\page.tsx
"use client";

import React, { useState } from "react";
import { useHabits } from "@/contexts/HabitContext";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/components/icons";

export default function CalendarPage() {
  const { habits } = useHabits();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Create empty cells for days before the month starts
  const emptyCells = Array(firstDayOfWeek).fill(null);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getHabitsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return habits.filter((habit) =>
      habit.completions.some((c) => c.date === dateString && c.completed)
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar View</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-xl p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells */}
          {emptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Date cells */}
          {daysInMonth.map((day) => {
            const habitsForDay = getHabitsForDate(day);
            const isTodayDate = isToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square border border-border rounded-lg p-2 transition-all hover:shadow-md",
                  isTodayDate && "ring-2 ring-primary bg-primary/5",
                  isWeekend && "bg-muted/30"
                )}
              >
                <div className="flex flex-col h-full">
                  <div
                    className={cn(
                      "text-sm font-semibold mb-1",
                      isTodayDate && "text-primary",
                      isWeekend && !isTodayDate && "text-muted-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="flex-1 flex flex-wrap gap-1 content-start overflow-hidden">
                    {habitsForDay.slice(0, 4).map((habit) => {
                      // ✅ Default icon যদি icon না থাকে
                      const Icon = getIcon(habit.icon || "target");
                      return (
                        <div
                          key={habit._id} // ✅ habit.id এর পরিবর্তে habit._id
                          className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center"
                          title={habit.name}
                        >
                          <Icon className="w-3 h-3 text-primary" />
                        </div>
                      );
                    })}
                    {habitsForDay.length > 4 && (
                      <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-semibold">
                        +{habitsForDay.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-primary bg-primary/5" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/30" />
          <span>Weekend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20" />
          <span>Completed Habit</span>
        </div>
      </div>
    </div>
  );
}