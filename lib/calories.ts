export type Sex = 'male' | 'female';
export type Goal = 'loss' | 'maintain' | 'gain';

export interface BodyParams {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
}

export interface Targets {
  loss20: number;
  loss15: number;
  loss10: number;
  maintain: number;
  gain10: number;
  gain15: number;
}

export interface Macros {
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Сидячий спосіб життя (мало або зовсім без фізичних вправ)' },
  { value: 1.375, label: 'Легка активність (1-3 дні тренувань на тиждень)' },
  { value: 1.55, label: 'Помірно активний (3-5 днів тренувань на тиждень)' },
  { value: 1.725, label: 'Дуже активний (6-7 днів тренувань на тиждень)' },
  {
    value: 1.9,
    label: 'Надзвичайно активний (дуже інтенсивні фізичні вправи або фізична робота)',
  },
] as const;

export const PROTEIN_PER_KG: Record<Goal, number> = {
  loss: 1.8,
  maintain: 1.6,
  gain: 2.0,
};
export const FAT_SHARE = 0.25;
export const KCAL_PER_KG_FAT = 7700;

export const LIMITS = {
  age: { min: 14, max: 100 },
  height: { min: 120, max: 230 },
  weight: { min: 30, max: 250 },
} as const;

const round10 = (n: number) => Math.round(+(n / 10).toFixed(6)) * 10;

export function bmrMifflin({ sex, weightKg, heightCm, age }: BodyParams): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'male' ? base + 5 : base - 161);
}

export function tdee(bmr: number, activityFactor: number): number {
  return Math.round(bmr * activityFactor);
}

export function targets(tdeeKcal: number): Targets {
  return {
    loss20: round10(tdeeKcal * 0.8),
    loss15: round10(tdeeKcal * 0.85),
    loss10: round10(tdeeKcal * 0.9),
    maintain: round10(tdeeKcal),
    gain10: round10(tdeeKcal * 1.1),
    gain15: round10(tdeeKcal * 1.15),
  };
}

export function goalTarget(t: Targets, goal: Goal): number {
  if (goal === 'loss') return t.loss15;
  if (goal === 'gain') return t.gain10;
  return t.maintain;
}

export function macros(kcal: number, weightKg: number, goal: Goal): Macros {
  const proteinG = Math.round(PROTEIN_PER_KG[goal] * weightKg);
  const fatG = Math.round((kcal * FAT_SHARE) / 9);
  const carbsG = Math.max(0, Math.round((kcal - proteinG * 4 - fatG * 9) / 4));
  return { proteinG, fatG, carbsG };
}

export function safeMinimum(sex: Sex): number {
  return sex === 'female' ? 1200 : 1500;
}

export function weeklyLossKg(deficitPerDay: number): number {
  return Math.round(((deficitPerDay * 7) / KCAL_PER_KG_FAT) * 100) / 100;
}

export function formatKg(kg: number): string {
  return kg.toFixed(2).replace('.', ',');
}
