/**
 * Select a random offer based on probability weights
 * Mirrors frontend offer.logic.js
 */
export function selectRandomOffer(offers) {
  if (!offers || !offers.length) {
    return null;
  }

  const totalProbability = offers.reduce(
    (total, offer) => total + Number(offer.probability),
    0
  );

  if (totalProbability <= 0) {
    return null;
  }

  const random = Math.random() * totalProbability;
  let cumulativeProbability = 0;

  for (const offer of offers) {
    cumulativeProbability += Number(offer.probability);

    if (random < cumulativeProbability) {
      return offer;
    }
  }

  return offers[offers.length - 1];
}
