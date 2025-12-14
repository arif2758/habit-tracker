// ... imports
import { format, subDays, startOfWeek, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useHabits } from "@/contexts/HabitContext";

export function HeatmapCalendar() {
  const { habits } = useHabits();

  // Get last 12 weeks (84 days)
  const today = new Date();
  const startDate = subDays(today, 83);
  const weeks: Date[][] = [];

  let currentWeek: Date[] = [];
  let currentDate = startOfWeek(startDate);

  for (let i = 0; i < 84; i++) {
    currentWeek.push(currentDate);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate = addDays(currentDate, 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Calculate completions per day
  const getCompletionCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    let count = 0;

    habits.forEach((habit) => {
      const completion = habit.completions.find((c) => c.date === dateStr);
      if (completion?.completed) {
        count++;
      }
    });

    return count;
  };

  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-muted/50 dark:bg-muted/20";
    if (count === 1) return "bg-emerald-400/40 dark:bg-emerald-500/30";
    if (count === 2) return "bg-emerald-400/60 dark:bg-emerald-500/50";
    if (count === 3) return "bg-emerald-400/80 dark:bg-emerald-500/70";
    return "bg-emerald-500 dark:bg-emerald-500";
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6",
        "bg-white/40 dark:bg-white/5",
        "backdrop-blur-xl",
        "border border-white/40 dark:border-white/10",
        "transition-all duration-300",
        "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-xl">
          Activity Heatmap
        </h3>
        <p className="text-sm text-muted-foreground">
          Your habit completion over the last 12 weeks
        </p>
      </div>

      <div className="space-y-6">
        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1.5 min-w-full justify-center md:justify-start">
            {/* Day labels */}
            <div className="flex flex-col gap-1.5 pr-2 text-[10px] font-medium text-muted-foreground pt-px">
              <div className="h-3"></div>
              <div className="h-3 leading-3">Mon</div>
              <div className="h-3"></div>
              <div className="h-3 leading-3">Wed</div>
              <div className="h-3"></div>
              <div className="h-3 leading-3">Fri</div>
              <div className="h-3"></div>
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.5">
                {week.map((day, dayIndex) => {
                  const count = getCompletionCount(day);
                  const isToday = isSameDay(day, today);

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "h-3 w-3 rounded-[3px] transition-all duration-300",
                        getIntensityColor(count),
                        isToday &&
                          "ring-2 ring-primary ring-offset-2 ring-offset-transparent shadow-lg scale-110 z-10",
                        !isToday &&
                          count > 0 &&
                          "hover:scale-125 hover:rotate-12 hover:shadow-sm"
                      )}
                      title={`${format(
                        day,
                        "MMM d, yyyy"
                      )}: ${count} habits completed`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-dashed border-white/20 dark:border-white/10">
          <span className="font-medium">Less</span>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-[3px] bg-muted/50 dark:bg-muted/20" />
            <div className="h-3 w-3 rounded-[3px] bg-emerald-400/40 dark:bg-emerald-500/30" />
            <div className="h-3 w-3 rounded-[3px] bg-emerald-400/60 dark:bg-emerald-500/50" />
            <div className="h-3 w-3 rounded-[3px] bg-emerald-400/80 dark:bg-emerald-500/70" />
            <div className="h-3 w-3 rounded-[3px] bg-emerald-500 dark:bg-emerald-500" />
          </div>
          <span className="font-medium">More</span>
        </div>
      </div>
    </div>
  );
}
