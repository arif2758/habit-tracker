// src\components\layout\Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ListTodo,
  BarChart3,
  Archive,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetClose } from "@/components/ui/sheet";

const navigation = [
  {
    items: [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "All Habits", href: "/habits", icon: ListTodo },
      { name: "Statistics", href: "/statistics", icon: BarChart3 },
    ],
  },
  {
    title: "Other",
    items: [
      { name: "Archived", href: "/archived", icon: Archive },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-1">
        <div className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              {section.title && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.title}
                </h4>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href}>
                        <div
                          className={cn(
                            "group flex items-center gap-3 rounded-lg my-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                            isActive
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isActive
                                ? "text-primary"
                                : "text-foreground/70 group-hover:text-foreground"
                            )}
                          />
                          {item.name}
                          {isActive && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* ✅ Pro Tip - Enhanced Glassmorphism */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-4 shadow-lg">
          {/* ✅ Background gradient glow */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent opacity-60 dark:opacity-100" />
          
          {/* ✅ Decorative glow - top right */}
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/20 dark:bg-primary/15 blur-2xl" />
          
          {/* ✅ Decorative glow - bottom left */}
          <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-purple-500/15 dark:bg-purple-500/10 blur-2xl" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-2 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Pro Tip
              </p>
            </div>
            
            {/* Content */}
            <p className="text-xs text-foreground/80 dark:text-foreground/90 leading-relaxed font-medium">
              Consistency is key! Try to check in every day to build a streak
              and form lasting habits.
            </p>
          </div>

          {/* ✅ Inner border glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}