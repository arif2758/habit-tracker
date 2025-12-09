// src\app\layout.tsx
import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { HabitProvider } from "@/contexts/HabitContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RegisterSW } from "@/components/RegisterSW";

// ✅ Sora font
const sora = Sora({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, 
};

export const metadata: Metadata = {
  title: "Habit Tracker - Build Better Habits",
  description:
    "Track your daily habits and build a better you. Stay consistent, achieve your goals.",
  keywords: [
    "habit tracker",
    "productivity",
    "self improvement",
    "goals",
    "habits",
  ],
  authors: [{ name: "Arif" }],
  openGraph: {
    title: "Habit Tracker - Build Better Habits",
    description: "Track your daily habits and build a better you",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: { 
    capable: true,
    statusBarStyle: "default",
    title: "Habit Tracker",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sora.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HabitProvider>
              <AppLayout>{children}</AppLayout>
              <Toaster richColors position="top-center" />
              <RegisterSW />
            </HabitProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}