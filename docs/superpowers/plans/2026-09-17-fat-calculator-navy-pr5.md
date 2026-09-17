# PR 5: калькулятор відсотка жиру з методом за обхватами. План реалізації

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Калькулятор жиру рахує відсоток двома методами (за обхватами без каліпера за замовчуванням і за трьома складками), показує категорію, кілограми жиру і сухої маси, а сторінка отримує макет tool-first, ISR, рейтинг і оновлений контент.

**Architecture:** Формули, ліміти і довідник категорій живуть у чистому модулі `lib/bodyFat.ts` з vitest-тестами; клієнтська форма `FatCalcList` тримає стан обох методів і рендерить `FatResult`; таблиці норм у `FatDescription` рендеряться з того ж довідника. Метадані, JSON-LD, OG-зображення, ISR і рейтинг повторюють патерни PR 1–4; спільні стилі перемикачів з `formStyles.ts`, числа з форми через `toPositiveNumber`.

**Tech Stack:** Next.js 14.2.35 (App Router, ISR, `next/og`), React 18, TypeScript strict, Tailwind 3.3, vitest 5, Lighthouse 12 CLI.

**Spec:** `docs/superpowers/specs/2026-09-17-fat-calculator-navy-design.md`.

**Гілка:** `feat/fat-calculator-navy` від `main` (HEAD `1a67d8b` або новіший).

## Global Constraints

