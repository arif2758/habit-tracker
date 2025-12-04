"use client";

import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";

interface HabitCalendarProps {
  habit: Habit;
  onDateClick?: (date: string) => void;
}

export function HabitCalendar({ habit, onDateClick }: HabitCalendarProps) {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const completion = habit.completions.find((c) => c.date === dateStr);
    return completion?.completed || false;
  };

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h3>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month start */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Actual days */}
        {days.map((day) => {
          const isCompleted = getCompletionStatus(day);
          const isCurrent = isToday(day);
          const dateStr = format(day, "yyyy-MM-dd");

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick?.(dateStr)}
              className={cn(
                "aspect-square rounded-lg text-sm font-medium transition-all hover:scale-110",
                isCurrent && "ring-2 ring-primary ring-offset-2",
                isCompleted
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
                !isSameMonth(day, currentDate) && "opacity-30"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-500" />
          <span className="text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted" />
          <span className="text-muted-foreground">Incomplete</span>
        </div>
      </div>
    </div>
  );
}
