import { Router } from "express";
import {
  getActiveSession,
  getSessionById,
  activateSession,
  completeSession,
  cancelSession,
  getAllSessions,
} from "../services/session.service.js";
import { ApiError } from "../middleware/errorHandler.js";

const router = Router();

/**
 * GET /api/sessions/active
 * Get current active session (PUBLIC endpoint for QR page)
 * Returns minimal data (no sensitive customer info)
 */
router.get("/active", async (req, res, next) => {
  try {
    const session = await getActiveSession();

    if (!session) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No active session",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: session._id,
        status: session.status,
        spinsUsed: session.spinsUsed,
        spinsAllowed: session.spinsAllowed,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sessions/:id
 * Get session by ID (admin/staff)
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await getSessionById(id);

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/sessions/activate
 * Staff activates a new session for a customer
 * Request: { customerId, billAmount }
 */
router.post("/activate", async (req, res, next) => {
  try {
    const { customerId, billAmount } = req.body;

    const session = await activateSession(customerId, billAmount);

    res.status(201).json({
      success: true,
      data: session,
      message: "Session activated successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/sessions/:id/complete
 * Mark session as completed (called after successful spin)
 * Request: { rewardId }
 */
router.post("/:id/complete", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rewardId } = req.body;

    const session = await completeSession(id, rewardId);

    res.status(200).json({
      success: true,
      data: session,
      message: "Session completed",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/sessions/:id/cancel
 * Staff cancels a session
 */
router.delete("/:id/cancel", async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await cancelSession(id);

    res.status(200).json({
      success: true,
      data: session,
      message: "Session cancelled",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sessions
 * Get all sessions (admin/history)
 */
router.get("/", async (req, res, next) => {
  try {
    const { limit = 100, skip = 0 } = req.query;
    const result = await getAllSessions(Number(limit), Number(skip));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