- Домен `https://gym-adrenalin.com.ua`; константи `CALC_SITE_URL`, `ORGANIZATION_ID`, автор і дати з `const/calcSeo.ts`.
- Ліміти: зріст 120–230, шия 20–60, талія 40–200, стегна 50–200, вік 14–100, складка 1–100, вага 30–250 (необов'язкова, без повзунка).
- Метод ВМС (см): чоловіки `495 / (1.0324 − 0.19077·log10(талія − шия) + 0.15456·log10(зріст)) − 450`; жінки `495 / (1.29579 − 0.35004·log10(талія + стегна − шия) + 0.22100·log10(зріст)) − 450`; `null`, якщо талія ≤ шия (чоловіки) або талія + стегна ≤ шия чи стегна відсутні (жінки). Джексон-Поллок: поточні формули з `FatCalcFormula.tsx` без змін. Округлення до одного знака, у видимому тексті десяткова кома.
- Категорії: чоловіки межі 6, 13, 17, 21, 25; жінки 10, 14, 16, 20, 24, 30; значення належить категорії, якщо воно строго менше межі. Здоровий діапазон: чоловіки 12–20%, жінки 16–24%.
- Title лишається `Калькулятор відсотка жиру в організмі для чоловіків та жінок`; H1 `Калькулятор відсотка жиру в організмі`; description з Task 3 рівно 155 знаків.
- Кольори і контраст як у PR 2–4 (`text-neutral-700 dark:text-mainTextBlack`, акцент `text-orange-800 dark:text-mainTitleBlack`).
- Комміти без будь-яких трейлерів (без `Co-Authored-By`). Лінт не запускати. Не змінювати сторінки калорій і ІМТ, `lib/calories.ts`, `lib/bmi.ts`.
- Windows 11, Git Bash, Node 24; production-сервер на порту 3100, зупинка через `netstat -ano` + `taskkill //PID <pid> //F`; довгі файли писати інструментом Write. MongoDB Atlas доступна локально.

## Структура файлів

| Файл | Дія | Відповідальність |
|---|---|---|
| `lib/bodyFat.ts`, `lib/bodyFat.test.ts` | створити | формули, ліміти, категорії, маса жиру |
| `components/calcs-page/FatCalcList.tsx` | переписати | метод, стать, поля обох методів, вага |
| `components/calcs-page/FatResult.tsx` | створити | результат |
| `components/calcs-page/FatCalcFormula.tsx` | видалити | замінений `FatResult` |
| `components/calcs-page/FatDescription.tsx` | переписати | два методи, як міряти, таблиці з довідника |
| `components/calcs-page/FatFaq.tsx` | змінити | 7 питань |
| `components/calcs-page/FatJsonLd.tsx` | змінити | проп `rating`, featureList, HowTo |
| `components/calcs-page/fatHero.ts` | створити | H1 і підводка |
| `app/calcs/fat-calculator/layout.tsx` | переписати | метадані |
| `app/calcs/fat-calculator/opengraph-image.tsx`, `Inter-Bold.ttf` | створити | OG-зображення |
| `app/calcs/fat-calculator/page.tsx`, `loading.tsx` | переписати | tool-first, ISR, рейтинг |
| `const/calcSeo.ts` | змінити | дата оновлення |

---

### Task 1: чистий модуль `lib/bodyFat.ts` (TDD)

**Files:**
- Create: `lib/bodyFat.ts`
- Create: `lib/bodyFat.test.ts`

**Interfaces:**
- Consumes: `type Sex` з `lib/calories.ts`.
- Produces: `FAT_LIMITS`, `type FatMethod`, `interface TapeMeasures`, `navyBodyFat(sex, measures)`, `jacksonPollockBodyFat(sex, age, sumMm)`, `interface FatCategory`, `FAT_CATEGORIES`, `bodyFatCategory(sex, pct)`, `fatRangeLabel(list, index)`, `HEALTHY_RANGE`, `fatMassKg`, `leanMassKg`, `formatPercent`.

- [ ] **Step 1: Тести `lib/bodyFat.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  bodyFatCategory,
  FAT_CATEGORIES,
  FAT_LIMITS,
  fatMassKg,
  fatRangeLabel,
  formatPercent,
  HEALTHY_RANGE,
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

describe('constants', () => {
  it('exposes the agreed limits and healthy ranges', () => {
    expect(FAT_LIMITS.neck).toEqual({ min: 20, max: 60 });
    expect(FAT_LIMITS.weight).toEqual({ min: 30, max: 250 });
    expect(HEALTHY_RANGE.male).toEqual([12, 20]);
    expect(HEALTHY_RANGE.female).toEqual([16, 24]);
  });
});
```

- [ ] **Step 2: RED** — `npm test 2>&1 | tail -6`: помилка резолву `./bodyFat`, решта 55 тестів проходять.

- [ ] **Step 3: Реалізувати `lib/bodyFat.ts`**

```ts
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
// жінки: трицепс, живіт збоку, стегно).
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
  return round1(weightKg - (weightKg * pct) / 100);
}

export function formatPercent(pct: number): string {
  return pct.toFixed(1).replace('.', ',');
}
```

- [ ] **Step 4: GREEN** — `npm test 2>&1 | tail -4`: `Test Files 7 passed`, `Tests 65 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/bodyFat.ts lib/bodyFat.test.ts
git commit -m "feat(fat): pure body-fat module with US Navy and Jackson-Pollock formulas"
```

---

### Task 2: форма з двома методами і результат

**Files:**
- Create: `components/calcs-page/FatResult.tsx`
- Modify: `components/calcs-page/FatCalcList.tsx` (повна заміна)
- Delete: `components/calcs-page/FatCalcFormula.tsx`

**Interfaces:**
- Consumes: `lib/bodyFat.ts`, `toPositiveNumber` з `lib/toPositiveNumber.ts`, `rangeError`, `SEX_OPTIONS`/`toggleClass` з `formStyles.ts`, `InputSkeleton` (з пропом `noRange`).
- Produces: `FatResult({ method, sex, values })`, де `values: Record<FatField, string>`; `type FatField = 'height' | 'neck' | 'waist' | 'hip' | 'age' | 'skinFold' | 'skinFoldW' | 'skinFoldL' | 'weight'`.

- [ ] **Step 1: `components/calcs-page/FatResult.tsx`**

```tsx
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
  jacksonPollockBodyFat,
  leanMassKg,
  navyBodyFat,
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
```

- [ ] **Step 2: Переписати `components/calcs-page/FatCalcList.tsx`**

```tsx
'use client';

import React, { useState } from 'react';
import { InputSkeleton } from './InputSkeleton';
import { FatResult, type FatField } from './FatResult';
import { SEX_OPTIONS, toggleClass } from './formStyles';
import { FAT_LIMITS, type FatMethod } from '@/lib/bodyFat';
import type { Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';

const METHODS: Array<{ value: FatMethod; label: string }> = [
  { value: 'tape', label: 'За обхватами' },
  { value: 'caliper', label: 'За складками' },
];

const LIMIT_OF: Record<FatField, { min: number; max: number }> = {
  height: FAT_LIMITS.height,
  neck: FAT_LIMITS.neck,
  waist: FAT_LIMITS.waist,
  hip: FAT_LIMITS.hip,
  age: FAT_LIMITS.age,
  skinFold: FAT_LIMITS.skinfold,
  skinFoldW: FAT_LIMITS.skinfold,
  skinFoldL: FAT_LIMITS.skinfold,
  weight: FAT_LIMITS.weight,
};

const EMPTY: Record<FatField, string> = {
  height: '',
  neck: '',
  waist: '',
  hip: '',
  age: '',
  skinFold: '',
  skinFoldW: '',
  skinFoldL: '',
  weight: '',
};

export const FatCalcList = () => {
  const [method, setMethod] = useState<FatMethod>('tape');
  const [sex, setSex] = useState<Sex>('male');
  const [values, setValues] = useState<Record<FatField, string>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FatField, string>>>({});

  const change = (field: FatField) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validate = (field: FatField) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setErrors(prev => ({
      ...prev,
      [field]: rangeError(e.target.value, LIMIT_OF[field].min, LIMIT_OF[field].max),
    }));

  const field = (name: FatField, text: string, noRange = false) => (
    <InputSkeleton
      key={name}
      text={text}
      name={name}
      min={LIMIT_OF[name].min}
      max={LIMIT_OF[name].max}
      value={values[name]}
      setAny={change(name)}
      onBlur={validate(name)}
      error={errors[name]}
      noRange={noRange}
    />
  );

  return (
    <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
      <div role="radiogroup" aria-label="Метод" className="flex flex-col gap-2">
        <span className="text-lg font-bold text-left text-mainTitle dark:text-mainTitleBlack">
          Метод
        </span>
        <div className="flex gap-2 flex-wrap">
          {METHODS.map(option => (
            <label key={option.value} className={toggleClass(method === option.value)}>
              <input
                type="radio"
                name="method"
                value={option.value}
                className="sr-only"
                checked={method === option.value}
                onChange={() => setMethod(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div role="radiogroup" aria-label="Стать" className="flex items-center gap-3">
        <span className="p-2 text-lg font-bold text-mainTitle dark:text-mainTitleBlack">
          Стать:
        </span>
        {SEX_OPTIONS.map(option => (
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

      {method === 'tape' ? (
        <>
          {field('height', 'Зріст (см):')}
          {field('neck', 'Обхват шиї (см):')}
          {field('waist', 'Обхват талії (см):')}
          {sex === 'female' && field('hip', 'Обхват стегон (см):')}
          <p className="text-sm text-left text-neutral-600 dark:text-mainTextBlack">
            Стрічка щільно, але не втискається в шкіру; живіт не втягувати.
          </p>
        </>
      ) : (
        <>
          {field('age', 'Вік, років:')}
          <p className="font-bold md:text-lg text-left text-neutral-700 dark:text-mainTextBlack">
            Товщина шкірних складок:
          </p>
          {field('skinFold', sex === 'male' ? 'На грудях (мм):' : 'На трицепсі (мм):')}
          {field('skinFoldW', sex === 'male' ? 'На животі (мм):' : 'Живіт збоку (мм):')}
          {field('skinFoldL', 'На стегні (мм):')}
        </>
      )}

      {field('weight', 'Вага, кг (за бажанням):', true)}

      <FatResult method={method} sex={sex} values={values} />
    </form>
  );
};
```

- [ ] **Step 3: Видалити стару формулу і перевірити**

```bash
git rm -q components/calcs-page/FatCalcFormula.tsx
grep -rn "FatCalcFormula" app components; echo "grep exit: $?"
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/fat-calculator | tr -d '\n' > .lighthouse/fat.html
grep -o 'role="radiogroup"' .lighthouse/fat.html | wc -l
grep -o 'type="range"' .lighthouse/fat.html | wc -l
grep -o 'Обхват талії' .lighthouse/fat.html | wc -l
grep -o 'щоб побачити відсоток жиру' .lighthouse/fat.html | wc -l
grep -c "yup" .next/static/chunks/app/calcs/fat-calculator/*.js; echo "(0 expected)"
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `grep exit: 1`; 65 тестів; `radiogroup` 2 (метод, стать); `type="range"` 3 (зріст, шия, талія; вага без повзунка, стегна лише для жінок); підпис талії ≥ 1; підказка результату 1; yup у чанках 0. Після цього кроку `yup` не використовується жодним калькулятором, але лишається в `package.json` для інших форм сайту.

- [ ] **Step 4: Commit**

```bash
git add components/calcs-page/FatResult.tsx components/calcs-page/FatCalcList.tsx
git commit -m "feat(fat): tape and caliper methods in one form, result with category and fat mass"
```

---

### Task 3: контент, FAQ, JSON-LD, метадані, OG

**Files:**
- Modify: `components/calcs-page/FatDescription.tsx` (повна заміна)
- Modify: `components/calcs-page/FatFaq.tsx` (масив)
- Modify: `components/calcs-page/FatJsonLd.tsx`
- Create: `components/calcs-page/fatHero.ts`
- Modify: `app/calcs/fat-calculator/layout.tsx` (повна заміна)
- Create: `app/calcs/fat-calculator/opengraph-image.tsx`, `app/calcs/fat-calculator/Inter-Bold.ttf`
- Modify: `app/calcs/fat-calculator/page.tsx` (лише `<FatJsonLd rating={null} />`, повна заміна у Task 4)

- [ ] **Step 1: `components/calcs-page/fatHero.ts`**

```ts
export const FAT_H1 = 'Калькулятор відсотка жиру в організмі';
export const FAT_LEAD =
  'Введіть обхвати або складки і дізнайтесь відсоток жиру, категорію і кілограми жиру';
```

- [ ] **Step 2: Переписати `components/calcs-page/FatDescription.tsx`**

```tsx
import Link from 'next/link';
import { FAT_CATEGORIES, fatRangeLabel, HEALTHY_RANGE } from '@/lib/bodyFat';
import type { Sex } from '@/lib/calories';

const linkClass = 'text-mainTitle dark:text-mainTitleBlack underline';

const NormTable = ({ sex, title }: { sex: Sex; title: string }) => (
  <div className="mt-8 overflow-x-auto">
    <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
      <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
        {title}
      </caption>
      <thead>
        <tr className="border-b border-gray-400">
          <th scope="col" className="py-2 pr-4">Відсоток жиру</th>
          <th scope="col" className="py-2">Оцінка</th>
        </tr>
      </thead>
      <tbody>
        {FAT_CATEGORIES[sex].map((category, index) => (
          <tr key={category.label} className="border-b border-gray-300">
            <th scope="row" className="py-2 pr-4 font-normal">
              {fatRangeLabel(FAT_CATEGORIES[sex], index)}
            </th>
            <td className="py-2">{category.label}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DescriptionFat = () => {
  return (
    <div className="text-mainText dark:text-mainTextBlack">
      <ul className="flex flex-col gap-6 text-base lg:text-lg text-justify">
        <li>
          Калькулятор рахує відсоток жиру двома способами. За обхватами шиї, талії і стегон
          працює метод ВМС США: потрібна лише сантиметрова стрічка. За трьома шкірними
          складками працює формула Джексона-Поллока: потрібен каліпер або лінійка і помічник.
        </li>
        <li>
          Здоровий діапазон: <strong>{HEALTHY_RANGE.male[0]}–{HEALTHY_RANGE.male[1]}%</strong>{' '}
          для чоловіків і{' '}
          <strong>{HEALTHY_RANGE.female[0]}–{HEALTHY_RANGE.female[1]}%</strong> для жінок. У
          цьому випадку фігура виглядає спортивною, у міру рельєфною, а здоровʼя не страждає.
        </li>
        <li>
          З віком при незмінному підшкірному прошарку загальна кількість жиру росте:
          накопичується внутрішньомʼязовий жир і жир навколо внутрішніх органів.
        </li>
        <li>
          Чоловіки з <strong>30%</strong> жиру і жінки з <strong>35%</strong> мають явні ознаки
          ожиріння, а разом з ними ростуть ризики для серця і судин.
        </li>
        <li>
          Обидва методи мають похибку 3–4%. Для самоконтролю важливіша не абсолютна точність,
          а однакові умови вимірів: той самий час доби, та сама стрічка, ті самі точки.
        </li>
        <li>
          Знаючи свою форму, розрахуйте{' '}
          <Link href="/calcs/calories-calculator" className={linkClass}>
            денну норму калорій і дефіцит для схуднення
          </Link>
          .
        </li>
        <li>
          Короткі статті про{' '}
          <Link href="/learn/nutrition/diet-for-weight-lost" className={linkClass}>
            Раціон при схудненні
          </Link>{' '}
          та{' '}
          <Link href="/learn/nutrition/diet-for-gaining-weight" className={linkClass}>
            Раціон при наборі ваги
          </Link>
          .
        </li>
      </ul>

      <p className="text-lg font-semibold mt-6 text-mainTitle dark:text-mainTitleBlack">
        Як виміряти обхвати:
      </p>
      <ul className="flex flex-col gap-1 text-justify mt-3 list-disc list-inside">
        <li>Шия: під гортанню, стрічка трохи нахилена вперед-вниз, не стискає.</li>
        <li>
          Талія: чоловіки на рівні пупа, жінки в найвужчому місці; горизонтально, живіт не
          втягувати, вимір після спокійного видиху.
        </li>
        <li>Стегна (для жінок): у найширшому місці сідниць, стрічка горизонтально.</li>
        <li>Зріст без взуття. Усі виміри в сантиметрах, стрічка щільна, але не врізається.</li>
      </ul>

      <p className="text-lg font-semibold mt-6 text-mainTitle dark:text-mainTitleBlack">
        Як виміряти шкірні складки:
      </p>
      <ul className="flex flex-col gap-1 text-justify mt-3 list-disc list-inside">
        <li>
          Відтягніть шкіру вказівним і великим пальцями в потрібному місці і виміряйте товщину
          складки каліпером або лінійкою.
        </li>
        <li>Груди (чоловіки): діагональна складка по зовнішньому краю великого грудного мʼяза.</li>
        <li>Трицепс (жінки): вертикальна складка на задній середній лінії руки між плечем і ліктем.</li>
        <li>
          Живіт: вертикальна складка за 2 см від пупа (чоловіки) або збоку на рівні пупа (жінки).
        </li>
        <li>Стегно: вертикальна складка на передній середній лінії між пахом і коліном.</li>
      </ul>

      <NormTable sex="male" title="Норма відсотка жиру для чоловіків" />
      <NormTable sex="female" title="Норма відсотка жиру для жінок" />

      <p className="mt-6 text-sm">
        Джерела: метод ВМС США за обхватами (Hodgdon &amp; Beckett, 1984); каліперометрія за
        формулою Джексона-Поллока; орієнтовні норми{' '}
        <a
          href="https://www.acsm.org"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Американського коледжу спортивної медицини (ACSM)
        </a>
        .
      </p>
    </div>
  );
};
```

- [ ] **Step 3: Масив `fatFaq` у `components/calcs-page/FatFaq.tsx`** (компонент без змін)

```ts
export const fatFaq = [
  {
    question: 'Як розрахувати відсоток жиру в організмі?',
    answer:
      'Є два домашні способи. За обхватами: виміряйте шию, талію і для жінок стегна сантиметровою стрічкою, вкажіть зріст — калькулятор порахує відсоток за формулою ВМС США. За складками: виміряйте три шкірні складки каліпером або лінійкою — працює формула Джексона-Поллока. Наприклад, чоловік зростом 180 см із шиєю 38 см і талією 90 см має близько 19,8% жиру.',
  },
  {
    question: 'Який відсоток жиру в організмі вважається нормою?',
    answer:
      'Оптимальним є 12–20% жиру для чоловіків і 16–24% для жінок — фігура виглядає спортивною, а здоровʼя не страждає. Показник понад 30% у чоловіків і 35% у жінок свідчить про ожиріння та підвищені ризики для серця й судин.',
  },
  {
    question: 'Як виміряти відсоток жиру в тілі без каліпера?',
    answer:
      'Оберіть у калькуляторі метод «За обхватами»: потрібні лише сантиметрова стрічка і зріст. Виміряйте обхват шиї під гортанню, талії на рівні пупа (жінки — у найвужчому місці) і для жінок стегон у найширшому місці. Це метод ВМС США, який не потребує каліпера.',
  },
  {
    question: 'Який метод точніший: обхвати чи складки?',
    answer:
      'Обидва дають похибку 3–4% порівняно з лабораторними методами. Каліпер точніший, якщо складки міряє досвідчена людина, а стрічка стабільніша для самоконтролю: результат менше залежить від навички. Для відстеження прогресу важливо міряти щоразу однаково: той самий метод, час доби і точки.',
  },
  {
    question: 'Скільки в мене кілограмів жиру?',
    answer:
      'Помножте вагу на відсоток жиру. Наприклад, 80 кг при 19,8% — це 15,8 кг жиру і 64,2 кг сухої маси (мʼязи, кістки, органи, вода). Введіть вагу в калькулятор, і він покаже обидва числа.',
  },
  {
    question: 'Чим відрізняється норма жиру для жінок і чоловіків?',
    answer:
      'Жіночий організм фізіологічно потребує більше жиру, тому норма для жінок вища: 16–24% проти 12–20% у чоловіків. Занадто низький відсоток жиру у жінок (менше 10%) небезпечний і може призвести до припинення менструального циклу.',
  },
  {
    question: 'За якими формулами рахує калькулятор жиру?',
    answer:
      'За обхватами — формула ВМС США (Hodgdon & Beckett, 1984) з обхватами шиї, талії, стегон і зростом. За складками — формула Джексона-Поллока за трьома складками (груди, живіт, стегно у чоловіків; трицепс, живіт збоку, стегно у жінок). Обидві дають оцінку з точністю близько 3–4%.',
  },
];
```

- [ ] **Step 4: `components/calcs-page/FatJsonLd.tsx`**

Додати `import { buildAggregateRating, type RatingStats } from '@/lib/calcRating';`, сигнатуру `export const FatJsonLd = ({ rating }: { rating: RatingStats | null }) => { const aggregateRating = buildAggregateRating(rating); const jsonLd = {…`. У `WebApplication` після `offers` замінити `description` і додати:

```ts
        ...(aggregateRating ? { aggregateRating } : {}),
        description:
          'Безкоштовний онлайн-калькулятор відсотка жиру в організмі: за обхватами шиї, талії і стегон (метод ВМС США) або за трьома шкірними складками (Джексон-Поллок), з нормами для чоловіків і жінок та розрахунком жирової маси.',
        inLanguage: 'uk',
        featureList: [
          'Метод за обхватами без каліпера (ВМС США)',
          'Метод за трьома шкірними складками (Джексон-Поллок)',
          'Категорії і норми окремо для чоловіків і жінок',
          'Жирова і суха маса за вагою',
        ],
```

`HowTo` замінити:

```ts
        name: 'Як розрахувати відсоток жиру за обхватами',
        description:
          'Покрокова інструкція, як визначити відсоток жиру сантиметровою стрічкою за методом ВМС США.',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Оберіть метод і стать', text: 'Залиште метод «За обхватами» і виберіть стать.' },
          { '@type': 'HowToStep', position: 2, name: 'Виміряйте шию', text: 'Обхват шиї під гортанню, стрічка не стискає.' },
          { '@type': 'HowToStep', position: 3, name: 'Виміряйте талію і стегна', text: 'Талія на рівні пупа (жінки — у найвужчому місці), для жінок також стегна в найширшому місці.' },
          { '@type': 'HowToStep', position: 4, name: 'Введіть зріст і виміри', text: 'Усі значення в сантиметрах; за бажанням додайте вагу, щоб побачити кілограми жиру.' },
          { '@type': 'HowToStep', position: 5, name: 'Отримайте результат', text: 'Калькулятор покаже відсоток жиру, категорію для вашої статі, жирову і суху масу.' },
        ],
```

- [ ] **Step 5: Переписати `app/calcs/fat-calculator/layout.tsx`**

```tsx
import type { Metadata } from 'next';

const TITLE = 'Калькулятор відсотка жиру в організмі для чоловіків та жінок';
const DESCRIPTION =
  'Безкоштовний калькулятор відсотка жиру онлайн: за обхватами талії, шиї і стегон без каліпера або за трьома шкірними складками. Норми для чоловіків і жінок.';
const PAGE_URL = 'https://gym-adrenalin.com.ua/calcs/fat-calculator';

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
    'калькулятор жиру в організмі',
    'відсоток жиру в організмі калькулятор',
    'калькулятор відсотка жиру',
    'як порахувати відсоток жиру в організмі',
    'відсоток жиру в організмі норма',
    'відсоток жиру у жінок',
    'відсоток жиру у чоловіків',
    'калькулятор жиру за обхватами',
    'відсоток жиру без каліпера',
    'метод вмс сша відсоток жиру',
    'каліперометрія',
    'формула джексона поллока',
    'жирова маса калькулятор',
    'суха маса тіла калькулятор',
    'як виміряти відсоток жиру в домашніх умовах',
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

export default function FatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 6: OG-зображення**

```bash
cp app/calcs/calories-calculator/Inter-Bold.ttf app/calcs/fat-calculator/Inter-Bold.ttf
cp app/calcs/calories-calculator/opengraph-image.tsx app/calcs/fat-calculator/opengraph-image.tsx
```

У новому файлі: `alt` → `'Калькулятор відсотка жиру в організмі від тренажерного залу Адреналін: за обхватами і складками, норми для чоловіків і жінок'`; заголовок → `Калькулятор відсотка жиру`; підзаголовок → `за обхватами · за складками · норми для чоловіків і жінок`.

- [ ] **Step 7: Тимчасовий проп у поточній сторінці**

У `app/calcs/fat-calculator/page.tsx` замінити `<FatJsonLd />` на `<FatJsonLd rating={null} />` (сторінка переписується в Task 4).

- [ ] **Step 8: Перевірка**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
node -e "const d='Безкоштовний калькулятор відсотка жиру онлайн: за обхватами талії, шиї і стегон без каліпера або за трьома шкірними складками. Норми для чоловіків і жінок.';console.log('description',d.length)"
```

Очікувано: 65 тестів; збірка успішна; description 155.

- [ ] **Step 9: Commit**

```bash
git add components/calcs-page/FatDescription.tsx components/calcs-page/FatFaq.tsx components/calcs-page/FatJsonLd.tsx components/calcs-page/fatHero.ts app/calcs/fat-calculator/layout.tsx app/calcs/fat-calculator/opengraph-image.tsx app/calcs/fat-calculator/Inter-Bold.ttf app/calcs/fat-calculator/page.tsx
git commit -m "seo(fat): two-method description with norm tables, richer FAQ and JSON-LD, new metadata"
```

---

### Task 4: сторінка жиру: tool-first, ISR, рейтинг

**Files:**
- Modify: `app/calcs/fat-calculator/page.tsx` (повна заміна)
- Modify: `app/calcs/fat-calculator/loading.tsx` (повна заміна)

- [ ] **Step 1: Переписати `app/calcs/fat-calculator/page.tsx`**

```tsx
import Link from 'next/link';
import { ButtonGroup } from '@/components/calcs-page/ButttonGroup';
import { CalcTitle } from '@/components/calcs-page/CalcsTitle';
import { FatCalcList } from '@/components/calcs-page/FatCalcList';
import { DescriptionFat } from '@/components/calcs-page/FatDescription';
import { FatFaq } from '@/components/calcs-page/FatFaq';
import { FatJsonLd } from '@/components/calcs-page/FatJsonLd';
import { CalcByline } from '@/components/calcs-page/CalcByline';
import { CalcRating } from '@/components/calcs-page/CalcRating';
import { FAT_H1, FAT_LEAD } from '@/components/calcs-page/fatHero';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import { getCalcRating } from '@/app/_services/calcRating.service';

export const revalidate = 3600;

const FatCalc = async () => {
  const rating = await getCalcRating('fat-calculator');

  return (
    <main>
      <section className="bg-[#2E2F42] md:bg-hero-photo bg-cover bg-center">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <nav aria-label="Хлібні крихти" className="text-left text-mainTitleBlack">
            <ol className="flex gap-2 items-center">
              <li>
                <Link href="/" className="flex gap-2 items-center">
                  <HomeIcon />
                  <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
                </Link>
              </li>
              <li>
                <Link href="/calcs" className="flex gap-2 items-center font-semibold">
                  <span className="sr-only md:not-sr-only">&gt; Калькулятори</span>
                </Link>
              </li>
              <li>
                <span className="font-semibold"> &gt; Відсоток жиру в тілі</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            {FAT_H1}
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            {FAT_LEAD}
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-darkBody">
        <div className="div-container py-6 md:py-[44px] mx-auto text-center">
          <div className="flex flex-col items-center md:items-start md:flex-row gap-10 md:gap-6 justify-between lg:justify-evenly">
            <div
              className="p-6 md:p-12 bg-[#F5F5F5] dark:bg-[#676465] flex flex-col w-full max-w-[500px]
            text-center basis-1/2
            shadow-[0px_4px_20px_0px_rgba(133,119,123,0.30)] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]"
            >
              <p className="text-sm mb-4 text-neutral-600 dark:text-mainTextBlack">
                Переміщуйте повзунок або введіть значення вручну
              </p>
              <FatCalcList />
              <ButtonGroup />
              <CalcRating calcId="fat-calculator" initial={rating} />
            </div>

            <div className="basis-1/2 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-mainTitle dark:text-mainTitleBlack">
                Розрахунок відсотка жиру в тілі онлайн
              </h2>
              <p className="mt-4 text-base md:text-lg text-mainText dark:text-mainTextBlack">
                Відсоток жиру показує, яка частка ваги припадає на жирову тканину, і каже про
                форму більше, ніж ІМТ. Калькулятор рахує його за обхватами сантиметровою
                стрічкою або за товщиною шкірних складок і порівнює з нормами для вашої статі.
              </p>
              <DescriptionFat />
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-mainTitle dark:text-mainTitleBlack">
              Фітнес-калькулятори
            </h2>
            <CalcTitle page={1} />
          </div>
        </div>
      </section>

      <FatFaq />
      <CalcByline />
      <FatJsonLd rating={rating} />
    </main>
  );
};

export default FatCalc;
```

- [ ] **Step 2: Переписати `app/calcs/fat-calculator/loading.tsx`**

```tsx
import SceletonForCalc from '@/components/sceleton/sceletonForCalc';
import { FAT_H1, FAT_LEAD } from '@/components/calcs-page/fatHero';

export default function Loading() {
  return (
    <main>
      <section className="bg-[#2E2F42] md:bg-hero-photo bg-cover bg-center">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <div className="h-5 w-40 rounded bg-gray-500/60" aria-hidden="true" />
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            {FAT_H1}
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            {FAT_LEAD}
          </p>
        </div>
      </section>
      <section className="bg-white dark:bg-darkBody">
        <div className="div-container py-[20px] md:py-[44px] mx-auto text-center">
          <SceletonForCalc />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Перевірка**

```bash
npm run build 2>&1 | grep -E "Compiled|Failed|error|fat-calculator " | head -4
node -e "const m=require('./.next/prerender-manifest.json');console.log('fat revalidate:',m.routes['/calcs/fat-calculator']?.initialRevalidateSeconds)"
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/fat-calculator | tr -d '\n' > .lighthouse/fat.html
grep -oE "<title>[^<]*</title>" .lighthouse/fat.html
grep -oE "<h[12][^>]*>[^<]*</h[12]>" .lighthouse/fat.html | sed -E 's/<[^>]+>//g'
grep -o "<table" .lighthouse/fat.html | wc -l
grep -o 'Чи корисний калькулятор' .lighthouse/fat.html | wc -l
grep -o '"@type":"Question"' .lighthouse/fat.html | wc -l
grep -o 'HowToStep' .lighthouse/fat.html | wc -l
grep -oE '<meta property="og:image" content="[^"]*"' .lighthouse/fat.html | head -1
curl -s -o /dev/null -w "og: %{http_code} %{content_type} %{size_download}\n" http://localhost:3100/calcs/fat-calculator/opengraph-image
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `initialRevalidateSeconds: 3600`; title без суфікса; заголовки H1 → «Розрахунок відсотка жиру в тілі онлайн» → «Фітнес-калькулятори» → «Часті питання про відсоток жиру в організмі»; `<table` 2; віджет 1; `Question` 7; `HowToStep` 5 (або 10 через RSC-дублювання); og:image і картинка `200 image/png`.

- [ ] **Step 4: Commit**

```bash
git add app/calcs/fat-calculator/page.tsx app/calcs/fat-calculator/loading.tsx
git commit -m "feat(fat): tool-first layout, ISR with rating widget and aggregateRating"
```

---

### Task 5: дата оновлення і фінальна перевірка

**Files:**
- Modify: `const/calcSeo.ts`
- Modify: `docs/superpowers/plans/2026-09-17-fat-calculator-navy-pr5.md` (розділ «Результати»)

- [ ] **Step 1: Дата** — у `const/calcSeo.ts` встановити `CALC_DATE_MODIFIED` і `CALC_DATE_MODIFIED_LABEL` на поточну дату (якщо вона вже така, лишити).

- [ ] **Step 2: Тести, збірка, Lighthouse**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npx --yes lighthouse@12 http://localhost:3100/calcs/fat-calculator --only-categories=performance,accessibility,seo --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --output=json --output-path=.lighthouse/pr5.json --quiet
node -e "const r=require('./.lighthouse/pr5.json');const c=r.categories;console.log('perf',Math.round(c.performance.score*100),'a11y',Math.round(c.accessibility.score*100),'seo',Math.round(c.seo.score*100));const f=Object.values(r.audits).filter(a=>a.score!==null&&a.score<1&&a.scoreDisplayMode==='binary').map(a=>a.id);console.log('failing:',f.join(', ')||'none')"
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: 65 тестів; performance ≥ 90, accessibility 100, SEO 100, без провалених бінарних аудитів.

- [ ] **Step 3: Ручна перевірка в браузері** (`npm run dev`): чоловік 180/38/90 → 19,8%, «Середній рівень»; вага 80 → 15,8 і 64,2 кг; талія 35 → підказка; метод «За складками», 30 років, 20+20+20 → 17,9%; жінка з обхватами 165/33/75/98 → 28,4%; темна тема; зірки. Зупинити dev-сервер.

- [ ] **Step 4: Записати результати** — дописати в кінець цього файлу:

```markdown
## Результати PR 5

| Метрика | До (PR 4) | PR 5 |
|---|---|---|
| Performance (mobile, local) | … | … |
| Accessibility | … | … |
| SEO | … | … |
| Тестів | 55 | 65 |

Після деплою: Rich Results Test, PSI, запит на індексування; через 4–6 тижнів позиція за
«відсоток жиру в організмі калькулятор» (базова 8,7) і CTR (базовий 2,6%).
```

- [ ] **Step 5: Commit**

```bash
git add const/calcSeo.ts docs/superpowers/plans/2026-09-17-fat-calculator-navy-pr5.md
git commit -m "docs(plan): record PR 5 verification results"
```

Далі гілку завершує skill `superpowers:finishing-a-development-branch`.

## Результати PR 5

| Метрика | До (PR 4) | PR 5 |
|---|---|---|
| Performance (mobile, local) | 97 | 94 |
| Accessibility | 100 | 100 |
| SEO | 100 | 100 |
| Тестів | 55 | 66 |

ISR сторінки жиру: `initialRevalidateSeconds` 3600. Дата `CALC_DATE_MODIFIED` уже 2026-09-17.

Зміни поза планом: контрольне значення Джексона-Поллока для 60 мм і 30 років виправлено на
17,9% (план помилково писав 18,0%); додано перевірку правдоподібності результату 2–70%
(`isPlausibleBodyFat`), бо формула ВМС при талії, що ледь перевищує шию, дає безглузді
від'ємні значення.

Після деплою: Rich Results Test, PSI, запит на індексування; через 4–6 тижнів позиція за
«відсоток жиру в організмі калькулятор» (базова 8,7) і CTR (базовий 2,6%).
