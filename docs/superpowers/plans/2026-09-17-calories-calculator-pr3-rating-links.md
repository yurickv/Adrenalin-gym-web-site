# PR 3: рейтинг калькулятора і внутрішні посилання. План реалізації

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Користувачі оцінюють калькулятор калорій п'ятьма зірками, середня оцінка з п'яти й більше голосів потрапляє в JSON-LD як `aggregateRating`, а ключові сторінки сайту посилаються на калькулятор описовими анкорами.

**Architecture:** Голоси зберігаються в MongoDB двома моделями: агрегат `CalcRating { calcId, sum, count }` і журнал `CalcRatingVote { calcId, ipHash, createdAt }` з TTL 24 години та унікальним індексом, що блокує повторний голос з однієї адреси. API `GET/POST /api/calc-rating/[calcId]` читає й пише агрегат. Сторінка калькулятора стає ISR (`revalidate = 3600`), читає агрегат напряму з бази у серверному компоненті й передає його в JSON-LD і в клієнтський віджет. Уся арифметика й правила (валідний бал, середнє, поріг публікації) живуть у чистому модулі `lib/calcRating.ts` з vitest-тестами.

**Tech Stack:** Next.js 14.2.35 (App Router, ISR), React 18, TypeScript strict, Mongoose 8, Node `crypto`, Tailwind 3.3, vitest 5.

**Spec:** `docs/superpowers/specs/2026-09-16-calories-calculator-seo-design.md`, розділ 6. Відхилення, прийняте в цьому плані: віджет рендериться завжди, навіть якщо база недоступна під час рендеру сторінки (тоді без статистики, а `aggregateRating` у JSON-LD відсутній). Spec пропонував ховати віджет, але це залишало б сторінку без віджета на годину після будь-якого збою бази.

**Гілка:** `feat/calories-rating-links` від `main` (HEAD `186a7f8` або новіший).

## Global Constraints

- Домен `https://gym-adrenalin.com.ua`. Допустимі `calcId`: `calories-calculator`, `imt-calculator`, `fat-calculator`; віджет у цьому PR підключається тільки на сторінці калорій.
- Бал: ціле число від 1 до 5. Середнє округлюється до одного знака. `aggregateRating` публікується лише при `count >= 5`, з `bestRating: 5`, `worstRating: 1`, `ratingValue` рядком з одним знаком, `ratingCount` числом.
- Один голос на адресу на добу: `CalcRatingVote` з унікальним індексом `(calcId, ipHash)` і TTL-індексом `createdAt` на 86400 с. Адреса хешується SHA-256 із сіллю `process.env.NEXTAUTH_SECRET`; сира адреса ніде не зберігається і не логується.
- Один голос на браузер: ключ `localStorage` `calc_rating_<calcId>` зі значенням балу.
- Сторінка калорій: `export const revalidate = 3600;` без `dynamic = 'force-dynamic'`.
- Помилки API повертають `{ message }` зі статусом з класів у `app/api/_helpers/errors.ts`; успіх повертає `{ average, count }`.
- Тексти віджета: заголовок `Чи корисний калькулятор?`, після голосу `Дякуємо! Середня оцінка {average} з 5, голосів: {count}`, при повторній спробі `Ви вже оцінювали цей калькулятор сьогодні`, при збої `Не вдалося зберегти оцінку, спробуйте пізніше`.
- Внутрішні посилання: анкори містять слово «калькулятор» і призначення, наприклад `калькулятор калорій для схуднення`, `калькулятор денної норми калорій`, `калькулятор ІМТ`, `калькулятор відсотка жиру в організмі`. Крапка після посилання стоїть поза `<Link>`.
- Комміти без будь-яких трейлерів (без `Co-Authored-By`). Лінт не запускати (ESLint відсутній). Не змінювати `app/api/_utils/database.ts`.
- Windows 11, Git Bash, Node 24; production-сервер для перевірок на порту 3100; довгі файли писати інструментом Write. `.env` містить `MONGODB_URI` і `NEXTAUTH_SECRET`; якщо база з локальної машини недоступна, ручні перевірки API виконуються на Vercel preview, а в звіті це зазначається.

