import mongoose, { model, Schema } from "mongoose";

const waterSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    gender: {
      type: String,
      enum: ["woman", "man"],
      default: "woman",
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    sportTime: {
      type: Number,
      default: 0,
    },
    dailyWater: {
      type: Number,
      default: 1.5,
    },
    avatar: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Water = model("Water", waterSchema);
