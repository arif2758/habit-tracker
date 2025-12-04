"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, Upload, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const handleExport = () => {
    const data = localStorage.getItem("habitTrackerData");
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `habits-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            localStorage.setItem("habitTrackerData", data);
            window.location.reload();
          } catch (error) {
            alert("Invalid file format");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure? This will delete ALL your habits from the database!"
      )
    ) {
      if (confirm("This action cannot be undone. Are you ABSOLUTELY sure?")) {
        // TODO: Implement database clear function
        alert("Database clear function not yet implemented");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and data
        </p>
      </div>

      <div className="space-y-4">
        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch id="notifications" />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export, import, or clear your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleExport}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                onClick={handleImport}
                variant="outline"
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </div>

            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <h4 className="font-semibold text-destructive">Danger Zone</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                This action cannot be undone
              </p>
              <Button
                onClick={handleClearAll}
                variant="destructive"
                className="mt-4 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
