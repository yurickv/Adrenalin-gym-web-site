# PR 2: контент і результат калькулятора калорій. План реалізації

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сторінка `/calcs/calories-calculator` показує BMR, норму, шість цільових значень калорій, БЖВ для обраної цілі, таблиці норм і дефіциту, і отримує новий title, description та H1 під запити «норма», «дефіцит», «КБЖВ».

**Architecture:** Уся арифметика виноситься в чистий модуль `lib/calories.ts` з vitest-тестами; клієнтська форма `CaloriesCalcList` лишається єдиним місцем стану і рендерить новий компонент результату `CaloriesResult`; серверні контентні блоки (таблиці норм і дефіциту) рахують свої числа тим самим модулем, щоб текст сторінки і калькулятор ніколи не розходились. Метадані, JSON-LD і зв'язка сутностей через `@id` оновлюються окремими задачами.

**Tech Stack:** Next.js 14.2.35 (App Router), React 18, TypeScript 5.1 strict, Tailwind 3.3, vitest 5 (`npm test`), Lighthouse 12 CLI.

**Spec:** `docs/superpowers/specs/2026-09-16-calories-calculator-seo-design.md`, розділ 5. Відхилення від spec, прийняте в цьому плані: контрольний приклад у JS-округленні дає BMR 1402, норму 2170, дефіцит 15% 1850 (spec писав 1401/2172/1846); текст FAQ приводиться до цих чисел.

**Гілка:** `feat/calories-calculator-content` від `main` (HEAD `60ad809` або новіший).

## Global Constraints

- Домен `https://gym-adrenalin.com.ua`; Sytno завжди через `SYTNO_URL` з `const/index.ts`.
- Формула Міффліна-Сан Жеора: `10·вага + 6,25·зріст − 5·вік`, плюс 5 для чоловіків, мінус 161 для жінок; BMR округлюється до цілого; норма (TDEE) = `Math.round(BMR · коефіцієнт)`; цільові значення округлюються до 10 ккал.
- Цілі: `loss` (за замовчуванням, підсвічує рядок −15%), `maintain` (норма), `gain` (+10%).
- Білок: 1,8 г/кг для `loss`, 1,6 для `maintain`, 2,0 для `gain`; жири 25% калорійності, 9 ккал/г; вуглеводи решта, 4 ккал/г, не менше 0.
- Безпечний мінімум: 1200 ккал для жінок, 1500 для чоловіків.
- Ліміти форми: вік 14–100, зріст 120–230, вага 30–250. Помилки: `Не менше X` / `Не більше Y`.
- 1 кг жиру = 7700 ккал; втрата за тиждень = `дефіцит·7/7700`, два знаки після коми.
- Title (absolute, ≤ 60 знаків): `Калькулятор калорій: норма, дефіцит для схуднення, БЖВ`. H1: `Калькулятор калорій: норма на день, дефіцит і БЖВ`. Description ≤ 155 знаків, текст у Task 5.
- Дисклеймер на всіх трьох калькуляторах: `Розрахунки орієнтовні і не замінюють консультацію лікаря чи дієтолога. За хронічних захворювань, вагітності або віку до 18 років узгодьте раціон із фахівцем.`
- `@id` організації: `https://gym-adrenalin.com.ua/#organization`.
- Комміти без будь-яких трейлерів (без `Co-Authored-By`). Лінт не запускати (ESLint у репозиторії відсутній).
- Windows 11, Git Bash, Node 24; production-сервер для перевірок на порту 3100; Chrome `C:/Program Files/Google/Chrome/Application/chrome.exe` з прапорцями `--headless=new --no-sandbox --disable-gpu`; довгі файли писати інструментом Write, не heredoc.
- Не змінювати `components/calcs-page/ImtCalcList.tsx`, `FatCalcList.tsx` і їхні сторінки, крім спільних `CalcByline.tsx` і `const/calcSeo.ts`.

## Структура файлів

| Файл | Дія | Відповідальність |
|---|---|---|
| `lib/calories.ts`, `lib/calories.test.ts` | створити | чиста арифметика: BMR, TDEE, цілі, БЖВ, мінімум, втрата ваги, коефіцієнти |
| `lib/rangeError.ts`, `lib/rangeError.test.ts` | створити | валідація діапазону без yup |
| `components/calcs-page/CaloriesCalcList.tsx` | переписати | стан форми, стать, ціль, поля, рендер результату |
| `components/calcs-page/CaloriesResult.tsx` | створити | BMR, норма, таблиця цілей, БЖВ, попередження, CTA |
| `components/calcs-page/CaloriesCalcFormula.tsx` | видалити | замінений `CaloriesResult` |
| `components/calcs-page/ButttonGroup.tsx` | змінити | контраст тексту |
| `components/calcs-page/CaloriesNormTable.tsx` | створити | H2 + таблиця норм за віком і активністю |
| `components/calcs-page/CaloriesDeficitTable.tsx` | створити | H2 + таблиця дефіциту 10/15/20% |
| `components/calcs-page/CaloriesFaq.tsx` | змінити | два нові питання, оновлені числа |
| `components/calcs-page/CaloriesDescription.tsx` | змінити | прибрати дубль про дефіцит і inert `basis-1/2` |
| `components/calcs-page/CalcByline.tsx` | змінити | дисклеймер |
| `app/calcs/calories-calculator/page.tsx` | змінити | новий H1, підводка, нові блоки, h2 для списку калькуляторів |
| `app/calcs/calories-calculator/loading.tsx` | змінити | скелет під новий hero |
| `app/calcs/calories-calculator/layout.tsx` | змінити | title, description, OG, keywords |
| `components/calcs-page/CaloriesJsonLd.tsx` | змінити | description, featureList, крок HowTo |
| `components/LocalBusinessSchema.tsx`, `const/calcSeo.ts` | змінити | `@id`, автор з url/worksFor/sameAs |
| `components/Button.tsx` | змінити | зовнішні посилання як `<a target=_blank>` |
| `tsconfig.json` | змінити | виключити тести зі збірки Next |

