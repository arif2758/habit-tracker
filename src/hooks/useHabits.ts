"use client";

import { useState, useEffect } from "react";
import { Habit } from "@/lib/types";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load habits from localStorage
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    setLoading(false);
  }, []);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem("habits", JSON.stringify(newHabits));
  };

  const addHabit = (habit: Omit<Habit, "id" | "completions">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completions: [],
    };
    saveHabits([...habits, newHabit]);
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, ...updates } : habit
    );
    saveHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    const filteredHabits = habits.filter((habit) => habit.id !== id);
    saveHabits(filteredHabits);
  };

  const toggleCompletion = (habitId: string, date: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const completions = [...habit.completions];
    const existingCompletionIndex = completions.findIndex(
      (c) => c.date === date
    );

    if (existingCompletionIndex > -1) {
      // Toggle or remove? Let's toggle for now, or remove if false.
      // Simple toggle:
      completions[existingCompletionIndex] = {
        ...completions[existingCompletionIndex],
        completed: !completions[existingCompletionIndex].completed,
      };
    } else {
      completions.push({ date, completed: true });
    }

    updateHabit(habitId, { completions });
  };

  const isCompleted = (habitId: string, date: string) => {
    const habit = habits.find((h) => h.id === habitId);
    return habit
      ? habit.completions.find((c) => c.date === date)?.completed ?? false
      : false;
  };

  const getHabitsForDate = (date: string) => {
    return habits.filter((habit) => {
      // Simple check: is it created before or on this date?
      // And is it not archived?
      const habitStart = new Date(habit.createdAt);
      const checkDate = new Date(date);

      // Reset times for comparison
      habitStart.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);

      if (habit.archived) return false;

      return checkDate >= habitStart;
    });
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompleted,
    getHabitsForDate,
  };
}
