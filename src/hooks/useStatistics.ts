import { Habit } from "@/lib/types";

export interface Statistics {
  currentStreak: number;
  bestStreak: number;
  doneInMonth: number;
  totalDone: number;
  goalPercentage: number;
}

export function useStatistics(habit: Habit): Statistics {
  // Helper to get completed dates as Date objects
  const getCompletedDates = () => {
    return habit.completions
      .filter((c) => c.completed)
      .map((c) => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime()); // Descending
  };

  const calculateCurrentStreak = (): number => {
    const completedDates = getCompletedDates();
    if (completedDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if completed today
    const lastCompletion = completedDates[0];
    lastCompletion.setHours(0, 0, 0, 0);

    const diffToLast = Math.floor(
      (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If not completed today or yesterday, streak is broken (unless today is just starting)
    // Actually, if last completion was yesterday, streak is alive. If today, alive.
    if (diffToLast > 1) return 0;

    // Iterate to count streak
    // We need dates in descending order
    const currentDate = today;
    // If completed today, start checking from today. If yesterday, start from yesterday.
    if (diffToLast === 0) {
      // completed today
    } else {
      // completed yesterday
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (const date of completedDates) {
      date.setHours(0, 0, 0, 0);
      if (date.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Gap found
        break;
      }
    }

    return streak;
  };

  const calculateBestStreak = (): number => {
    const completedDates = getCompletedDates().sort(
      (a, b) => a.getTime() - b.getTime()
    ); // Ascending
    if (completedDates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = completedDates[i - 1];
      const currDate = completedDates[i];

      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    return maxStreak;
  };

  const calculateDoneInMonth = (): number => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return habit.completions.filter((c) => {
      if (!c.completed) return false;
      const date = new Date(c.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    }).length;
  };

  const calculateGoalPercentage = (): number => {
    const startDate = new Date(habit.createdAt);
    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const totalDays =
      Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    if (totalDays <= 0) return 0;

    const completedCount = habit.completions.filter((c) => c.completed).length;

    return Math.round((completedCount / totalDays) * 100);
  };

  return {
    currentStreak: calculateCurrentStreak(),
    bestStreak: calculateBestStreak(),
    doneInMonth: calculateDoneInMonth(),
    totalDone: habit.completions.filter((c) => c.completed).length,
    goalPercentage: calculateGoalPercentage(),
  };
}
