// src/lib/wermTypes.ts
import type { WormBalances } from "@/features/employees";

export type WermType = 'gold' | 'silver' | 'bronze';

// Werm value = how many werms one unit is worth
export const WERM_PRICES: Record<WermType, number> = {
  gold: 32.0,
  silver: 8.0,
  bronze: 1.0,
};

/**
 * Compute total coins and total werms from simple counts.
 */
export function computeWormBalances(counts: Record<WermType, number>): WormBalances {
  const total_coins = counts.gold + counts.silver + counts.bronze;

  const total_werms =
    counts.gold * WERM_PRICES.gold +
    counts.silver * WERM_PRICES.silver +
    counts.bronze * WERM_PRICES.bronze;

  return {
    gold: counts.gold,
    silver: counts.silver,
    bronze: counts.bronze,
    total_coins,
    total_werms,
  };
}