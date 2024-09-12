import { model, Schema } from "mongoose";

const waterSchema = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    norm: { type: Number, required: true },
    percentage: { type: Number },
    owner: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const Water = model("Water", waterSchema);
