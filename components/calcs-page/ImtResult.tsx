import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';
import {
  ageBmiNorm,
  bmi,
  BMI_CATEGORY_LABELS,
  BMI_LIMITS,
  bmiCategory,
  devineIdealWeight,
  formatBmi,
  normalWeightRange,
  weightToNormal,
} from '@/lib/bmi';

export interface ImtResultProps {
  sex: Sex;
  heightCm: string;
  weightKg: string;
  age: string;
}

function toNumber(value: string): number | null {
  const n = Number(value);
  return value.trim() !== '' && Number.isFinite(n) && n > 0 ? n : null;
}

const valueClass = 'font-semibold text-mainTitle dark:text-mainTitleBlack';

export const ImtResult = ({ sex, heightCm, weightKg, age }: ImtResultProps) => {
  const heightN = toNumber(heightCm);
  const weightN = toNumber(weightKg);
  const ageN = toNumber(age);
  const inRange =
    rangeError(heightCm, BMI_LIMITS.height.min, BMI_LIMITS.height.max) === undefined &&
    rangeError(weightKg, BMI_LIMITS.weight.min, BMI_LIMITS.weight.max) === undefined;
  const ageValid =
    ageN !== null &&
    rangeError(age, BMI_LIMITS.age.min, BMI_LIMITS.age.max) === undefined;

  let summary = 'Результат зʼявиться після введення зросту і ваги';
  let body: ReactNode = (
    <p className="text-neutral-600 dark:text-mainTextBlack">
      Введіть зріст і вагу, щоб побачити ІМТ, норму ваги та ідеальну вагу.
    </p>
  );

  if (heightN !== null && weightN !== null && inRange) {
    const value = bmi(weightN, heightN);
    const category = BMI_CATEGORY_LABELS[bmiCategory(value)];
    const range = normalWeightRange(heightN);
    const delta = weightToNormal(weightN, range);
    const devine = devineIdealWeight(sex, heightN);
    const ageNorm = ageValid && ageN !== null ? ageBmiNorm(ageN) : null;

    summary = `ІМТ ${formatBmi(value)}, ${category.label.toLowerCase()}`;
    body = (
      <>
        <div className="flex flex-col gap-2 text-left">
          <p className="text-lg font-bold text-mainTitle dark:text-mainTitleBlack">
            Індекс маси тіла:{' '}
            <span className="text-orange-800 dark:text-mainTitleBlack">{formatBmi(value)}</span>
          </p>
          <p className="font-semibold text-mainTitle dark:text-mainTitleBlack">
            {category.label}{' '}
            <span className="font-normal text-neutral-600 dark:text-mainTextBlack">
              (ІМТ {category.range})
            </span>
          </p>
          <p className="text-neutral-700 dark:text-mainTextBlack">{category.advice}</p>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-neutral-700 dark:text-mainTextBlack">
          <dt>Норма для вашого зросту</dt>
          <dd className={valueClass}>
            {range.min}–{range.max} кг
          </dd>
          <dt>До норми</dt>
          <dd className={valueClass}>
            {delta === 0
              ? 'Ви в нормі'
              : delta < 0
              ? `мінус ${Math.abs(delta)} кг`
              : `плюс ${delta} кг`}
          </dd>
          {devine !== null && (
            <>
              <dt>Ідеальна вага за Девіном</dt>
              <dd className={valueClass}>{devine} кг</dd>
            </>
          )}
          {ageNorm && (
            <>
              <dt>Норма ІМТ для вашого віку</dt>
              <dd className={valueClass}>
                {ageNorm.min}–{ageNorm.max}
              </dd>
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
