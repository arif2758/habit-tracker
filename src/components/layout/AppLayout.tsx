// src\components\layout\AppLayout.tsx
"use client";

import React, { useState } from "react";
import { Header } from "./Header";
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

      {/* Header (Fixed at top) */}
      <Header onAddHabit={handleAddHabit} />

      {/* Spacer for fixed header */}
      <div className="h-12" />

      {/* Main Content - Centered, no sidebar offset */}
      <main className="relative z-10">
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Mobile Navigation (Bottom) */}
      <MobileNav onAddHabit={handleAddHabit} />

      <CreateHabitDialog
        open={isAddHabitOpen}
        onOpenChange={setIsAddHabitOpen}
      />
    </div>
  );
}