---

### Task 1: чистий модуль `lib/calories.ts` (TDD)

**Files:**
- Create: `lib/calories.ts`
- Create: `lib/calories.test.ts`

**Interfaces:**
- Produces:
  - `type Sex = 'male' | 'female'`, `type Goal = 'loss' | 'maintain' | 'gain'`
  - `interface BodyParams { sex: Sex; weightKg: number; heightCm: number; age: number }`
  - `ACTIVITY_LEVELS: ReadonlyArray<{ value: number; label: string }>`
  - `bmrMifflin(p: BodyParams): number`
  - `tdee(bmr: number, activityFactor: number): number`
  - `interface Targets { loss20; loss15; loss10; maintain; gain10; gain15: number }`, `targets(tdeeKcal: number): Targets`
  - `goalTarget(t: Targets, goal: Goal): number`
  - `interface Macros { proteinG: number; fatG: number; carbsG: number }`, `macros(kcal: number, weightKg: number, goal: Goal): Macros`
  - `safeMinimum(sex: Sex): number`
  - `weeklyLossKg(deficitPerDay: number): number`
  - `PROTEIN_PER_KG: Record<Goal, number>`, `FAT_SHARE = 0.25`, `KCAL_PER_KG_FAT = 7700`

- [ ] **Step 1: Написати тести `lib/calories.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  ACTIVITY_LEVELS,
  bmrMifflin,
  goalTarget,
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
```

- [ ] **Step 2: Запустити, переконатися, що тести падають**

```bash
npm test 2>&1 | tail -8
```

Очікувано: `FAIL lib/calories.test.ts` з `Failed to resolve import "./calories"`; `lib/sitemap.test.ts` далі проходить.

- [ ] **Step 3: Реалізувати `lib/calories.ts`**

```ts
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

const round10 = (n: number) => Math.round(n / 10) * 10;

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
```

- [ ] **Step 4: Запустити тести**

```bash
npm test 2>&1 | tail -6
```

Очікувано: `Test Files  2 passed (2)`, `Tests  18 passed (18)` (7 sitemap + 11 calories).

- [ ] **Step 5: Commit**

```bash
git add lib/calories.ts lib/calories.test.ts
git commit -m "feat(calories): pure calculation module with Mifflin BMR, targets, macros"
```

---

### Task 2: валідація діапазону без yup (TDD)

**Files:**
- Create: `lib/rangeError.ts`
- Create: `lib/rangeError.test.ts`

**Interfaces:**
- Produces: `rangeError(value: string, min: number, max: number): string | undefined` — `undefined` для порожнього або допустимого значення, `'Не менше ${min}'`, `'Не більше ${max}'` інакше.

- [ ] **Step 1: Тести `lib/rangeError.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { rangeError } from './rangeError';

describe('rangeError', () => {
  it('returns undefined for an empty string', () => {
    expect(rangeError('', 14, 100)).toBeUndefined();
  });

  it('returns undefined for a value inside the range, inclusive', () => {
    expect(rangeError('14', 14, 100)).toBeUndefined();
    expect(rangeError('100', 14, 100)).toBeUndefined();
  });

  it('reports values below the minimum', () => {
    expect(rangeError('13', 14, 100)).toBe('Не менше 14');
  });

  it('reports values above the maximum', () => {
    expect(rangeError('101', 14, 100)).toBe('Не більше 100');
  });

  it('treats non-numeric input as below the minimum', () => {
    expect(rangeError('abc', 14, 100)).toBe('Не менше 14');
  });
});
```

- [ ] **Step 2: Запустити, переконатися, що падає** — `npm test 2>&1 | tail -6`, очікувано `Failed to resolve import "./rangeError"`.

- [ ] **Step 3: Реалізувати `lib/rangeError.ts`**

```ts
export function rangeError(
  value: string,
  min: number,
  max: number
): string | undefined {
  if (value.trim() === '') return undefined;
  const n = Number(value);
  if (Number.isNaN(n) || n < min) return `Не менше ${min}`;
  if (n > max) return `Не більше ${max}`;
  return undefined;
}
```

- [ ] **Step 4: Запустити тести** — очікувано `Test Files 3 passed`, `Tests 23 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/rangeError.ts lib/rangeError.test.ts
git commit -m "feat(calcs): plain range validation helper"
```

---

### Task 3: форма з ціллю і новий компонент результату

**Files:**
- Create: `components/calcs-page/CaloriesResult.tsx`
- Modify: `components/calcs-page/CaloriesCalcList.tsx` (повна заміна)
- Modify: `components/calcs-page/ButttonGroup.tsx` (кольори тексту)
- Delete: `components/calcs-page/CaloriesCalcFormula.tsx`

**Interfaces:**
- Consumes: усе з `lib/calories.ts`, `rangeError` з `lib/rangeError.ts`, `SYTNO_URL` з `const/index.ts`, `InputSkeleton` (без змін; його `error?: string | null`).
- Produces: `CaloriesResult({ sex, age, heightCm, weightKg, activity, goal }: CaloriesResultProps)`, де `age`, `heightCm`, `weightKg` рядки з форми, `activity: number`, `goal: Goal`.

- [ ] **Step 1: Створити `components/calcs-page/CaloriesResult.tsx`**

