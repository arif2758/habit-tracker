"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/mongodb";
import HabitCollectionModel from "@/lib/db/models/Habit";
import type { IHabit } from "@/lib/db/models/Habit";

// Get all habits
export async function getHabits(): Promise<IHabit[]> {
  try {
    await connectDB();
    const habits = await HabitCollectionModel.find({ archived: false })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(habits));
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw new Error("Failed to fetch habits");
  }
}

// Create a new habit
export async function createHabit(data: Partial<IHabit>): Promise<IHabit> {
  try {
    await connectDB();
    const habit = await HabitCollectionModel.create(data);
    revalidatePath("/");
    return JSON.parse(JSON.stringify(habit));
  } catch (error) {
    console.error("Error creating habit:", error);
    throw new Error("Failed to create habit");
  }
}

// Update a habit
export async function updateHabit(
  id: string,
  data: Partial<IHabit>
): Promise<IHabit | null> {
  try {
    await connectDB();
    const habit = await HabitCollectionModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    revalidatePath("/");
    return habit ? JSON.parse(JSON.stringify(habit)) : null;
  } catch (error) {
    console.error("Error updating habit:", error);
    throw new Error("Failed to update habit");
  }
}

// Delete a habit
export async function deleteHabit(id: string): Promise<boolean> {
  try {
    await connectDB();
    await HabitCollectionModel.findByIdAndDelete(id);
    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw new Error("Failed to delete habit");
  }
}

// Toggle habit completion for a specific date
export async function toggleHabitCompletion(
  id: string,
  date: string
): Promise<IHabit | null> {
  try {
    await connectDB();
    const habit = await HabitCollectionModel.findById(id);

    if (!habit) {
      throw new Error("Habit not found");
    }

    const completionIndex = habit.completions.findIndex(
      (c: { date: string }) => c.date === date
    );

    if (completionIndex >= 0) {
      // Toggle existing completion
      habit.completions[completionIndex].completed =
        !habit.completions[completionIndex].completed;
    } else {
      // Add new completion
      habit.completions.push({ date, completed: true });
    }

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const todayCompletion = habit.completions.find(
      (c: { date: string }) => c.date === today
    );

    if (todayCompletion?.completed) {
      habit.streak += 1;
    } else {
      habit.streak = 0;
    }

    await habit.save();
    revalidatePath("/");

    return JSON.parse(JSON.stringify(habit));
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    throw new Error("Failed to toggle habit completion");
  }
}

// Archive/unarchive a habit
export async function archiveHabit(
  id: string,
  archived: boolean = true
): Promise<IHabit | null> {
  try {
    await connectDB();
    const habit = await HabitCollectionModel.findByIdAndUpdate(
      id,
      { archived },
      { new: true, runValidators: true }
    ).lean();
    revalidatePath("/");
    return habit ? JSON.parse(JSON.stringify(habit)) : null;
  } catch (error) {
    console.error("Error archiving habit:", error);
    throw new Error("Failed to archive habit");
  }
}

// Get archived habits
export async function getArchivedHabits(): Promise<IHabit[]> {
  try {
    await connectDB();
    const habits = await HabitCollectionModel.find({ archived: true })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(habits));
  } catch (error) {
    console.error("Error fetching archived habits:", error);
    throw new Error("Failed to fetch archived habits");
  }
}
