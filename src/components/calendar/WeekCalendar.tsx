"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
} 

export function WeekCalendar({
  selectedDate,
  onDateSelect,
}: WeekCalendarProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="w-full px-1">
      {/* Week Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg",
                "transition-all duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                // Today + Selected state
                isSelected &&
                  isTodayDate &&
                  "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/95",
                // Selected but not today
                isSelected &&
                  !isTodayDate &&
                  "bg-primary/10 ring-1.5 ring-primary text-foreground hover:bg-primary/15",
                // Not selected, today
                !isSelected &&
                  isTodayDate &&
                  "bg-muted text-foreground hover:bg-muted/80 border border-primary/30",
                // Not selected, not today
                !isSelected &&
                  !isTodayDate &&
                  "bg-card text-foreground hover:bg-muted/40 border border-border/50"
              )}
            >
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-tighter opacity-70">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "text-sm sm:text-lg font-bold mt-0.5 leading-none",
                  isTodayDate && isSelected && "text-primary-foreground",
                  isTodayDate && !isSelected && "text-primary"
                )}
              >
                {format(day, "d")}
              </span>
              {isTodayDate && isSelected && (
                <div className="w-1 h-1 rounded-full bg-primary-foreground mt-1" />
              )}
              {isTodayDate && !isSelected && (
                <div className="w-1 h-1 rounded-full bg-primary mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
