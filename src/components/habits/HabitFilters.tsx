'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORY_CONFIG } from '@/lib/constants';
import type { HabitCategory } from '@/lib/types';

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
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search habits..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Tabs */}
      <Tabs 
        value={selectedCategory} 
        onValueChange={(value) => onCategoryChange(value as HabitCategory | 'all')}
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <TabsTrigger key={key} value={key}>
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}