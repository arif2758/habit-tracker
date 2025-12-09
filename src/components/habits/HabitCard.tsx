// src\components\habits\HabitCard.tsx
"use client";

import React, { useState } from "react";
import { MoreVertical, Trash2, Edit, Archive, Eye } from "lucide-react";
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
import { IconMap } from "@/components/icons";
import { getToday, isHexColor } from "@/lib/utils";
import type { Habit } from "@/lib/types";
import { HabitDetailModal } from "./HabitDetailModal";
import { EditHabitDialog } from "./EditHabitDialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { toggleCompletion, deleteHabit, archiveHabit } = useHabits();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const today = getToday();
  const todayCompletion = habit.completions.find((c) => c.date === today);
  const isCompleted = todayCompletion?.completed || false;

  const handleToggle = () => {
    toggleCompletion(habit._id, today);
  };

  const handleDelete = () => {
    deleteHabit(habit._id);
  };

  const handleArchive = () => {
    archiveHabit(habit._id);
  };

  // ✅ Get border color based on habit color - updated for border-l-2
  const getBorderStyle = () => {
    if (isHexColor(habit.color)) {
      return {
        borderLeftColor: isCompleted ? habit.color : `${habit.color}60`, // ✅ 60 instead of 40 for better visibility
        backgroundColor: isCompleted ? `${habit.color}15` : undefined,
      };
    }
    if (!isCompleted && COLOR_CONFIG[habit.color]) {
      return {
        borderLeftColor: `${habit.color}60`, // ✅ Slightly more visible
      };
    }
    return {};
  };

  const borderColorClass =
    !isHexColor(habit.color) && COLOR_CONFIG[habit.color]
      ? COLOR_CONFIG[habit.color].border
      : "";

  // Enhanced Checkbox style
  const getCheckboxStyle = () => {
    if (isCompleted && isHexColor(habit.color)) {
      return {
        backgroundColor: habit.color,
        borderColor: habit.color,
        boxShadow: `0 0 0 1px ${habit.color}`,
      };
    }
    return {};
  };

  // Checkbox dynamic class
  const checkboxClassName = cn(
    "h-7 w-7 rounded-full transition-all",
    "border-[2.5px]",
    isCompleted
      ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:shadow-md"
      : cn(
          "border-zinc-400 dark:border-zinc-500",
          "hover:border-primary/80 dark:hover:border-primary/70",
          "hover:shadow-sm hover:scale-105"
        )
  );

  return (
    <>
      <Card
        className={cn(
          "group cursor-pointer hover:shadow-md transition-all duration-200 py-3",
          "border-l-2", // ✅ Always apply border-l-2
          isCompleted ? borderColorClass : "border-primary/40",
          isCompleted && !isHexColor(habit.color) && "bg-primary/10"
        )}
        style={{
          ...getBorderStyle(),
          borderLeftWidth: isCompleted ? "4px" : "3px", // ✅ 4px when completed, 2px when not
        }}
        onClick={() => setIsDetailOpen(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Habit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Habit Info */}
            <div className="flex-1 space-y-">
              <div className="flex items-center gap-2">
                {habit.icon && (
                  <span className="text-xl flex items-center justify-center rounded-full bg-primary/1 text-primary">
                    {IconMap[habit.icon] ? (
                      React.createElement(IconMap[habit.icon], {
                        className: "h-5 w-5",
                      })
                    ) : (
                      <span className="text-lg leading-none">{habit.icon}</span>
                    )}
                  </span>
                )}
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                  {habit.name}
                </h3>
              </div>
              {habit.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Checkbox with better visibility */}
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggle}
              className={checkboxClassName}
              style={getCheckboxStyle()}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Detail Modal */}
      <HabitDetailModal
        habit={habit}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* Edit Dialog */}
      <EditHabitDialog
        habit={habit}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Habit?"
        description={`Are you sure you want to delete "${habit.name}"? This action cannot be undone and will permanently delete all habit data.`}
      />
    </>
  );
}
