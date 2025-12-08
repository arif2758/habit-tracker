"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { HabitCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HabitFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: HabitCategory | "all";
  onCategoryChange: (category: HabitCategory | "all") => void;
}

export function HabitFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: HabitFiltersProps) {
  return (
    <div className="w-full space-y-3">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search habits..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 bg-card text-sm"
        />
      </div>

      {/* Category Tabs - Full screen scroll on mobile, normal on desktop */}
      <Tabs
        value={selectedCategory}
        onValueChange={(value) =>
          onCategoryChange(value as HabitCategory | "all")
        }
      >
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-4 overflow-x-auto scrollbar-hide md:w-full md:relative-auto md:left-auto md:right-auto md:-mx-0 md:px-0 md:overflow-x-visible">
          <TabsList className="inline-flex h-auto items-center gap-2 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className={cn(
                "flex-shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap",
                "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
                "hover:bg-muted/50"
              )}
            >
              All
            </TabsTrigger>

            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "flex-shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap",
                  "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
                  "hover:bg-muted/50"
                )}
              >
                {config.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
