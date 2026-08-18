import mongoose from "mongoose";

const spinSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
    deviceId: {
      type: String,
      default: null,
      index: true,
    },
    billAmount: {
      type: Number,
      default: 0,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Spin = mongoose.model("Spin", spinSchema);
