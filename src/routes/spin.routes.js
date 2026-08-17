import { Router } from "express";
import {
  recordSpin,
  getAllSpins,
  getSpinsByCustomer,
  getSpinsBySession,
} from "../services/spin.service.js";
import { getActiveSession } from "../services/session.service.js";
import { getActiveOffers } from "../services/offer.service.js";
import { selectRandomOffer } from "../utils/probability.js";
import { completeSession } from "../services/session.service.js";
import { getSessionById } from "../services/session.service.js";
import { ApiError } from "../middleware/errorHandler.js";

const router = Router();

/**
 * POST /api/spins/spin
 * Customer spins the wheel
 * Backend:
 * 1. Verify active session exists
 * 2. Verify customer hasn't already spun
 * 3. Select reward (probability-weighted)
 * 4. Record spin in DB
 * 5. Update session status
 * 6. Return reward to frontend
 */
router.post("/spin", async (req, res, next) => {
  try {
    const session = await getActiveSession();

    if (!session) {
      throw new ApiError(400, "No active session", "NO_ACTIVE_SESSION");
    }

    // Verify one-spin enforcement
    if (session.spinsUsed >= session.spinsAllowed) {
      throw new ApiError(
        400,
        "Already used all available spins",
        "SPINS_EXHAUSTED"
      );
    }

    // Get active offers
    const offers = await getActiveOffers();

    if (!offers.length) {
      throw new ApiError(400, "No active offers available", "NO_OFFERS");
    }

    // Select random offer based on probability
    const selectedOffer = selectRandomOffer(offers);

    if (!selectedOffer) {
      throw new ApiError(500, "Failed to select reward", "SELECTION_ERROR");
    }

    // Record spin
    const spin = await recordSpin(
      session.customerId._id,
      session._id,
      session.billAmount,
      selectedOffer._id
    );

    // Complete session
    const completedSession = await completeSession(session._id, selectedOffer._id);

    res.status(201).json({
      success: true,
      data: {
        rewardId: selectedOffer._id,
        rewardName: selectedOffer.name,
        rewardType: selectedOffer.type,
        rewardValue: selectedOffer.value,
        sessionStatus: completedSession.status,
      },
      message: "Spin recorded successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/spins
 * Get all spins (admin/history)
 */
router.get("/", async (req, res, next) => {
  try {
    const { limit = 100, skip = 0 } = req.query;
    const result = await getAllSpins(Number(limit), Number(skip));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/spins/customer/:customerId
 * Get spins by customer ID (customer history)
 */
router.get("/customer/:customerId", async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const result = await getSpinsByCustomer(
      customerId,
      Number(limit),
      Number(skip)
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/spins/session/:sessionId
 * Get spins by session ID
 */
router.get("/session/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const spins = await getSpinsBySession(sessionId);

    res.status(200).json({
      success: true,
      data: spins,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
