/**
 * Get number of spins allowed based on bill amount
 * Mirrors frontend offer.rules.js
 */
export function getSpinEligibility(billAmount) {
  const amount = Number(billAmount);

  if (amount >= 3000) return 3;
  if (amount >= 2000) return 2;
  if (amount >= 1000) return 1;

  return 0;
}
