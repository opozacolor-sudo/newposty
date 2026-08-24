export const PRESALE_TRANCHES = [
  { tranche: 1, slotsFrom: 1, slotsTo: 300, priceEur: 100 },
  { tranche: 2, slotsFrom: 301, slotsTo: 600, priceEur: 150 },
  { tranche: 3, slotsFrom: 601, slotsTo: 900, priceEur: 200 },
  { tranche: 4, slotsFrom: 901, slotsTo: 1200, priceEur: 250 },
  { tranche: 5, slotsFrom: 1201, slotsTo: 1500, priceEur: 300 },
] as const;

export const PRESALE_TOTAL_SLOTS = 1500;
export const PRESALE_TOKEN_TTL_DAYS = 7;
export const PRESALE_TRANCHE_SIZE = 300;
