export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: HabitColor;
  icon: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  createdAt: string;
  updatedAt: string;
  completions: HabitCompletion[];
  archived: boolean;
}

export interface HabitCompletion {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  note?: string;
}

export type HabitCategory = 
  | 'health' 
  | 'learning' 
  | 'productivity' 
  | 'mindfulness' 
  | 'creativity' 
  | 'lifestyle'
  | 'other';

export type HabitColor = 
  | 'emerald' 
  | 'blue' 
  | 'purple' 
  | 'pink' 
  | 'orange' 
  | 'cyan'
  | 'red'
  | 'yellow';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  weekStart: 'sunday' | 'monday';
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