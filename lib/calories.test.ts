import { describe, it, expect } from 'vitest';
import {
  ACTIVITY_LEVELS,
  bmrMifflin,
  formatKg,
  goalTarget,
  LIMITS,
  macros,
  safeMinimum,
  targets,
  tdee,
  weeklyLossKg,
} from './calories';

const woman = { sex: 'female' as const, weightKg: 65, heightCm: 170, age: 30 };
const man = { sex: 'male' as const, weightKg: 80, heightCm: 180, age: 30 };

describe('bmrMifflin', () => {
  it('computes the Mifflin-St Jeor BMR for a woman (rounded)', () => {
    // 10*65 + 6.25*170 - 5*30 - 161 = 1401.5 -> 1402
    expect(bmrMifflin(woman)).toBe(1402);
  });

  it('computes the Mifflin-St Jeor BMR for a man', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(bmrMifflin(man)).toBe(1780);
  });
});

describe('tdee', () => {
  it('multiplies BMR by the activity factor and rounds to a whole kcal', () => {
    expect(tdee(1402, 1.55)).toBe(2173);
    expect(tdee(1780, 1.2)).toBe(2136);
  });
});

describe('targets', () => {
  it('rounds every target to 10 kcal', () => {
    expect(targets(2173)).toEqual({
      loss20: 1740,
      loss15: 1850,
      loss10: 1960,
      maintain: 2170,
      gain10: 2390,
      gain15: 2500,
    });
  });
});

describe('goalTarget', () => {
  const t = targets(2173);
  it('uses -15% for loss, maintain for maintain, +10% for gain', () => {
    expect(goalTarget(t, 'loss')).toBe(1850);
    expect(goalTarget(t, 'maintain')).toBe(2170);
    expect(goalTarget(t, 'gain')).toBe(2390);
  });
});

describe('macros', () => {
  it('gives 1.8 g/kg protein, 25% fat and the rest as carbs for loss', () => {
    // protein 1.8*65 = 117 g; fat 1850*0.25/9 = 51 g; carbs (1850-468-459)/4 = 231 g
    expect(macros(1850, 65, 'loss')).toEqual({ proteinG: 117, fatG: 51, carbsG: 231 });
  });

  it('uses 1.6 g/kg for maintain and 2.0 g/kg for gain', () => {
    expect(macros(2170, 65, 'maintain').proteinG).toBe(104);
    expect(macros(2390, 65, 'gain').proteinG).toBe(130);
  });

  it('never returns negative carbs', () => {
    expect(macros(800, 120, 'gain').carbsG).toBe(0);
  });
});

describe('safeMinimum', () => {
  it('is 1200 kcal for women and 1500 kcal for men', () => {
    expect(safeMinimum('female')).toBe(1200);
    expect(safeMinimum('male')).toBe(1500);
  });
});

describe('weeklyLossKg', () => {
  it('converts a daily deficit into kg of fat per week with two decimals', () => {
    expect(weeklyLossKg(300)).toBe(0.27);
    expect(weeklyLossKg(500)).toBe(0.45);
  });
});

describe('ACTIVITY_LEVELS', () => {
  it('lists the five standard factors in ascending order', () => {
    expect(ACTIVITY_LEVELS.map(l => l.value)).toEqual([1.2, 1.375, 1.55, 1.725, 1.9]);
  });
});

describe('targets rounding', () => {
  it('rounds .5 boundaries up despite floating point noise', () => {
    // 2700 * 1.15 = 3104.9999999999995 in IEEE-754; exact decimal is 3105 -> 3110
    expect(targets(2700).gain15).toBe(3110);
  });
});

describe('formatKg', () => {
  it('formats with two decimals and a comma separator', () => {
    expect(formatKg(0.2727)).toBe('0,27');
    expect(formatKg(0.5)).toBe('0,50');
  });
});

describe('LIMITS', () => {
  it('matches the agreed form ranges', () => {
    expect(LIMITS).toEqual({
      age: { min: 14, max: 100 },
      height: { min: 120, max: 230 },
      weight: { min: 30, max: 250 },
    });
  });
});
