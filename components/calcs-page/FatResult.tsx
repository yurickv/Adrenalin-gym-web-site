import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';
import { toPositiveNumber } from '@/lib/toPositiveNumber';
import {
  bodyFatCategory,
  FAT_LIMITS,
  fatMassKg,
  formatPercent,
  HEALTHY_RANGE,
  isPlausibleBodyFat,
  jacksonPollockBodyFat,
  leanMassKg,
  navyBodyFat,
  PLAUSIBLE_RANGE,
  type FatMethod,
} from '@/lib/bodyFat';

export type FatField =
  | 'height'
  | 'neck'
  | 'waist'
  | 'hip'
  | 'age'
  | 'skinFold'
  | 'skinFoldW'
  | 'skinFoldL'
  | 'weight';

export interface FatResultProps {
  method: FatMethod;
  sex: Sex;
  values: Record<FatField, string>;
}

type Limit = { min: number; max: number };

function validNumber(value: string, limit: Limit): number | null {
  const n = toPositiveNumber(value);
  return n !== null && rangeError(value, limit.min, limit.max) === undefined ? n : null;
}

const valueClass = 'font-semibold text-mainTitle dark:text-mainTitleBlack';

export const FatResult = ({ method, sex, values }: FatResultProps) => {
  let pct: number | null = null;
  let ready = false;
  let hint = 'Введіть виміри, щоб побачити відсоток жиру, категорію і кілограми жиру.';

  if (method === 'tape') {
    const height = validNumber(values.height, FAT_LIMITS.height);
    const neck = validNumber(values.neck, FAT_LIMITS.neck);
    const waist = validNumber(values.waist, FAT_LIMITS.waist);
    const hip = sex === 'female' ? validNumber(values.hip, FAT_LIMITS.hip) : null;
    ready = height !== null && neck !== null && waist !== null && (sex === 'male' || hip !== null);
    if (ready && height !== null && neck !== null && waist !== null) {
      pct = navyBodyFat(sex, { heightCm: height, neckCm: neck, waistCm: waist, hipCm: hip });
      if (pct === null) {
        hint =
          sex === 'male'
            ? 'Перевірте виміри: обхват талії має бути більшим за обхват шиї.'
            : 'Перевірте виміри: талія і стегна разом мають бути більшими за шию.';
      }
    }
  } else {
    const age = validNumber(values.age, FAT_LIMITS.age);
    const folds = [values.skinFold, values.skinFoldW, values.skinFoldL].map(v =>
      validNumber(v, FAT_LIMITS.skinfold)
    );
    ready = age !== null && folds.every(f => f !== null);
    if (ready && age !== null) {
      const sum = folds.reduce<number>((acc, f) => acc + (f ?? 0), 0);
      pct = jacksonPollockBodyFat(sex, age, sum);
    }
  }

  if (pct !== null && !isPlausibleBodyFat(pct)) {
    pct = null;
    const cause =
      method === 'tape'
        ? 'Найчастіше причина в обхватах талії і шиї.'
        : 'Найчастіше причина в товщині складок або віці.';
    hint = `Перевірте виміри: результат поза можливим діапазоном ${PLAUSIBLE_RANGE[0]}–${PLAUSIBLE_RANGE[1]}%. ${cause}`;
  }

  const weight = validNumber(values.weight, FAT_LIMITS.weight);
  const [healthyMin, healthyMax] = HEALTHY_RANGE[sex];

  let summary = 'Результат зʼявиться після введення вимірів';
  let body: ReactNode = (
    <p className="text-neutral-600 dark:text-mainTextBlack">{hint}</p>
  );

  if (pct !== null) {
    const category = bodyFatCategory(sex, pct);
    summary = `Відсоток жиру ${formatPercent(pct)}, ${category.label}`;
    body = (
      <>
        <div className="flex flex-col gap-2 text-left">
          <p className="text-lg font-bold text-mainTitle dark:text-mainTitleBlack">
            Відсоток жиру:{' '}
            <span className="text-orange-800 dark:text-mainTitleBlack">{formatPercent(pct)}%</span>
          </p>
          <p className="font-semibold text-mainTitle dark:text-mainTitleBlack">{category.label}</p>
          <p className="text-neutral-700 dark:text-mainTextBlack">{category.note}</p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-neutral-700 dark:text-mainTextBlack">
          <dt>Здоровий діапазон для {sex === 'male' ? 'чоловіків' : 'жінок'}</dt>
          <dd className={valueClass}>
            {healthyMin}–{healthyMax}%
          </dd>
          {weight !== null && (
            <>
              <dt>Жирова маса</dt>
              <dd className={valueClass}>{formatPercent(fatMassKg(weight, pct))} кг</dd>
              <dt>Суха маса</dt>
              <dd className={valueClass}>{formatPercent(leanMassKg(weight, pct))} кг</dd>
            </>
          )}
        </dl>
        <p className="text-left text-sm text-neutral-600 dark:text-mainTextBlack">
          Наступний крок:{' '}
          <Link
            href="/calcs/calories-calculator"
            className="font-semibold underline text-mainTitle dark:text-mainTitleBlack"
          >
            розрахуйте денну норму калорій і дефіцит для схуднення
          </Link>
          .
        </p>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <p className="sr-only" aria-live="polite">
        {summary}
      </p>
      {body}
    </div>
  );
};
