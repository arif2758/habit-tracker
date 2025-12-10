// src\components\layout\MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {BarChart3, Plus, Blocks } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Blocks },
  { name: "Stats", href: "/statistics", icon: BarChart3 },
];

interface MobileNavProps {
  onAddHabit?: () => void;
}

export function MobileNav({ onAddHabit }: MobileNavProps) {
  const pathname = usePathname();
 
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* ✅ Glassmorphism Container - একদম নিচে */}
      <div className="rounded-t-3xl bg-background/40 backdrop-blur-2xl border-t border-x border-white/10 shadow-2xl dark:bg-black/40 dark:border-white/5">
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-t-3xl bg-linear-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between px-6 py-3 pb-safe">
          {/* Navigation Items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300",
                  "hover:bg-white/10 dark:hover:bg-white/5 active:scale-95",
                  isActive && "bg-white/10 dark:bg-white/5"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                 
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-wide transition-all duration-300",
                    isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* FAB Button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-3">
            <button
              onClick={onAddHabit}
              className={cn(
                "h-16 w-16 rounded-full",
                "bg-primary",
                "flex items-center justify-center",
                "transition-all duration-300",
                "hover:scale-105",
                "active:scale-95",
                "border-4 border-background"
              )}
            >
              <Plus
                className="h-9 w-9 text-primary-foreground"
                strokeWidth={3}
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
