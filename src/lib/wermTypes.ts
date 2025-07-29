export type WermType = 'gold' | 'silver' | 'bronze';

export type WermBalances = {
  [key in WermType]: {
    count: number;
    total_value: number;
  };
} & {
  total_werms: number;
  total_value_aud: number;
};

export const WERM_PRICES: Record<WermType, number> = {
  gold: 10.0,
  silver: 3.0,
  bronze: 1.0
};