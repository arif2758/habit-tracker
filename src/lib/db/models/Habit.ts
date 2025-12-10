// src\lib\db\models\Habit.ts
import { Schema, model, models, Model } from "mongoose";

export interface ICompletion {
  date: string;
  completed: boolean;
}

export interface IHabit {
  _id: string;
  name: string;
  description?: string;
  category:
    | "health"
    | "productivity"
    | "mindfulness"
    | "learning"
    | "spiritual"        // ✅ Added
    | "harmful"          // ✅ Added
    | "non-negotiable";  // ✅ Added
  color: "blue" | "green" | "purple" | "orange" | "pink" | "yellow" | string;
  icon?: string;
  frequency: "daily" | "weekly";
  targetDays?: number[];
  completions: ICompletion[];
  streak: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

const CompletionSchema = new Schema<ICompletion>({
  date: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
});

const HabitSchema = new Schema<IHabit>(
  {
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: [100, "Habit name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "health",
        "productivity",
        "mindfulness",
        "learning",
        "spiritual",        // ✅ Added
        "harmful",          // ✅ Added
        "non-negotiable",   // ✅ Added
      ],
      default: "health",
    },
    color: {
      type: String,
      required: true,
      default: "#3b82f6",
    },
    icon: {
      type: String,
      default: "",
    },
    frequency: {
      type: String,
      required: true,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    targetDays: {
      type: [Number],
      default: [],
    },
    completions: {
      type: [CompletionSchema],
      default: [],
    },
    streak: {
      type: Number,
      default: 0,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
HabitSchema.index({ archived: 1, createdAt: -1 });

const HabitCollectionModel =
  (models.HabitCollection as Model<IHabit>) ||
  model<IHabit>("HabitCollection", HabitSchema);

export default HabitCollectionModel;