## Структура файлів

| Файл | Дія | Відповідальність |
|---|---|---|
| `lib/calcRating.ts`, `lib/calcRating.test.ts` | створити | ідентифікатори, валідація балу, середнє, поріг, обʼєкт `AggregateRating`, ключ localStorage |
| `app/api/_schemas/calcRating.schema.ts` | створити | моделі `CalcRating` і `CalcRatingVote` з індексами |
| `app/api/_helpers/hashIp.ts` | створити | SHA-256 адреси з сіллю |
| `app/api/calc-rating/[calcId]/route.ts` | створити | GET агрегат, POST голос |
| `app/_services/calcRating.service.ts` | створити | серверне читання агрегату напряму з бази |
| `components/calcs-page/CaloriesJsonLd.tsx` | змінити | проп `rating`, `aggregateRating` у `WebApplication` |
| `components/calcs-page/CalcRating.tsx` | створити | клієнтський віджет зірок |
| `app/calcs/calories-calculator/page.tsx` | змінити | ISR, читання рейтингу, віджет |
| `components/main-page/AboutCalc.tsx` | змінити | прямі посилання на три калькулятори |
| `components/calcs-page/IMTDescription.tsx`, `components/calcs-page/FatDescription.tsx` | змінити | посилання на калькулятор калорій |
| `app/learn/nutrition/basics/page.tsx`, `app/learn/nutrition/diet-for-gaining-weight/page.tsx`, `app/learn/nutrition/diet-for-weight-lost/page.tsx` | змінити | описові анкори |

---

### Task 1: чистий модуль `lib/calcRating.ts` (TDD)

**Files:**
- Create: `lib/calcRating.ts`
- Create: `lib/calcRating.test.ts`

**Interfaces:**
- Produces:
  - `CALC_IDS = ['calories-calculator', 'imt-calculator', 'fat-calculator'] as const`, `type CalcId`, `isCalcId(value: unknown): value is CalcId`
  - `RATING_MIN = 1`, `RATING_MAX = 5`, `isValidRatingValue(value: unknown): value is number`
  - `MIN_RATING_COUNT = 5`, `isPublishable(count: number): boolean`
  - `averageOf(sum: number, count: number): number` (один знак, 0 при `count <= 0`)
  - `interface RatingStats { average: number; count: number }`
  - `buildAggregateRating(stats: RatingStats | null | undefined): AggregateRatingJsonLd | undefined`
  - `ratingStorageKey(calcId: CalcId): string`

- [ ] **Step 1: Тести `lib/calcRating.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  averageOf,
  buildAggregateRating,
  CALC_IDS,
  isCalcId,
  isPublishable,
  isValidRatingValue,
  MIN_RATING_COUNT,
  ratingStorageKey,
} from './calcRating';

describe('isCalcId', () => {
  it('accepts the three calculators and rejects anything else', () => {
    for (const id of CALC_IDS) expect(isCalcId(id)).toBe(true);
    expect(isCalcId('blog')).toBe(false);
    expect(isCalcId(undefined)).toBe(false);
  });
});

describe('isValidRatingValue', () => {
  it('accepts integers 1..5 only', () => {
    expect(isValidRatingValue(1)).toBe(true);
    expect(isValidRatingValue(5)).toBe(true);
    expect(isValidRatingValue(0)).toBe(false);
    expect(isValidRatingValue(6)).toBe(false);
    expect(isValidRatingValue(4.5)).toBe(false);
    expect(isValidRatingValue('5')).toBe(false);
    expect(isValidRatingValue(NaN)).toBe(false);
  });
});

describe('averageOf', () => {
  it('rounds to one decimal', () => {
    expect(averageOf(22, 5)).toBe(4.4);
    expect(averageOf(13, 3)).toBe(4.3);
  });

  it('returns 0 when there are no votes', () => {
    expect(averageOf(0, 0)).toBe(0);
  });
});

describe('isPublishable', () => {
  it(`needs at least ${MIN_RATING_COUNT} votes`, () => {
    expect(isPublishable(4)).toBe(false);
    expect(isPublishable(5)).toBe(true);
  });
});

describe('buildAggregateRating', () => {
  it('returns schema.org AggregateRating for publishable stats', () => {
    expect(buildAggregateRating({ average: 4.4, count: 12 })).toEqual({
      '@type': 'AggregateRating',
      ratingValue: '4.4',
      ratingCount: 12,
      bestRating: 5,
      worstRating: 1,
    });
  });

  it('returns undefined below the threshold or without stats', () => {
    expect(buildAggregateRating({ average: 5, count: 4 })).toBeUndefined();
    expect(buildAggregateRating(null)).toBeUndefined();
    expect(buildAggregateRating(undefined)).toBeUndefined();
  });
});

describe('ratingStorageKey', () => {
  it('namespaces the key by calculator', () => {
    expect(ratingStorageKey('calories-calculator')).toBe('calc_rating_calories-calculator');
  });
});
```

