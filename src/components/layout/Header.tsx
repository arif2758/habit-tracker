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
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* ✅ Enhanced Glassmorphism Container */}
      <div className="relative bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/5 dark:via-transparent pointer-events-none" />

        <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="p-1 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20">
              <Image
                src="/icons/icon-512x512.png"
                alt="Habit Tracker Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Habitor
            </span>
          </Link>

          {/* Right: Actions + Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Add Button */}
            <Button
              onClick={onAddHabit}
              size="sm"
              className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span className="font-semibold">Add Habit</span>
            </Button>

            {/* Divider */}
            <div className="h-6 w-px bg-border/50 hidden sm:block" />

            {/* Theme Toggle */}
            <div className="hover:bg-white/20 dark:hover:bg-white/5 rounded-lg transition-colors p-1">
              <ThemeToggle />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-border/50" />

            {/* ✅ Hamburger Menu */}
            <Sheet modal={false}> {/* ✅ modal={false} - Layout shift বন্ধ করবে */}
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 p-0 border-l border-white/20 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-2xl"
              >
                {/* Inner glow for sidebar */}
                <div className="absolute inset-0 bg-linear-to-l from-primary/10 via-primary/5 to-transparent dark:from-primary/5 dark:via-transparent pointer-events-none" />

                <SheetHeader className="border-b border-white/20 dark:border-white/5 p-6 text-left relative">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20">
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

                <div className="relative h-full">
                  <Sidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}