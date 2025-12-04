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
import { parseISO } from "date-fns";
import {
  triggerConfetti,
  triggerStreakConfetti,
} from "@/components/ui/confetti";

// Import types
import type { Habit, HabitStats } from "@/lib/types";

// Import server actions
import {
  getHabits,
  createHabit as createHabitAction,
  updateHabit as updateHabitAction,
  deleteHabit as deleteHabitAction,
  toggleHabitCompletion as toggleHabitCompletionAction,
  archiveHabit as archiveHabitAction,
} from "@/app/actions/habits";

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (
    habit: Omit<
      Habit,
      | "_id"
      | "id"
      | "createdAt"
      | "updatedAt"
      | "completions"
      | "archived"
      | "streak"
    >
  ) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
  addNote: (habitId: string, date: string, note: string) => void;
  getHabitById: (id: string) => Habit | undefined;
  getTodayHabits: () => Habit[];
  getHabitsForDate: (date: string) => Habit[];
  getHabitStats: (habitId: string) => HabitStats | null;
  archiveHabit: (id: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load habits from database
  const refreshHabits = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedHabits = await getHabits();
      setHabits(fetchedHabits);
    } catch (error) {
      console.error("Error loading habits:", error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshHabits();
  }, [refreshHabits]);

  // Add new habit
  const addHabit = useCallback(
    async (
      habit: Omit<
        Habit,
        | "_id"
        | "id"
        | "createdAt"
        | "updatedAt"
        | "completions"
        | "archived"
        | "streak"
      >
    ) => {
      try {
        const newHabit = await createHabitAction({
          ...habit,
          completions: [],
          streak: 0,
          archived: false,
        });

        setHabits((prev) => [newHabit, ...prev]);
        toast.success("Habit created successfully!");
      } catch (error) {
        console.error("Error creating habit:", error);
        toast.error("Failed to create habit");
        throw error;
      }
    },
    []
  );

  // Update habit
  const updateHabit = useCallback(
    async (id: string, updates: Partial<Habit>) => {
      try {
        // Optimistic update
        setHabits((prev) =>
          prev.map((h) => (h._id === id ? { ...h, ...updates } : h))
        );

        const updatedHabit = await updateHabitAction(id, updates);

        if (updatedHabit) {
          setHabits((prev) =>
            prev.map((h) => (h._id === id ? updatedHabit : h))
          );
          toast.success("Habit updated successfully!");
        }
      } catch (error) {
        console.error("Error updating habit:", error);
        toast.error("Failed to update habit");
        // Revert optimistic update
        await refreshHabits();
        throw error;
      }
    },
    [refreshHabits]
  );

  // Delete habit
  const deleteHabit = useCallback(
    async (id: string) => {
      try {
        // Optimistic update
        setHabits((prev) => prev.filter((h) => h._id !== id));

        await deleteHabitAction(id);
        toast.success("Habit deleted successfully!");
      } catch (error) {
        console.error("Error deleting habit:", error);
        toast.error("Failed to delete habit");
        // Revert optimistic update
        await refreshHabits();
        throw error;
      }
    },
    [refreshHabits]
  );

  // Toggle completion
  const toggleCompletion = useCallback(
    async (habitId: string, date: string) => {
      const habit = habits.find((h) => h._id === habitId);
      if (!habit) return;

      const existingCompletion = habit.completions.find((c) => c.date === date);
      const isCompleting = !existingCompletion?.completed;

      try {
        // Optimistic update
        setHabits((prev) =>
          prev.map((h) => {
            if (h._id !== habitId) return h;

            const completions = [...h.completions];
            const index = completions.findIndex((c) => c.date === date);

            if (index >= 0) {
              completions[index] = {
                ...completions[index],
                completed: !completions[index].completed,
              };
            } else {
              completions.push({ date, completed: true });
            }

            return { ...h, completions };
          })
        );

        const updatedHabit = await toggleHabitCompletionAction(habitId, date);

        if (updatedHabit) {
          setHabits((prev) =>
            prev.map((h) => (h._id === habitId ? updatedHabit : h))
          );

          // Show celebration for completions
          if (isCompleting) {
            const newStreak = updatedHabit.streak || 0;

            if (newStreak > 0 && newStreak % 7 === 0) {
              triggerStreakConfetti(newStreak);
              toast.success(`🔥 ${newStreak} Day Streak!`, {
                description: `Incredible! You're on fire!`,
              });
            } else if (newStreak >= 3) {
              triggerConfetti();
              toast.success(`🎉 ${newStreak} Day Streak!`, {
                description: `Amazing! Keep it up!`,
              });
            } else {
              toast.success("Habit completed for today", {
                description: `${habit.name} completed for today`,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error toggling completion:", error);
        toast.error("Failed to update habit");
        // Revert optimistic update
        await refreshHabits();
        throw error;
      }
    },
    [habits, refreshHabits]
  );

  // Archive habit
  const archiveHabit = useCallback(
    async (id: string) => {
      try {
        // Optimistic update
        setHabits((prev) =>
          prev.map((h) => (h._id === id ? { ...h, archived: true } : h))
        );

        await archiveHabitAction(id, true);
        toast.success("Habit archived successfully!");
      } catch (error) {
        console.error("Error archiving habit:", error);
        toast.error("Failed to archive habit");
        // Revert optimistic update
        await refreshHabits();
        throw error;
      }
    },
    [refreshHabits]
  );

  // Add note (not implemented in server action yet)
  const addNote = useCallback((habitId: string, date: string, note: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit._id !== habitId) return habit;

        const completions = habit.completions.map((c) =>
          c.date === date ? { ...c, note } : c
        );

        return { ...habit, completions };
      })
    );
    toast.success("Note added!");
  }, []);

  // Get habit by ID
  const getHabitById = useCallback(
    (id: string) => {
      return habits.find((h) => h._id === id || h.id === id);
    },
    [habits]
  );

  // Get today's habits
  const getTodayHabits = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return habits.filter((habit) => {
      if (habit.archived) return false;
      if (habit.frequency === "daily") return true;
      if (habit.frequency === "weekly" && habit.targetDays) {
        const dayOfWeek = new Date().getDay();
        return habit.targetDays.includes(dayOfWeek);
      }
      return false;
    });
  }, [habits]);

  // Get habits for a specific date
  const getHabitsForDate = useCallback(
    (date: string) => {
      return habits.filter((habit) => {
        if (habit.archived) return false;
        if (habit.frequency === "daily") return true;
        if (habit.frequency === "weekly" && habit.targetDays) {
          const dayOfWeek = new Date(date).getDay();
          return habit.targetDays.includes(dayOfWeek);
        }
        return false;
      });
    },
    [habits]
  );

  // Calculate habit stats
  const getHabitStats = useCallback(
    (habitId: string): HabitStats | null => {
      const habit = habits.find((h) => h._id === habitId || h.id === habitId);
      if (!habit) return null;

      const completedDays = habit.completions.filter((c) => c.completed);
      const totalCompletions = completedDays.length;

      const createdDate = parseISO(habit.createdAt);
      const today = new Date();
      const totalDays = Math.max(
        1,
        Math.floor(
          (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      const completionRate = (totalCompletions / totalDays) * 100;

      // Calculate current streak
      const sortedCompletions = completedDays
        .map((c) => parseISO(c.date))
        .sort((a, b) => b.getTime() - a.getTime());

      let currentStreak = 0;
      if (sortedCompletions.length > 0) {
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedCompletions.length; i++) {
          const completionDate = new Date(sortedCompletions[i]);
          completionDate.setHours(0, 0, 0, 0);

          const expectedDate = new Date(todayDate);
          expectedDate.setDate(todayDate.getDate() - currentStreak);

          if (completionDate.getTime() === expectedDate.getTime()) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      const sortedDates = completedDays
        .map((c) => parseISO(c.date))
        .sort((a, b) => a.getTime() - b.getTime());

      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const daysDiff = Math.floor(
            (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (daysDiff === 1) {
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
        totalCompletions,
        totalDays,
      };
    },
    [habits]
  );

  const value = useMemo(
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
      refreshHabits,
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
      refreshHabits,
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
