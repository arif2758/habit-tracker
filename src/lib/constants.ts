import { HabitCategory, HabitColor } from "./types";

export const CATEGORY_CONFIG: Record<
  HabitCategory,
  {
    label: string;
    icon: string;
    color: HabitColor;
  }
> = {
  health: {
    label: "Health & Fitness",
    icon: "Dumbbell",
    color: "emerald",
  },
  learning: {
    label: "Learning",
    icon: "BookOpen",
    color: "blue",
  },
  productivity: {
    label: "Productivity",
    icon: "Target",
    color: "purple",
  },
  mindfulness: {
    label: "Mindfulness",
    icon: "Brain",
    color: "pink",
  },
  creativity: {
    label: "Creativity",
    icon: "Palette",
    color: "orange",
  },
  lifestyle: {
    label: "Lifestyle",
    icon: "Home",
    color: "cyan",
  },
  other: {
    label: "Other",
    icon: "Star",
    color: "yellow",
  },
};

export const COLOR_CONFIG: Record<
  HabitColor,
  {
    bg: string;
    text: string;
    border: string;
    hover: string;
  }
> = {
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-500",
    border: "border-emerald-500",
    hover: "hover:bg-emerald-600",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-500",
    hover: "hover:bg-blue-600",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-500",
    border: "border-purple-500",
    hover: "hover:bg-purple-600",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-pink-500",
    border: "border-pink-500",
    hover: "hover:bg-pink-600",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
    hover: "hover:bg-orange-600",
  },
  cyan: {
    bg: "bg-cyan-500",
    text: "text-cyan-500",
    border: "border-cyan-500",
    hover: "hover:bg-cyan-600",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
    hover: "hover:bg-red-600",
  },
  yellow: {
    bg: "bg-yellow-500",
    text: "text-yellow-500",
    border: "border-yellow-500",
    hover: "hover:bg-yellow-600",
  },
};

export const COLOR_OPTIONS: Array<{ value: HabitColor; class: string }> = [
  { value: "blue", class: "bg-blue-500" },
  { value: "emerald", class: "bg-emerald-500" },
  { value: "purple", class: "bg-purple-500" },
  { value: "pink", class: "bg-pink-500" },
  { value: "orange", class: "bg-orange-500" },
  { value: "cyan", class: "bg-cyan-500" },
  { value: "red", class: "bg-red-500" },
  { value: "yellow", class: "bg-yellow-500" },
];

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const APP_VERSION = "1.0.0";
export const LOCAL_STORAGE_KEY = "habitTrackerData";
