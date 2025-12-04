"use client";

import React from "react";
import { CheckCircle2, Target, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useHabits } from "@/contexts/HabitContext";
import { getToday } from "@/lib/utils";

export function QuickStats() {
  const { getTodayHabits } = useHabits();
  const todayHabits = getTodayHabits();
  const today = getToday();

  const completedToday = todayHabits.filter(
    (h) => h.completions.find((c) => c.date === today)?.completed
  ).length;

  const completionRate =
    todayHabits.length > 0
      ? Math.round((completedToday / todayHabits.length) * 100)
      : 0;

  const stats = [
    {
      label: "Today's Habits",
      value: todayHabits.length,
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      desc: "Scheduled for today",
    },
    {
      label: "Completed",
      value: completedToday,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
      desc: "Habits done",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      desc: "Daily progress",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 bg-card/50 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.desc}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