- [ ] **Step 2: Запустити і побачити RED** — `npm test 2>&1 | tail -6`, очікувано помилка резолву `./calcRating`, решта 26 тестів проходять.

- [ ] **Step 3: Реалізувати `lib/calcRating.ts`**

```ts
export const CALC_IDS = [
  'calories-calculator',
  'imt-calculator',
  'fat-calculator',
] as const;
export type CalcId = (typeof CALC_IDS)[number];

export function isCalcId(value: unknown): value is CalcId {
  return typeof value === 'string' && (CALC_IDS as readonly string[]).includes(value);
}

export const RATING_MIN = 1;
export const RATING_MAX = 5;

export function isValidRatingValue(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= RATING_MIN &&
    value <= RATING_MAX
  );
}

export const MIN_RATING_COUNT = 5;

export function isPublishable(count: number): boolean {
  return count >= MIN_RATING_COUNT;
}

export function averageOf(sum: number, count: number): number {
  if (count <= 0) return 0;
  return Math.round((sum / count) * 10) / 10;
}

export interface RatingStats {
  average: number;
  count: number;
}

export interface AggregateRatingJsonLd {
  '@type': 'AggregateRating';
  ratingValue: string;
  ratingCount: number;
  bestRating: number;
  worstRating: number;
}

export function buildAggregateRating(
  stats: RatingStats | null | undefined
): AggregateRatingJsonLd | undefined {
  if (!stats || !isPublishable(stats.count)) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: stats.average.toFixed(1),
    ratingCount: stats.count,
    bestRating: RATING_MAX,
    worstRating: RATING_MIN,
  };
}

export function ratingStorageKey(calcId: CalcId): string {
  return `calc_rating_${calcId}`;
}
```

- [ ] **Step 4: GREEN** — `npm test 2>&1 | tail -4`, очікувано `Test Files 4 passed`, `Tests 34 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/calcRating.ts lib/calcRating.test.ts
git commit -m "feat(rating): pure calculator rating rules and AggregateRating builder"
```

---

### Task 2: моделі, хеш адреси, API

**Files:**
- Create: `app/api/_schemas/calcRating.schema.ts`
- Create: `app/api/_helpers/hashIp.ts`
- Create: `app/api/calc-rating/[calcId]/route.ts`

**Interfaces:**
- Consumes: `connectToDB` з `app/api/_utils/database.ts`; `BadRequest`, `NotFound`, `Conflict` з `app/api/_helpers/errors.ts`; `isCalcId`, `isValidRatingValue`, `averageOf` з `lib/calcRating.ts`.
- Produces: моделі `CalcRating`, `CalcRatingVote`; `hashIp(ip: string): string`; `GET /api/calc-rating/:calcId` → `{ average, count }` (200; `404` для невідомого calcId); `POST` з тілом `{ value }` → `{ average, count }` (200; `400` для поганого балу; `409` для повторного голосу за добу).

- [ ] **Step 1: `app/api/_schemas/calcRating.schema.ts`**

