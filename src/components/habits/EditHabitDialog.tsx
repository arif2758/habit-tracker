"use client";

import React, { useRef } from "react";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabits } from "@/contexts/HabitContext";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { Habit, HabitCategory } from "@/lib/types";

interface EditHabitDialogProps {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({
  habit,
  open,
  onOpenChange,
}: EditHabitDialogProps) {
  const { updateHabit } = useHabits();
  const formRef = useRef<HTMLFormElement>(null);

  // ✅ Initialize state directly from habit prop (no useEffect needed)
  const [category, setCategory] = React.useState<HabitCategory>(
    habit?.category || "health"
  );
  const [frequency, setFrequency] = React.useState<"daily" | "weekly">(
    habit?.frequency === "custom" ? "daily" : habit?.frequency || "daily"
  );

  // ✅ Reset state when dialog opens with new habit
  React.useEffect(() => {
    if (open && habit) {
      setCategory(habit.category);
      setFrequency(habit.frequency === "custom" ? "daily" : habit.frequency);
    }
  }, [open, habit]);

  if (!habit) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const updates = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: category,
      color: CATEGORY_CONFIG[category].color,
      icon: CATEGORY_CONFIG[category].icon,
      frequency: frequency,
    };

    if (!updates.name.trim()) {
      return;
    }

    updateHabit(habit.id, updates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Update your habit details below.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Habit Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Habit Name *</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={habit.name}
              placeholder="e.g., Morning Exercise"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={habit.description}
              placeholder="What does this habit involve?"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category *</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as HabitCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="edit-frequency">Frequency *</Label>
            <Select
              value={frequency}
              onValueChange={(value) =>
                setFrequency(value as "daily" | "weekly")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Every Day</SelectItem>
                <SelectItem value="weekly">Specific Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Edit className="h-4 w-4" />
              Update Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
