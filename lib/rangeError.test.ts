import { describe, it, expect } from 'vitest';
import { rangeError } from './rangeError';

describe('rangeError', () => {
  it('returns undefined for an empty string', () => {
    expect(rangeError('', 14, 100)).toBeUndefined();
  });

  it('returns undefined for a value inside the range, inclusive', () => {
    expect(rangeError('14', 14, 100)).toBeUndefined();
    expect(rangeError('100', 14, 100)).toBeUndefined();
  });

  it('reports values below the minimum', () => {
    expect(rangeError('13', 14, 100)).toBe('Не менше 14');
  });

  it('reports values above the maximum', () => {
    expect(rangeError('101', 14, 100)).toBe('Не більше 100');
  });

  it('treats non-numeric input as below the minimum', () => {
    expect(rangeError('abc', 14, 100)).toBe('Не менше 14');
  });
});
