// src\components\layout\AppLayout.tsx
"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { CreateHabitDialog } from "@/components/habits/CreateHabitDialog";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);

  const handleAddHabit = () => {
    setIsAddHabitOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* 1. Header (Fixed at top) */}
      <Header onAddHabit={handleAddHabit} />

      {/* ✅ Spacer for fixed header */}
      <div className="h-16" />

      <div className="flex relative z-10">
        {/* 2. Desktop Sidebar (Fixed Left, Below Header) */}
        <aside className="hidden lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-white/10 dark:lg:border-white/5 lg:bg-white/40 dark:lg:bg-black/30 lg:backdrop-blur-xl">
          {/* Sidebar inner glow */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative h-full">
            <Sidebar />
          </div>
        </aside>

        {/* 3. Main Content (Pushed right on desktop) */}
        <main className="flex-1 lg:pl-72">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* 4. Mobile Navigation (Bottom) */}
      <MobileNav onAddHabit={handleAddHabit} />

      <CreateHabitDialog
        open={isAddHabitOpen}
        onOpenChange={setIsAddHabitOpen}
      />
    </div>
  );
}
