// src\components\layout\Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface HeaderProps {
  onAddHabit?: () => void;
}

export function Header({ onAddHabit }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ✅ Glassmorphism Container */}
      <div className="bg-background/40 backdrop-blur-xl border-b border-white/10 shadow dark:bg-black/40 dark:border-white/5">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto flex h-12 items-center justify-between px-4 relative">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/icons/icon-512x512.png"
              alt="Habit Tracker Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Habit Tracker
            </span>
          </Link>

          {/* Right: Actions + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Add Button */}
            <Button
              onClick={onAddHabit}
              size="sm"
              className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="font-semibold">Add Habit</span>
            </Button>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10 dark:bg-white/5 hidden sm:block" />

            {/* Theme Toggle */}
            <div className="hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 p-0 border-l border-white/10 dark:border-white/5 bg-background/40 backdrop-blur-2xl dark:bg-black/40"
              >
                {/* Inner glow for sidebar */}
                <div className="absolute inset-0 bg-linear-to-l from-primary/5 via-transparent to-transparent pointer-events-none" />
                
                <SheetHeader className="border-b border-white/10 dark:border-white/5 p-6 text-left relative">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm">
                      <Image
                        src="/icons/icon-512x512.png"
                        alt="Habit Tracker Logo"
                        width={28}
                        height={28}
                        className="rounded-lg"
                      />
                    </div>
                    <span className="text-xl font-bold">Menu</span>
                  </SheetTitle>
                </SheetHeader>

                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}