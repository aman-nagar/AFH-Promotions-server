import { Router } from "express";
import {
  getAllOffers,
  getActiveOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOffer,
} from "../services/offer.service.js";
import { ApiError } from "../middleware/errorHandler.js";

const router = Router();

/**
 * GET /api/offers/active
 * Get only active offers (for spin wheel)
 */
router.get("/active", async (req, res, next) => {
  try {
    const offers = await getActiveOffers();

    res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/offers
 * Get all offers (admin)
 */
router.get("/", async (req, res, next) => {
  try {
    const offers = await getAllOffers();

    res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/offers/:id
 * Get single offer by ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await getOfferById(id);

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/offers
 * Create new offer
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, type, value, probability } = req.body;

    const offer = await createOffer(name, type, value, probability);

    res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/offers/:id
 * Update offer
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const offer = await updateOffer(id, updates);

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/offers/:id
 * Delete offer
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await deleteOffer(id);

    res.status(200).json({
      success: true,
      data: offer,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/offers/:id/toggle
 * Toggle offer active status
 */
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await toggleOffer(id);

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
