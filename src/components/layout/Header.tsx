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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ✅ Left: Logo Only */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <Image
            src="/icons/icon-512x512.png"
            alt="Habit Tracker Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-sm"
          />
          <span className="text-lg font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Habit Tracker
          </span>
        </Link>

        {/* ✅ Right: Actions + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Desktop Add Button */}
          <Button
            onClick={onAddHabit}
            size="sm"
            className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="font-semibold">Add Habit</span>
          </Button>

          {/* Divider */}
          <div className="h-8 w-px bg-border/50 hidden sm:block" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* ✅ Mobile Menu Trigger - ডানে */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 p-0 border-l border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader className="border-b border-border/50 p-4 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
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
    </header>
  );
}