```ts
import { model, models, Schema } from 'mongoose';

const CalcRatingSchema = new Schema(
  {
    calcId: { type: String, required: true, unique: true },
    sum: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

const CalcRatingVoteSchema = new Schema(
  {
    calcId: { type: String, required: true },
    ipHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

CalcRatingVoteSchema.index({ calcId: 1, ipHash: 1 }, { unique: true });
CalcRatingVoteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const CalcRating =
  models.CalcRating || model('CalcRating', CalcRatingSchema);
export const CalcRatingVote =
  models.CalcRatingVote || model('CalcRatingVote', CalcRatingVoteSchema);
```

- [ ] **Step 2: `app/api/_helpers/hashIp.ts`**

```ts
import { createHash } from 'crypto';

export function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET ?? 'calc-rating';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}
```

- [ ] **Step 3: `app/api/calc-rating/[calcId]/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/api/_utils/database';
import { CalcRating, CalcRatingVote } from '@/app/api/_schemas/calcRating.schema';
import { hashIp } from '@/app/api/_helpers/hashIp';
import { BadRequest, Conflict, NotFound } from '@/app/api/_helpers/errors';
import { averageOf, isCalcId, isValidRatingValue } from '@/lib/calcRating';

type Params = { calcId: string };

function statsOf(doc: { sum?: number; count?: number } | null) {
  const sum = doc?.sum ?? 0;
  const count = doc?.count ?? 0;
  return { average: averageOf(sum, count), count };
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || req.ip || 'unknown';
}

function errorResponse(e: unknown) {
  const err = e as { message?: string; status?: number };
  return NextResponse.json(
    { message: err.message || 'Unable to process rating' },
    { status: err.status || 500 }
  );
}

export const GET = async (_req: NextRequest, { params }: { params: Params }) => {
  try {
    if (!isCalcId(params.calcId)) {
      throw new NotFound(`Unknown calculator '${params.calcId}'`);
    }
    await connectToDB();
    const doc = await CalcRating.findOne({ calcId: params.calcId }).lean();
    return NextResponse.json(statsOf(doc), { status: 200 });
  } catch (e) {
    return errorResponse(e);
  }
};

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    if (!isCalcId(params.calcId)) {
      throw new NotFound(`Unknown calculator '${params.calcId}'`);
    }
    const body = await req.json().catch(() => ({}));
    const value = body?.value;
    if (!isValidRatingValue(value)) {
      throw new BadRequest('value must be an integer from 1 to 5');
    }

    await connectToDB();

    try {
      await CalcRatingVote.create({
        calcId: params.calcId,
        ipHash: hashIp(clientIp(req)),
      });
    } catch (e) {
      if ((e as { code?: number }).code === 11000) {
        throw new Conflict('Ви вже оцінювали цей калькулятор сьогодні');
      }
      throw e;
    }

    const doc = await CalcRating.findOneAndUpdate(
      { calcId: params.calcId },
      { $inc: { sum: value, count: 1 } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json(statsOf(doc), { status: 200 });
  } catch (e) {
    return errorResponse(e);
  }
};
```

- [ ] **Step 4: Збірка і ручна перевірка API**

