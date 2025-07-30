// src/lib/wermTypes.ts
import type { WormBalances } from "@/features/employees";
import { ComputedWermBalance } from "@/features/employees/types";

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
export function computeWormBalances(balances: WormBalances): ComputedWermBalance {
    const total_coins = balances.gold + balances.silver + balances.bronze;
    const total_werms =
      balances.gold * WERM_PRICES.gold + balances.silver * WERM_PRICES.silver + balances.bronze * WERM_PRICES.bronze;
  
    return {
      ...balances,
      total_werms,
      total_coins,
    };
}