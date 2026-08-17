import { Offer } from "../models/Offer.js";

export const defaultOffers = [
  {
    name: "Perfume",
    type: "gift",
    value: 150,
    probability: 10,
    active: true,
  },
  {
    name: "Cap",
    type: "gift",
    value: 100,
    probability: 20,
    active: true,
  },
  {
    name: "Honey",
    type: "gift",
    value: 80,
    probability: 20,
    active: true,
  },
  {
    name: "₹50 Cashback",
    type: "cashback",
    value: 50,
    probability: 15,
    active: true,
  },
  {
    name: "₹20 Cashback",
    type: "cashback",
    value: 20,
    probability: 25,
    active: true,
  },
  {
    name: "Better Luck Next Time",
    type: "none",
    value: 0,
    probability: 10,
    active: true,
  },
];

/**
 * Seed default offers if database is empty
 */
export async function seedOffers() {
  try {
    const offerCount = await Offer.countDocuments();

    if (offerCount === 0) {
      console.log("Seeding default offers...");
      await Offer.insertMany(defaultOffers);
      console.log("✓ Default offers seeded");
    }
  } catch (error) {
    console.error("Seed offers error:", error.message);
  }
}
