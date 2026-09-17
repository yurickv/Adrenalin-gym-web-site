import type { Sex } from './calories';

export const BMI_LIMITS = {
  height: { min: 120, max: 230 },
  weight: { min: 30, max: 250 },
  age: { min: 18, max: 100 },
} as const;

export type BmiCategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese1'
  | 'obese2'
  | 'obese3';

export const BMI_CATEGORY_ORDER: BmiCategory[] = [
  'underweight',
  'normal',
  'overweight',
  'obese1',
  'obese2',
  'obese3',
];

export const BMI_CATEGORY_LABELS: Record<
  BmiCategory,
  { label: string; range: string; advice: string }
> = {
  underweight: {
    label: 'Недостатня вага',
    range: 'менше 18,5',
    advice:
      'Варто набрати вагу: додайте калорій і білка, а якщо вага падає без причини, зверніться до лікаря.',
  },
  normal: {
    label: 'Норма',
    range: '18,5–24,9',
    advice:
      'Вага в нормі. Підтримуйте її регулярними тренуваннями і збалансованим харчуванням.',
  },
  overweight: {
    label: 'Надлишкова вага',
    range: '25,0–29,9',
    advice:
      'Помірний дефіцит калорій і силові тренування допоможуть повернутися до норми.',
  },
  obese1: {
    label: 'Ожиріння I ступеня',
    range: '30,0–34,9',
    advice:
      'Почніть зі стабільного дефіциту калорій і щоденної активності, бажано під наглядом лікаря.',
  },
  obese2: {
    label: 'Ожиріння II ступеня',
    range: '35,0–39,9',
    advice:
      'Схуднення варто планувати разом із лікарем: ризики для серця і суглобів значні.',
  },
  obese3: {
    label: 'Ожиріння III ступеня',
    range: '40,0 і більше',
    advice:
      'Потрібна медична підтримка: зверніться до лікаря перед зміною харчування і тренувань.',
  },
};

export function bmi(weightKg: number, heightCm: number): number {
  const metres = heightCm / 100;
  return Math.round((weightKg / (metres * metres)) * 10) / 10;
}

export function bmiCategory(value: number): BmiCategory {
  if (value < 18.5) return 'underweight';
  if (value < 25) return 'normal';
  if (value < 30) return 'overweight';
  if (value < 35) return 'obese1';
  if (value < 40) return 'obese2';
  return 'obese3';
}

export interface WeightRange {
  min: number;
  max: number;
}

export function normalWeightRange(heightCm: number): WeightRange {
  const metresSquared = (heightCm / 100) ** 2;
  return {
    min: Math.round(18.5 * metresSquared),
    max: Math.round(24.9 * metresSquared),
  };
}

export function weightToNormal(weightKg: number, range: WeightRange): number {
  if (weightKg < range.min) return Math.round(range.min - weightKg);
  if (weightKg > range.max) return Math.round(range.max - weightKg);
  return 0;
}

export function devineIdealWeight(sex: Sex, heightCm: number): number | null {
  if (heightCm < 152) return null;
  const base = sex === 'male' ? 50 : 45.5;
  return Math.round(base + 0.9 * (heightCm - 152));
}

export interface AgeBmiNorm {
  from: number;
  to: number;
  min: number;
  max: number;
}

// Орієнтовна таблиця вікових норм; ВООЗ вік не коригує.
export const AGE_BMI_NORMS: AgeBmiNorm[] = [
  { from: 18, to: 24, min: 19, max: 24 },
  { from: 25, to: 34, min: 20, max: 25 },
  { from: 35, to: 44, min: 21, max: 26 },
  { from: 45, to: 54, min: 22, max: 27 },
  { from: 55, to: 64, min: 23, max: 28 },
  { from: 65, to: 100, min: 24, max: 29 },
];

export function ageBmiNorm(age: number): AgeBmiNorm | null {
  return AGE_BMI_NORMS.find(row => age >= row.from && age <= row.to) ?? null;
}

export const HEIGHT_TABLE_ROWS = [150, 155, 160, 165, 170, 175, 180, 185, 190, 195];

export function formatBmi(value: number): string {
  return value.toFixed(1).replace('.', ',');
}
