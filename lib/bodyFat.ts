import type { Sex } from './calories';

export const FAT_LIMITS = {
  height: { min: 120, max: 230 },
  neck: { min: 20, max: 60 },
  waist: { min: 40, max: 200 },
  hip: { min: 50, max: 200 },
  age: { min: 14, max: 100 },
  skinfold: { min: 1, max: 100 },
  weight: { min: 30, max: 250 },
} as const;

export type FatMethod = 'tape' | 'caliper';

export interface TapeMeasures {
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number | null;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

// Метод ВМС США (Hodgdon & Beckett, 1984), сантиметрові коефіцієнти.
export function navyBodyFat(sex: Sex, m: TapeMeasures): number | null {
  const { heightCm, neckCm, waistCm, hipCm } = m;
  if (sex === 'male') {
    if (waistCm <= neckCm) return null;
    const density =
      1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
    return round1(495 / density - 450);
  }
  if (hipCm == null || waistCm + hipCm <= neckCm) return null;
  const density =
    1.29579 -
    0.35004 * Math.log10(waistCm + hipCm - neckCm) +
    0.221 * Math.log10(heightCm);
  return round1(495 / density - 450);
}

// Джексон-Поллок за трьома складками (чоловіки: груди, живіт, стегно;
// жінки: трицепс, над клубовою кісткою (suprailiac), стегно).
export function jacksonPollockBodyFat(sex: Sex, age: number, sumMm: number): number {
  const density =
    sex === 'male'
      ? 1.10938 - 0.0008267 * sumMm + 0.0000016 * sumMm ** 2 - 0.0002574 * age
      : 1.0994921 - 0.0009929 * sumMm + 0.0000023 * sumMm ** 2 - 0.0001392 * age;
  return round1(495 / density - 450);
}

export interface FatCategory {
  max: number;
  label: string;
  note: string;
}

export const FAT_CATEGORIES: Record<Sex, FatCategory[]> = {
  male: [
    { max: 6, label: 'Мінімальний рівень', note: 'Мінімальний відсоток жиру, характерний для змагального періоду.' },
    { max: 13, label: 'Спортсмен, атлетична статура', note: 'Малий відсоток жиру, підтягнута атлетична статура.' },
    { max: 17, label: 'Гарна фізична форма', note: 'Невеликий відсоток жиру. Любитель спорту з малою кількістю жиру.' },
    { max: 21, label: 'Середній рівень', note: 'Середній рівень жиру. Звичайна статура, середній рівень фізичної активності.' },
    { max: 25, label: 'Прийнятний рівень', note: 'Прийнятний рівень жиру. Невисокий рівень форми, жир у проблемних місцях.' },
    { max: Infinity, label: 'Зайва вага', note: 'Зайва вага. Дефіцит калорій і силові тренування повернуть форму.' },
  ],
  female: [
    { max: 10, label: 'Виснаження (небезпечно)', note: 'Небезпечно для жіночого організму: може призвести до припинення менструального циклу.' },
    { max: 14, label: 'Мінімальний для здоровʼя', note: 'Мінімальний відсоток для здорової життєдіяльності організму.' },
    { max: 16, label: 'Спортсменка, атлетична статура', note: 'Невеликий відсоток жиру, атлетична статура.' },
    { max: 20, label: 'Аматорка спорту, гарна форма', note: 'Хороша фізична форма з невеликими жировими запасами.' },
    { max: 24, label: 'Прийнятний рівень', note: 'Звичайна статура, середній рівень фізичної активності.' },
    { max: 30, label: 'Середній рівень', note: 'Звичайна статура, низький рівень фізичної активності.' },
    { max: Infinity, label: 'Зайва вага', note: 'Зайва вага. Дефіцит калорій і силові тренування повернуть форму.' },
  ],
};

export function bodyFatCategory(sex: Sex, pct: number): FatCategory {
  const list = FAT_CATEGORIES[sex];
  return list.find(c => pct < c.max) ?? list[list.length - 1];
}

export function fatRangeLabel(list: FatCategory[], index: number): string {
  const current = list[index];
  if (index === 0) return `до ${current.max}%`;
  const previous = list[index - 1].max;
  if (!Number.isFinite(current.max)) return `понад ${previous}%`;
  return `${previous}–${current.max}%`;
}

export const HEALTHY_RANGE: Record<Sex, [number, number]> = {
  male: [12, 20],
  female: [16, 24],
};

export function fatMassKg(weightKg: number, pct: number): number {
  return round1((weightKg * pct) / 100);
}

export function leanMassKg(weightKg: number, pct: number): number {
  return round1(round1(weightKg) - fatMassKg(weightKg, pct));
}

export function formatPercent(pct: number): string {
  return pct.toFixed(1).replace('.', ',');
}

export const PLAUSIBLE_RANGE: [number, number] = [2, 70];

export function isPlausibleBodyFat(pct: number): boolean {
  return pct >= PLAUSIBLE_RANGE[0] && pct <= PLAUSIBLE_RANGE[1];
}
