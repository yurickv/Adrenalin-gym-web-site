export interface GymActivity {
  code: string;
  label: string;
  met: number;
}

// 2024 Adult Compendium of Physical Activities (pacompendium.com), перевірено 06.11.2026.
export const GYM_ACTIVITIES: readonly GymActivity[] = [
  { code: '02054', label: 'Силове тренування, 8–15 повторень', met: 3.5 },
  { code: '02050', label: 'Силове інтенсивне (пауерліфтинг, бодібілдинг)', met: 6.0 },
  { code: '02040', label: 'Кругове тренування, інтенсивне', met: 7.5 },
  { code: '01224', label: 'Велотренажер, 101–125 Вт', met: 6.8 },
  { code: '02048', label: 'Еліптичний тренажер, помірно', met: 5.0 },
  { code: '02071', label: 'Гребний тренажер, помірно', met: 5.0 },
  { code: '17355', label: 'Ходьба на доріжці, 4,8–5,5 км/год', met: 3.8 },
  { code: '12030', label: 'Біг, близько 8 км/год', met: 8.5 },
  { code: '02150', label: 'Йога (хатха)', met: 2.3 },
];

export const BURN_WEIGHTS = [60, 80] as const;

// ккал ≈ MET × вага (кг) × години; для однієї години, округлено до 10 ккал.
export function kcalPerHour(met: number, weightKg: number): number {
  return Math.round((met * weightKg) / 10) * 10;
}

export function formatMet(met: number): string {
  return met.toFixed(1).replace('.', ',');
}
