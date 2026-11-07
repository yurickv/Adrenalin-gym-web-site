import { describe, it, expect } from 'vitest';
import { BURN_WEIGHTS, GYM_ACTIVITIES, formatMet, kcalPerHour } from './activityBurn';

// [код Compendium 2024, ккал/год для 60 кг, ккал/год для 80 кг] — таблиця 6.3 спеку
const EXPECTED: Array<[string, number, number]> = [
  ['02054', 210, 280],
  ['02050', 360, 480],
  ['02040', 450, 600],
  ['01224', 410, 540],
  ['02048', 300, 400],
  ['02071', 300, 400],
  ['17355', 230, 300],
  ['12030', 510, 680],
  ['02150', 140, 180],
];

describe('kcalPerHour', () => {
  it('multiplies MET by body weight for one hour and rounds to 10 kcal', () => {
    expect(kcalPerHour(3.5, 60)).toBe(210);
    expect(kcalPerHour(3.8, 60)).toBe(230);
    expect(kcalPerHour(6.8, 80)).toBe(540);
  });
});

describe('GYM_ACTIVITIES', () => {
  it('lists the nine Compendium 2024 activities in table order with unique codes', () => {
    expect(GYM_ACTIVITIES.map(a => a.code)).toEqual(EXPECTED.map(([code]) => code));
    expect(new Set(GYM_ACTIVITIES.map(a => a.code)).size).toBe(GYM_ACTIVITIES.length);
  });

  it('gives the spec table values for 60 and 80 kg', () => {
    expect(BURN_WEIGHTS).toEqual([60, 80]);
    for (const [code, kcal60, kcal80] of EXPECTED) {
      const activity = GYM_ACTIVITIES.find(a => a.code === code)!;
      expect(BURN_WEIGHTS.map(w => kcalPerHour(activity.met, w))).toEqual([kcal60, kcal80]);
    }
  });
});

describe('formatMet', () => {
  it('prints one decimal with a comma', () => {
    expect(formatMet(6)).toBe('6,0');
    expect(formatMet(3.8)).toBe('3,8');
  });
});