```tsx
import { SYTNO_URL } from '@/const';
import {
  bmrMifflin,
  goalTarget,
  macros,
  safeMinimum,
  targets,
  tdee,
  type Goal,
  type Sex,
  type Targets,
} from '@/lib/calories';

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
  const ready = ageN !== null && heightN !== null && weightN !== null;

  let body: React.ReactNode;

  if (!ready) {
    body = (
      <p className="text-neutral-600 dark:text-mainTextBlack">
        Введіть вік, зріст і вагу, щоб побачити норму, дефіцит і БЖВ.
      </p>
    );
  } else {
    const bmr = bmrMifflin({ sex, age: ageN, heightCm: heightN, weightKg: weightN });
    const norm = tdee(bmr, activity);
    const t = targets(norm);
    const target = goalTarget(t, goal);
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
            Норма на день: <span className="text-orange-800">{t.maintain} ккал</span>
          </p>
        </div>

        <table className="w-full text-left text-sm md:text-base border-collapse text-neutral-700 dark:text-mainTextBlack">
          <caption className="sr-only">Цільові калорії за метою</caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th className="py-1 pr-2">Мета</th>
              <th className="py-1 text-right">ккал/день</th>
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
                  aria-current={active ? 'true' : undefined}
                >
                  <td className="py-1 pr-2">{row.label}</td>
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
          <p className="text-left text-sm text-red-700 dark:text-red-300" role="alert">
            {target} ккал нижче безпечного мінімуму {minimum} ккал. Не опускайтеся нижче
            нього без нагляду лікаря.
          </p>
        )}

        <p className="text-left text-sm text-neutral-600 dark:text-mainTextBlack">
          Під {target} ккал застосунок Sytno складе меню на день.{' '}
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
    <div aria-live="polite" className="flex flex-col gap-4 mt-2">
      {body}
    </div>
  );
};
```

- [ ] **Step 2: Переписати `components/calcs-page/CaloriesCalcList.tsx`**

```tsx
'use client';

import React, { useState } from 'react';
import { InputSkeleton } from './InputSkeleton';
import { CaloriesResult } from './CaloriesResult';
import { ACTIVITY_LEVELS, type Goal, type Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';

export const LIMITS = {
  age: { min: 14, max: 100 },
  height: { min: 120, max: 230 },
  weight: { min: 30, max: 250 },
} as const;

type Field = keyof typeof LIMITS;

const toggleClass = (active: boolean) =>
  `cursor-pointer flex items-center justify-center tracking-widest truncate font-semibold text-lg rounded-xl p-2
   focus-within:ring-2 focus-within:ring-main focus-within:ring-offset-1
   hover:bg-[#ECECEC] dark:hover:bg-[#d4d4d4] dark:hover:text-mainText ${
     active
       ? 'bg-[#D9D9D9] dark:bg-[#d4d4d4] text-orange-800'
       : 'text-neutral-700 dark:text-mainTextBlack'
   }`;

const GOALS: Array<{ value: Goal; label: string }> = [
  { value: 'loss', label: 'Схуднути' },
  { value: 'maintain', label: 'Підтримати' },
  { value: 'gain', label: 'Набрати' },
];

export const CaloriesCalcList = () => {
  const [sex, setSex] = useState<Sex>('male');
  const [goal, setGoal] = useState<Goal>('loss');
  const [values, setValues] = useState<Record<Field, string>>({
    age: '',
    height: '',
    weight: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [activity, setActivity] = useState<number>(1.2);

  const change = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validate = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setErrors(prev => ({
      ...prev,
      [field]: rangeError(e.target.value, LIMITS[field].min, LIMITS[field].max),
    }));

  return (
    <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
      <div role="radiogroup" aria-label="Стать" className="flex items-center gap-3">
        <span className="p-2 text-lg font-bold text-mainTitle dark:text-mainTitleBlack">
          Стать:
        </span>
        {(
          [
            { value: 'female', label: 'Жінка' },
            { value: 'male', label: 'Чоловік' },
          ] as Array<{ value: Sex; label: string }>
        ).map(option => (
          <label key={option.value} className={toggleClass(sex === option.value)}>
            <input
              type="radio"
              name="sex"
              value={option.value}
              className="sr-only"
              checked={sex === option.value}
              onChange={() => setSex(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <InputSkeleton
        text="Вік, років:"
        name="age"
        min={LIMITS.age.min}
        max={LIMITS.age.max}
        value={values.age}
        setAny={change('age')}
        onBlur={validate('age')}
        error={errors.age}
      />
      <InputSkeleton
        text="Зріст (см):"
        name="height"
        min={LIMITS.height.min}
        max={LIMITS.height.max}
        value={values.height}
        setAny={change('height')}
        onBlur={validate('height')}
        error={errors.height}
      />
      <InputSkeleton
        text="Вага (кг):"
        name="weight"
        min={LIMITS.weight.min}
        max={LIMITS.weight.max}
        value={values.weight}
        setAny={change('weight')}
        onBlur={validate('weight')}
        error={errors.weight}
      />

      <label
        htmlFor="activity"
        className="font-bold -mb-4 text-lg text-mainTitle dark:text-mainTitleBlack"
      >
        Рівень активності
      </label>
      <select
        id="activity"
        name="activity"
        className="max-[440px]:max-w-[280px] min-[768px]:max-w-[340px] min-[880px]:max-w-[380px] min-[980px]:max-w-[404px]
        font-bold border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main
        text-neutral-700 dark:text-mainTextBlack bg-[#e5e5e5] dark:bg-[#676465]"
        value={activity}
        onChange={e => setActivity(Number(e.target.value))}
      >
        {ACTIVITY_LEVELS.map(level => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>

      <div role="radiogroup" aria-label="Мета" className="flex flex-col gap-2">
        <span className="text-lg font-bold text-left text-mainTitle dark:text-mainTitleBlack">
          Мета
        </span>
        <div className="flex gap-2 flex-wrap">
          {GOALS.map(option => (
            <label key={option.value} className={toggleClass(goal === option.value)}>
              <input
                type="radio"
                name="goal"
                value={option.value}
                className="sr-only"
                checked={goal === option.value}
                onChange={() => setGoal(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <CaloriesResult
        sex={sex}
        age={values.age}
        heightCm={values.height}
        weightKg={values.weight}
        activity={activity}
        goal={goal}
      />
    </form>
  );
};
```

