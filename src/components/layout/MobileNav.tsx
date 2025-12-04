"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, BarChart3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Habits", href: "/habits", icon: ListTodo },
  { name: "Stats", href: "/statistics", icon: BarChart3 },
];

interface MobileNavProps {
  onAddHabit?: () => void;
}

export function MobileNav({ onAddHabit }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "h-14 w-full flex-col gap-1",
                  isActive && "text-primary"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                <span className="text-xs">{item.name}</span>
              </Button>
            </Link>
          );
        })}

        {/* FAB - Add Habit */}
        <div className="flex-1">
          <Button
            onClick={onAddHabit}
            size="icon"
            className="mx-auto h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Habit</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
