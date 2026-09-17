import { describe, it, expect } from 'vitest';
import {
  averageOf,
  buildAggregateRating,
  CALC_IDS,
  isCalcId,
  isPublishable,
  isValidRatingValue,
  MIN_RATING_COUNT,
  ratingStorageKey,
} from './calcRating';

describe('isCalcId', () => {
  it('accepts the three calculators and rejects anything else', () => {
    for (const id of CALC_IDS) expect(isCalcId(id)).toBe(true);
    expect(isCalcId('blog')).toBe(false);
    expect(isCalcId(undefined)).toBe(false);
  });
});

describe('isValidRatingValue', () => {
  it('accepts integers 1..5 only', () => {
    expect(isValidRatingValue(1)).toBe(true);
    expect(isValidRatingValue(5)).toBe(true);
    expect(isValidRatingValue(0)).toBe(false);
    expect(isValidRatingValue(6)).toBe(false);
    expect(isValidRatingValue(4.5)).toBe(false);
    expect(isValidRatingValue('5')).toBe(false);
    expect(isValidRatingValue(NaN)).toBe(false);
  });
});

describe('averageOf', () => {
  it('rounds to one decimal', () => {
    expect(averageOf(22, 5)).toBe(4.4);
    expect(averageOf(13, 3)).toBe(4.3);
  });

  it('returns 0 when there are no votes', () => {
    expect(averageOf(0, 0)).toBe(0);
  });
});

describe('isPublishable', () => {
  it(`needs at least ${MIN_RATING_COUNT} votes`, () => {
    expect(isPublishable(4)).toBe(false);
    expect(isPublishable(5)).toBe(true);
  });
});

describe('buildAggregateRating', () => {
  it('returns schema.org AggregateRating for publishable stats', () => {
    expect(buildAggregateRating({ average: 4.4, count: 12 })).toEqual({
      '@type': 'AggregateRating',
      ratingValue: '4.4',
      ratingCount: 12,
      bestRating: 5,
      worstRating: 1,
    });
  });

  it('returns undefined below the threshold or without stats', () => {
    expect(buildAggregateRating({ average: 5, count: 4 })).toBeUndefined();
    expect(buildAggregateRating(null)).toBeUndefined();
    expect(buildAggregateRating(undefined)).toBeUndefined();
  });
});

describe('ratingStorageKey', () => {
  it('namespaces the key by calculator', () => {
    expect(ratingStorageKey('calories-calculator')).toBe('calc_rating_calories-calculator');
  });
});
