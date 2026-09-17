export const CALC_IDS = [
  'calories-calculator',
  'imt-calculator',
  'fat-calculator',
] as const;
export type CalcId = (typeof CALC_IDS)[number];

export function isCalcId(value: unknown): value is CalcId {
  return typeof value === 'string' && (CALC_IDS as readonly string[]).includes(value);
}

export const RATING_MIN = 1;
export const RATING_MAX = 5;

export function isValidRatingValue(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= RATING_MIN &&
    value <= RATING_MAX
  );
}

export const MIN_RATING_COUNT = 5;

export function isPublishable(count: number): boolean {
  return count >= MIN_RATING_COUNT;
}

export function averageOf(sum: number, count: number): number {
  if (count <= 0) return 0;
  return Math.round((sum / count) * 10) / 10;
}

export interface RatingStats {
  average: number;
  count: number;
}

export interface AggregateRatingJsonLd {
  '@type': 'AggregateRating';
  ratingValue: string;
  ratingCount: number;
  bestRating: number;
  worstRating: number;
}

export function buildAggregateRating(
  stats: RatingStats | null | undefined
): AggregateRatingJsonLd | undefined {
  if (!stats || !isPublishable(stats.count)) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: stats.average.toFixed(1),
    ratingCount: stats.count,
    bestRating: RATING_MAX,
    worstRating: RATING_MIN,
  };
}

export function ratingStorageKey(calcId: CalcId): string {
  return `calc_rating_${calcId}`;
}

export function formatRating(average: number): string {
  return average.toFixed(1).replace('.', ',');
}
