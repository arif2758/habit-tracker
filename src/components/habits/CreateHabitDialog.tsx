// src\components\habits\CreateHabitDialog.tsx
"use client";

import React, { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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
import { ColorPicker } from "@/components/ui/color-picker";
import { HabitTemplates } from "./HabitTemplates";
import { useHabits } from "@/contexts/HabitContext";
import { CATEGORY_CONFIG } from "@/lib/constants";
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
  const { addHabit, habits } = useHabits();
  const formRef = useRef<HTMLFormElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("templates");

  // Form States
  const [category, setCategory] = React.useState<HabitCategory>("health");
  const [selectedColor, setSelectedColor] =
    React.useState<HabitColor>("#3b82f6");
  const [frequency, setFrequency] = React.useState<"daily" | "weekly">("daily");
  const [description, setDescription] = React.useState("");
  const [targetDays, setTargetDays] = React.useState<number[]>([]);
  const [habitName, setHabitName] = React.useState(""); // ✅ State for name

  // ---- TEMPLATE HANDLER ----
  const handleTemplateSelect = (template: {
    name: string;
    emoji: string;
    category: HabitCategory;
  }) => {
    const isDuplicate = habits.some(
      (h) =>
        h.name.toLowerCase().replace(/\s+/g, " ").trim() ===
          template.name.toLowerCase().replace(/\s+/g, " ").trim() && !h.archived
    );

    if (isDuplicate) {
      toast.error("Habit already exists", {
        description: `A habit with the name "${template.name}" already exists.`,
      });
      return;
    }

    const habitData = {
      name: template.name,
      description: `Daily ${template.name} habit`,
      category: template.category,
      color: "blue" as HabitColor,
      icon: template.emoji,
      frequency: "daily" as const,
    };

    addHabit(habitData);
    resetForm();
    onOpenChange(false);
  };

  const handleCustom = () => {
    setViewMode("form");
  };

  // ---- CUSTOM HABIT SUBMIT ----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!habitName.trim()) {
      toast.error("Name is required");
      return;
    }

    const isDuplicate = habits.some(
      (h) =>
        h.name.toLowerCase().replace(/\s+/g, " ").trim() ===
          habitName.toLowerCase().replace(/\s+/g, " ").trim() && !h.archived
    );

    if (isDuplicate) {
      toast.error("Habit already exists", {
        description: `A habit with the name "${habitName}" already exists.`,
      });
      return;
    }

    // ✅ habitName থেকে সরাসরি নেওয়া হচ্ছে, spaces preserve হবে
    const habitData = {
      name: habitName, // ✅ Multiple spaces সহ
      description: description,
      category: category,
      color: selectedColor,
      icon: "",
      frequency: frequency,
      ...(frequency === "weekly" && { targetDays }),
    };

    addHabit(habitData);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    formRef.current?.reset();
    setHabitName(""); // ✅ Reset name state
    setCategory("health");
    setSelectedColor("#3b82f6");
    setFrequency("daily");
    setDescription("");
    setTargetDays([]);
    setViewMode("templates");
  };

  const handleBack = () => {
    setViewMode("templates");
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setViewMode("templates");
      setDescription("");
      setHabitName(""); // ✅ Reset name
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[500px] gap-0 p-0 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header Section */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            {viewMode === "form" && (
              <button
                onClick={handleBack}
                className="p-1.5 -ml-2 mr-1 hover:bg-muted rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="space-y-1">
              <DialogTitle className="text-xl">
                {viewMode === "templates"
                  ? "Add New Habit"
                  : "Create Custom Habit"}
              </DialogTitle>
              {viewMode === "templates" && (
                <DialogDescription>
                  Choose a template or create your own
                </DialogDescription>
              )}
            </div> 
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {viewMode === "templates" ? (
            <HabitTemplates
              onSelectTemplate={handleTemplateSelect}
              onCreateCustom={handleCustom}
            />
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6">
              {/* Habit Name */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. 🏃  Morning Run"
                  required
                  autoFocus
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)} // ✅ Controlled input
                  className="h-12 text-base bg-muted/30"
                  style={{ whiteSpace: "pre-wrap" }}
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {description.length}/40
                  </span>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Why do you want to build this habit?"
                  rows={2}
                  maxLength={40}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none text-base bg-muted/30"
                />
              </div>

              {/* Color Picker */}
              <div className="grid gap-3">
                <Label className="text-sm font-medium">Color</Label>
                <ColorPicker
                  value={selectedColor as string}
                  onChange={(color) => setSelectedColor(color as HabitColor)}
                  presetColors={[
                    "#6900E1", // violet / electric purple
                    "#00E054", // bright green
                    "#003DE0", // royal blue
                    "#162329", // charcoal / deep gray
                    "#E15B07", // orange
                    "#1AB7E1", // sky blue / cyan-blue
                    "#ef4444", // red
                    "#E01B51", // magenta / rose pink
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value as HabitCategory)
                    }
                  >
                    <SelectTrigger className="h-11 bg-muted/30">
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
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Frequency</Label>
                  <Select
                    value={frequency}
                    onValueChange={(value) =>
                      setFrequency(value as "daily" | "weekly")
                    }
                  >
                    <SelectTrigger className="h-11 bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Every Day</SelectItem>
                      <SelectItem value="weekly">Specific Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Day Selector for Weekly */}
              {frequency === "weekly" && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-sm font-medium">Select Days</Label>
                  <div className="flex justify-between gap-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setTargetDays((prev) =>
                            prev.includes(index)
                              ? prev.filter((d) => d !== index)
                              : [...prev, index]
                          );
                        }}
                        className={cn(
                          "h-10 w-10 rounded-full text-sm font-semibold transition-all border",
                          targetDays.includes(index)
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background border-input hover:bg-muted hover:border-muted-foreground/50"
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                  size="lg"
                >
                  Create Habit
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
