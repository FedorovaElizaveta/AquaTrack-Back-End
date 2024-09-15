import { model, Schema } from "mongoose";

const waterSchema = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const WaterCollection = model("WaterCollection", waterSchema);
