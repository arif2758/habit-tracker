"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { parseISO, differenceInDays } from "date-fns";
import {
  triggerConfetti,
  triggerStreakConfetti,
} from "@/components/ui/confetti";

// Import types
import type { Habit, AppData, HabitStats } from "@/lib/types";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/localStorage";

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "createdAt" | "updatedAt" | "completions" | "archived"
    >
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  addNote: (habitId: string, date: string, note: string) => void;
  getHabitById: (id: string) => Habit | undefined;
  getTodayHabits: () => Habit[];
  getHabitsForDate: (date: string) => Habit[];
  getHabitStats: (habitId: string) => HabitStats | null;
  archiveHabit: (id: string) => void;
  clearAllData: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = loadFromLocalStorage();
      setHabits(data.habits);
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const data: AppData = {
      habits,
      settings: {
        theme: "system",
        weekStart: "sunday",
        notifications: false,
      },
      version: "1.0.0",
    };

    saveToLocalStorage(data);
  }, [habits]);

  // ===== CALCULATE STREAK (Moved before toggleCompletion) =====
  const calculateStreak = useCallback((habit: Habit): number => {
    const sortedCompletions = habit.completions
      .filter((c) => c.completed)
      .map((c) => parseISO(c.date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (sortedCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = new Date(sortedCompletions[i]);
      completionDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (completionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, []);

  // ===== CREATE =====
  const addHabit = useCallback(
    (
      habitData: Omit<
        Habit,
        "id" | "createdAt" | "updatedAt" | "completions" | "archived"
      >
    ) => {
      const newHabit: Habit = {
        ...habitData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completions: [],
        archived: false,
      };

      setHabits((prev) => [...prev, newHabit]);

      toast.success("Habit created! 🎉", {
        description: `${newHabit.name} added to your habits`,
      });
    },
    []
  );

  // ===== UPDATE =====
  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, ...updates, updatedAt: new Date().toISOString() }
          : habit
      )
    );

    toast.success("Habit updated! ✨");
  }, []);

  // ===== DELETE =====
  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => {
      const habit = prev.find((h) => h.id === id);
      const newHabits = prev.filter((h) => h.id !== id);

      if (habit) {
        toast.success("Habit deleted", {
          action: {
            label: "Undo",
            onClick: () => {
              setHabits((current) => [...current, habit]);
              toast.success("Habit restored");
            },
          },
        });
      }

      return newHabits;
    });
  }, []);

  // ===== TOGGLE COMPLETION =====
  const toggleCompletion = useCallback(
    (habitId: string, date: string) => {
      setHabits((prev) =>
        prev.map((habit) => {
          if (habit.id !== habitId) return habit;

          const existingIndex = habit.completions.findIndex(
            (c) => c.date === date
          );
          const newCompletions = [...habit.completions];
          let isCompleting = false;

          if (existingIndex >= 0) {
            isCompleting = !newCompletions[existingIndex].completed;
            newCompletions[existingIndex] = {
              ...newCompletions[existingIndex],
              completed: isCompleting,
            };
          } else {
            isCompleting = true;
            newCompletions.push({ date, completed: true });
          }

          if (isCompleting) {
            const updatedHabit = { ...habit, completions: newCompletions };
            const newStreak = calculateStreak(updatedHabit);

            triggerConfetti();

            if (newStreak % 7 === 0 && newStreak > 0) {
              setTimeout(() => triggerStreakConfetti(newStreak), 300);
              toast.success(`🎉 ${newStreak} Day Streak!`, {
                description: `Amazing! Keep it up!`,
              });
            } else {
              toast.success("Great job! 🎉", {
                description: `${habit.name} completed for today`,
              });
            }
          }

          return {
            ...habit,
            completions: newCompletions,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [calculateStreak]
  );

  // ===== ADD NOTE =====
  const addNote = useCallback((habitId: string, date: string, note: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const existingIndex = habit.completions.findIndex(
          (c) => c.date === date
        );
        const newCompletions = [...habit.completions];

        if (existingIndex >= 0) {
          newCompletions[existingIndex] = {
            ...newCompletions[existingIndex],
            note,
          };
        } else {
          newCompletions.push({ date, completed: false, note });
        }

        return {
          ...habit,
          completions: newCompletions,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    toast.success("Note added");
  }, []);

  // ===== GET HABIT BY ID =====
  const getHabitById = useCallback(
    (id: string): Habit | undefined => {
      return habits.find((h) => h.id === id);
    },
    [habits]
  );

  // ===== GET TODAY'S HABITS =====
  const getTodayHabits = useCallback((): Habit[] => {
    const today = new Date().getDay();
    return habits.filter((h) => {
      if (h.archived) return false;
      if (h.frequency === "daily") return true;
      if (h.frequency === "weekly" && h.targetDays) {
        return h.targetDays.includes(today);
      }
      return false;
    });
  }, [habits]);

  // ===== GET HABITS FOR DATE =====
  const getHabitsForDate = useCallback(
    (date: string): Habit[] => {
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();

      return habits.filter((h) => {
        if (h.archived) return false;

        // Check if habit was created before or on this date
        const createdDate = new Date(h.createdAt);
        if (createdDate > targetDate) return false;

        if (h.frequency === "daily") return true;
        if (h.frequency === "weekly" && h.targetDays) {
          return h.targetDays.includes(dayOfWeek);
        }
        return false;
      });
    },
    [habits]
  );

  // ===== GET HABIT STATS =====
  const getHabitStats = useCallback(
    (habitId: string): HabitStats | null => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return null;

      const completions = habit.completions.filter((c) => c.completed);
      const totalDays = habit.completions.length;
      const completionRate =
        totalDays > 0 ? (completions.length / totalDays) * 100 : 0;
      const currentStreak = calculateStreak(habit);

      const sortedDates = habit.completions
        .filter((c) => c.completed)
        .map((c) => parseISO(c.date))
        .sort((a, b) => a.getTime() - b.getTime());

      let longestStreak = 0;
      let tempStreak = 0;

      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const diff = differenceInDays(sortedDates[i], sortedDates[i - 1]);
          if (diff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        completionRate,
        currentStreak,
        longestStreak,
        totalCompletions: completions.length,
        totalDays,
      };
    },
    [habits, calculateStreak]
  );

  // ===== ARCHIVE =====
  const archiveHabit = useCallback((id: string) => {
    setHabits((prev) => {
      const habit = prev.find((h) => h.id === id);
      const newHabits = prev.map((h) =>
        h.id === id
          ? { ...h, archived: true, updatedAt: new Date().toISOString() }
          : h
      );

      if (habit) {
        toast.success("Habit archived", {
          action: {
            label: "Undo",
            onClick: () => {
              setHabits((current) =>
                current.map((h) =>
                  h.id === id ? { ...h, archived: false } : h
                )
              );
            },
          },
        });
      }

      return newHabits;
    });
  }, []);

  // ===== CLEAR ALL =====
  const clearAllData = useCallback(() => {
    setHabits([]);
    toast.success("All data cleared");
  }, []);

  const value = useMemo<HabitContextType>(
    () => ({
      habits,
      loading,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleCompletion,
      addNote,
      getHabitById,
      getTodayHabits,
      getHabitsForDate,
      getHabitStats,
      archiveHabit,
      clearAllData,
    }),
    [
      habits,
      loading,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleCompletion,
      addNote,
      getHabitById,
      getTodayHabits,
      getHabitsForDate,
      getHabitStats,
      archiveHabit,
      clearAllData,
    ]
  );

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
