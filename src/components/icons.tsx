import {
  Dumbbell,
  BookOpen,
  Target,
  Brain,
  Palette,
  Home,
  Star,
  type LucideIcon,
} from "lucide-react";

export const IconMap: Record<string, LucideIcon> = {
  Dumbbell,
  BookOpen,
  Target,
  Brain,
  Palette,
  Home,
  Star,
};

export const getIcon = (name: string) => {
  const Icon = IconMap[name] || Star;
  return Icon;
};
