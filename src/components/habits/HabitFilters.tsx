'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORY_CONFIG } from '@/lib/constants';
import type { HabitCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HabitFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: HabitCategory | 'all';
  onCategoryChange: (category: HabitCategory | 'all') => void;
}

export function HabitFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: HabitFiltersProps) {
  return (
    <div className="space-y-4 w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search habits..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card" // bg-card নিশ্চিত করে ইনপুট ব্যাকগ্রাউন্ড ঠিক আছে
        />
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={(value) => onCategoryChange(value as HabitCategory | 'all')}
        className="w-full"
      >
        {/* 
           FIX: নেগেটিভ মার্জিন (-mx-4) বাদ দেওয়া হয়েছে। 
           এখন এটি প্যারেন্ট কন্টেইনারের ভেতরেই থাকবে এবং পেজ বড় করবে না।
        */}
        <div className="w-full overflow-x-auto pb-2 no-scrollbar">
          
          {/* TabsList: w-max ব্যবহার করা হয়েছে যাতে বাটনগুলো চেপে না যায় */}
          <TabsList className="inline-flex h-auto w-max items-center justify-start gap-2 bg-transparent p-0">
            
            <TabsTrigger
              value="all"
              className={cn(
                "flex-none rounded-full border border-border bg-background px-4 py-2 text-xs font-medium shadow-sm transition-all",
                "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
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
                  "flex-none rounded-full border border-border bg-background px-4 py-2 text-xs font-medium shadow-sm transition-all",
                  "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
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