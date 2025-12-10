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

  // ✅ FIX: ESLint Errors resolved 
  const getGlassStyle = () => {
    const isHex = isHexColor(habit.color);
    // ESLint fix: 'let' changed to 'const'
    const habitColor = isHex ? habit.color : "hsl(var(--primary))";

    // 1. Color Logic: Completed হলে ফুল কালার, না হলে ৬০% অপাসিটি
    const borderColor = isCompleted
      ? habitColor
      : isHex
      ? `${habitColor}60`
      : `${habitColor}60`;

    // Style object
    const style: React.CSSProperties = {
      borderColor: borderColor, // চারপাশের বর্ডার কালার সেট করা হলো
      borderLeftWidth: "4px", // বাম পাশের বর্ডার ফিক্সড মোটা রাখা হলো
    };

    // Background Gradient Logic (Only for completed)
    if (isCompleted && isHex) {
      style.background = `linear-gradient(to right, ${habitColor}15, transparent)`;
    }

    return style;
  };

  // ESLint fix: Removed unused 'borderColorClass' variable

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

  const checkboxClassName = cn(
    "h-7 w-7 rounded-full transition-all shrink-0",
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
      <div className="relative group">
        <Card
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all duration-300 py-3",

            
            "border",  "border-l-4",

            // ✅ Glass & Background
            "bg-background/40 dark:bg-background/20",
            "backdrop-blur-xl",

            // ✅ Hover Effects
            "hover:shadow-lg hover:scale-[1.02]",
            "active:scale-[0.98]",

            // ডিফল্ট বর্ডার কালার (যদি হেক্স না হয়)
            // ইনলাইন স্টাইল দিয়ে ওভাররাইড হবে, তবে ফলব্যাকের জন্য রাখা যেতে পারে
            !isHexColor(habit.color) ? "border-primary/40" : ""
          )}
          style={getGlassStyle()}
          onClick={() => setIsDetailOpen(true)}
        >
          {isCompleted && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isHexColor(habit.color)
                  ? `radial-gradient(circle at top left, ${habit.color}10, transparent 70%)`
                  : undefined,
              }}
            />
          )}

          {/* ✅ FIXED: Perfect Alignment */}
          <CardHeader className="relative flex flex-row items-center justify-between py-2 px-3 gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-background/95 backdrop-blur-xl border-white/10 dark:border-white/5"
                >
                  <DropdownMenuItem
                    onClick={() => setIsDetailOpen(true)}
                    className="hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Habit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleArchive}
                    className="hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 dark:bg-white/5" />
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Habit Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  {habit.icon && (
                    <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-sm shrink-0">
                      {IconMap[habit.icon] ? (
                        React.createElement(IconMap[habit.icon], {
                          className: "h-4 w-4 text-primary",
                        })
                      ) : (
                        <span className="text-sm leading-none">
                          {habit.icon}
                        </span>
                      )}
                    </div>
                  )}
                  <h3 className="font-semibold text-base leading-none tracking-tight">
                    {habit.name}
                  </h3>
                </div>
                {habit.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1 leading-tight">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center shrink-0"
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={handleToggle}
                className={checkboxClassName}
                style={getCheckboxStyle()}
              />
            </div>
          </CardHeader>
        </Card>
      </div>

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
