import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["gift", "cashback", "none"],
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Offer = mongoose.model("Offer", offerSchema);
