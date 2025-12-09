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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 p-0 border-r border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader className="border-b border-border/50 p-4 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/icons/icon-512x512.png"
                    alt="Habit Tracker Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  Habit Tracker
                </SheetTitle>
              </SheetHeader>
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Logo */}
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
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              Habit Tracker
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onAddHabit}
            size="sm"
            className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            <Plus className="h-4 w-4" />
            <span>Add Habit</span>
          </Button>

          <div className="h-8 w-px bg-border/50 hidden sm:block" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
