// src\lib\types.ts
export interface Habit {
  _id: string; // MongoDB ID
  id?: string; // For backward compatibility
  name: string;
  description?: string;
  category: HabitCategory;
  color: HabitColor;
  icon?: string;
  frequency: "daily" | "weekly";
  targetDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  createdAt: string;
  updatedAt: string;
  completions: HabitCompletion[];
  streak?: number;
  archived: boolean;
}

export interface HabitCompletion {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  note?: string;
}

// ✅ Updated categories
export type HabitCategory =
  | "health"
  | "learning"
  | "productivity"
  | "mindfulness"
  | "spiritual"      // ✅ Added
  | "harmful"        // ✅ Added
  | "non-negotiable"; // ✅ Added

export type HabitColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "yellow"
  | string; // Support for custom hex colors

export interface AppSettings {
  theme: "light" | "dark" | "system";
  weekStart: "sunday" | "monday";
  notifications: boolean;
}

export interface AppData {
  habits: Habit[];
  settings: AppSettings;
  version: string;
}

export interface HabitStats {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  totalDays: number;
}