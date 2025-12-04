"use client";

import React, { useState } from "react";
import {
  Calendar,
  TrendingUp,
  Flame,
  Edit,
  Archive,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HabitCalendar } from "./HabitCalendar";
import { EditHabitDialog } from "./EditHabitDialog";
import { useHabits } from "@/contexts/HabitContext";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { Habit } from "@/lib/types";

interface HabitDetailDialogProps {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HabitDetailDialog({
  habit,
  open,
  onOpenChange,
}: HabitDetailDialogProps) {
  const { toggleCompletion, deleteHabit, archiveHabit, getHabitStats } =
    useHabits();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!habit) return null;

  const stats = getHabitStats(habit._id);

  const handleDateClick = (date: string) => {
    toggleCompletion(habit._id, date);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(habit._id);
      onOpenChange(false);
    }
  };

  const handleArchive = () => {
    archiveHabit(habit._id);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-2xl">{habit.name}</DialogTitle>
                {habit.description && (
                  <p className="text-muted-foreground">{habit.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {CATEGORY_CONFIG[habit.category].label}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {habit.frequency}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-1 rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flame className="h-4 w-4 text-orange-500" />
                Current Streak
              </div>
              <div className="text-2xl font-bold">
                {stats?.currentStreak || 0}
              </div>
            </div>

            <div className="space-y-1 rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Longest Streak
              </div>
              <div className="text-2xl font-bold">
                {stats?.longestStreak || 0}
              </div>
            </div>

            <div className="space-y-1 rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-blue-500" />
                Completion Rate
              </div>
              <div className="text-2xl font-bold">
                {Math.round(stats?.completionRate || 0)}%
              </div>
            </div>

            <div className="space-y-1 rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Total Days
              </div>
              <div className="text-2xl font-bold">
                {stats?.totalCompletions || 0}
              </div>
            </div>
          </div>

          <Separator />

          {/* Calendar */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Monthly Calendar</h3>
            <HabitCalendar habit={habit} onDateClick={handleDateClick} />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Habit
            </Button>
            <Button variant="outline" onClick={handleArchive} className="gap-2">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2 ml-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditHabitDialog
        habit={habit}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
