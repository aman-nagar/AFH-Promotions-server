import { Spin } from "../models/Spin.js";
import { ApiError } from "../middleware/errorHandler.js";

/**
 * Record a completed spin for a customer session
 */
export async function recordSpin(customerId, sessionId, billAmount, rewardId) {
  if (!customerId || !sessionId || !rewardId) {
    throw new ApiError(400, "Invalid spin data", "INVALID_SPIN");
  }

  const spin = new Spin({
    customerId,
    sessionId,
    billAmount: Number(billAmount),
    rewardId,
  });

  await spin.save();

  const savedSpin = await Spin.findById(spin._id)
    .populate("customerId")
    .populate("rewardId");

  return savedSpin;
}

/**
 * Record a guest/customer spin without requiring an active session.
 * Used for mobile customer flow.
 */
export async function recordGuestSpin(deviceId, rewardId) {
  if (!deviceId || !rewardId) {
    throw new ApiError(400, "Invalid guest spin data", "INVALID_GUEST_SPIN");
  }

  const spin = new Spin({
    customerId: null,
    sessionId: null,
    deviceId,
    billAmount: 0,
    rewardId,
  });

  await spin.save();

  return await Spin.findById(spin._id).populate("rewardId");
}

/**
 * Get all spins (admin view)
 */
export async function getAllSpins(limit = 100, skip = 0) {
  const spins = await Spin.find()
    .populate("customerId")
    .populate("sessionId")
    .populate("rewardId")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Spin.countDocuments();

  return {
    spins,
    total,
    limit,
    skip,
  };
}

/**
 * Get spins by customer ID
 */
export async function getSpinsByCustomer(customerId, limit = 50, skip = 0) {
  const spins = await Spin.find({ customerId })
    .populate("sessionId")
    .populate("rewardId")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Spin.countDocuments({ customerId });

  return {
    spins,
    total,
    limit,
    skip,
  };
}

/**
 * Get spins by session ID
 */
export async function getSpinsBySession(sessionId) {
  const spins = await Spin.find({ sessionId })
    .populate("customerId")
    .populate("rewardId");

  return spins;
}