- [ ] **Step 3: Видалити стару формулу і оновити кольори кнопок**

```bash
git rm -q components/calcs-page/CaloriesCalcFormula.tsx
grep -rn "CaloriesCalcFormula" app components; echo "grep exit: $?"
```

Очікувано `grep exit: 1`. У `components/calcs-page/ButttonGroup.tsx` замінити обидва `className="mt-12 text-mainText dark:text-mainTextBlack"` на `className="mt-12 text-neutral-600 dark:text-mainTextBlack"`.

- [ ] **Step 4: Зібрати і перевірити SSR**

```bash
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
grep -c 'aria-live="polite"' .lighthouse/page.html
grep -c 'Введіть вік, зріст і вагу' .lighthouse/page.html
grep -c 'role="radiogroup"' .lighthouse/page.html
grep -c 'max="250"' .lighthouse/page.html
grep -c "yup" .next/static/chunks/app/calcs/calories-calculator/*.js; echo "(0 expected)"
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `aria-live` 1, підказка 1, `radiogroup` 2, `max="250"` 2 (input і range), `yup` у чанку сторінки 0.

- [ ] **Step 5: Ручна перевірка в браузері**

`npm run dev`, відкрити `http://localhost:3000/calcs/calories-calculator`, ввести жінка, 30, 170, 65, «Помірно активний». Очікувано: BMR 1402, норма 2170, у таблиці підсвічено «Схуднення, −15%» = 1850, БЖВ 117/51/231, CTA Sytno. Ввести вагу 20 і клацнути повз: помилка «Не менше 30». Зупинити dev-сервер.

- [ ] **Step 6: Commit**

```bash
git add components/calcs-page/CaloriesResult.tsx components/calcs-page/CaloriesCalcList.tsx components/calcs-page/ButttonGroup.tsx
git commit -m "feat(calories): goal selector, BMR/targets/macros result, drop yup from the form"
```

---

### Task 4: контентні блоки, FAQ, дисклеймер, сторінка

**Files:**
- Create: `components/calcs-page/CaloriesNormTable.tsx`
- Create: `components/calcs-page/CaloriesDeficitTable.tsx`
- Modify: `components/calcs-page/CaloriesFaq.tsx`
- Modify: `components/calcs-page/CalcByline.tsx`
- Modify: `components/calcs-page/CaloriesDescription.tsx`
- Modify: `app/calcs/calories-calculator/page.tsx`
- Modify: `app/calcs/calories-calculator/loading.tsx`

**Interfaces:**
- Consumes: `bmrMifflin`, `tdee`, `targets`, `weeklyLossKg`, `safeMinimum` з `lib/calories.ts`.
- Produces: серверні компоненти `CaloriesNormTable`, `CaloriesDeficitTable` без пропсів; масив `caloriesFaq` з 7 елементами (використовує `CaloriesJsonLd`).

- [ ] **Step 1: `components/calcs-page/CaloriesNormTable.tsx`**

```tsx
import { bmrMifflin, targets, tdee, type Sex } from '@/lib/calories';

const AGE_GROUPS = [
  { label: '18–30 років', age: 25 },
  { label: '31–50 років', age: 40 },
  { label: '51–70 років', age: 60 },
];
const ACTIVITIES = [
  { label: 'низька, 1,2', factor: 1.2 },
  { label: 'помірна, 1,55', factor: 1.55 },
  { label: 'висока, 1,725', factor: 1.725 },
];
const PROFILES: Array<{ sex: Sex; title: string; heightCm: number; weightKg: number }> = [
  { sex: 'female', title: 'Жінка, 165 см, 65 кг', heightCm: 165, weightKg: 65 },
  { sex: 'male', title: 'Чоловік, 178 см, 80 кг', heightCm: 178, weightKg: 80 },
];

const norm = (p: (typeof PROFILES)[number], age: number, factor: number) =>
  targets(tdee(bmrMifflin({ ...p, age }), factor)).maintain;

export const CaloriesNormTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Норма калорій на день для жінок і чоловіків
      </h2>
      <p className="max-w-[900px] mx-auto mb-6 text-base lg:text-lg text-mainText dark:text-mainTextBlack">
        Орієнтовні норми для підтримання ваги, розраховані тим самим калькулятором за
        формулою Міффліна-Сан Жеора. Ваша особиста норма залежить від зросту і ваги,
        тому введіть свої дані вище.
      </p>
      <div className="grid gap-8 md:grid-cols-2 max-w-[1100px] mx-auto">
        {PROFILES.map(profile => (
          <div key={profile.sex} className="overflow-x-auto">
            <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
              <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
                {profile.title}, ккал на день
              </caption>
              <thead>
                <tr className="border-b border-gray-400">
                  <th scope="col" className="py-2 pr-4">Вік</th>
                  {ACTIVITIES.map(a => (
                    <th key={a.factor} scope="col" className="py-2 pr-4">
                      Активність {a.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGE_GROUPS.map(group => (
                  <tr key={group.age} className="border-b border-gray-300">
                    <th scope="row" className="py-2 pr-4 font-normal">{group.label}</th>
                    {ACTIVITIES.map(a => (
                      <td key={a.factor} className="py-2 pr-4">
                        {norm(profile, group.age, a.factor)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

- [ ] **Step 2: `components/calcs-page/CaloriesDeficitTable.tsx`**

```tsx
import { safeMinimum, weeklyLossKg } from '@/lib/calories';

