import mongoose from "mongoose";
import "../models/Customer.js";
import "../models/Offer.js";
import "../models/Session.js";
import "../models/Spin.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
