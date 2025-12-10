"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void; 
  presetColors?: string[];
}

export function ColorPicker({
  value,
  onChange,
  presetColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#a855f7", // purple
    "#f97316", // orange
    "#ec4899", // pink
    "#eab308", // yellow
    "#ef4444", // red
    "#06b6d4", // cyan
  ],
}: ColorPickerProps) {
  const [copied, setCopied] = useState(false);

  const handlePresetColorClick = (color: string) => {
    onChange(color);
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-3">
      {/* Quick Color Buttons - Circular */}
      <div className="flex items-center gap-2 flex-wrap">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            type="button"
            onClick={() => handlePresetColorClick(presetColor)}
            className={cn(
              "w-8 h-8 rounded-full transition-all duration-200",
              "border-3 hover:scale-110 active:scale-95",
              value === presetColor
                ? "ring-2 ring-offset-2 ring-primary border-primary scale-110 shadow-lg"
                : "border-transparent shadow-sm hover:shadow-md"
            )}
            style={{ backgroundColor: presetColor }}
            title={presetColor}
          />
        ))}
      </div>

      {/* Native Color Picker + HEX Input */}
      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-input">
        <input
          type="color"
          value={value}
          onChange={handleColorPickerChange}
          className={cn(
            "w-12 h-12 rounded-lg cursor-pointer border-2 border-input",
            "hover:border-primary/50 transition-colors"
          )}
        />

        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(val) || val === "#") {
              onChange(val);
            }
          }}
          placeholder="#000000"
          className={cn(
            "flex-1 px-3 py-2 rounded-md border border-input",
            "text-sm font-mono font-semibold",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
            "bg-background transition-colors"
          )}
          maxLength={7}
        />

        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "p-2 rounded-md transition-colors duration-200",
            copied
              ? "bg-green-500/20 text-green-600 dark:text-green-400"
              : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          )}
          title="Copy color code"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
