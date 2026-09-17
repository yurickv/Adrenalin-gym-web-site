# PR 4: хаб /calcs і калькулятор ІМТ. План реалізації

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Хаб `/calcs` отримує повні метадані, структуровані дані, змістовні картки і посилання з навігації, а калькулятор ІМТ показує категорію за ВООЗ, норму ваги для зросту, ідеальну вагу за Девіном і вікову норму, з рейтингом і ISR, як у калорій.

**Architecture:** Уся арифметика ІМТ живе в чистому модулі `lib/bmi.ts` з vitest-тестами; форма `ImtCalcList` лишається єдиним місцем стану і рендерить новий `ImtResult`; три серверні таблиці рахують числа тим самим модулем. Спільні стилі перемикачів виносяться з `CaloriesCalcList` у `components/calcs-page/formStyles.ts`. Хаб читає тексти карток і JSON-LD з одного масиву `HUB_CARDS`. Рейтинг, ISR і OG-зображення повторюють готові патерни PR 1–3.

**Tech Stack:** Next.js 14.2.35 (App Router, ISR, `next/og`), React 18, TypeScript strict, Tailwind 3.3, vitest 5, Lighthouse 12 CLI.

**Spec:** `docs/superpowers/specs/2026-09-17-calcs-hub-and-bmi-design.md`. Відхилення, прийняте в плані: рядок таблиці «Норма ІМТ за віком» не підсвічується за введеним віком, бо таблиця серверна, а вік живе в клієнтській формі; вікова норма показується в результаті калькулятора.

**Гілка:** `feat/calcs-hub-bmi` від `main` (HEAD `fb30bb9` або новіший).

## Global Constraints

