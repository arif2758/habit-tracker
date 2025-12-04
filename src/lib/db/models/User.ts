import mongoose, { Schema, model, models, Model } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserCollectionModel =
  (models.UserCollection as Model<IUser>) ||
  model<IUser>("UserCollection", UserSchema);

export default UserCollectionModel;
