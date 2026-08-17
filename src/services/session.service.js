import { Session } from "../models/Session.js";
import { getSpinEligibility } from "../utils/eligibility.js";
import { ApiError } from "../middleware/errorHandler.js";

/**
 * Get current active session (only one at a time)
 */
export async function getActiveSession() {
  const session = await Session.findOne({ status: "active" })
    .populate("customerId")
    .populate("rewardId");

  return session;
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId) {
  const session = await Session.findById(sessionId)
    .populate("customerId")
    .populate("rewardId");

  if (!session) {
    throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");
  }

  return session;
}

/**
 * Activate new session for a customer
 * - Only one active session allowed at a time
 * - If previous session exists, mark as completed
 * - Bill eligibility is verified
 */
export async function activateSession(customerId, billAmount) {
  const billAmountNum = Number(billAmount);

  if (!customerId || billAmountNum <= 0) {
    throw new ApiError(400, "Invalid customer or bill amount", "INVALID_INPUT");
  }

  // Check bill eligibility
  const spinsAllowed = getSpinEligibility(billAmountNum);

  if (spinsAllowed === 0) {
    throw new ApiError(
      400,
      "Bill amount not eligible for spins",
      "NOT_ELIGIBLE"
    );
  }

  // End any existing active session
  const existingActive = await Session.findOne({ status: "active" });

  if (existingActive) {
    existingActive.status = "completed";
    existingActive.completedAt = new Date();
    await existingActive.save();
  }

  // Create new session
  const session = new Session({
    customerId,
    billAmount: billAmountNum,
    status: "active",
    spinsAllowed,
    spinsUsed: 0,
    rewardId: null,
    completedAt: null,
  });

  await session.save();
  return session.populate("customerId");
}

/**
 * Complete session after spin is used
 */
export async function completeSession(sessionId, rewardId) {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");
  }

  if (session.status !== "active") {
    throw new ApiError(400, "Session is not active", "INVALID_SESSION");
  }

  session.status = "completed";
  session.spinsUsed += 1;
  session.rewardId = rewardId;
  session.completedAt = new Date();

  await session.save();
  
  // Populate and return fresh session
  const completedSession = await Session.findById(sessionId)
    .populate("customerId")
    .populate("rewardId");
  
  return completedSession;
}

/**
 * Cancel session (staff action)
 */
export async function cancelSession(sessionId) {
  const session = await getSessionById(sessionId);

  session.status = "cancelled";
  session.completedAt = new Date();

  await session.save();
  return session;
}

/**
 * Get all sessions (admin/history)
 */
export async function getAllSessions(limit = 100, skip = 0) {
  const sessions = await Session.find()
    .populate("customerId")
    .populate("rewardId")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Session.countDocuments();

  return {
    sessions,
    total,
    limit,
    skip,
  };
}