- Домен `https://gym-adrenalin.com.ua`. `ORGANIZATION_ID`, `CALC_SITE_URL`, автор і дати з `const/calcSeo.ts`.
- Ліміти ІМТ: зріст 120–230, вага 30–250, вік 18–100 (необов'язковий). Помилки через `rangeError`.
- ІМТ з одним знаком і десятковою комою у видимому тексті (`formatBmi`). Категорії ВООЗ: < 18,5; 18,5–24,9; 25–29,9; 30–34,9; 35–39,9; ≥ 40. Норма ваги: ІМТ 18,5–24,9 у кг, округлення до цілого. Девін: чоловіки 50 + 0,9·(зріст − 152), жінки 45,5 + 0,9·(зріст − 152), `null` для зросту < 152. Вікові норми: 18–24: 19–24; 25–34: 20–25; 35–44: 21–26; 45–54: 22–27; 55–64: 23–28; 65–100: 24–29.
- Хаб: title `Фітнес-калькулятори: ІМТ, відсоток жиру, норма калорій`; H1 `Фітнес-калькулятори онлайн`. ІМТ: title `Калькулятор ІМТ онлайн: індекс маси тіла і норма ваги`; H1 `Калькулятор ІМТ: індекс маси тіла і норма ваги`. Description обох сторінок у Task 2 і Task 4, не довше 155 знаків.
- Кольори і контраст як у PR 2–3: текст картки `text-neutral-700 dark:text-mainTextBlack`, акцент `text-orange-800 dark:text-mainTitleBlack`, активний перемикач `text-orange-800`.
- Комміти без будь-яких трейлерів (без `Co-Authored-By`). Лінт не запускати. Не змінювати сторінку калькулятора жиру і `lib/calories.ts`, крім імпорту типу `Sex`.
- Windows 11, Git Bash, Node 24; production-сервер на порту 3100, зупинка через `netstat -ano` + `taskkill //PID <pid> //F`; довгі файли писати інструментом Write. MongoDB Atlas доступна локально.

## Структура файлів

| Файл | Дія | Відповідальність |
|---|---|---|
| `lib/bmi.ts`, `lib/bmi.test.ts` | створити | арифметика і довідники ІМТ |
| `components/calcs-page/formStyles.ts` | створити | спільний `toggleClass` і `SEX_OPTIONS` |
| `components/calcs-page/CaloriesCalcList.tsx` | змінити | використовує `formStyles` |
| `components/calcs-page/calcHubContent.ts` | створити | `HUB_TITLE`, `HUB_DESCRIPTION`, `HUB_CARDS` |
| `components/calcs-page/CalcHubCard.tsx` | створити | картка калькулятора на хабі |
| `components/calcs-page/CalcsHubJsonLd.tsx` | створити | BreadcrumbList + CollectionPage |
| `app/calcs/page.tsx` | переписати | метадані, hero, картки, фото, JSON-LD |
| `app/calcs/opengraph-image.tsx`, `app/calcs/Inter-Bold.ttf` | створити | OG-зображення хабу |
| `components/Header.tsx`, `components/Footer.tsx` | змінити | пункт «Усі калькулятори» |
| `components/calcs-page/ImtCalcList.tsx` | переписати | стать, вік, зріст, вага без yup |
| `components/calcs-page/ImtResult.tsx` | створити | результат ІМТ |
| `components/calcs-page/ImtCaclFormula.tsx` | видалити | замінений `ImtResult` |
| `components/calcs-page/BmiCategoryTable.tsx`, `BmiHeightWeightTable.tsx`, `BmiAgeTable.tsx` | створити | контентні таблиці |
| `components/calcs-page/IMTDescription.tsx` | змінити | без старої таблиці категорій |
| `components/calcs-page/ImtFaq.tsx` | змінити | 7 питань |
| `components/calcs-page/ImtJsonLd.tsx` | змінити | проп `rating`, featureList, HowTo |
| `app/calcs/imt-calculator/layout.tsx` | переписати | метадані |
| `app/calcs/imt-calculator/opengraph-image.tsx`, `app/calcs/imt-calculator/Inter-Bold.ttf` | створити | OG-зображення ІМТ |
| `app/calcs/imt-calculator/page.tsx`, `loading.tsx` | переписати | tool-first, ISR, рейтинг |
| `const/calcSeo.ts` | змінити | дата оновлення |

---

### Task 1: чистий модуль `lib/bmi.ts` (TDD)

**Files:**
- Create: `lib/bmi.ts`
- Create: `lib/bmi.test.ts`

**Interfaces:**
- Consumes: `type Sex` з `lib/calories.ts`.
- Produces: `BMI_LIMITS`, `type BmiCategory`, `BMI_CATEGORY_LABELS`, `BMI_CATEGORY_ORDER`, `bmi(weightKg, heightCm)`, `bmiCategory(value)`, `interface WeightRange`, `normalWeightRange(heightCm)`, `weightToNormal(weightKg, range)`, `devineIdealWeight(sex, heightCm)`, `interface AgeBmiNorm`, `AGE_BMI_NORMS`, `ageBmiNorm(age)`, `HEIGHT_TABLE_ROWS`, `formatBmi(value)`.

- [ ] **Step 1: Тести `lib/bmi.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  AGE_BMI_NORMS,
  ageBmiNorm,
  bmi,
  BMI_CATEGORY_LABELS,
  BMI_CATEGORY_ORDER,
  bmiCategory,
  devineIdealWeight,
  formatBmi,
  HEIGHT_TABLE_ROWS,
  normalWeightRange,
  weightToNormal,
} from './bmi';

describe('bmi', () => {
  it('divides weight by squared height in metres and keeps one decimal', () => {
    expect(bmi(65, 170)).toBe(22.5);
    expect(bmi(80, 170)).toBe(27.7);
    expect(bmi(45, 160)).toBe(17.6);
  });
});

describe('bmiCategory', () => {
  it('follows the WHO cut-offs', () => {
    expect(bmiCategory(18.4)).toBe('underweight');
    expect(bmiCategory(18.5)).toBe('normal');
    expect(bmiCategory(24.9)).toBe('normal');
    expect(bmiCategory(25)).toBe('overweight');
    expect(bmiCategory(29.9)).toBe('overweight');
    expect(bmiCategory(30)).toBe('obese1');
    expect(bmiCategory(35)).toBe('obese2');
    expect(bmiCategory(40)).toBe('obese3');
  });

  it('has a label, range and advice for every category in display order', () => {
    expect(BMI_CATEGORY_ORDER).toHaveLength(6);
    for (const key of BMI_CATEGORY_ORDER) {
      const entry = BMI_CATEGORY_LABELS[key];
      expect(entry.label.length).toBeGreaterThan(0);
      expect(entry.range.length).toBeGreaterThan(0);
      expect(entry.advice.length).toBeGreaterThan(0);
    }
  });
});

describe('normalWeightRange', () => {
  it('maps BMI 18.5–24.9 to whole kilograms', () => {
    expect(normalWeightRange(170)).toEqual({ min: 53, max: 72 });
    expect(normalWeightRange(160)).toEqual({ min: 47, max: 64 });
  });
});

describe('weightToNormal', () => {
  it('is 0 inside the range, negative above it and positive below it', () => {
    const range = normalWeightRange(170);
    expect(weightToNormal(65, range)).toBe(0);
    expect(weightToNormal(80, range)).toBe(-8);
    expect(weightToNormal(45, normalWeightRange(160))).toBe(2);
  });
});

describe('devineIdealWeight', () => {
  it('uses 50 / 45.5 kg plus 0.9 kg per cm above 152', () => {
    expect(devineIdealWeight('male', 170)).toBe(66);
    expect(devineIdealWeight('female', 170)).toBe(62);
  });

  it('is not defined below 152 cm', () => {
    expect(devineIdealWeight('male', 150)).toBeNull();
  });
});

describe('ageBmiNorm', () => {
  it('returns the row for the age band', () => {
    expect(ageBmiNorm(30)).toEqual({ from: 25, to: 34, min: 20, max: 25 });
    expect(ageBmiNorm(65)).toEqual({ from: 65, to: 100, min: 24, max: 29 });
    expect(ageBmiNorm(100)?.min).toBe(24);
  });

  it('returns null outside 18–100', () => {
    expect(ageBmiNorm(17)).toBeNull();
    expect(ageBmiNorm(101)).toBeNull();
  });

  it('covers 18–100 without gaps', () => {
    for (let age = 18; age <= 100; age += 1) expect(ageBmiNorm(age)).not.toBeNull();
    expect(AGE_BMI_NORMS).toHaveLength(6);
  });
});

describe('HEIGHT_TABLE_ROWS', () => {
  it('lists 150–195 cm in 5 cm steps', () => {
    expect(HEIGHT_TABLE_ROWS[0]).toBe(150);
    expect(HEIGHT_TABLE_ROWS.at(-1)).toBe(195);
    expect(HEIGHT_TABLE_ROWS).toHaveLength(10);
  });
});

describe('formatBmi', () => {
  it('uses one decimal and a comma', () => {
    expect(formatBmi(22.5)).toBe('22,5');
    expect(formatBmi(20)).toBe('20,0');
  });
});
```

- [ ] **Step 2: RED** — `npm test 2>&1 | tail -6`: помилка резолву `./bmi`, решта 38 тестів проходять.

- [ ] **Step 3: Реалізувати `lib/bmi.ts`**

```ts
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
      'Потрібна медична підтримка: зверніться до лікаря перед зміною харчування і тренуваннями.',
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
```

- [ ] **Step 4: GREEN** — `npm test 2>&1 | tail -4`: `Test Files 5 passed`, `Tests 50 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/bmi.ts lib/bmi.test.ts
git commit -m "feat(bmi): pure BMI module with WHO categories, weight range, Devine and age norms"
```

---

### Task 2: хаб /calcs

**Files:**
- Create: `components/calcs-page/calcHubContent.ts`
- Create: `components/calcs-page/CalcHubCard.tsx`
- Create: `components/calcs-page/CalcsHubJsonLd.tsx`
- Create: `app/calcs/opengraph-image.tsx`, `app/calcs/Inter-Bold.ttf`
- Modify: `app/calcs/page.tsx` (повна заміна)
- Modify: `components/Header.tsx` (масив `calcHeader`), `components/Footer.tsx` (масив `products`)

**Interfaces:**
- Consumes: `ButtonSecond`, `HomeIcon`, `CALC_SITE_URL`, `ORGANIZATION_ID`.
- Produces: `HUB_TITLE`, `HUB_DESCRIPTION`, `HUB_CARDS` (масив із `href`, `title`, `appName`, `lead`, `inputs`, `useCase`).

- [ ] **Step 1: `components/calcs-page/calcHubContent.ts`**

```ts
export const HUB_TITLE = 'Фітнес-калькулятори: ІМТ, відсоток жиру, норма калорій';
export const HUB_DESCRIPTION =
  'Безкоштовні онлайн-калькулятори від тренажерного залу Адреналін: індекс маси тіла з нормою ваги, відсоток жиру в організмі, денна норма калорій і дефіцит.';

export interface HubCard {
  href: string;
  title: string;
  appName: string;
  lead: string;
  inputs: string;
  useCase: string;
}

export const HUB_CARDS: HubCard[] = [
  {
    href: '/calcs/imt-calculator',
    title: 'Калькулятор ІМТ: індекс маси тіла і норма ваги',
    appName: 'Калькулятор індексу маси тіла (ІМТ)',
    lead: 'Показує, чи відповідає ваша вага зросту за класифікацією ВООЗ, а також норму ваги для вашого зросту й ідеальну вагу за формулою Девіна.',
    inputs: 'зріст і вага, за бажанням стать і вік',
    useCase: 'хочете зрозуміти, скільки кілограмів до норми, перш ніж планувати схуднення чи набір.',
  },
  {
    href: '/calcs/fat-calculator',
    title: 'Калькулятор відсотка жиру в організмі',
    appName: 'Калькулятор відсотка жиру в організмі',
    lead: 'Оцінює частку жиру в тілі за товщиною шкірних складок і порівнює її з нормами для чоловіків і жінок.',
    inputs: 'стать, вік і три виміри складок каліпером або лінійкою',
    useCase: 'ІМТ у нормі, але хочете знати, що саме змінюється: жир чи мʼязи.',
  },
  {
    href: '/calcs/calories-calculator',
    title: 'Калькулятор калорій: норма, дефіцит і БЖВ',
    appName: 'Калькулятор калорій',
    lead: 'Рахує базовий обмін і денну норму калорій за формулою Міффліна-Сан Жеора, цільові калорії для схуднення чи набору і розподіл білків, жирів і вуглеводів.',
    inputs: 'стать, вік, зріст, вага, рівень активності і мета',
    useCase: 'складаєте раціон і хочете знати, скільки їсти, щоб схуднути або набрати вагу.',
  },
];
```

- [ ] **Step 2: `components/calcs-page/CalcHubCard.tsx`**

```tsx
import Link from 'next/link';
import { ButtonSecond } from '../ButtonSecond';
import type { HubCard } from './calcHubContent';

export const CalcHubCard = ({ href, title, lead, inputs, useCase }: HubCard) => (
  <article
    className="flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-[#F5F5F5] dark:bg-[#676465]
    shadow-[0px_4px_20px_0px_rgba(133,119,123,0.30)] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]"
  >
    <h2 className="text-xl md:text-2xl font-bold text-mainTitle dark:text-mainTitleBlack">
      <Link href={href} className="hover:text-main dark:hover:text-orange-300">
        {title}
      </Link>
    </h2>
    <p className="text-base lg:text-lg text-neutral-700 dark:text-mainTextBlack">{lead}</p>
    <p className="text-sm text-neutral-600 dark:text-mainTextBlack">
      <span className="font-semibold">Потрібно:</span> {inputs}.
    </p>
    <p className="text-sm text-neutral-600 dark:text-mainTextBlack">
      <span className="font-semibold">Корисно, коли</span> {useCase}
    </p>
    <ButtonSecond route={href} text="Відкрити калькулятор" width="mt-auto w-full md:w-[284px]" />
  </article>
);
```

- [ ] **Step 3: `components/calcs-page/CalcsHubJsonLd.tsx`**

```tsx
import { CALC_SITE_URL, ORGANIZATION_ID } from '@/const/calcSeo';
import { HUB_CARDS, HUB_DESCRIPTION } from './calcHubContent';

const PAGE_URL = `${CALC_SITE_URL}/calcs`;

export const CalcsHubJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Головна', item: CALC_SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Калькулятори', item: PAGE_URL },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Фітнес-калькулятори онлайн',
        url: PAGE_URL,
        description: HUB_DESCRIPTION,
        inLanguage: 'uk',
        publisher: { '@id': ORGANIZATION_ID },
        hasPart: HUB_CARDS.map(card => ({
          '@type': 'WebApplication',
          name: card.appName,
          url: `${CALC_SITE_URL}${card.href}`,
          applicationCategory: 'HealthApplication',
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
```

- [ ] **Step 4: Переписати `app/calcs/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import { CalcHubCard } from '@/components/calcs-page/CalcHubCard';
import { CalcsHubJsonLd } from '@/components/calcs-page/CalcsHubJsonLd';
import {
  HUB_CARDS,
  HUB_DESCRIPTION,
  HUB_TITLE,
} from '@/components/calcs-page/calcHubContent';

const PAGE_URL = 'https://gym-adrenalin.com.ua/calcs';

export const metadata: Metadata = {
  title: { absolute: HUB_TITLE },
  description: HUB_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Адреналін Gym',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
  },
};

const Calcs = () => {
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
                <span className="font-semibold"> &gt; Калькулятори</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Фітнес-калькулятори онлайн
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Три безкоштовні інструменти, щоб зрозуміти свою форму і спланувати харчування
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-darkBody">
        <div className="div-container py-8 md:py-[44px] mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {HUB_CARDS.map(card => (
              <CalcHubCard
                key={card.href}
                href={card.href}
                title={card.title}
                appName={card.appName}
                lead={card.lead}
                inputs={card.inputs}
                useCase={card.useCase}
              />
            ))}
          </div>
          <div className="max-w-[820px] mx-auto mt-10 md:mt-14">
            <Image
              src="/fit-blond.webp"
              alt="Дівчина у спортивній формі перевіряє результат тренувань"
              width={500}
              height={300}
              loading="lazy"
              sizes="(min-width: 820px) 820px, 100vw"
              style={{ width: '100%', height: 'auto' }}
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>
      <CalcsHubJsonLd />
    </main>
  );
};

export default Calcs;
```

- [ ] **Step 5: OG-зображення хабу**

```bash
cp app/calcs/calories-calculator/Inter-Bold.ttf app/calcs/Inter-Bold.ttf
cp app/calcs/calories-calculator/opengraph-image.tsx app/calcs/opengraph-image.tsx
```

У `app/calcs/opengraph-image.tsx` замінити три рядки:

```tsx
export const alt =
  'Фітнес-калькулятори онлайн від тренажерного залу Адреналін: ІМТ, відсоток жиру, норма калорій';
```

```tsx
          <div style={{ fontSize: 76, lineHeight: 1.1 }}>
            Фітнес-калькулятори онлайн
          </div>
          <div style={{ fontSize: 36, color: '#D4D4D4' }}>
            ІМТ · відсоток жиру · норма калорій
          </div>
```

Решта файлу (коментарі, `loadFont`, стилі) без змін.

- [ ] **Step 6: Пункт «Усі калькулятори» у навігації**

`components/Header.tsx`, у масив `calcHeader` після третього елемента:

```tsx
    {
      name: 'Усі калькулятори',
      description: 'Огляд трьох калькуляторів на одній сторінці',
      href: '/calcs',
      icon: <HomeIcon />,
    },
```

`components/Footer.tsx`, у масив `products` після третього елемента:

```tsx
    { name: 'Усі калькулятори', href: '/calcs' },
```

- [ ] **Step 7: Перевірка**

```bash
npm run build 2>&1 | grep -E "Compiled|Failed|error|/calcs " | head -4
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs > .lighthouse/hub.html
grep -oE "<title>[^<]*</title>" .lighthouse/hub.html
grep -oE '<link rel="canonical"[^>]*>' .lighthouse/hub.html
grep -oE '<meta property="og:image" content="[^"]*"' .lighthouse/hub.html | head -1
grep -oE "<h[12][^>]*>[^<]*</h[12]>" .lighthouse/hub.html | sed -E 's/<[^>]+>//g'
grep -o '"@type":"CollectionPage"' .lighthouse/hub.html | wc -l
grep -o '"@type":"WebApplication"' .lighthouse/hub.html | wc -l
grep -o 'alt="Дівчина у спортивній формі' .lighthouse/hub.html | wc -l
grep -o 'href="/calcs"' .lighthouse/hub.html | wc -l
curl -s http://localhost:3100/contacts | tr -d '\n' | grep -o 'Усі калькулятори' | wc -l
curl -s -o /dev/null -w "og: %{http_code} %{content_type} %{size_download}\n" http://localhost:3100/calcs/opengraph-image
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: title без суфікса; canonical `/calcs`; og:image URL; заголовки H1 + три H2 з назвами калькуляторів; `CollectionPage` 1, `WebApplication` 3 (у JSON-LD; через RSC-дублювання може бути 6); alt фото 1; «Усі калькулятори» на сторінці контактів ≥ 2 (шапка і футер); OG-зображення `200 image/png` > 20000 байтів.

- [ ] **Step 8: Commit**

```bash
git add components/calcs-page/calcHubContent.ts components/calcs-page/CalcHubCard.tsx components/calcs-page/CalcsHubJsonLd.tsx app/calcs/page.tsx app/calcs/opengraph-image.tsx app/calcs/Inter-Bold.ttf components/Header.tsx components/Footer.tsx
git commit -m "seo(calcs-hub): metadata, cards, CollectionPage schema, og image, nav link"
```

---

### Task 3: форма ІМТ і результат

**Files:**
- Create: `components/calcs-page/formStyles.ts`
- Modify: `components/calcs-page/CaloriesCalcList.tsx` (імпорт спільних стилів)
- Create: `components/calcs-page/ImtResult.tsx`
- Modify: `components/calcs-page/ImtCalcList.tsx` (повна заміна)
- Delete: `components/calcs-page/ImtCaclFormula.tsx`

**Interfaces:**
- Produces: `toggleClass(active: boolean): string`, `SEX_OPTIONS: Array<{ value: Sex; label: string }>` у `formStyles.ts`; `ImtResult({ sex, heightCm, weightKg, age })`.

- [ ] **Step 1: `components/calcs-page/formStyles.ts`**

```ts
import type { Sex } from '@/lib/calories';

// Спільний вигляд перемикачів (стать, мета) для форм калькуляторів.
export const toggleClass = (active: boolean) =>
  `cursor-pointer flex items-center justify-center tracking-widest truncate font-semibold text-lg rounded-xl p-2
   focus-within:ring-2 focus-within:ring-main focus-within:ring-offset-1
   hover:bg-[#ECECEC] dark:hover:bg-[#d4d4d4] dark:hover:text-mainTitle ${
     active
       ? 'bg-[#D9D9D9] dark:bg-[#d4d4d4] text-orange-800'
       : 'text-neutral-700 dark:text-mainTextBlack'
   }`;

export const SEX_OPTIONS: Array<{ value: Sex; label: string }> = [
  { value: 'female', label: 'Жінка' },
  { value: 'male', label: 'Чоловік' },
];
```

- [ ] **Step 2: Використати спільні стилі в `components/calcs-page/CaloriesCalcList.tsx`**

Прочитати файл. Видалити локальну константу `toggleClass` і додати `import { SEX_OPTIONS, toggleClass } from './formStyles';`. У блоці статі замінити вбудований масив `[{ value: 'female', ... }, { value: 'male', ... }] as Array<...>` на `SEX_OPTIONS`. Поведінка не змінюється.

- [ ] **Step 3: `components/calcs-page/ImtResult.tsx`**

```tsx
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
```

- [ ] **Step 4: Переписати `components/calcs-page/ImtCalcList.tsx`**

```tsx
'use client';

import React, { useState } from 'react';
import { InputSkeleton } from './InputSkeleton';
import { ImtResult } from './ImtResult';
import { SEX_OPTIONS, toggleClass } from './formStyles';
import { BMI_LIMITS } from '@/lib/bmi';
import type { Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';

type Field = keyof typeof BMI_LIMITS;

export const ImtCalcList = () => {
  const [sex, setSex] = useState<Sex>('male');
  const [values, setValues] = useState<Record<Field, string>>({
    height: '',
    weight: '',
    age: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const change = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validate = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setErrors(prev => ({
      ...prev,
      [field]: rangeError(e.target.value, BMI_LIMITS[field].min, BMI_LIMITS[field].max),
    }));

  return (
    <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
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

      <InputSkeleton
        text="Зріст (см):"
        name="height"
        min={BMI_LIMITS.height.min}
        max={BMI_LIMITS.height.max}
        value={values.height}
        setAny={change('height')}
        onBlur={validate('height')}
        error={errors.height}
      />
      <InputSkeleton
        text="Вага (кг):"
        name="weight"
        min={BMI_LIMITS.weight.min}
        max={BMI_LIMITS.weight.max}
        value={values.weight}
        setAny={change('weight')}
        onBlur={validate('weight')}
        error={errors.weight}
      />
      <InputSkeleton
        text="Вік, років (за бажанням):"
        name="age"
        min={BMI_LIMITS.age.min}
        max={BMI_LIMITS.age.max}
        value={values.age}
        setAny={change('age')}
        onBlur={validate('age')}
        error={errors.age}
      />

      <ImtResult sex={sex} heightCm={values.height} weightKg={values.weight} age={values.age} />
    </form>
  );
};
```

- [ ] **Step 5: Видалити стару формулу і перевірити**

```bash
git rm -q components/calcs-page/ImtCaclFormula.tsx
grep -rn "ImtCalcFormula\|ImtCaclFormula" app components; echo "grep exit: $?"
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/imt-calculator | tr -d '\n' > .lighthouse/imt.html
grep -o 'role="radiogroup"' .lighthouse/imt.html | wc -l
grep -o 'max="250"' .lighthouse/imt.html | wc -l
grep -o 'Введіть зріст і вагу, щоб побачити' .lighthouse/imt.html | wc -l
grep -c "yup" .next/static/chunks/app/calcs/imt-calculator/*.js; echo "(0 expected)"
curl -s http://localhost:3100/calcs/calories-calculator | tr -d '\n' | grep -o 'role="radiogroup"' | wc -l
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `grep exit: 1`; 50 тестів; на ІМТ `radiogroup` 1, `max="250"` 2, підказка 1, yup у чанку 0; на калоріях `radiogroup` далі 2 (стать, мета).

- [ ] **Step 6: Commit**

```bash
git add components/calcs-page/formStyles.ts components/calcs-page/CaloriesCalcList.tsx components/calcs-page/ImtResult.tsx components/calcs-page/ImtCalcList.tsx
git commit -m "feat(imt): sex and optional age, BMI result with weight range, Devine and age norm"
```

---

### Task 4: контент, FAQ, JSON-LD і метадані ІМТ

**Files:**
- Create: `components/calcs-page/BmiCategoryTable.tsx`, `BmiHeightWeightTable.tsx`, `BmiAgeTable.tsx`
- Modify: `components/calcs-page/IMTDescription.tsx`
- Modify: `components/calcs-page/ImtFaq.tsx`
- Modify: `components/calcs-page/ImtJsonLd.tsx`
- Modify: `app/calcs/imt-calculator/layout.tsx` (повна заміна)
- Create: `app/calcs/imt-calculator/opengraph-image.tsx`, `app/calcs/imt-calculator/Inter-Bold.ttf`

**Interfaces:**
- Consumes: `lib/bmi.ts`, `buildAggregateRating`, `RatingStats` з `lib/calcRating.ts`.
- Produces: `ImtJsonLd({ rating }: { rating: RatingStats | null })`; масив `imtFaq` із 7 елементів.

- [ ] **Step 1: `components/calcs-page/BmiCategoryTable.tsx`**

```tsx
import { BMI_CATEGORY_LABELS, BMI_CATEGORY_ORDER } from '@/lib/bmi';

export const BmiCategoryTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Категорії ІМТ за ВООЗ
      </h2>
      <div className="max-w-[900px] mx-auto overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Класифікація індексу маси тіла для дорослих
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th scope="col" className="py-2 pr-4">ІМТ</th>
              <th scope="col" className="py-2 pr-4">Категорія</th>
              <th scope="col" className="py-2">Що робити</th>
            </tr>
          </thead>
          <tbody>
            {BMI_CATEGORY_ORDER.map(key => {
              const category = BMI_CATEGORY_LABELS[key];
              return (
                <tr key={key} className="border-b border-gray-300">
                  <th scope="row" className="py-2 pr-4 font-normal">{category.range}</th>
                  <td className="py-2 pr-4">{category.label}</td>
                  <td className="py-2">{category.advice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="max-w-[900px] mx-auto mt-4 text-sm text-mainText dark:text-mainTextBlack">
        Джерело: класифікація ВООЗ для дорослих від 18 років. У спортсменів із великою мʼязовою
        масою ІМТ завищує оцінку жиру, тому доповніть його виміром відсотка жиру.
      </p>
    </div>
  </section>
);
```

- [ ] **Step 2: `components/calcs-page/BmiHeightWeightTable.tsx`**

```tsx
import { devineIdealWeight, HEIGHT_TABLE_ROWS, normalWeightRange } from '@/lib/bmi';

export const BmiHeightWeightTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Норма ваги за зростом
      </h2>
      <p className="max-w-[900px] mx-auto mb-6 text-base lg:text-lg text-mainText dark:text-mainTextBlack">
        Діапазон норми відповідає ІМТ 18,5–24,9. Ідеальна вага за формулою Девіна — одне
        орієнтовне число всередині цього діапазону, окремо для жінок і чоловіків.
      </p>
      <div className="max-w-[900px] mx-auto overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Норма ваги і ідеальна вага для зросту 150–195 см
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th scope="col" className="py-2 pr-4">Зріст</th>
              <th scope="col" className="py-2 pr-4">Норма ваги, кг</th>
              <th scope="col" className="py-2 pr-4">Ідеальна вага, жінки</th>
              <th scope="col" className="py-2">Ідеальна вага, чоловіки</th>
            </tr>
          </thead>
          <tbody>
            {HEIGHT_TABLE_ROWS.map(height => {
              const range = normalWeightRange(height);
              return (
                <tr key={height} className="border-b border-gray-300">
                  <th scope="row" className="py-2 pr-4 font-normal">{height} см</th>
                  <td className="py-2 pr-4">
                    {range.min}–{range.max}
                  </td>
                  <td className="py-2 pr-4">{devineIdealWeight('female', height)} кг</td>
                  <td className="py-2">{devineIdealWeight('male', height)} кг</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 3: `components/calcs-page/BmiAgeTable.tsx`**

```tsx
import { AGE_BMI_NORMS } from '@/lib/bmi';

const ageLabel = (from: number, to: number) => (to >= 100 ? `${from} і старше` : `${from}–${to}`);

export const BmiAgeTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Норма ІМТ за віком
      </h2>
      <div className="max-w-[900px] mx-auto overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Орієнтовна норма ІМТ для різного віку
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th scope="col" className="py-2 pr-4">Вік, років</th>
              <th scope="col" className="py-2">Норма ІМТ</th>
            </tr>
          </thead>
          <tbody>
            {AGE_BMI_NORMS.map(row => (
              <tr key={row.from} className="border-b border-gray-300">
                <th scope="row" className="py-2 pr-4 font-normal">{ageLabel(row.from, row.to)}</th>
                <td className="py-2">
                  {row.min}–{row.max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="max-w-[900px] mx-auto mt-4 text-sm text-mainText dark:text-mainTextBlack">
        ВООЗ не коригує ІМТ за віком. Таблиця орієнтовна і відображає, що після 50 років трохи
        вища вага не шкодить здоровʼю, а після 65 навіть захищає від втрати мʼязів. Введіть вік
        у калькулятор, і він покаже норму для вашої вікової групи.
      </p>
    </div>
  </section>
);
```

- [ ] **Step 4: Спростити `components/calcs-page/IMTDescription.tsx`**

Прочитати файл. Видалити блок `<div className="mt-8 overflow-x-auto"> … </div>` зі старою таблицею категорій (4 рядки) і залишити список `<ul>` з поясненнями, посилання на статті й на калькулятор калорій, а також абзац «Джерело: класифікація ІМТ за даними ВООЗ». Інших змін немає.

- [ ] **Step 5: Оновити `components/calcs-page/ImtFaq.tsx`**

Замінити масив `imtFaq` (компонент без змін):

```ts
export const imtFaq = [
  {
    question: 'Як розрахувати індекс маси тіла (ІМТ)?',
    answer:
      'Індекс маси тіла розраховують за формулою: вагу в кілограмах ділять на квадрат зросту в метрах (ІМТ = вага / зріст²). Введіть зріст і вагу у калькулятор вище — і ви побачите ІМТ, категорію за ВООЗ, норму ваги для свого зросту та ідеальну вагу за формулою Девіна.',
  },
  {
    question: 'Яка формула індексу маси тіла?',
    answer:
      'Формула ІМТ: маса тіла (кг) поділена на зріст (м) у квадраті. Наприклад, для ваги 70 кг і зросту 1,75 м: 70 / (1,75 × 1,75) = 22,9 — це нормальний показник.',
  },
  {
    question: 'Який індекс маси тіла вважається нормою?',
    answer:
      'За ВООЗ нормальний ІМТ — 18,5–24,9. Менше 18,5 — недостатня вага, 25–29,9 — надлишкова вага, 30–34,9 — ожиріння I ступеня, 35–39,9 — II ступеня, 40 і більше — III ступеня. Для людей до 25 років «ідеальним» вважають ІМТ 22–23.',
  },
  {
    question: 'Яка нормальна вага для мого зросту?',
    answer:
      'Норма ваги — це діапазон, у якому ІМТ дорівнює 18,5–24,9. Для зросту 170 см це 53–72 кг, для 160 см — 47–64 кг, для 180 см — 60–81 кг. Калькулятор показує діапазон для вашого зросту і скільки кілограмів до нього бракує або зайві.',
  },
  {
    question: 'Як розрахувати ідеальну вагу?',
    answer:
      'Найпоширеніша формула — Девіна: для чоловіків 50 кг + 0,9 кг за кожний сантиметр зросту понад 152 см, для жінок 45,5 кг + 0,9 кг. Для зросту 170 см це 66 кг у чоловіків і 62 кг у жінок. Це орієнтир: у людей з розвиненою мускулатурою здорова вага вища.',
  },
  {
    question: 'Чи змінюється норма ІМТ з віком?',
    answer:
      'Класична формула і межі ВООЗ вік не враховують. Проте з віком трохи вища вага не шкодить, тому орієнтовно нормою вважають ІМТ 19–24 у 18–24 роки, 20–25 у 25–34, 21–26 у 35–44, 22–27 у 45–54, 23–28 у 55–64 і 24–29 після 65. Введіть вік у калькулятор, щоб побачити норму для своєї групи.',
  },
  {
    question: 'Чи підходить калькулятор ІМТ для підлітків?',
    answer:
      'Для дітей і підлітків до 18 років ІМТ оцінюють за віковими та статевими перцентилями, а не за дорослими межами. Наш калькулятор дає орієнтовне значення, але для точної оцінки підлітків краще звернутися до педіатра.',
  },
];
```

- [ ] **Step 6: Оновити `components/calcs-page/ImtJsonLd.tsx`**

Додати імпорт `import { buildAggregateRating, type RatingStats } from '@/lib/calcRating';`, змінити сигнатуру на `export const ImtJsonLd = ({ rating }: { rating: RatingStats | null }) => { const aggregateRating = buildAggregateRating(rating); const jsonLd = { …` і у вузлі `WebApplication` після `offers` додати:

```ts
        ...(aggregateRating ? { aggregateRating } : {}),
        description:
          'Безкоштовний онлайн-калькулятор ІМТ: індекс маси тіла з категорією за ВООЗ, норма ваги для зросту, ідеальна вага за формулою Девіна і орієнтовна норма ІМТ за віком.',
        inLanguage: 'uk',
        featureList: [
          'Індекс маси тіла з одним знаком',
          'Категорія за класифікацією ВООЗ (6 класів)',
          'Норма ваги для вашого зросту і різниця до неї',
          'Ідеальна вага за формулою Девіна для жінок і чоловіків',
          'Орієнтовна норма ІМТ за віком',
        ],
```

(старий `description` видалити). `HowTo` замінити:

```ts
        name: 'Як розрахувати індекс маси тіла (ІМТ)',
        description:
          'Покрокова інструкція, як визначити ІМТ, норму ваги та ідеальну вагу за зростом.',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Оберіть стать', text: 'Виберіть свою стать — жінка або чоловік; вона потрібна для ідеальної ваги за Девіном.' },
          { '@type': 'HowToStep', position: 2, name: 'Вкажіть вік за бажанням', text: 'Якщо ввести вік, калькулятор додатково покаже норму ІМТ для вашої вікової групи.' },
          { '@type': 'HowToStep', position: 3, name: 'Введіть зріст і вагу', text: 'Вкажіть зріст у сантиметрах і вагу в кілограмах.' },
          { '@type': 'HowToStep', position: 4, name: 'Отримайте результат', text: 'Калькулятор покаже ІМТ, категорію за ВООЗ, норму ваги для зросту, скільки кілограмів до неї, та ідеальну вагу.' },
        ],
```

- [ ] **Step 7: Переписати `app/calcs/imt-calculator/layout.tsx`**

```tsx
import type { Metadata } from 'next';

const TITLE = 'Калькулятор ІМТ онлайн: індекс маси тіла і норма ваги';
const DESCRIPTION =
  'Безкоштовний калькулятор ІМТ онлайн: індекс маси тіла за ВООЗ, норма ваги для вашого зросту, ідеальна вага за формулою Девіна і норма ІМТ за віком.';
const PAGE_URL = 'https://gym-adrenalin.com.ua/calcs/imt-calculator';

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
    'імт калькулятор',
    'індекс маси тіла калькулятор',
    'калькулятор імт онлайн',
    'розрахувати імт',
    'індекс маси тіла формула',
    'імт норма',
    'калькулятор ідеальної ваги',
    'ідеальна вага за зростом',
    'норма ваги за зростом',
    'калькулятор ваги і зросту',
    'імт калькулятор з віком',
    'індекс маси тіла за віком',
    'таблиця імт',
    'імт для жінок',
    'імт для чоловіків',
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

export default function ImtLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 8: OG-зображення ІМТ**

```bash
cp app/calcs/calories-calculator/Inter-Bold.ttf app/calcs/imt-calculator/Inter-Bold.ttf
cp app/calcs/calories-calculator/opengraph-image.tsx app/calcs/imt-calculator/opengraph-image.tsx
```

У новому файлі замінити `alt` на `'Калькулятор ІМТ онлайн від тренажерного залу Адреналін: індекс маси тіла, норма ваги, ідеальна вага'`, заголовок на `Калькулятор ІМТ онлайн`, підзаголовок на `індекс маси тіла · норма ваги · ідеальна вага`.

- [ ] **Step 9: Перевірка**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
node -e "const t='Калькулятор ІМТ онлайн: індекс маси тіла і норма ваги';const d='Безкоштовний калькулятор ІМТ онлайн: індекс маси тіла за ВООЗ, норма ваги для вашого зросту, ідеальна вага за формулою Девіна і норма ІМТ за віком.';console.log('title',t.length,'description',d.length)"
```

Перед збіркою у поточному `app/calcs/imt-calculator/page.tsx` замінити `<ImtJsonLd />` на
`<ImtJsonLd rating={null} />`, інакше TypeScript впаде на обов'язковому пропі; Task 5 перепише
сторінку повністю. Очікувано: 50 тестів; збірка успішна; title 53, description 147.

- [ ] **Step 10: Commit**

```bash
git add components/calcs-page/BmiCategoryTable.tsx components/calcs-page/BmiHeightWeightTable.tsx components/calcs-page/BmiAgeTable.tsx components/calcs-page/IMTDescription.tsx components/calcs-page/ImtFaq.tsx components/calcs-page/ImtJsonLd.tsx app/calcs/imt-calculator/layout.tsx app/calcs/imt-calculator/opengraph-image.tsx app/calcs/imt-calculator/Inter-Bold.ttf app/calcs/imt-calculator/page.tsx
git commit -m "seo(imt): WHO table, height/weight and age tables, richer FAQ and JSON-LD, new metadata"
```

---

### Task 5: сторінка ІМТ: tool-first, ISR, рейтинг

**Files:**
- Modify: `app/calcs/imt-calculator/page.tsx` (повна заміна)
- Modify: `app/calcs/imt-calculator/loading.tsx` (повна заміна)

**Interfaces:**
- Consumes: `getCalcRating`, `CalcRating`, `ImtCalcList`, `ButtonGroup`, `CalcTitle`, `DescriptionIMT`, `BmiCategoryTable`, `BmiHeightWeightTable`, `BmiAgeTable`, `ImtFaq`, `CalcByline`, `ImtJsonLd`.

- [ ] **Step 1: Переписати `app/calcs/imt-calculator/page.tsx`**

```tsx
import Link from 'next/link';
import { ButtonGroup } from '@/components/calcs-page/ButttonGroup';
import { CalcTitle } from '@/components/calcs-page/CalcsTitle';
import { DescriptionIMT } from '@/components/calcs-page/IMTDescription';
import { ImtCalcList } from '@/components/calcs-page/ImtCalcList';
import { ImtFaq } from '@/components/calcs-page/ImtFaq';
import { ImtJsonLd } from '@/components/calcs-page/ImtJsonLd';
import { CalcByline } from '@/components/calcs-page/CalcByline';
import { CalcRating } from '@/components/calcs-page/CalcRating';
import { BmiCategoryTable } from '@/components/calcs-page/BmiCategoryTable';
import { BmiHeightWeightTable } from '@/components/calcs-page/BmiHeightWeightTable';
import { BmiAgeTable } from '@/components/calcs-page/BmiAgeTable';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import { getCalcRating } from '@/app/_services/calcRating.service';

export const revalidate = 3600;

const ImtCalc = async () => {
  const rating = await getCalcRating('imt-calculator');

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
                <span className="font-semibold"> &gt; Індекс маси тіла</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Калькулятор ІМТ: індекс маси тіла і норма ваги
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Введіть зріст і вагу і дізнайтесь ІМТ, норму ваги та ідеальну вагу
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
              <ImtCalcList />
              <ButtonGroup />
              <CalcRating calcId="imt-calculator" initial={rating} />
            </div>

            <div className="basis-1/2 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-mainTitle dark:text-mainTitleBlack">
                Розрахунок індексу маси тіла онлайн
              </h2>
              <p className="mt-4 text-base md:text-lg text-mainText dark:text-mainTextBlack">
                Індекс маси тіла (ІМТ) — це співвідношення ваги та зросту, яке показує, чи
                відповідає вага нормі: вага в кілограмах, поділена на квадрат зросту в метрах.
                Нормальний ІМТ — 18,5–24,9. Калькулятор також показує норму ваги для вашого
                зросту, ідеальну вагу за формулою Девіна і орієнтовну норму для вашого віку.
              </p>
              <DescriptionIMT />
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-mainTitle dark:text-mainTitleBlack">
              Фітнес-калькулятори
            </h2>
            <CalcTitle page={0} />
          </div>
        </div>
      </section>

      <BmiCategoryTable />
      <BmiHeightWeightTable />
      <BmiAgeTable />
      <ImtFaq />
      <CalcByline />
      <ImtJsonLd rating={rating} />
    </main>
  );
};

export default ImtCalc;
```

- [ ] **Step 2: Переписати `app/calcs/imt-calculator/loading.tsx`**

```tsx
import SceletonForCalc from '@/components/sceleton/sceletonForCalc';

export default function Loading() {
  return (
    <main>
      <section className="bg-[#2E2F42] md:bg-hero-photo bg-cover bg-center">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <div className="h-5 w-40 rounded bg-gray-500/60" aria-hidden="true" />
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Калькулятор ІМТ: індекс маси тіла і норма ваги
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Введіть зріст і вагу і дізнайтесь ІМТ, норму ваги та ідеальну вагу
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
npm run build 2>&1 | grep -E "Compiled|Failed|error|imt-calculator " | head -4
node -e "const m=require('./.next/prerender-manifest.json');console.log('imt revalidate:',m.routes['/calcs/imt-calculator']?.initialRevalidateSeconds)"
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/imt-calculator | tr -d '\n' > .lighthouse/imt.html
grep -oE "<title>[^<]*</title>" .lighthouse/imt.html
grep -oE "<h[12][^>]*>[^<]*</h[12]>" .lighthouse/imt.html | sed -E 's/<[^>]+>//g'
grep -o "<table" .lighthouse/imt.html | wc -l
grep -o 'Чи корисний калькулятор' .lighthouse/imt.html | wc -l
grep -o '"@type":"Question"' .lighthouse/imt.html | wc -l
grep -o 'featureList' .lighthouse/imt.html | wc -l
grep -oE '<meta property="og:image" content="[^"]*"' .lighthouse/imt.html | head -1
curl -s -o /dev/null -w "og: %{http_code} %{content_type} %{size_download}\n" http://localhost:3100/calcs/imt-calculator/opengraph-image
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `initialRevalidateSeconds: 3600`; title без суфікса; заголовки в порядку H1 → «Розрахунок індексу маси тіла онлайн» → «Фітнес-калькулятори» → «Категорії ІМТ за ВООЗ» → «Норма ваги за зростом» → «Норма ІМТ за віком» → «Часті питання про індекс маси тіла»; `<table` 3; віджет 1; `Question` 7; `featureList` ≥ 1; og:image присутній, картинка `200 image/png`.

- [ ] **Step 4: Ручна перевірка**

`npm run dev`, відкрити `/calcs/imt-calculator`: чоловік, 30 років, 170 см, 65 кг → ІМТ 22,5, «Норма», 53–72 кг, «Ви в нормі», Девін 66 кг, вікова норма 20–25. Ввести вагу 80 → 27,7, «Надлишкова вага», «мінус 8 кг». Перевірити темну тему і роботу зірок. Зупинити dev-сервер.

- [ ] **Step 5: Commit**

```bash
git add app/calcs/imt-calculator/page.tsx app/calcs/imt-calculator/loading.tsx
git commit -m "feat(imt): tool-first layout, ISR with rating widget and aggregateRating"
```

---

### Task 6: дата оновлення і фінальна перевірка

**Files:**
- Modify: `const/calcSeo.ts`
- Modify: `docs/superpowers/plans/2026-09-17-calcs-hub-bmi-pr4.md` (розділ «Результати»)

- [ ] **Step 1: Дата оновлення калькуляторів**

У `const/calcSeo.ts` встановити `CALC_DATE_MODIFIED` у форматі `YYYY-MM-DD` на поточну дату і відповідний `CALC_DATE_MODIFIED_LABEL` («18 вересня 2026» тощо). `npm test` має проходити (sitemap читає константу).

- [ ] **Step 2: Тести, збірка, Lighthouse обох сторінок**

```bash
npm test 2>&1 | tail -3
npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
for p in calcs calcs/imt-calculator; do n=$(echo $p | tr '/' '_'); npx --yes lighthouse@12 "http://localhost:3100/$p" --only-categories=performance,accessibility,seo --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --output=json --output-path=".lighthouse/pr4-$n.json" --quiet; node -e "const r=require('./.lighthouse/pr4-$n.json');const c=r.categories;console.log('$p perf',Math.round(c.performance.score*100),'a11y',Math.round(c.accessibility.score*100),'seo',Math.round(c.seo.score*100));const f=Object.values(r.audits).filter(a=>a.score!==null&&a.score<1&&a.scoreDisplayMode==='binary').map(a=>a.id);console.log(' failing:',f.join(', ')||'none')"; done
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: 50 тестів; performance ≥ 90, accessibility 100, SEO 100 на обох сторінках, без провалених бінарних аудитів.

- [ ] **Step 3: Записати результати**

Дописати в кінець цього файлу:

```markdown
## Результати PR 4

| Сторінка | Performance | Accessibility | SEO |
|---|---|---|---|
| /calcs | ... | ... | ... |
| /calcs/imt-calculator | ... | ... | ... |

Тестів: 50. ISR ІМТ: `initialRevalidateSeconds` 3600.

Після деплою: Rich Results Test для обох сторінок, PSI, запит на індексування; через 4–6 тижнів порівняти позицію ІМТ (базова 14,9) і CTR (базовий 0,3%).
```

- [ ] **Step 4: Commit**

```bash
git add const/calcSeo.ts docs/superpowers/plans/2026-09-17-calcs-hub-bmi-pr4.md
git commit -m "docs(plan): record PR 4 verification results, bump calculators dateModified"
```

Далі гілку завершує skill `superpowers:finishing-a-development-branch`.
