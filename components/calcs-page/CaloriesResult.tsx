import type { ReactNode } from 'react';
import { SYTNO_URL } from '@/const';
import {
  bmrMifflin,
  goalTarget,
  LIMITS,
  macros,
  safeMinimum,
  targets,
  tdee,
  type Goal,
  type Sex,
  type Targets,
} from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';

export interface CaloriesResultProps {
  sex: Sex;
  age: string;
  heightCm: string;
  weightKg: string;
  activity: number;
  goal: Goal;
}

const ROWS: Array<{ key: keyof Targets; label: string; goal: Goal | null }> = [
  { key: 'loss20', label: 'Швидке схуднення, −20%', goal: null },
  { key: 'loss15', label: 'Схуднення, −15%', goal: 'loss' },
  { key: 'loss10', label: 'Повільне схуднення, −10%', goal: null },
  { key: 'maintain', label: 'Підтримання ваги', goal: 'maintain' },
  { key: 'gain10', label: 'Набір ваги, +10%', goal: 'gain' },
  { key: 'gain15', label: 'Швидкий набір, +15%', goal: null },
];

function toNumber(value: string): number | null {
  const n = Number(value);
  return value.trim() !== '' && Number.isFinite(n) && n > 0 ? n : null;
}

export const CaloriesResult = ({
  sex,
  age,
  heightCm,
  weightKg,
  activity,
  goal,
}: CaloriesResultProps) => {
  const ageN = toNumber(age);
  const heightN = toNumber(heightCm);
  const weightN = toNumber(weightKg);
  const inRange =
    rangeError(age, LIMITS.age.min, LIMITS.age.max) === undefined &&
    rangeError(heightCm, LIMITS.height.min, LIMITS.height.max) === undefined &&
    rangeError(weightKg, LIMITS.weight.min, LIMITS.weight.max) === undefined;
  const ready = ageN !== null && heightN !== null && weightN !== null && inRange;

  // Computed unconditionally (with safe fallbacks) so the always-present
  // sr-only summary below can read `t`/`target` regardless of readiness.
  const bmr = bmrMifflin({ sex, age: ageN ?? 0, heightCm: heightN ?? 0, weightKg: weightN ?? 0 });
  const norm = tdee(bmr, activity);
  const t = targets(norm);
  const target = goalTarget(t, goal);

  let body: ReactNode;

  if (!ready || ageN === null || heightN === null || weightN === null) {
    body = (
      <p className="text-neutral-600 dark:text-mainTextBlack">
        Введіть вік, зріст і вагу, щоб побачити норму, дефіцит і БЖВ.
      </p>
    );
  } else {
    const m = macros(target, weightN, goal);
    const minimum = safeMinimum(sex);

    body = (
      <>
        <div className="flex flex-col gap-2 text-left">
          <p className="text-neutral-600 dark:text-mainTextBlack">
            Базовий обмін (BMR):{' '}
            <span className="font-bold text-mainTitle dark:text-mainTitleBlack">
              {bmr} ккал
            </span>
          </p>
          <p className="text-lg font-bold text-mainTitle dark:text-mainTitleBlack">
            Норма на день: <span className="text-orange-800 dark:text-mainTitleBlack">{t.maintain} ккал</span>
          </p>
        </div>

        <table className="w-full text-left text-sm md:text-base border-collapse text-neutral-700 dark:text-mainTextBlack">
          <caption className="sr-only">Цільові калорії за метою</caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th scope="col" className="py-1 pr-2">Мета</th>
              <th scope="col" className="py-1 text-right">ккал/день</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => {
              const active = row.goal === goal;
              return (
                <tr
                  key={row.key}
                  className={`border-b border-gray-300 ${
                    active ? 'font-bold text-mainTitle dark:text-mainTitleBlack' : ''
                  }`}
                >
                  <th scope="row" className="py-1 pr-2 font-normal text-left">
                    {row.label}
                    {active && <span className="sr-only"> (ваша мета)</span>}
                  </th>
                  <td className="py-1 text-right">{t[row.key]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-left">
          <p className="font-bold text-mainTitle dark:text-mainTitleBlack">
            БЖВ для {target} ккал:
          </p>
          <ul className="flex gap-4 flex-wrap text-neutral-700 dark:text-mainTextBlack">
            <li>Білки {m.proteinG} г</li>
            <li>Жири {m.fatG} г</li>
            <li>Вуглеводи {m.carbsG} г</li>
          </ul>
        </div>

        {target < minimum && (
          <p
            className="text-left text-sm rounded-lg p-3 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
            role="alert"
          >
            {target} ккал нижче безпечного мінімуму {minimum} ккал. Не опускайтеся нижче
            нього без нагляду лікаря.
          </p>
        )}

        <p className="text-left text-sm text-neutral-600 dark:text-mainTextBlack">
          Під вашу ціль {target} ккал застосунок Sytno складе меню на день.{' '}
          <a
            href={SYTNO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-mainTitle dark:text-mainTitleBlack"
          >
            Спробувати Sytno
          </a>
        </p>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <p className="sr-only" aria-live="polite">
        {ready
          ? `Норма ${t.maintain} ккал на день, ціль ${target} ккал`
          : 'Результат з’явиться після введення віку, зросту і ваги'}
      </p>
      {body}
    </div>
  );
};
