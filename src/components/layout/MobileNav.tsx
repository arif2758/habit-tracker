"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, Plus, ChartNoAxesCombined } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// আইটেমগুলো এখানে ডিফাইন করা থাকলো
const navItems = [
  { name: "Habits", href: "/habits", icon: ListTodo },
  { name: "Stats", href: "/statistics", icon: ChartNoAxesCombined },
];

interface MobileNavProps {
  onAddHabit?: () => void;
}

export function MobileNav({ onAddHabit }: MobileNavProps) {
  const pathname = usePathname();

  // আলাদা করে আইটেমগুলো ভেরিয়েবলে নিলাম
  const habitsItem = navItems[0];
  const statsItem = navItems[1];

  const renderNavItem = (item: (typeof navItems)[0]) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link href={item.href} className="flex-1">
        <Button
          variant="ghost"
          className={cn(
            "h-14 w-full flex-col gap-1 hover:bg-transparent",
            isActive && "text-primary"
          )}
        >
          <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
          <span className="text-xs font-medium">{item.name}</span>
        </Button>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
      <div className="flex items-center justify-between px-6 py-2">
        {/* ১. বাম পাশের আইটেম (Habits) */}
        <div className="flex-1 flex justify-start">
          {renderNavItem(habitsItem)}
        </div>

        {/* ২. মাঝখানের FAB বাটন (Add Habit) */}
        <div className="flex justify-center ">
          {" "}
          {/* -mt-6 দিয়ে বাটনটিকে একটু উপরে ভাসানো হয়েছে */}
          <Button
            onClick={onAddHabit}
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-10 w-10" />
            <span className="sr-only">Add Habit</span>
          </Button>
        </div>

        {/* ৩. ডান পাশের আইটেম (Stats) */}
        <div className="flex-1 flex justify-end">
          {renderNavItem(statsItem)}
        </div>
      </div>
    </nav>
  );
}
