import { Offer } from "../models/Offer.js";
import { ApiError } from "../middleware/errorHandler.js";

/**
 * Get all offers
 */
export async function getAllOffers() {
  const offers = await Offer.find().sort({ createdAt: -1 });
  return offers;
}

/**
 * Get only active offers (for spin wheel)
 */
export async function getActiveOffers() {
  const offers = await Offer.find({ active: true });
  return offers;
}

/**
 * Get offer by ID
 */
export async function getOfferById(offerId) {
  const offer = await Offer.findById(offerId);

  if (!offer) {
    throw new ApiError(404, "Offer not found", "OFFER_NOT_FOUND");
  }

  return offer;
}

/**
 * Create new offer
 */
export async function createOffer(name, type, value, probability, imageUrl = "") {
  if (!name || !type) {
    throw new ApiError(400, "Name and type are required", "INVALID_OFFER");
  }

  const offer = new Offer({
    name: name.trim(),
    type,
    value: Number(value) || 0,
    probability: Number(probability) || 0,
    active: true,
    imageUrl: imageUrl ? imageUrl.trim() : "",
  });

  await offer.save();
  return offer;
}

/**
 * Update offer
 */
export async function updateOffer(offerId, updates) {
  const offer = await getOfferById(offerId);

  if (updates.name) offer.name = updates.name.trim();
  if (updates.type) offer.type = updates.type;
  if (typeof updates.value !== "undefined")
    offer.value = Number(updates.value);
  if (typeof updates.probability !== "undefined")
    offer.probability = Number(updates.probability);
  if (typeof updates.active !== "undefined") offer.active = updates.active;
  if (typeof updates.imageUrl !== "undefined")
    offer.imageUrl = updates.imageUrl ? updates.imageUrl.trim() : "";

  await offer.save();
  return offer;
}

/**
 * Delete offer
 */
export async function deleteOffer(offerId) {
  const offer = await getOfferById(offerId);
  await Offer.deleteOne({ _id: offerId });
  return offer;
}

/**
 * Toggle offer active status
 */
export async function toggleOffer(offerId) {
  const offer = await getOfferById(offerId);
  offer.active = !offer.active;
  await offer.save();
  return offer;
}
