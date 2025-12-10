// src\components\habits\HabitTemplates.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import type { HabitCategory } from "@/lib/types";

interface HabitTemplate {
  name: string;
  emoji: string;
  category: HabitCategory;
  description?: string;
}

const habitTemplates: Record<string, HabitTemplate[]> = {
  Sport: [
    { name: "Walk", emoji: "🚶", category: "health" },
    { name: "Run", emoji: "🏃", category: "health" },
    { name: "Yoga", emoji: "🧘", category: "health" },
    { name: "Exercise", emoji: "🏋️", category: "health" },
    { name: "Stretch", emoji: "🤸", category: "health" },
    { name: "Swim", emoji: "🏊", category: "health" },
    { name: "Cycling", emoji: "🚴", category: "health" },
    { name: "Dance", emoji: "💃", category: "health" },
    { name: "Interval Training", emoji: "⏱️", category: "health" },
  ],
  Health: [
    { name: "Drink Water", emoji: "💧", category: "health" },
    { name: "Take Vitamins", emoji: "💊", category: "health" },
    { name: "Healthy Meal", emoji: "🥗", category: "health" },
    { name: "Sleep Early", emoji: "😴", category: "health" },
    { name: "Meditation", emoji: "🧘‍♀️", category: "mindfulness" },
  ],
  Thought: [
    { name: "Journaling", emoji: "📝", category: "mindfulness" },
    { name: "Reading", emoji: "📚", category: "learning" },
    { name: "Gratitude", emoji: "🙏", category: "mindfulness" },
    { name: "Learn Something", emoji: "🎓", category: "learning" },
  ],
  Productivity: [
    { name: "Deep Work", emoji: "💻", category: "productivity" },
    { name: "Plan Tomorrow", emoji: "📅", category: "productivity" },
    { name: "Clean Workspace", emoji: "🧹", category: "productivity" }, // ✅ Changed from "social" to "productivity"
  ],
  Spiritual: [
    { name: "Prayer", emoji: "🤲", category: "spiritual" },
    { name: "Quran Reading", emoji: "📖", category: "spiritual" },
    { name: "Dhikr", emoji: "📿", category: "spiritual" },
    { name: "Charity", emoji: "💝", category: "spiritual" },
  ],
  "Non-Negotiable": [
    { name: "Fajr Prayer", emoji: "🌅", category: "non-negotiable" },
    { name: "Family Time", emoji: "👨‍👩‍👧", category: "non-negotiable" },
    { name: "No Screen Before Bed", emoji: "📵", category: "non-negotiable" },
  ],
  Harmful: [
    { name: "Quit Smoking", emoji: "🚭", category: "harmful" },
    { name: "Reduce Sugar", emoji: "🍬", category: "harmful" },
    { name: "Less Social Media", emoji: "📱", category: "harmful" },
    { name: "Avoid Junk Food", emoji: "🍔", category: "harmful" },
  ],
};

interface HabitTemplatesProps {
  onSelectTemplate: (template: HabitTemplate) => void;
  onCreateCustom: () => void;
}

export function HabitTemplates({
  onSelectTemplate,
  onCreateCustom,
}: HabitTemplatesProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Sport",
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-4">
      {/* Custom Habit Option */}
      <button
        onClick={onCreateCustom}
        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✏️</span>
          <span className="font-medium">Create Custom Habit</span>
        </div>
        <Plus className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
      </button> 

      {/* Template Categories */}
      {Object.entries(habitTemplates).map(([category, templates]) => {
        const isExpanded = expandedCategories.includes(category);

        return (
          <div key={category} className="border rounded-xl overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="font-semibold text-lg">{category}</span>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>

            {/* Template List */}
            {isExpanded && (
              <div className="divide-y">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => onSelectTemplate(template)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-2xl">{template.emoji}</span>
                    <span className="font-medium">{template.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}