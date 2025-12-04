"use client";

import React, { useState } from "react";
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
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="w-full">
      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200",
                "hover:bg-muted/50",
                isSelected &&
                  isTodayDate &&
                  "bg-primary text-primary-foreground shadow-lg scale-105",
                isSelected &&
                  !isTodayDate &&
                  "ring-2 ring-primary bg-background",
                !isSelected && "bg-background border border-border"
              )}
            >
              <span className="text-xs font-medium uppercase mb-1 opacity-60">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "text-2xl font-bold",
                  isTodayDate && isSelected && "text-primary-foreground",
                  !isSelected && "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>
              {isTodayDate && isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
