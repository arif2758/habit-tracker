"use client";

import React, { useState } from "react";
import { MoreVertical, Trash2, Edit, Archive } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useHabits } from "@/contexts/HabitContext";
import { COLOR_CONFIG } from "@/lib/constants";
import { getIcon } from "@/components/icons";
import { getToday } from "@/lib/utils";
import type { Habit } from "@/lib/types";
import { HabitDetailModal } from "./HabitDetailModal";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { toggleCompletion, deleteHabit, archiveHabit } = useHabits();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const today = getToday();
  const todayCompletion = habit.completions.find((c) => c.date === today);
  const isCompleted = todayCompletion?.completed || false;

  const handleToggle = () => {
    toggleCompletion(habit.id, today);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(habit.id);
    }
  };

  const handleArchive = () => {
    archiveHabit(habit.id);
  };

  // Get border color based on habit color
  const borderColorClass =
    COLOR_CONFIG[habit.color]?.border || "border-primary";

  return (
    <>
      <Card
        className={cn(
          "group cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
          borderColorClass
        )}
        onClick={() => setIsDetailOpen(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Checkbox */}
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isCompleted}
                onCheckedChange={handleToggle}
                className="h-6 w-6 rounded-full"
              />
            </div>

            {/* Habit Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {React.createElement(getIcon(habit.icon), {
                    className: "h-5 w-5",
                  })}
                </span>
                <h3 className="font-semibold leading-none tracking-tight">
                  {habit.name}
                </h3>
              </div>
              {habit.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>

      {/* Detail Modal */}
      <HabitDetailModal
        habit={habit}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
