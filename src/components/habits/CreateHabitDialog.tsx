"use client";

import React, { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { HabitTemplates } from "./HabitTemplates";
import { useHabits } from "@/contexts/HabitContext";
import { CATEGORY_CONFIG, COLOR_OPTIONS } from "@/lib/constants";
import type { HabitCategory, HabitColor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CreateHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewMode = "templates" | "form";

export function CreateHabitDialog({
  open,
  onOpenChange,
}: CreateHabitDialogProps) {
  const { addHabit } = useHabits();
  const formRef = useRef<HTMLFormElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("templates");
  const [category, setCategory] = React.useState<HabitCategory>("health");
  const [selectedColor, setSelectedColor] = React.useState<HabitColor>("blue");
  const [frequency, setFrequency] = React.useState<"daily" | "weekly">("daily");
  const [description, setDescription] = React.useState("");

  const handleTemplateSelect = (template: {
    name: string;
    emoji: string;
    category: HabitCategory;
  }) => {
    // Directly create the habit with default values
    const habitData = {
      name: template.name,
      description: `Daily ${template.name} habit`,
      category: template.category,
      color: "blue" as HabitColor,
      icon: CATEGORY_CONFIG[template.category].icon,
      frequency: "daily" as const,
    };

    addHabit(habitData);

    // Reset and close
    setCategory("health");
    setSelectedColor("blue");
    setFrequency("daily");
    setDescription("");
    setViewMode("templates");
    onOpenChange(false);
  };

  const handleCustom = () => {
    setViewMode("form");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const habitData = {
      name: formData.get("name") as string,
      description: description,
      category: category,
      color: selectedColor,
      icon: CATEGORY_CONFIG[category].icon,
      frequency: frequency,
    };

    if (!habitData.name.trim()) return;

    addHabit(habitData);
    formRef.current?.reset();
    setCategory("health");
    setSelectedColor("blue");
    setFrequency("daily");
    setDescription("");
    setViewMode("templates");
    onOpenChange(false);
  };

  const handleBack = () => {
    setViewMode("templates");
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setViewMode("templates");
      setDescription("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[500px] gap-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {viewMode === "form" && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <DialogTitle className="text-xl">
              {viewMode === "templates" ? "Add Habit" : "Create Custom Habit"}
            </DialogTitle>
          </div>
          {viewMode === "templates" && (
            <DialogDescription>
              Choose from templates or create a custom habit
            </DialogDescription>
          )}
        </DialogHeader>

        {viewMode === "templates" ? (
          <HabitTemplates
            onSelectTemplate={handleTemplateSelect}
            onCreateCustom={handleCustom}
          />
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="grid gap-6 py-2"
          >
            {/* Habit Name */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Habit name..."
                required
                autoFocus
                className="text-base"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="description"
                  className="text-base font-semibold"
                >
                  Description
                </Label>
                <span className="text-sm text-muted-foreground">
                  {description.length} / 40
                </span>
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="Short habit description..."
                rows={2}
                maxLength={40}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none text-base"
              />
            </div>

            {/* Color Picker */}
            <div className="grid gap-2">
              <Label className="text-base font-semibold">Color</Label>
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <span className="text-sm">Select habit color</span>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        color.class,
                        selectedColor === color.value &&
                          "ring-2 ring-offset-2 ring-primary scale-110"
                      )}
                      aria-label={`Select ${color.value} color`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Frequency */}
            <div className="grid gap-2">
              <Label className="text-base font-semibold">Frequency</Label>
              <Select
                value={frequency}
                onValueChange={(value) =>
                  setFrequency(value as "daily" | "weekly")
                }
              >
                <SelectTrigger className="text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Every Day</SelectItem>
                  <SelectItem value="weekly">Specific Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as HabitCategory)}
              >
                <SelectTrigger className="text-base">
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold mt-4"
              size="lg"
            >
              Save
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