```bash
npm run build 2>&1 | grep -E "Compiled|Failed|error|calc-rating" | head -4
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s -w " [%{http_code}]\n" http://localhost:3100/api/calc-rating/calories-calculator
curl -s -w " [%{http_code}]\n" http://localhost:3100/api/calc-rating/unknown
curl -s -w " [%{http_code}]\n" -X POST -H "Content-Type: application/json" -d '{"value":7}' http://localhost:3100/api/calc-rating/calories-calculator
curl -s -w " [%{http_code}]\n" -X POST -H "Content-Type: application/json" -H "X-Forwarded-For: 203.0.113.10" -d '{"value":5}' http://localhost:3100/api/calc-rating/calories-calculator
curl -s -w " [%{http_code}]\n" -X POST -H "Content-Type: application/json" -H "X-Forwarded-For: 203.0.113.10" -d '{"value":4}' http://localhost:3100/api/calc-rating/calories-calculator
curl -s -w " [%{http_code}]\n" http://localhost:3100/api/calc-rating/calories-calculator
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: маршрут `ƒ /api/calc-rating/[calcId]` у виводі збірки; GET `{"average":0,"count":0} [200]` (або поточні значення); `unknown` → `[404]`; `value 7` → `[400]`; перший POST → `{"average":5,"count":1} [200]`; повторний з тієї ж адреси → `[409]` з повідомленням українською; фінальний GET показує `count` 1. Якщо база недоступна (у логах `MongoDB` помилка, відповіді `[500]` після паузи), зафіксувати це у звіті: перевірку виконати на Vercel preview після пушу. Тестові голоси залишаються в базі, це прийнятно (TTL прибере журнал за добу; агрегат можна обнулити вручну в Atlas перед релізом).

- [ ] **Step 5: Commit**

```bash
git add app/api/_schemas/calcRating.schema.ts app/api/_helpers/hashIp.ts "app/api/calc-rating/[calcId]/route.ts"
git commit -m "feat(rating): calc rating models and GET/POST API with per-IP daily vote guard"
```

---

### Task 3: серверне читання рейтингу, JSON-LD, ISR

**Files:**
- Create: `app/_services/calcRating.service.ts`
- Modify: `components/calcs-page/CaloriesJsonLd.tsx`
- Modify: `app/calcs/calories-calculator/page.tsx`

**Interfaces:**
- Consumes: `connectToDB`, модель `CalcRating`, `averageOf`, `RatingStats`, `buildAggregateRating`, `CalcId`.
- Produces: `getCalcRating(calcId: CalcId): Promise<RatingStats | null>`; `CaloriesJsonLd({ rating }: { rating: RatingStats | null })`.

- [ ] **Step 1: `app/_services/calcRating.service.ts`**

```ts
import mongoose from 'mongoose';
import { connectToDB } from '@/app/api/_utils/database';
import { CalcRating } from '@/app/api/_schemas/calcRating.schema';
import { averageOf, type CalcId, type RatingStats } from '@/lib/calcRating';

// Читається напряму з бази у серверному компоненті сторінки (ISR), без
// самозапиту до власного API: під час збірки API ще не піднятий.
export async function getCalcRating(calcId: CalcId): Promise<RatingStats | null> {
  try {
    await connectToDB();
    if (mongoose.connection.readyState !== 1) return null;
    const doc = await CalcRating.findOne({ calcId }).lean<{ sum?: number; count?: number }>();
    const count = doc?.count ?? 0;
    return { average: averageOf(doc?.sum ?? 0, count), count };
  } catch (e) {
    console.error('calcRating.service: не вдалося прочитати рейтинг', e);
    return null;
  }
}
```

- [ ] **Step 2: Проп `rating` у `components/calcs-page/CaloriesJsonLd.tsx`**

Замінити сигнатуру й додати імпорт:

```tsx
import { buildAggregateRating, type RatingStats } from '@/lib/calcRating';

