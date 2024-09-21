import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['woman', 'man'],
      default: 'woman',
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
      default: 1500,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