const BASE = 2000;
const DEFICITS = [10, 15, 20];

export const CaloriesDeficitTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Дефіцит калорій для схуднення: скільки віднімати
      </h2>
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <p className="mb-6 text-base lg:text-lg">
          Дефіцит калорій — це різниця між нормою і тим, що ви з'їдаєте. Для сталого
          схуднення достатньо 10–20% від норми. Приклад для норми {BASE} ккал:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base border-collapse">
            <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
              Дефіцит калорій і орієнтовна втрата ваги
            </caption>
            <thead>
              <tr className="border-b border-gray-400">
                <th scope="col" className="py-2 pr-4">Дефіцит</th>
                <th scope="col" className="py-2 pr-4">ккал на день</th>
                <th scope="col" className="py-2 pr-4">Мінус на день</th>
                <th scope="col" className="py-2">Втрата за тиждень</th>
              </tr>
            </thead>
            <tbody>
              {DEFICITS.map(percent => {
                const perDay = Math.round((BASE * percent) / 100);
                return (
                  <tr key={percent} className="border-b border-gray-300">
                    <th scope="row" className="py-2 pr-4 font-normal">{percent}%</th>
                    <td className="py-2 pr-4">{BASE - perDay}</td>
                    <td className="py-2 pr-4">{perDay} ккал</td>
                    <td className="py-2">≈ {weeklyLossKg(perDay)} кг</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ul className="mt-6 flex flex-col gap-2 list-disc list-inside text-base lg:text-lg">
          <li>
            Не опускайтеся нижче {safeMinimum('female')} ккал для жінок і{' '}
            {safeMinimum('male')} ккал для чоловіків.
          </li>
          <li>Безпечний темп — 0,5–1 кг на тиждень; швидше втрачаються м'язи і вода.</li>
          <li>Після кожних 4–5 кг перерахуйте норму: легше тіло витрачає менше.</li>
          <li>Розрахунок орієнтовний: 1 кг жиру ≈ 7700 ккал, реальний темп коливається.</li>
        </ul>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 3: Оновити `components/calcs-page/CaloriesFaq.tsx`**

Замінити масив `caloriesFaq` на такий (компонент `CaloriesFaq` без змін):

```ts
export const caloriesFaq = [
  {
    question: 'Як розрахувати денну норму калорій?',
    answer:
      'Денну норму калорій розраховують за формулою Міффліна-Сан Жеора з урахуванням статі, віку, зросту, ваги та рівня фізичної активності. Введіть свої дані у калькулятор калорій вище — і ви отримаєте норму, цільові калорії для схуднення чи набору та БЖВ. Наприклад, для жінки 30 років, зростом 170 см і вагою 65 кг із помірною активністю норма — близько 2170 ккал, а для схуднення (дефіцит 15%) — приблизно 1850 ккал.',
  },
  {
    question: 'Що таке BMR і чим він відрізняється від норми калорій?',
    answer:
      'BMR (базовий обмін) — це калорії, які організм витрачає у повному спокої на дихання, кровообіг і роботу органів. Норма калорій — це BMR, помножений на коефіцієнт активності від 1,2 до 1,9. Для жінки з прикладу вище BMR становить близько 1400 ккал, а норма з помірною активністю — 2170 ккал.',
  },
  {
    question: 'Скільки калорій потрібно, щоб схуднути?',
    answer:
      'Щоб схуднути, створіть дефіцит калорій: зменшіть денну норму на 10-15%. Не рекомендується опускатися нижче 1200 калорій на день для жінок і 1500 для чоловіків і втрачати більше 0,8-1 кг на тиждень, адже це шкідливо для здоровʼя та сповільнює метаболізм.',
  },
  {
    question: 'Що таке дефіцит калорій?',
    answer:
      'Дефіцит калорій — це стан, коли ви споживаєте менше калорій, ніж витрачаєте протягом дня. Саме дефіцит калорій є основною умовою схуднення. Оптимальний дефіцит — 10-15% від денної норми калорій; 1 кг жиру відповідає приблизно 7700 ккал.',
  },
  {
    question: 'Скільки потрібно калорій, щоб набрати вагу?',
    answer:
      'Для набору ваги збільште денну норму калорій на 10-15% і зробіть акцент на достатній кількості білка та силових тренуваннях. Так приріст ваги відбуватиметься переважно за рахунок мʼязової маси, а не жиру.',
  },
  {
    question: 'Скільки білка потрібно на день?',
    answer:
      'Калькулятор рахує білок від ваги тіла: 1,8 г на кілограм при схудненні, 1,6 г при підтриманні і 2 г при наборі маси (рекомендації ISSN). Жири займають 25% калорійності, решта припадає на вуглеводи. Для 1850 ккал і 65 кг це приблизно 117 г білка, 51 г жирів і 231 г вуглеводів.',
  },
  {
    question: 'За якою формулою рахує калькулятор калорій?',
    answer:
      'Калькулятор використовує формулу Міффліна-Сан Жеора — сучасний стандарт для розрахунку базового обміну речовин (BMR) та денної потреби калорій з поправкою на рівень фізичної активності.',
  },
];
```

- [ ] **Step 4: Дисклеймер у `components/calcs-page/CalcByline.tsx`**

Після існуючого `<p ...>Матеріал підготував ...</p>` додати:

```tsx
        <p className="max-w-[900px] mx-auto mt-3 text-xs text-center text-neutral-600 dark:text-mainTextBlack">
          Розрахунки орієнтовні і не замінюють консультацію лікаря чи дієтолога. За
          хронічних захворювань, вагітності або віку до 18 років узгодьте раціон із
          фахівцем.
        </p>
```

- [ ] **Step 5: Прибрати дубль у `components/calcs-page/CaloriesDescription.tsx`**

Видалити другий `<p>` (той, що починається з «Щоб схуднути, скоротіть кількість споживаних калорій в день на» і закінчується «більше 0,8 - 1 кг в тиждень.»), і в кореневому `<div className="basis-1/2 text-mainText dark:text-mainTextBlack">` замінити клас на `className="text-mainText dark:text-mainTextBlack"`.

- [ ] **Step 6: Оновити `app/calcs/calories-calculator/page.tsx`**

Додати імпорти:

```tsx
import { CaloriesNormTable } from '@/components/calcs-page/CaloriesNormTable';
import { CaloriesDeficitTable } from '@/components/calcs-page/CaloriesDeficitTable';
```

Замінити H1 і підводку:

```tsx
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Калькулятор калорій: норма на день, дефіцит і БЖВ
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Введіть дані і отримайте норму, дефіцит для схуднення і БЖВ за 10 секунд
          </p>
```

Замінити блок «Інші калькулятори»:

```tsx
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-mainTitle dark:text-mainTitleBlack">
              Інші фітнес-калькулятори
            </h2>
            <CalcTitle page={2} />
          </div>
```

Після закриття другої `<section>` (перед `<CaloriesFaq />`) вставити:

```tsx
      <CaloriesNormTable />
      <CaloriesDeficitTable />
```

- [ ] **Step 7: Оновити `app/calcs/calories-calculator/loading.tsx`**

Замінити вміст першої `<section>` на скелет нового hero:

```tsx
      <section className="bg-[#2E2F42]">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <div className="h-5 w-40 rounded bg-gray-500/60" aria-hidden="true" />
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Калькулятор калорій: норма на день, дефіцит і БЖВ
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Введіть дані і отримайте норму, дефіцит для схуднення і БЖВ за 10 секунд
          </p>
        </div>
      </section>
```

Імпорт `HomeIcon` стає непотрібним — видалити його; `SceletonForCalc` лишається.

- [ ] **Step 8: Зібрати і перевірити**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
grep -oE "<h[12][^>]*>[^<]*</h[12]>" .lighthouse/page.html | sed -E 's/<[^>]+>//g'
grep -c "<table" .lighthouse/page.html
grep -c "Розрахунки орієнтовні" .lighthouse/page.html
grep -o "1850" .lighthouse/page.html | wc -l
for p in imt-calculator fat-calculator; do echo "$p disclaimer: $(curl -s http://localhost:3100/calcs/$p | grep -c 'Розрахунки орієнтовні')"; done
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: заголовки у порядку H1 → «Розрахунок денної норми калорій онлайн» → «Інші фітнес-калькулятори» → «Норма калорій на день…» → «Дефіцит калорій…» → «Часті питання…»; `<table` 4 (коефіцієнти, 2 норми, дефіцит; таблиця результату рендериться лише після вводу); дисклеймер 1 на кожній із трьох сторінок; «1850» щонайменше 2 (FAQ і JSON-LD).

- [ ] **Step 9: Commit**

```bash
git add components/calcs-page/CaloriesNormTable.tsx components/calcs-page/CaloriesDeficitTable.tsx components/calcs-page/CaloriesFaq.tsx components/calcs-page/CalcByline.tsx components/calcs-page/CaloriesDescription.tsx app/calcs/calories-calculator/page.tsx app/calcs/calories-calculator/loading.tsx
git commit -m "feat(calories): norm and deficit tables, richer FAQ, medical disclaimer, new H1"
```

---

### Task 5: metadata і JSON-LD сторінки

**Files:**
- Modify: `app/calcs/calories-calculator/layout.tsx`
- Modify: `components/calcs-page/CaloriesJsonLd.tsx`

- [ ] **Step 1: Переписати `metadata` у `app/calcs/calories-calculator/layout.tsx`**

```tsx
import type { Metadata } from 'next';

const TITLE = 'Калькулятор калорій: норма, дефіцит для схуднення, БЖВ';
const DESCRIPTION =
  'Безкоштовний калькулятор калорій без реєстрації: денна норма за Міффліном-Сан Жеором, дефіцит для схуднення, профіцит для набору ваги і БЖВ за 10 секунд.';
const PAGE_URL = 'https://gym-adrenalin.com.ua/calcs/calories-calculator';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  authors: [{ name: 'Теслюк Юрій' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  keywords: [
    'калькулятор калорій',
    'калькулятор калорій для схуднення',
    'калькулятор дефіциту калорій',
    'розрахунок калорій',
    'розрахунок калорій для схуднення',
    'розрахувати норму калорій',
    'норма калорій на день',
    'денна норма калорій',
    'калькулятор кбжв',
    'розрахунок кбжв',
    'калькулятор бжв',
    'скільки калорій потрібно щоб схуднути',
    'скільки калорій потрібно щоб набрати вагу',
    'формула міффліна сан жеора',
    'базовий обмін речовин калькулятор',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Адреналін Gym',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function CaloriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Оновити `components/calcs-page/CaloriesJsonLd.tsx`**

У об'єкті `WebApplication` замінити `description` і додати `featureList` та `inLanguage`:

```ts
        description:
          'Безкоштовний онлайн-калькулятор калорій: базовий обмін (BMR) і денна норма за формулою Міффліна-Сан Жеора, цільові калорії для схуднення, підтримання чи набору ваги і розрахунок БЖВ.',
        inLanguage: 'uk',
        featureList: [
          'Базовий обмін речовин (BMR)',
          'Денна норма калорій за рівнем активності',
          'Дефіцит 10, 15 і 20% для схуднення',
          'Профіцит 10 і 15% для набору ваги',
          'Білки, жири і вуглеводи для обраної мети',
        ],
```

У `HowTo` замінити масив `step` на п'ять кроків:

```ts
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Оберіть стать', text: 'Виберіть свою стать — жінка або чоловік.' },
          { '@type': 'HowToStep', position: 2, name: 'Введіть дані', text: 'Вкажіть вік, зріст у сантиметрах і вагу в кілограмах.' },
          { '@type': 'HowToStep', position: 3, name: 'Оберіть активність', text: 'Виберіть рівень фізичної активності від сидячого способу життя до дуже високого.' },
          { '@type': 'HowToStep', position: 4, name: 'Оберіть мету', text: 'Схуднути, підтримати або набрати вагу — калькулятор підсвітить потрібний рядок.' },
          { '@type': 'HowToStep', position: 5, name: 'Отримайте результат', text: 'Калькулятор покаже BMR, норму, цільові калорії для всіх варіантів і БЖВ для вашої мети.' },
        ],
```

Також у `HowTo.description` замінити текст на `'Покрокова інструкція, як визначити норму калорій, дефіцит для схуднення і БЖВ за формулою Міффліна-Сан Жеора.'`.

- [ ] **Step 3: Перевірити довжини і HTML**

```bash
node -e "const t='Калькулятор калорій: норма, дефіцит для схуднення, БЖВ';const d='Безкоштовний калькулятор калорій без реєстрації: денна норма за Міффліном-Сан Жеором, дефіцит для схуднення, профіцит для набору ваги і БЖВ за 10 секунд.';console.log('title',t.length,'description',d.length)"
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
grep -oE "<title>[^<]*</title>" .lighthouse/page.html
grep -oE '<meta name="description" content="[^"]*"' .lighthouse/page.html | cut -c1-120
grep -o "HowToStep" .lighthouse/page.html | wc -l
grep -o '"@type":"Question"' .lighthouse/page.html | wc -l
grep -c "featureList" .lighthouse/page.html
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: title 54, description ≤ 155; `<title>` без суфікса; `HowToStep` 5; `Question` 7; `featureList` 1. Скопіювати JSON-LD із HTML у Rich Results Test (`https://search.google.com/test/rich-results`, вкладка «Код») після деплою.

- [ ] **Step 4: Commit**

```bash
git add app/calcs/calories-calculator/layout.tsx components/calcs-page/CaloriesJsonLd.tsx
git commit -m "seo(calories): title and description for norm/deficit/macros intent, richer JSON-LD"
```

---

### Task 6: зв'язка сутностей через `@id`

**Files:**
- Modify: `components/LocalBusinessSchema.tsx:1-10`
- Modify: `const/calcSeo.ts`

- [ ] **Step 1: `@id` у `components/LocalBusinessSchema.tsx`**

Після `'@type': 'SportsActivityLocation',` додати рядок:

```ts
    '@id': 'https://gym-adrenalin.com.ua/#organization',
```

- [ ] **Step 2: Автор і видавець у `const/calcSeo.ts`**

```ts
export const CALC_SITE_URL = 'https://gym-adrenalin.com.ua';
export const ORGANIZATION_ID = `${CALC_SITE_URL}/#organization`;

export const CALC_AUTHOR = {
  '@type': 'Person',
  name: 'Теслюк Юрій',
  jobTitle: 'Тренер',
  url: `${CALC_SITE_URL}/contacts`,
  worksFor: { '@id': ORGANIZATION_ID },
  sameAs: ['https://www.instagram.com/gym.adrenalin/'],
};

export const CALC_PUBLISHER = { '@id': ORGANIZATION_ID };

export const CALC_DATE_PUBLISHED = '2023-08-12';
export const CALC_DATE_MODIFIED = '2026-09-17';
export const CALC_DATE_MODIFIED_LABEL = '17 вересня 2026';
```

(Значення дат лишити такими, як у поточному файлі, якщо вони новіші.)

- [ ] **Step 3: Перевірити**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
for p in calories-calculator imt-calculator fat-calculator; do echo "$p: $(curl -s http://localhost:3100/calcs/$p | grep -o '#organization' | wc -l)"; done
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: на кожній сторінці `#organization` зустрічається 3 рази (LocalBusiness `@id`, `worksFor`, `publisher`). Тести sitemap проходять, бо `CALC_DATE_MODIFIED` імпортується як і раніше.

- [ ] **Step 4: Commit**

```bash
git add components/LocalBusinessSchema.tsx const/calcSeo.ts
git commit -m "seo(schema): link author and publisher to the organization via @id"
```

---

### Task 7: хвости з рев'ю PR 1

**Files:**
- Modify: `components/Button.tsx`
- Modify: `tsconfig.json`

- [ ] **Step 1: Зовнішні посилання в `components/Button.tsx`**

```tsx
import Link from 'next/link';

type ButtonProps = {
  route: string;
  text: string;
  width?: string;
};

const buttonClass = (width?: string) =>
  `bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600
  hover:to-orange-600 focus:from-red-600 focus:to-orange-600
  rounded-xl p-4 text-mainTitleBlack text-center block active:bg-primary-700
  hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
  shadow-[0_4px_9px_-4px_#3b71ca] dark:shadow-none dark:hover:shadow-none
  ${width ? width : 'w-max'} transition-all duration-200`;

export const Button = ({ route, text, width }: ButtonProps) => {
  if (/^https?:\/\//.test(route)) {
    return (
      <a
        href={route}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(width)}
      >
        {text}
      </a>
    );
  }

  return (
    <Link href={route} prefetch={true} className={buttonClass(width)}>
      {text}
    </Link>
  );
};
```

- [ ] **Step 2: Виключити тести зі збірки Next у `tsconfig.json`**

Замінити `"exclude": ["node_modules"]` на `"exclude": ["node_modules", "**/*.test.ts"]`.

- [ ] **Step 3: Перевірити**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator | grep -oE '<a[^>]*nutriday[^>]*>' | grep -c 'target="_blank"'
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: тести 23 passed, збірка успішна, посилань на Sytno з `target="_blank"` у SSR-HTML 1 (кнопка; CTA результату з'являється після вводу).

- [ ] **Step 4: Commit**

```bash
git add components/Button.tsx tsconfig.json
git commit -m "chore: open external buttons in a new tab, keep tests out of the Next build"
```

---

### Task 8: фінальна перевірка PR 2

**Files:**
- Modify: `docs/superpowers/plans/2026-09-17-calories-calculator-pr2-content.md` (розділ «Результати»)

- [ ] **Step 1: Тести, збірка, Lighthouse (performance + accessibility)**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error|calories-calculator " | head -4
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npx --yes lighthouse@12 http://localhost:3100/calcs/calories-calculator --only-categories=performance,accessibility,seo --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --output=json --output-path=.lighthouse/pr2.json --quiet
node scripts/lh-summary.mjs .lighthouse/pr2.json | tee .lighthouse/pr2.txt
node -e "const r=require('./.lighthouse/pr2.json');console.log('a11y',Math.round(r.categories.accessibility.score*100),'seo',Math.round(r.categories.seo.score*100));const cc=r.audits['color-contrast'];console.log('contrast items',(cc.details?.items||[]).length);for(const i of cc.details?.items||[])console.log(' ',i.node.selector.slice(0,80))"
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: 23 тести; performance не гірше за PR 1 (локально ≈ 95), accessibility ≥ 96, SEO 100; список contrast-порушень порожній або лише поза карткою калькулятора. Якщо в картці лишились порушення, виправити колір у відповідному класі (`text-neutral-600` → `text-neutral-700`) і повторити.

- [ ] **Step 2: Записати результати в план**

Дописати в кінець цього файлу:

```markdown
## Результати PR 2

| Метрика | PR 1 | PR 2 |
|---|---|---|
| Performance (mobile, local) | 95 | ... |
| Accessibility | 96 | ... |
| LCP simulated | 2717 ms | ... |
| Тестів | 7 | 26 |

Після деплою: Rich Results Test для BreadcrumbList і WebApplication, PSI, запит на переіндексацію в Search Console. Порівняння позицій за «калькулятор калорій», «калькулятор дефіциту калорій», «розрахунок калорій» через 4–6 тижнів.
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-09-17-calories-calculator-pr2-content.md
git commit -m "docs(plan): record PR 2 verification results"
```

Далі гілку завершує skill `superpowers:finishing-a-development-branch`.

## Результати PR 2

Локальна production-збірка, Lighthouse 12, мобільна емуляція, simulate.

| Метрика | PR 1 | PR 2 |
|---|---|---|
| Performance (mobile, local) | 95 | 96 |
| Accessibility | 96 | 100 |
| SEO | 100 | 100 |
| LCP simulated | 2717 ms | 2617 ms |
| LCP element | h1 | h1 |
| Тестів | 7 | 23 |

Цифри після пакета виправлень з фінального рев'ю (коміт ff5881e). Performance коливається між
прогонами на 5-10 балів через локальний шум; TBT 12 мс після видалення yup із форми.
Контрастних зауважень 0 після заміни кольорів підказки й активного перемикача.

Після деплою: Rich Results Test для BreadcrumbList і WebApplication, PSI, запит на
переіндексацію в Search Console. Порівняння позицій за «калькулятор калорій»,
«калькулятор дефіциту калорій», «розрахунок калорій» через 4–6 тижнів.

## Зміни після фінального рев'ю

- `LIMITS` перенесено з `CaloriesCalcList.tsx` у `lib/calories.ts` як єдине джерело меж форми (вік, зріст, вага).
- Результат калькулятора тепер рендериться лише тоді, коли вік, зріст і вага одночасно непорожні, додатні і в межах `LIMITS` (раніше перевірялась лише «непорожнє додатне число»).
- `round10` зроблено стійким до похибки floating-point: округлення йде через `toFixed(6)` перед `Math.round`, щоб межові значення на кшталт 2700×1.15 не занижувались через 3104.9999999999995.
- Додано `formatKg` — вага у кг виводиться з десятковою комою («0,18», «0,50»), а не з крапкою.
- Колір норми на день і колір попередження про безпечний мінімум узгоджено з темною темою (`text-orange-800 dark:text-mainTitleBlack`; фон і текст попередження — окремі класи для light/dark).
- Замість `aria-live="polite"` на всьому блоці результату додано завжди присутній `sr-only`-підсумок з `aria-live="polite"`, який озвучує норму і ціль скрінрідером одразу після заповнення форми.
- У таблиці цільових калорій заголовки отримали `scope="col"`, назва рядка мети стала `<th scope="row">` з прихованою позначкою «(ваша мета)», `aria-current` на `<tr>` прибрано.
- Уніфіковано формулювання дефіциту в усьому контенті: 10–20% (оптимально 15%), втрата ваги не більше 0,5–1 кг на тиждень — у вступі сторінки, описі, таблиці дефіциту і FAQ.
- Мітки рівнів активності в таблиці норм скорочено до «Низька (1,2)», «Помірна (1,55)», «Висока (1,725)»; заголовок колонки без слова «Активність»; підпис таблиці — «...: ккал на день за рівнем активності».
- Заголовок списку калькуляторів на сторінці скорочено з «Інші фітнес-калькулятори» до «Фітнес-калькулятори».
- CTA під результатом уточнено: «Під вашу ціль {target} ккал застосунок Sytno складе меню на день.»
- Дрібні узгодження контрасту й типографіки: прибрано зайвий `dark:hover:text-mainText` у перемикачах форми; в одному з пунктів FAQ про набір ваги дефіс замінено на тире (10–15%) для єдиного стилю з рештою тексту.
