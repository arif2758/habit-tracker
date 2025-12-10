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
                    <Link key={item.href} href={item.href}>
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
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer / Pro Tip */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-xl border bg-white dark:bg-linear-to-br dark:from-primary/5 dark:via-primary/10 dark:to-transparent p-4">
          {/* ✅ Glow শুধু ডার্ক মোডে */}
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 blur-2xl opacity-0 dark:opacity-100" />
          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-wider">
                Pro Tip
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Consistency is key! Try to check in every day to build a streak
              and form lasting habits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
