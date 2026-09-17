import { describe, it, expect } from 'vitest';
import {
  AGE_BMI_NORMS,
  ageBmiNorm,
  bmi,
  BMI_CATEGORY_LABELS,
  BMI_CATEGORY_ORDER,
  bmiCategory,
  devineIdealWeight,
  formatBmi,
  HEIGHT_TABLE_ROWS,
  normalWeightRange,
  weightToNormal,
} from './bmi';

describe('bmi', () => {
  it('divides weight by squared height in metres and keeps one decimal', () => {
    expect(bmi(65, 170)).toBe(22.5);
    expect(bmi(80, 170)).toBe(27.7);
    expect(bmi(45, 160)).toBe(17.6);
  });
});

describe('bmiCategory', () => {
  it('follows the WHO cut-offs', () => {
    expect(bmiCategory(18.4)).toBe('underweight');
    expect(bmiCategory(18.5)).toBe('normal');
    expect(bmiCategory(24.9)).toBe('normal');
    expect(bmiCategory(25)).toBe('overweight');
    expect(bmiCategory(29.9)).toBe('overweight');
    expect(bmiCategory(30)).toBe('obese1');
    expect(bmiCategory(35)).toBe('obese2');
    expect(bmiCategory(40)).toBe('obese3');
  });

  it('has a label, range and advice for every category in display order', () => {
    expect(BMI_CATEGORY_ORDER).toHaveLength(6);
    for (const key of BMI_CATEGORY_ORDER) {
      const entry = BMI_CATEGORY_LABELS[key];
      expect(entry.label.length).toBeGreaterThan(0);
      expect(entry.range.length).toBeGreaterThan(0);
      expect(entry.advice.length).toBeGreaterThan(0);
    }
  });
});

describe('normalWeightRange', () => {
  it('maps BMI 18.5–24.9 to whole kilograms', () => {
    expect(normalWeightRange(170)).toEqual({ min: 53, max: 72 });
    expect(normalWeightRange(160)).toEqual({ min: 47, max: 64 });
  });
});

describe('weightToNormal', () => {
  it('is 0 inside the range, negative above it and positive below it', () => {
    const range = normalWeightRange(170);
    expect(weightToNormal(65, range)).toBe(0);
    expect(weightToNormal(80, range)).toBe(-8);
    expect(weightToNormal(45, normalWeightRange(160))).toBe(2);
  });
});

describe('devineIdealWeight', () => {
  it('uses 50 / 45.5 kg plus 0.9 kg per cm above 152', () => {
    expect(devineIdealWeight('male', 170)).toBe(66);
    expect(devineIdealWeight('female', 170)).toBe(62);
  });

  it('is not defined below 152 cm', () => {
    expect(devineIdealWeight('male', 150)).toBeNull();
  });
});

describe('ageBmiNorm', () => {
  it('returns the row for the age band', () => {
    expect(ageBmiNorm(30)).toEqual({ from: 25, to: 34, min: 20, max: 25 });
    expect(ageBmiNorm(65)).toEqual({ from: 65, to: 100, min: 24, max: 29 });
    expect(ageBmiNorm(100)?.min).toBe(24);
  });

  it('returns null outside 18–100', () => {
    expect(ageBmiNorm(17)).toBeNull();
    expect(ageBmiNorm(101)).toBeNull();
  });

  it('covers 18–100 without gaps', () => {
    for (let age = 18; age <= 100; age += 1) expect(ageBmiNorm(age)).not.toBeNull();
    expect(AGE_BMI_NORMS).toHaveLength(6);
  });
});

describe('HEIGHT_TABLE_ROWS', () => {
  it('lists 150–195 cm in 5 cm steps', () => {
    expect(HEIGHT_TABLE_ROWS[0]).toBe(150);
    expect(HEIGHT_TABLE_ROWS.at(-1)).toBe(195);
    expect(HEIGHT_TABLE_ROWS).toHaveLength(10);
  });
});

describe('formatBmi', () => {
  it('uses one decimal and a comma', () => {
    expect(formatBmi(22.5)).toBe('22,5');
    expect(formatBmi(20)).toBe('20,0');
  });
});
