import { describe, it, expect } from 'vitest';
import { toPositiveNumber } from './toPositiveNumber';

describe('toPositiveNumber', () => {
  it('parses positive numbers and rejects empty, zero, negative and non-numeric input', () => {
    expect(toPositiveNumber('65')).toBe(65);
    expect(toPositiveNumber(' 65.5 ')).toBe(65.5);
    expect(toPositiveNumber('')).toBeNull();
    expect(toPositiveNumber('0')).toBeNull();
    expect(toPositiveNumber('-3')).toBeNull();
    expect(toPositiveNumber('abc')).toBeNull();
  });
});
