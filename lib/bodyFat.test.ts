import { describe, it, expect } from 'vitest';
import {
  bodyFatCategory,
  FAT_CATEGORIES,
  FAT_LIMITS,
  fatMassKg,
  fatRangeLabel,
  formatPercent,
  HEALTHY_RANGE,
  isPlausibleBodyFat,
  jacksonPollockBodyFat,
  leanMassKg,
  navyBodyFat,
} from './bodyFat';

describe('navyBodyFat', () => {
  it('matches the US Navy formula for men', () => {
    expect(navyBodyFat('male', { heightCm: 180, neckCm: 38, waistCm: 90 })).toBe(19.8);
    expect(navyBodyFat('male', { heightCm: 175, neckCm: 40, waistCm: 80 })).toBe(11.1);
  });

  it('matches the US Navy formula for women', () => {
    expect(
      navyBodyFat('female', { heightCm: 165, neckCm: 33, waistCm: 75, hipCm: 98 })
    ).toBe(28.4);
  });

  it('returns null for impossible tape measures', () => {
    expect(navyBodyFat('male', { heightCm: 180, neckCm: 38, waistCm: 35 })).toBeNull();
    expect(navyBodyFat('female', { heightCm: 165, neckCm: 33, waistCm: 75 })).toBeNull();
    expect(
      navyBodyFat('female', { heightCm: 165, neckCm: 90, waistCm: 40, hipCm: 50 })
    ).toBeNull();
  });
});

describe('jacksonPollockBodyFat', () => {
  it('keeps the existing three-site formulas', () => {
    expect(jacksonPollockBodyFat('male', 30, 60)).toBe(17.9);
    expect(jacksonPollockBodyFat('female', 30, 60)).toBe(24.1);
  });
});

describe('bodyFatCategory', () => {
  it('uses strict upper bounds per sex', () => {
    expect(bodyFatCategory('male', 5.9).label).toBe('Мінімальний рівень');
    expect(bodyFatCategory('male', 6).label).toBe('Спортсмен, атлетична статура');
    expect(bodyFatCategory('male', 19.8).label).toBe('Середній рівень');
    expect(bodyFatCategory('male', 40).label).toBe('Зайва вага');
    expect(bodyFatCategory('female', 28.4).label).toBe('Середній рівень');
    expect(bodyFatCategory('female', 9).label).toBe('Виснаження (небезпечно)');
  });

  it('has six male and seven female categories with labels and notes', () => {
    expect(FAT_CATEGORIES.male).toHaveLength(6);
    expect(FAT_CATEGORIES.female).toHaveLength(7);
    for (const sex of ['male', 'female'] as const) {
      for (const c of FAT_CATEGORIES[sex]) {
        expect(c.label.length).toBeGreaterThan(0);
        expect(c.note.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('fatRangeLabel', () => {
  it('renders "до", ranges and "понад" for table rows', () => {
    expect(fatRangeLabel(FAT_CATEGORIES.male, 0)).toBe('до 6%');
    expect(fatRangeLabel(FAT_CATEGORIES.male, 1)).toBe('6–13%');
    expect(fatRangeLabel(FAT_CATEGORIES.male, 5)).toBe('понад 25%');
    expect(fatRangeLabel(FAT_CATEGORIES.female, 6)).toBe('понад 30%');
  });
});

describe('mass helpers', () => {
  it('split weight into fat and lean mass with one decimal', () => {
    expect(fatMassKg(80, 19.8)).toBe(15.8);
    expect(leanMassKg(80, 19.8)).toBe(64.2);
  });
});

describe('formatPercent', () => {
  it('uses one decimal and a comma', () => {
    expect(formatPercent(19.8)).toBe('19,8');
    expect(formatPercent(18)).toBe('18,0');
  });
});

describe('isPlausibleBodyFat', () => {
  it('accepts 2–70% and rejects the rest', () => {
    expect(isPlausibleBodyFat(2)).toBe(true);
    expect(isPlausibleBodyFat(70)).toBe(true);
    expect(isPlausibleBodyFat(1.9)).toBe(false);
    expect(isPlausibleBodyFat(-91.7)).toBe(false);
  });
});

describe('constants', () => {
  it('exposes the agreed limits and healthy ranges', () => {
    expect(FAT_LIMITS.neck).toEqual({ min: 20, max: 60 });
    expect(FAT_LIMITS.weight).toEqual({ min: 30, max: 250 });
    expect(HEALTHY_RANGE.male).toEqual([12, 20]);
    expect(HEALTHY_RANGE.female).toEqual([16, 24]);
  });
});

describe('fat and lean mass', () => {
  it('always sum to the entered weight', () => {
    for (let w = 40; w <= 120; w += 0.5) {
      for (let p = 2; p <= 70; p = Math.round((p + 0.1) * 10) / 10) {
        expect(fatMassKg(w, p) + leanMassKg(w, p)).toBeCloseTo(Math.round(w * 10) / 10, 5);
      }
    }
  });
});

describe('category boundaries', () => {
  it('switches category exactly at every threshold', () => {
    const male = [6, 13, 17, 21, 25];
    male.forEach((t, i) => {
      expect(bodyFatCategory('male', t - 0.1)).toBe(FAT_CATEGORIES.male[i]);
      expect(bodyFatCategory('male', t)).toBe(FAT_CATEGORIES.male[i + 1]);
    });
    const female = [10, 14, 16, 20, 24, 30];
    female.forEach((t, i) => {
      expect(bodyFatCategory('female', t - 0.1)).toBe(FAT_CATEGORIES.female[i]);
      expect(bodyFatCategory('female', t)).toBe(FAT_CATEGORIES.female[i + 1]);
    });
  });

  it('table labels agree with the classifier', () => {
    for (const sex of ['male', 'female'] as const) {
      const list = FAT_CATEGORIES[sex];
      list.forEach((c, i) => {
        const label = fatRangeLabel(list, i);
        if (Number.isFinite(c.max)) {
          expect(label.endsWith(`${c.max}%`)).toBe(true);
          expect(bodyFatCategory(sex, c.max - 0.1)).toBe(c);
        } else {
          expect(label.startsWith('понад')).toBe(true);
        }
      });
    }
  });
});

describe('navyBodyFat implausible output', () => {
  it('goes far negative when waist barely exceeds neck, which isPlausibleBodyFat rejects', () => {
    const pct = navyBodyFat('male', { heightCm: 180, neckCm: 38, waistCm: 38.1 });
    expect(pct).not.toBeNull();
    expect(isPlausibleBodyFat(pct as number)).toBe(false);
  });
});