export const CaloriesJsonLd = ({ rating }: { rating: RatingStats | null }) => {
  const aggregateRating = buildAggregateRating(rating);
  const jsonLd = {
```

У вузлі `WebApplication` після `offers: {...},` додати рядок:

```ts
        ...(aggregateRating ? { aggregateRating } : {}),
```

Решта файлу без змін.

- [ ] **Step 3: ISR і читання рейтингу в `app/calcs/calories-calculator/page.tsx`**

Додати імпорт `import { getCalcRating } from '@/app/_services/calcRating.service';`, після імпортів:

```tsx
export const revalidate = 3600;
```

Компонент стає асинхронним і передає рейтинг у JSON-LD:

```tsx
const CaloriesCalc = async () => {
  const rating = await getCalcRating('calories-calculator');
  return (
```

і в кінці `<CaloriesJsonLd rating={rating} />`.

- [ ] **Step 4: Перевірка**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error|calories-calculator " | head -4
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/pr3.html
grep -o '"aggregateRating"' .lighthouse/pr3.html | wc -l
grep -o '"@type":"WebApplication"' .lighthouse/pr3.html | wc -l
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: у збірці сторінка позначена як ISR (`◐` або `○` з revalidate 1h у легенді, залежно від версії виводу); `WebApplication` 1; `aggregateRating` 0, поки голосів менше 5 (або 1, якщо в базі вже ≥ 5). Сторінка рендериться навіть без бази.

- [ ] **Step 5: Commit**

```bash
git add app/_services/calcRating.service.ts components/calcs-page/CaloriesJsonLd.tsx app/calcs/calories-calculator/page.tsx
git commit -m "feat(rating): read calculator rating on the server, ISR page, aggregateRating in JSON-LD"
```

---

### Task 4: клієнтський віджет `CalcRating`

**Files:**
- Create: `components/calcs-page/CalcRating.tsx`
- Modify: `app/calcs/calories-calculator/page.tsx`

**Interfaces:**
- Consumes: `CalcId`, `RatingStats`, `RATING_MIN`, `RATING_MAX`, `ratingStorageKey`, `isValidRatingValue` з `lib/calcRating.ts`; API з Task 2.
- Produces: `CalcRating({ calcId, initial }: { calcId: CalcId; initial: RatingStats | null })`.

- [ ] **Step 1: `components/calcs-page/CalcRating.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import {
  isValidRatingValue,
  RATING_MAX,
  RATING_MIN,
  ratingStorageKey,
  type CalcId,
  type RatingStats,
} from '@/lib/calcRating';

type Props = { calcId: CalcId; initial: RatingStats | null };
type Status = 'idle' | 'pending' | 'voted' | 'duplicate' | 'error';

const STARS = Array.from(
  { length: RATING_MAX - RATING_MIN + 1 },
  (_, i) => RATING_MIN + i
);

function readStoredVote(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    const value = raw === null ? null : Number(raw);
    return isValidRatingValue(value) ? value : null;
  } catch {
    return null;
  }
}

export const CalcRating = ({ calcId, initial }: Props) => {
  const key = ratingStorageKey(calcId);
  const [stats, setStats] = useState<RatingStats | null>(initial);
  const [vote, setVote] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const stored = readStoredVote(key);
    if (stored !== null) {
      setVote(stored);
      setStatus('voted');
    }
  }, [key]);

  const submit = async (value: number) => {
    if (status === 'pending' || status === 'voted' || status === 'duplicate') return;
    setStatus('pending');
    setVote(value);
    try {
      const res = await fetch(`/api/calc-rating/${calcId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (res.status === 409) {
        setStatus('duplicate');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const next = (await res.json()) as RatingStats;
      setStats(next);
      setStatus('voted');
      try {
        localStorage.setItem(key, String(value));
      } catch {
        /* приватний режим: голос збережено лише на сервері */
      }
    } catch {
      setVote(null);
      setStatus('error');
    }
  };

  const locked = status === 'voted' || status === 'duplicate' || status === 'pending';
  const shown = hover ?? vote ?? 0;

  return (
    <div className="mt-10 text-center">
      <p
        id={`${calcId}-rating-label`}
        className="font-semibold text-mainTitle dark:text-mainTitleBlack"
      >
        Чи корисний калькулятор?
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${calcId}-rating-label`}
        className="mt-2 flex justify-center gap-1"
        onMouseLeave={() => setHover(null)}
      >
        {STARS.map(value => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={vote === value}
            aria-label={`Оцінити ${value} з ${RATING_MAX}`}
            disabled={locked}
            onMouseEnter={() => !locked && setHover(value)}
            onFocus={() => !locked && setHover(value)}
            onBlur={() => setHover(null)}
            onClick={() => submit(value)}
            className={`text-3xl leading-none px-1 rounded focus-visible:ring-2 focus-visible:ring-main disabled:cursor-default ${
              value <= shown
                ? 'text-orange-500'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-[1.5rem] text-sm text-neutral-600 dark:text-mainTextBlack" aria-live="polite">
        {status === 'voted' && stats && stats.count > 0
          ? `Дякуємо! Середня оцінка ${stats.average.toFixed(1)} з ${RATING_MAX}, голосів: ${stats.count}`
          : status === 'voted'
          ? 'Дякуємо за оцінку!'
          : status === 'duplicate'
          ? 'Ви вже оцінювали цей калькулятор сьогодні'
          : status === 'error'
          ? 'Не вдалося зберегти оцінку, спробуйте пізніше'
          : stats && stats.count > 0
          ? `Середня оцінка ${stats.average.toFixed(1)} з ${RATING_MAX}, голосів: ${stats.count}`
          : ''}
      </p>
    </div>
  );
};
```

- [ ] **Step 2: Підключити віджет у `app/calcs/calories-calculator/page.tsx`**

Імпорт `import { CalcRating } from '@/components/calcs-page/CalcRating';`. Усередині картки калькулятора після `<ButtonGroup />` додати:

```tsx
              <CalcRating calcId="calories-calculator" initial={rating} />
```

- [ ] **Step 3: Перевірка**

```bash
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/pr3.html
grep -o 'Чи корисний калькулятор' .lighthouse/pr3.html | wc -l
grep -o 'aria-label="Оцінити [1-5] з 5"' .lighthouse/pr3.html | wc -l
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: заголовок віджета ≥ 1, пʼять кнопок-зірок (5 або 10 через RSC-дублювання). Ручна перевірка в браузері (`npm run dev`, якщо база доступна): клік на зірку показує «Дякуємо! Середня оцінка …», перезавантаження зберігає вибрану зірку, другий клік неможливий.

- [ ] **Step 4: Commit**

```bash
git add components/calcs-page/CalcRating.tsx app/calcs/calories-calculator/page.tsx
git commit -m "feat(rating): five-star rating widget on the calories calculator"
```

---

### Task 5: внутрішні посилання

**Files:**
- Modify: `components/main-page/AboutCalc.tsx`
- Modify: `components/calcs-page/IMTDescription.tsx`
- Modify: `components/calcs-page/FatDescription.tsx`
- Modify: `app/learn/nutrition/basics/page.tsx:66-73`
- Modify: `app/learn/nutrition/diet-for-gaining-weight/page.tsx:77-84`
- Modify: `app/learn/nutrition/diet-for-weight-lost/page.tsx:99-126`

- [ ] **Step 1: Головна, `components/main-page/AboutCalc.tsx`**

Додати `import Link from 'next/link';` і після абзацу з описом (перед `<Button ...>`) вставити:

```tsx
        <p className="text-base lg:text-lg md:w-6/12 text-mainText mb-8 text-left">
          <Link href="/calcs/calories-calculator" className="underline underline-offset-4 font-semibold text-mainTitle">
            Калькулятор калорій для схуднення
          </Link>
          ,{' '}
          <Link href="/calcs/imt-calculator" className="underline underline-offset-4 font-semibold text-mainTitle">
            калькулятор ІМТ
          </Link>{' '}
          та{' '}
          <Link href="/calcs/fat-calculator" className="underline underline-offset-4 font-semibold text-mainTitle">
            калькулятор відсотка жиру в організмі
          </Link>
          .
        </p>
```

- [ ] **Step 2: Описи ІМТ і жиру**

У `components/calcs-page/IMTDescription.tsx` і `components/calcs-page/FatDescription.tsx` перед `<li>` зі словами «Короткі статті про» додати:

```tsx
        <li>
          Знаючи свою форму, розрахуйте{' '}
          <Link
            href="/calcs/calories-calculator"
            className="text-mainTitle dark:text-mainTitleBlack underline"
          >
            денну норму калорій і дефіцит для схуднення
          </Link>
          .
        </li>
```

- [ ] **Step 3: Анкори в `/learn/nutrition/*`**

`app/learn/nutrition/basics/page.tsx`: текст посилання `нашого калькулятора.` → `калькулятора денної норми калорій`, а крапка переноситься після `</Link>`:

```tsx
              можна визначити за допомогою{' '}
              <Link
                href="/calcs/calories-calculator"
                className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
              >
                калькулятора денної норми калорій
              </Link>
              .
```

`app/learn/nutrition/diet-for-gaining-weight/page.tsx`: `денну норму в калоріях можна тут` → `денну норму калорій у калькуляторі калорій` (дужки й крапка лишаються поза посиланням).

`app/learn/nutrition/diet-for-weight-lost/page.tsx`: перше посилання `нашого калькулятора.` → `калькулятора калорій для схуднення` з крапкою після `</Link>`; `IMT` → `калькулятор ІМТ`; `% жиру в тілі.` → `калькулятор відсотка жиру в організмі` з крапкою після `</Link>`.

- [ ] **Step 4: Перевірка**

```bash
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
for p in "" "/calcs/imt-calculator" "/calcs/fat-calculator" "/learn/nutrition/basics" "/learn/nutrition/diet-for-gaining-weight" "/learn/nutrition/diet-for-weight-lost"; do echo "$p: $(curl -s "http://localhost:3100$p" | grep -oE '<a[^>]*href="/calcs/calories-calculator"[^>]*>[^<]*</a>' | sed -E 's/<[^>]+>//g' | tr '\n' '|')"; done
curl -s http://localhost:3100/learn/nutrition/diet-for-weight-lost | grep -oE '<a[^>]*href="/calcs/(imt|fat)-calculator"[^>]*>[^<]*</a>' | sed -E 's/<[^>]+>//g'
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: кожна з шести сторінок містить посилання на калькулятор калорій з анкором, що містить слово «калькулятор»; на сторінці про схуднення анкори «калькулятор ІМТ» і «калькулятор відсотка жиру в організмі»; жодного анкора виду «нашого калькулятора.» чи «IMT».

- [ ] **Step 5: Commit**

```bash
git add components/main-page/AboutCalc.tsx components/calcs-page/IMTDescription.tsx components/calcs-page/FatDescription.tsx app/learn/nutrition/basics/page.tsx app/learn/nutrition/diet-for-gaining-weight/page.tsx app/learn/nutrition/diet-for-weight-lost/page.tsx
git commit -m "seo(links): descriptive internal anchors to the calculators"
```

---

### Task 6: фінальна перевірка PR 3

**Files:**
- Modify: `docs/superpowers/plans/2026-09-17-calories-calculator-pr3-rating-links.md` (розділ «Результати»)

- [ ] **Step 1: Тести, збірка, Lighthouse**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error|calories-calculator |calc-rating" | head -5
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npx --yes lighthouse@12 http://localhost:3100/calcs/calories-calculator --only-categories=performance,accessibility,seo --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --output=json --output-path=.lighthouse/pr3.json --quiet
node scripts/lh-summary.mjs .lighthouse/pr3.json | tee .lighthouse/pr3.txt
node -e "const r=require('./.lighthouse/pr3.json');const c=r.categories;console.log('a11y',Math.round(c.accessibility.score*100),'seo',Math.round(c.seo.score*100));const f=Object.values(r.audits).filter(a=>a.score!==null&&a.score<1&&a.scoreDisplayMode==='binary').map(a=>a.id);console.log('failing:',f.join(', ')||'none')"
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: 34 тести; сторінка ISR; performance не гірше 90, accessibility 100, SEO 100, без провалених бінарних аудитів (зірки мають `aria-label`, група `aria-labelledby`).

- [ ] **Step 2: Записати результати**

Дописати в кінець цього файлу:

```markdown
## Результати PR 3

| Метрика | PR 2 | PR 3 |
|---|---|---|
| Performance (mobile, local) | 96 | ... |
| Accessibility | 100 | ... |
| SEO | 100 | ... |
| Тестів | 26 | 34 |
| Перевірка API локально | — | виконано / відкладено на preview |

Після деплою: обнулити тестові голоси в Atlas (колекції `calcratings`, `calcratingvotes`), проголосувати з кількох пристроїв, після 5 голосів перевірити Rich Results Test на наявність Software App з рейтингом; PSI; Search Console.
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-09-17-calories-calculator-pr3-rating-links.md
git commit -m "docs(plan): record PR 3 verification results"
```

Далі гілку завершує skill `superpowers:finishing-a-development-branch`.
