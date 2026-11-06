# PR 6: формула, витрата в залі і наступні кроки на калькуляторі калорій. План реалізації

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сторінка `/calcs/calories-calculator` отримує пряму відповідь із формулою Міффліна-Сан Жеора, покроковий розрахунок, таблицю витрати калорій у залі з досвідом тренера, блок «Що робити з результатом», 11 питань FAQ і список джерел, а калькулятор лишається вгорі без змін.

**Architecture:** Дані, які перевіряють тести, живуть у чистих модулях: `lib/activityBurn.ts` (MET і ккал за годину) і `components/calcs-page/caloriesContent.ts` (FAQ, приклад, джерела). Нові секції сторінки є серверними компонентами за патерном `CaloriesNormTable`; числа прикладу рахуються функціями `lib/calories.ts`, тому не розходяться з калькулятором. Дати оновлення стають окремими для кожного калькулятора (`CALC_MODIFIED`), sitemap і JSON-LD читають їх звідти.

**Tech Stack:** Next.js 14.2 (App Router, ISR), React 18, TypeScript strict, Tailwind 3.3, vitest, Lighthouse 12 CLI.

**Spec:** `docs/superpowers/specs/2026-11-06-calories-formula-content-design.md`.

**Гілка:** `feat/calories-formula-content` (спек закомічено в `54314b3`).

## Global Constraints

- **Калькулятор не змінювати:** `components/calcs-page/CaloriesCalcList.tsx`, `CaloriesResult.tsx`, `ButttonGroup.tsx`, `CalcRating.tsx`, `InputSkeleton.tsx` і `lib/calories.ts` не редагуються. Title, description і решта `app/calcs/calories-calculator/layout.tsx` без змін.
- Тексти сторінки беруться дослівно з цього плану (вони збігаються з розділом 6 спеку).
- Апостроф у новому тексті `ʼ` (U+02BC). Мінус у формулах `−` (U+2212), множення `×` (U+00D7), діапазони через `–` (U+2013), тире в реченнях `—` (U+2014). Числа без розділювача тисяч (`1850`, не `1 850`).
- Нові секції: `section.bg-white dark:bg-darkBody` → `div.div-container py-[20px] md:py-[44px] mx-auto` → H2 `title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10` → контент `max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack`. Таблиці з `caption`, `th scope="col"`, `th scope="row"`, обгорнуті в `div.overflow-x-auto`.
- Vitest бере лише `lib/**/*.test.ts` у середовищі node; тести не імпортують `.tsx`.
- Комміти без будь-яких трейлерів (без `Co-Authored-By`). Лінт не запускати.
- Windows 11, Git Bash, Node 24. Production-сервер на порту 3100; чекати старту через `curl --retry-connrefused`, а не `sleep`; зупинка через `netstat -ano` + `taskkill //PID <pid> //F`. Довгі файли писати інструментом Write (довгі heredoc у Bash обрізаються). MongoDB Atlas доступна локально (рейтинг читається при збірці).
- Швидка перевірка типів: `npx tsc --noEmit` (≈3 с, зараз проходить чисто). Базова кількість тестів: 73.

## Структура файлів

| Файл | Дія | Відповідальність |
|---|---|---|
| `lib/activityBurn.ts`, `lib/activityBurn.test.ts` | створити | MET занять у залі, ккал за годину |
| `components/calcs-page/caloriesContent.ts` | створити | FAQ (11), приклад, джерела |
| `lib/caloriesContent.test.ts` | створити | узгодженість прикладу, FAQ і таблиці MET |
| `const/calcSeo.ts` | змінити | тип `CalcSource`, `CALC_MODIFIED`, `CALCS_HUB_DATE_MODIFIED` |
| `components/calcs-page/CaloriesFaq.tsx` | змінити | рендер FAQ з `caloriesContent.ts` |
| `components/calcs-page/CaloriesJsonLd.tsx` | змінити | FAQ з нового модуля, 4 джерела, своя дата |
| `components/calcs-page/ImtJsonLd.tsx`, `FatJsonLd.tsx` | змінити | своя дата |
| `components/calcs-page/CalcByline.tsx` | змінити | проп `calcId`, своя дата |
| `lib/sitemap.ts`, `lib/sitemap.test.ts` | змінити | дата з `CALC_MODIFIED` |
| `app/calcs/imt-calculator/page.tsx`, `app/calcs/fat-calculator/page.tsx` | змінити | `calcId` для підпису |
| `components/calcs-page/CaloriesFormula.tsx` | створити | формула, коефіцієнти, приклад |
| `components/calcs-page/CaloriesGymBurn.tsx` | створити | таблиця MET, досвід тренера |
| `components/calcs-page/CaloriesNextSteps.tsx` | створити | кроки, лайфхак, CTA Sytno |
| `components/calcs-page/CalcSources.tsx` | створити | список джерел |
| `components/calcs-page/CaloriesDescription.tsx` | змінити | новий другий абзац, без таблиці і рядка джерела |
| `components/calcs-page/CaloriesDeficitTable.tsx` | змінити | темп у відсотках |
| `app/calcs/calories-calculator/page.tsx` | змінити | пряма відповідь, нові секції, `calcId` |

---

### Task 1: чистий модуль `lib/activityBurn.ts` (TDD)

**Files:**
- Create: `lib/activityBurn.ts`
- Create: `lib/activityBurn.test.ts`

**Interfaces:**
- Consumes: нічого.
- Produces: `interface GymActivity { code: string; label: string; met: number }`, `GYM_ACTIVITIES: readonly GymActivity[]`, `BURN_WEIGHTS: readonly [60, 80]`, `kcalPerHour(met: number, weightKg: number): number`, `formatMet(met: number): string`.

- [ ] **Step 1: Тести `lib/activityBurn.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { BURN_WEIGHTS, GYM_ACTIVITIES, formatMet, kcalPerHour } from './activityBurn';

// [код Compendium 2024, ккал/год для 60 кг, ккал/год для 80 кг] — таблиця 6.3 спеку
const EXPECTED: Array<[string, number, number]> = [
  ['02054', 210, 280],
  ['02050', 360, 480],
  ['02040', 450, 600],
  ['01224', 410, 540],
  ['02048', 300, 400],
  ['02071', 300, 400],
  ['17355', 230, 300],
  ['12030', 510, 680],
  ['02150', 140, 180],
];

describe('kcalPerHour', () => {
  it('multiplies MET by body weight for one hour and rounds to 10 kcal', () => {
    expect(kcalPerHour(3.5, 60)).toBe(210);
    expect(kcalPerHour(3.8, 60)).toBe(230);
    expect(kcalPerHour(6.8, 80)).toBe(540);
  });
});

describe('GYM_ACTIVITIES', () => {
  it('lists the nine Compendium 2024 activities in table order with unique codes', () => {
    expect(GYM_ACTIVITIES.map(a => a.code)).toEqual(EXPECTED.map(([code]) => code));
    expect(new Set(GYM_ACTIVITIES.map(a => a.code)).size).toBe(GYM_ACTIVITIES.length);
  });

  it('gives the spec table values for 60 and 80 kg', () => {
    expect(BURN_WEIGHTS).toEqual([60, 80]);
    for (const [code, kcal60, kcal80] of EXPECTED) {
      const activity = GYM_ACTIVITIES.find(a => a.code === code)!;
      expect(BURN_WEIGHTS.map(w => kcalPerHour(activity.met, w))).toEqual([kcal60, kcal80]);
    }
  });
});

describe('formatMet', () => {
  it('prints one decimal with a comma', () => {
    expect(formatMet(6)).toBe('6,0');
    expect(formatMet(3.8)).toBe('3,8');
  });
});
```

- [ ] **Step 2: Запустити, переконатися, що падає**

Run: `npx vitest run lib/activityBurn.test.ts`
Expected: FAIL, `Failed to resolve import "./activityBurn"`.

- [ ] **Step 3: Реалізація `lib/activityBurn.ts`**

```ts
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
```

- [ ] **Step 4: Запустити тести**

Run: `npx vitest run lib/activityBurn.test.ts` → PASS (4 tests). Потім `npm test 2>&1 | tail -4` → 77 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/activityBurn.ts lib/activityBurn.test.ts
git commit -m "feat(calories): gym activity MET table from the 2024 Compendium"
```

---

### Task 2: контент калорій: FAQ на 11 питань, приклад, джерела (TDD)

**Files:**
- Create: `components/calcs-page/caloriesContent.ts`
- Create: `lib/caloriesContent.test.ts`
- Modify: `const/calcSeo.ts` (додати тип `CalcSource` у кінець файлу)
- Modify: `components/calcs-page/CaloriesFaq.tsx` (масив переїздить)
- Modify: `components/calcs-page/CaloriesJsonLd.tsx` (імпорт FAQ, `citation`)

**Interfaces:**
- Consumes: `bmrMifflin`, `tdee`, `targets`, `macros`, `type Sex`, `type Goal` з `lib/calories.ts`; `GYM_ACTIVITIES`, `kcalPerHour` з Task 1 (лише в тесті).
- Produces: `interface CalcSource { label: string; url: string; type: 'ScholarlyArticle' | 'CreativeWork' }` у `const/calcSeo.ts`; у `caloriesContent.ts`: `CALORIES_EXAMPLE: { sex: Sex; age: number; heightCm: number; weightKg: number; activity: number; goal: Goal }`, `CALORIES_SOURCES: CalcSource[]`, `caloriesFaq: Array<{ question: string; answer: string }>`.

- [ ] **Step 1: Тести `lib/caloriesContent.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  CALORIES_EXAMPLE,
  CALORIES_SOURCES,
  caloriesFaq,
} from '@/components/calcs-page/caloriesContent';
import { bmrMifflin, macros, targets, tdee } from './calories';
import { GYM_ACTIVITIES, kcalPerHour } from './activityBurn';

const answer = (question: string): string => {
  const item = caloriesFaq.find(faq => faq.question === question);
  if (!item) throw new Error(`FAQ question not found: ${question}`);
  return item.answer;
};

const burn = (code: string, weightKg: number) =>
  kcalPerHour(GYM_ACTIVITIES.find(a => a.code === code)!.met, weightKg);

describe('CALORIES_EXAMPLE', () => {
  it('produces the worked-example numbers', () => {
    const e = CALORIES_EXAMPLE;
    const bmr = bmrMifflin({ sex: e.sex, age: e.age, heightCm: e.heightCm, weightKg: e.weightKg });
    const daily = tdee(bmr, e.activity);
    const t = targets(daily);

    expect(bmr).toBe(1402);
    expect(daily).toBe(2173);
    expect(t.maintain).toBe(2170);
    expect(t.loss15).toBe(1850);
    expect(macros(t.loss15, e.weightKg, e.goal)).toEqual({ proteinG: 117, fatG: 51, carbsG: 231 });
  });
});

describe('caloriesFaq', () => {
  it('has 11 questions', () => {
    expect(caloriesFaq).toHaveLength(11);
  });

  it('keeps the example numbers in sync with the calculator', () => {
    expect(answer('Як розрахувати денну норму калорій?')).toContain('2170');
    expect(answer('Як розрахувати денну норму калорій?')).toContain('1850');
    expect(answer('Що таке BMR і чим він відрізняється від норми калорій?')).toContain('1400');
    expect(answer('Що таке BMR і чим він відрізняється від норми калорій?')).toContain('2170');
    const protein = answer('Скільки білка потрібно на день?');
    expect(protein).toContain('117 г');
    expect(protein).toContain('51 г');
    expect(protein).toContain('231 г');
  });

  it('quotes the Mifflin-St Jeor formula for both sexes', () => {
    const text = answer('За якою формулою рахує калькулятор калорій?');
    expect(text).toContain('10 × вага (кг) + 6,25 × зріст (см) − 5 × вік + 5');
    expect(text).toContain('10 × вага (кг) + 6,25 × зріст (см) − 5 × вік − 161');
  });

  it('matches the gym burn table', () => {
    const text = answer('Скільки калорій спалює тренування в залі?');
    expect(text).toContain(`${burn('02054', 60)}–${burn('02054', 80)} ккал`);
    expect(text).toContain(`${burn('02050', 60)}–${burn('02050', 80)} ккал`);
  });

  it('states the weekly pace in percent of body weight, not kilograms', () => {
    for (const item of caloriesFaq) {
      expect(item.answer).not.toContain('0,5–1 кг');
    }
    expect(answer('Скільки калорій потрібно, щоб схуднути?')).toContain('0,5–1% маси тіла на тиждень');
  });
});

describe('CALORIES_SOURCES', () => {
  it('lists the four verified sources', () => {
    expect(CALORIES_SOURCES.map(s => s.url)).toEqual([
      'https://pubmed.ncbi.nlm.nih.gov/2305711/',
      'https://pubmed.ncbi.nlm.nih.gov/28642676/',
      'https://pacompendium.com/',
      'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    ]);
    expect(CALORIES_SOURCES.map(s => s.type)).toEqual([
      'ScholarlyArticle',
      'ScholarlyArticle',
      'ScholarlyArticle',
      'CreativeWork',
    ]);
  });
});
```

- [ ] **Step 2: Запустити, переконатися, що падає**

Run: `npx vitest run lib/caloriesContent.test.ts`
Expected: FAIL, `Failed to resolve import "@/components/calcs-page/caloriesContent"`.

- [ ] **Step 3: Тип `CalcSource` у кінець `const/calcSeo.ts`**

```ts

export interface CalcSource {
  label: string;
  url: string;
  type: 'ScholarlyArticle' | 'CreativeWork';
}
```

- [ ] **Step 4: Створити `components/calcs-page/caloriesContent.ts`**

Перші шість питань — це поточний масив з `CaloriesFaq.tsx`; переносити копіюванням, а не передруковуванням, і змінити лише відповідь на «Скільки калорій потрібно, щоб схуднути?» (фрагмент «і втрачати більше 0,5–1 кг на тиждень» → «і худнути швидше ніж на 0,5–1% маси тіла на тиждень»). Результат має бути таким:

```ts
import type { CalcSource } from '@/const/calcSeo';
import type { Goal, Sex } from '@/lib/calories';

export const CALORIES_EXAMPLE: {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: number;
  goal: Goal;
} = { sex: 'female', age: 30, heightCm: 170, weightKg: 65, activity: 1.55, goal: 'loss' };

export const CALORIES_SOURCES: CalcSource[] = [
  {
    label:
      'Mifflin MD, St Jeor ST, Hill LA та ін. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241–247',
    url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    type: 'ScholarlyArticle',
  },
  {
    label:
      'Jäger R, Kerksick CM та ін. International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr. 2017;14:20',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/',
    type: 'ScholarlyArticle',
  },
  {
    label:
      'Herrmann SD, Willis EA, Ainsworth BE та ін. 2024 Adult Compendium of Physical Activities. J Sport Health Sci. 2024;13(1):6–12',
    url: 'https://pacompendium.com/',
    type: 'ScholarlyArticle',
  },
  {
    label: 'Всесвітня організація охорони здоровʼя. Здорове харчування (Healthy diet)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    type: 'CreativeWork',
  },
];

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
      'Щоб схуднути, створіть дефіцит калорій: зменшіть денну норму на 10–20%, оптимально на 15%. Не рекомендується опускатися нижче 1200 калорій на день для жінок і 1500 для чоловіків і худнути швидше ніж на 0,5–1% маси тіла на тиждень, адже це шкідливо для здоровʼя та сповільнює метаболізм.',
  },
  {
    question: 'Що таке дефіцит калорій?',
    answer:
      'Дефіцит калорій — це стан, коли ви споживаєте менше калорій, ніж витрачаєте протягом дня. Саме дефіцит калорій є основною умовою схуднення. Оптимальний дефіцит — 10–20% від денної норми калорій (для більшості — 15%); 1 кг жиру відповідає приблизно 7700 ккал.',
  },
  {
    question: 'Скільки потрібно калорій, щоб набрати вагу?',
    answer:
      'Для набору ваги збільште денну норму калорій на 10–15% і зробіть акцент на достатній кількості білка та силових тренуваннях. Так приріст ваги відбуватиметься переважно за рахунок мʼязової маси, а не жиру.',
  },
  {
    question: 'Скільки білка потрібно на день?',
    answer:
      'Калькулятор рахує білок від ваги тіла: 1,8 г на кілограм при схудненні, 1,6 г при підтриманні і 2 г при наборі маси (рекомендації ISSN). Жири займають 25% калорійності, решта припадає на вуглеводи. Для 1850 ккал і 65 кг це приблизно 117 г білка, 51 г жирів і 231 г вуглеводів.',
  },
  {
    question: 'За якою формулою рахує калькулятор калорій?',
    answer:
      'Калькулятор використовує формулу Міффліна-Сан Жеора (1990) — сучасний стандарт для розрахунку базового обміну (BMR). Для чоловіків: 10 × вага (кг) + 6,25 × зріст (см) − 5 × вік + 5; для жінок: 10 × вага (кг) + 6,25 × зріст (см) − 5 × вік − 161. Потім BMR множать на коефіцієнт активності від 1,2 до 1,9.',
  },
  {
    question: 'Наскільки точний калькулятор калорій?',
    answer:
      'Формула дає оцінку, а не вимірювання: реальний обмін залежить від складу тіла, гормонів і способу життя. Тримайтеся розрахованої калорійності 2–3 тижні і дивіться на зміну ваги: якщо вона довго стоїть при дотриманні раціону, зменште калорійність на 100–150 ккал.',
  },
  {
    question: 'Скільки калорій спалює тренування в залі?',
    answer:
      'Година силового тренування спалює приблизно 210–280 ккал для людини вагою 60–80 кг, інтенсивного — 360–480 ккал (Compendium of Physical Activities, 2024). Але тренування — лише близько 10% тижневих енерговитрат, а трекери й кардіотренажери часто завищують цифри.',
  },
  {
    question: 'Чому вага стоїть, хоча я тримаю дефіцит?',
    answer:
      'Найчастіше дефіциту насправді немає: люди недооцінюють, скільки зʼїли, і переоцінюють спалене на тренуванні. Крім того, вода дає коливання, тому оцінюйте прогрес за місячним трендом. Якщо вага тривалий час стоїть при дотриманні раціону, зменште калорійність на 100–150 ккал.',
  },
  {
    question: 'Чи треба доїдати калорії, спалені на тренуванні?',
    answer:
      'Ні. Після інтенсивного навантаження зростає апетит і хочеться винагородити себе, тому більшість людей неусвідомлено доїдає спалене, і дефіцит зникає. Рахуйте норму з коефіцієнтом активності: тренування в ньому вже враховані.',
  },
];
```

- [ ] **Step 5: `CaloriesFaq.tsx` рендерить масив з нового модуля**

Видалити з `components/calcs-page/CaloriesFaq.tsx` оголошення `export const caloriesFaq = [ … ];` (рядки 1–37) і додати на початок файлу імпорт. Початок файлу стає таким (компонент `CaloriesFaq` нижче без змін):

```tsx
import { caloriesFaq } from './caloriesContent';

export const CaloriesFaq = () => {
```

- [ ] **Step 6: `CaloriesJsonLd.tsx`: імпорт FAQ і чотири джерела**

Замінити перший рядок `import { caloriesFaq } from './CaloriesFaq';` на:

```tsx
import { CALORIES_SOURCES, caloriesFaq } from './caloriesContent';
```

Замінити обʼєкт `citation` (поточний `citation: { '@type': 'CreativeWork', name: 'Здорове харчування — …', url: 'https://www.who.int/…' },`) на:

```tsx
        citation: CALORIES_SOURCES.map(source => ({
          '@type': source.type,
          name: source.label,
          url: source.url,
        })),
```

- [ ] **Step 7: Тести і типи**

Run: `npx vitest run lib/caloriesContent.test.ts` → PASS (7 tests). `npm test 2>&1 | tail -4` → 84 passed. `npx tsc --noEmit` → без помилок.

- [ ] **Step 8: Commit**

```bash
git add components/calcs-page/caloriesContent.ts lib/caloriesContent.test.ts const/calcSeo.ts components/calcs-page/CaloriesFaq.tsx components/calcs-page/CaloriesJsonLd.tsx
git commit -m "seo(calories): FAQ with the written formula and gym answers, four cited sources"
```

---

### Task 3: окрема дата оновлення для кожного калькулятора (TDD)

**Files:**
- Modify: `const/calcSeo.ts`
- Modify: `lib/sitemap.ts`, `lib/sitemap.test.ts`
- Modify: `components/calcs-page/CalcByline.tsx`
- Modify: `components/calcs-page/CaloriesJsonLd.tsx`, `ImtJsonLd.tsx`, `FatJsonLd.tsx`
- Modify: `app/calcs/calories-calculator/page.tsx:100`, `app/calcs/imt-calculator/page.tsx:96`, `app/calcs/fat-calculator/page.tsx:89`

**Interfaces:**
- Consumes: `type CalcId`, `isCalcId` з `lib/calcRating.ts` (`'calories-calculator' | 'imt-calculator' | 'fat-calculator'`).
- Produces: `CALC_MODIFIED: Record<CalcId, { iso: string; label: string }>`, `CALCS_HUB_DATE_MODIFIED: string`; `CalcByline` з пропом `{ calcId: CalcId }`. `CALC_DATE_MODIFIED` і `CALC_DATE_MODIFIED_LABEL` видаляються.

- [ ] **Step 1: Тести `lib/sitemap.test.ts`**

Замінити імпорт `import { CALC_DATE_MODIFIED } from '@/const/calcSeo';` на:

```ts
import { CALC_MODIFIED, CALCS_HUB_DATE_MODIFIED } from '@/const/calcSeo';
```

Замінити тест `it('uses the calculators date for /calcs routes', …)` на два:

```ts
  it('gives each calculator its own date', () => {
    expect(lastModifiedForRoute('/calcs/calories-calculator')).toBe(
      CALC_MODIFIED['calories-calculator'].iso
    );
    expect(lastModifiedForRoute('/calcs/imt-calculator')).toBe('2026-09-17');
    expect(lastModifiedForRoute('/calcs/fat-calculator')).toBe('2026-09-17');
  });

  it('uses the hub date for /calcs', () => {
    expect(lastModifiedForRoute('/calcs')).toBe(CALCS_HUB_DATE_MODIFIED);
  });
```

У тесті `lists every static route with an absolute url and lastModified` замінити `lastModified: CALC_DATE_MODIFIED,` на:

```ts
      lastModified: CALC_MODIFIED['calories-calculator'].iso,
```

- [ ] **Step 2: Запустити, переконатися, що падає**

Run: `npx vitest run lib/sitemap.test.ts`
Expected: FAIL (`CALC_MODIFIED` undefined / `Cannot read properties of undefined`).

- [ ] **Step 3: `const/calcSeo.ts`**

Додати першим рядком файлу:

```ts
import type { CalcId } from '@/lib/calcRating';
```

Замінити два рядки

```ts
export const CALC_DATE_MODIFIED = '2026-09-17';
export const CALC_DATE_MODIFIED_LABEL = '17 вересня 2026';
```

на

```ts
// Дата змістовного оновлення кожного калькулятора; змінювати лише разом із його текстом.
export const CALC_MODIFIED: Record<CalcId, { iso: string; label: string }> = {
  'calories-calculator': { iso: '2026-11-06', label: '6 листопада 2026' },
  'imt-calculator': { iso: '2026-09-17', label: '17 вересня 2026' },
  'fat-calculator': { iso: '2026-09-17', label: '17 вересня 2026' },
};

export const CALCS_HUB_DATE_MODIFIED = '2026-09-17';
```

- [ ] **Step 4: `lib/sitemap.ts`**

Замінити імпорт `import { CALC_DATE_MODIFIED } from '@/const/calcSeo';` на:

```ts
import { CALC_MODIFIED, CALCS_HUB_DATE_MODIFIED } from '@/const/calcSeo';
import { isCalcId } from '@/lib/calcRating';
```

Замінити функцію `lastModifiedForRoute` на:

```ts
export function lastModifiedForRoute(route: string): string {
  if (route === '/calcs') return CALCS_HUB_DATE_MODIFIED;
  const calcId = route.startsWith('/calcs/') ? route.slice('/calcs/'.length) : '';
  if (isCalcId(calcId)) return CALC_MODIFIED[calcId].iso;
  return SITE_CONTENT_LASTMOD;
}
```

Run: `npx vitest run lib/sitemap.test.ts` → PASS.

- [ ] **Step 5: `CalcByline.tsx`**

Повний новий вміст `components/calcs-page/CalcByline.tsx`:

```tsx
import { CALC_AUTHOR, CALC_MODIFIED } from '@/const/calcSeo';
import type { CalcId } from '@/lib/calcRating';

export const CalcByline = ({ calcId }: { calcId: CalcId }) => {
  const modified = CALC_MODIFIED[calcId];
  return (
    <section className="bg-white dark:bg-darkBody">
      <div className="div-container pb-8 md:pb-12 mx-auto">
        <p className="max-w-[900px] mx-auto text-sm text-center text-mainText dark:text-mainTextBlack">
          Матеріал підготував тренер{' '}
          <span className="font-semibold">{CALC_AUTHOR.name}</span>.{' '}
          <time dateTime={modified.iso}>Оновлено: {modified.label}</time>.
        </p>
        <p className="max-w-[900px] mx-auto mt-3 text-xs text-center text-neutral-600 dark:text-mainTextBlack">
          Розрахунки орієнтовні і не замінюють консультацію лікаря чи дієтолога. За
          хронічних захворювань, вагітності або віку до 18 років узгодьте раціон із
          фахівцем.
        </p>
      </div>
    </section>
  );
};
```

- [ ] **Step 6: Сторінки передають `calcId`**

- `app/calcs/calories-calculator/page.tsx`: `<CalcByline />` → `<CalcByline calcId="calories-calculator" />`
- `app/calcs/imt-calculator/page.tsx`: `<CalcByline />` → `<CalcByline calcId="imt-calculator" />`
- `app/calcs/fat-calculator/page.tsx`: `<CalcByline />` → `<CalcByline calcId="fat-calculator" />`

- [ ] **Step 7: JSON-LD беруть свою дату**

У кожному з `CaloriesJsonLd.tsx`, `ImtJsonLd.tsx`, `FatJsonLd.tsx` в імпорті з `@/const/calcSeo` замінити `CALC_DATE_MODIFIED,` на `CALC_MODIFIED,`, а рядок `dateModified: CALC_DATE_MODIFIED,` замінити відповідно на:

```tsx
        dateModified: CALC_MODIFIED['calories-calculator'].iso,
```

```tsx
        dateModified: CALC_MODIFIED['imt-calculator'].iso,
```

```tsx
        dateModified: CALC_MODIFIED['fat-calculator'].iso,
```

- [ ] **Step 8: Перевірка**

Run: `grep -rn "CALC_DATE_MODIFIED" app components lib const` → порожньо. `npx tsc --noEmit` → без помилок. `npm test 2>&1 | tail -4` → 85 passed.

- [ ] **Step 9: Commit**

```bash
git add const/calcSeo.ts lib/sitemap.ts lib/sitemap.test.ts components/calcs-page/CalcByline.tsx components/calcs-page/CaloriesJsonLd.tsx components/calcs-page/ImtJsonLd.tsx components/calcs-page/FatJsonLd.tsx app/calcs/calories-calculator/page.tsx app/calcs/imt-calculator/page.tsx app/calcs/fat-calculator/page.tsx
git commit -m "seo(calcs): per-calculator dateModified for byline, JSON-LD and sitemap"
```

---

### Task 4: пряма відповідь і секція «Як розраховується норма калорій»

**Files:**
- Create: `components/calcs-page/CaloriesFormula.tsx`
- Modify: `app/calcs/calories-calculator/page.tsx` (імпорт, абзац у правій колонці, нова секція)
- Modify: `components/calcs-page/CaloriesDescription.tsx` (другий абзац, видалити таблицю і рядок джерела)
- Modify: `components/calcs-page/CaloriesDeficitTable.tsx:51`

**Interfaces:**
- Consumes: `bmrMifflin`, `tdee`, `targets`, `macros`, `PROTEIN_PER_KG` з `lib/calories.ts`; `CALORIES_EXAMPLE` з Task 2.
- Produces: компонент `CaloriesFormula` (без пропсів).

- [ ] **Step 1: Створити `components/calcs-page/CaloriesFormula.tsx`**

```tsx
import { bmrMifflin, macros, PROTEIN_PER_KG, targets, tdee } from '@/lib/calories';
import { CALORIES_EXAMPLE } from './caloriesContent';

const COEFFICIENTS = [
  { label: 'Сидячий спосіб життя', value: '1,2' },
  { label: 'Легка активність (1–3 тренування/тиждень)', value: '1,375' },
  { label: 'Помірна активність (3–5 тренувань/тиждень)', value: '1,55' },
  { label: 'Висока активність (6–7 тренувань/тиждень)', value: '1,725' },
  { label: 'Дуже висока (важка фізична праця)', value: '1,9' },
];

const decimal = (n: number) => String(n).replace('.', ',');

const stepTitle = 'text-lg font-bold text-mainTitle dark:text-mainTitleBlack mb-2';

export const CaloriesFormula = () => {
  const e = CALORIES_EXAMPLE;
  const bmr = bmrMifflin({ sex: e.sex, age: e.age, heightCm: e.heightCm, weightKg: e.weightKg });
  const daily = tdee(bmr, e.activity);
  const t = targets(daily);
  const m = macros(t.loss15, e.weightKg, e.goal);

  return (
    <section className="bg-white dark:bg-darkBody">
      <div className="div-container py-[20px] md:py-[44px] mx-auto">
        <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
          Як розраховується норма калорій: формула Міффліна-Сан Жеора
        </h2>
        <div className="max-w-[900px] mx-auto flex flex-col gap-6 text-base lg:text-lg text-mainText dark:text-mainTextBlack">
          <p>
            Формулу опублікували Міффлін, Сан Жеор та співавтори в American Journal
            of Clinical Nutrition у 1990 році. Розрахунок має три кроки.
          </p>

          <div>
            <h3 className={stepTitle}>
              1. Базовий обмін (BMR) — енергія, яку тіло витрачає у спокої
            </h3>
            <ul className="flex flex-col gap-1 list-disc list-inside">
              <li>
                <span className="font-semibold">Чоловіки:</span> 10 × вага (кг) + 6,25 ×
                зріст (см) − 5 × вік + 5
              </li>
              <li>
                <span className="font-semibold">Жінки:</span> 10 × вага (кг) + 6,25 ×
                зріст (см) − 5 × вік − 161
              </li>
            </ul>
          </div>

          <div>
            <h3 className={stepTitle}>2. Норма калорій = BMR × коефіцієнт активності</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
                  Коефіцієнти рівня активності
                </caption>
                <thead>
                  <tr className="border-b border-gray-400">
                    <th scope="col" className="py-2 pr-4">Рівень активності</th>
                    <th scope="col" className="py-2">Коефіцієнт</th>
                  </tr>
                </thead>
                <tbody>
                  {COEFFICIENTS.map(row => (
                    <tr key={row.value} className="border-b border-gray-300">
                      <th scope="row" className="py-2 pr-4 font-normal">{row.label}</th>
                      <td className="py-2">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className={stepTitle}>3. Поправка на мету</h3>
            <p>
              Для схуднення від норми віднімають 10–20% (оптимально 15%), для набору ваги
              додають 10–15%. Білок — 1,6–2 г на кг ваги залежно від мети, жири — 25%
              калорійності, решта — вуглеводи.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 dark:border-gray-600 p-4 md:p-6">
            <h3 className={stepTitle}>
              Приклад: жінка, {e.age} років, {e.heightCm} см, {e.weightKg} кг, помірна
              активність ({decimal(e.activity)})
            </h3>
            <ol className="flex flex-col gap-1 list-decimal list-inside">
              <li>
                BMR = 10 × {e.weightKg} + 6,25 × {e.heightCm} − 5 × {e.age} − 161 ≈ {bmr} ккал
              </li>
              <li>
                Норма = {bmr} × {decimal(e.activity)} ≈ {daily}, округлено {t.maintain} ккал
              </li>
              <li>Для схуднення (−15%): {t.loss15} ккал</li>
              <li>
                БЖВ: білок {m.proteinG} г ({decimal(PROTEIN_PER_KG[e.goal])} г × {e.weightKg}{' '}
                кг), жири {m.fatG} г, вуглеводи {m.carbsG} г
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: `page.tsx`: пряма відповідь у правій колонці**

У `app/calcs/calories-calculator/page.tsx` замінити абзац (рядки 78–83)

```tsx
              <p className="mt-4 text-base md:text-lg text-mainText dark:text-mainTextBlack">
                Калькулятор калорій розраховує денну норму калорій за формулою
                Міффліна-Сан Жеора з урахуванням статі, віку, зросту, ваги та
                рівня активності. Щоб схуднути, створюють дефіцит 10–20%
                (оптимально 15%), щоб набрати вагу — профіцит 10–15% від норми.
              </p>
```

на

```tsx
              <p className="mt-4 text-base md:text-lg text-mainText dark:text-mainTextBlack">
                Денна норма калорій — це базовий обмін (BMR), помножений на
                коефіцієнт активності. BMR за формулою Міффліна-Сан Жеора: для
                чоловіків 10 × вага (кг) + 6,25 × зріст (см) − 5 × вік + 5, для
                жінок 10 × вага (кг) + 6,25 × зріст (см) − 5 × вік − 161. Щоб
                схуднути, від норми віднімають 10–20% (оптимально 15%), щоб
                набрати вагу, додають 10–15%.
              </p>
```

- [ ] **Step 3: `page.tsx`: секція формули після блоку з калькулятором**

Додати імпорт після рядка `import { CaloriesFaq } from '@/components/calcs-page/CaloriesFaq';`:

```tsx
import { CaloriesFormula } from '@/components/calcs-page/CaloriesFormula';
```

Замінити рядок `      <CaloriesNormTable />` на:

```tsx
      <CaloriesFormula />
      <CaloriesNormTable />
```

- [ ] **Step 4: `CaloriesDescription.tsx`**

Замінити другий абзац (рядки 13–18)

```tsx
      <p className="mt-6 text-base lg:text-lg  text-justify">
        Для збалансованого схуднення частину дефіциту створюйте харчуванням, а
        частину — тренуваннями: так зберігається мʼязова маса, не сповільнюється
        обмін речовин, а результат тримається довго. Втрачати варто не більше
        0,5–1 кг на тиждень.
      </p>
```

на

```tsx
      <p className="mt-6 text-base lg:text-lg  text-justify">
        Дефіцит калорій створює харчування, а силові тренування бережуть мʼязи:
        так організм втрачає жир, а не мускулатуру, обмін речовин не
        сповільнюється, і результат тримається довго. Нормальний темп — 0,5–1%
        маси тіла на тиждень; оцінюйте його за місячним трендом, бо вода дає
        щоденні коливання.
      </p>
```

Потім видалити весь блок від `      <div className="mt-8 overflow-x-auto">` (таблиця «Коефіцієнти рівня активності», зараз рядок 54) до кінця абзацу `      <p className="mt-6 text-sm">` … `Джерело: …` … `      </p>` (зараз рядок 102) включно. Після видалення останні рядки файлу:

```tsx
          Раціон при наборі ваги
        </Link>
      </div>
    </div>
  );
};
```

- [ ] **Step 5: `CaloriesDeficitTable.tsx`, пункт про темп (рядок 51)**

Замінити

```tsx
          <li>Не більше 0,5–1 кг на тиждень: швидше втрачаються мʼязи і вода.</li>
```

на

```tsx
          <li>
            Темп — 0,5–1% маси тіла на тиждень (для 70 кг — 0,35–0,7 кг): швидше
            втрачаються мʼязи і вода.
          </li>
```

- [ ] **Step 6: Перевірка в зібраній сторінці**

```bash
npx tsc --noEmit
npm test 2>&1 | tail -4
npm run build 2>&1 | grep -E "Compiled|Failed|rror" | head -5
mkdir -p .lighthouse
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
curl -s --retry 30 --retry-delay 1 --retry-connrefused -o /dev/null http://localhost:3100/calcs/calories-calculator
curl -s http://localhost:3100/calcs/calories-calculator | sed 's/<!-- -->//g' > .lighthouse/pr6-task4.html
for p in "6,25 × зріст (см) − 5 × вік − 161" "≈ 1402 ккал" "округлено 2170 ккал" "Для схуднення (−15%): 1850 ккал" "Коефіцієнти рівня активності" "Переміщуйте повзунок" "0,5–1 кг"; do printf '%s: ' "$p"; grep -o "$p" .lighthouse/pr6-task4.html | wc -l; done
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: тести 85 passed, збірка `Compiled successfully`; «6,25 × зріст (см) − 5 × вік − 161» ≥ 3 (права колонка, секція формули, FAQ), «≈ 1402 ккал» 1, «округлено 2170 ккал» 1, «Для схуднення (−15%): 1850 ккал» 1, «Коефіцієнти рівня активності» 1, «Переміщуйте повзунок» 1 (калькулятор на місці), «0,5–1 кг» 0.

- [ ] **Step 7: Commit**

```bash
git add components/calcs-page/CaloriesFormula.tsx app/calcs/calories-calculator/page.tsx components/calcs-page/CaloriesDescription.tsx components/calcs-page/CaloriesDeficitTable.tsx
git commit -m "seo(calories): direct formula answer and step-by-step calculation section"
```

---

### Task 5: витрата в залі, досвід тренера, наступні кроки, джерела

**Files:**
- Create: `components/calcs-page/CaloriesGymBurn.tsx`
- Create: `components/calcs-page/CaloriesNextSteps.tsx`
- Create: `components/calcs-page/CalcSources.tsx`
- Modify: `app/calcs/calories-calculator/page.tsx` (імпорти і три секції)

**Interfaces:**
- Consumes: `GYM_ACTIVITIES`, `BURN_WEIGHTS`, `kcalPerHour`, `formatMet` (Task 1); `CALORIES_SOURCES` (Task 2); `type CalcSource` з `const/calcSeo.ts` (Task 2); `SYTNO_URL` з `@/const`.
- Produces: `CaloriesGymBurn`, `CaloriesNextSteps` (без пропсів); `CalcSources` з пропом `{ sources: CalcSource[] }` (перевикористовується для ІМТ і жиру в наступних PR).

- [ ] **Step 1: Створити `components/calcs-page/CaloriesGymBurn.tsx`**

```tsx
import { BURN_WEIGHTS, GYM_ACTIVITIES, formatMet, kcalPerHour } from '@/lib/activityBurn';

const TRAINER_NOTES = [
  'Люди зазвичай сильно переоцінюють, скільки калорій спалюють на тренуванні, і водночас недооцінюють, скільки зʼїли, або помиляються в розрахунках. Звідси хибне відчуття «компенсації»: бургер після залу перекриває всю витрачену енергію.',
  'Тренування становлять лише невелику частку, близько 10%, загальних енерговитрат за тиждень. Трекери й кардіотренажери часто завищують цифри, бо не враховують природну компенсацію: після втомливого тренування ви менше рухаєтеся в побуті.',
  'Схуднення відбувається за рахунок дефіциту калорій, і створює його насамперед харчування. Силові вправи потрібні, щоб зберегти мʼязи і тонус: з ними організм втрачає жир, а не мускулатуру. Кардіо корисне для серця і загального здоровʼя.',
  'Більшість людей неусвідомлено «доїдає» спалене: після інтенсивного навантаження зростає апетит, а ще хочеться винагородити себе за тренування. Це зводить нанівець невеликий дефіцит, створений у залі, і гальмує схуднення.',
];

export const CaloriesGymBurn = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Скільки калорій спалює тренування в залі
      </h2>
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <p className="mb-6 text-base lg:text-lg">
          Орієнтовні витрати за годину заняття за довідником Compendium of Physical
          Activities (2024): ккал ≈ MET × вага (кг) × години. Цифра включає енергію,
          яку тіло витратило б і у спокої (близько 1 MET), тож «додаткових» калорій
          ще менше.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base border-collapse">
            <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
              Витрата калорій за годину тренування
            </caption>
            <thead>
              <tr className="border-b border-gray-400">
                <th scope="col" className="py-2 pr-4">Заняття</th>
                <th scope="col" className="py-2 pr-4">MET</th>
                {BURN_WEIGHTS.map(weight => (
                  <th key={weight} scope="col" className="py-2 pr-4">
                    {weight} кг
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GYM_ACTIVITIES.map(activity => (
                <tr key={activity.code} className="border-b border-gray-300">
                  <th scope="row" className="py-2 pr-4 font-normal">{activity.label}</th>
                  <td className="py-2 pr-4">{formatMet(activity.met)}</td>
                  {BURN_WEIGHTS.map(weight => (
                    <td key={weight} className="py-2 pr-4">
                      {kcalPerHour(activity.met, weight)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="mt-8 p-4 md:p-6 rounded-lg border-l-4 border-main bg-orange-50 dark:bg-transparent text-left">
          <p className="mb-3 text-lg font-bold text-neutral-800 dark:text-mainTitleBlack">
            Досвід тренера Юрія Теслюка
          </p>
          <ul className="flex flex-col gap-3 list-disc list-inside text-base lg:text-lg text-neutral-700 dark:text-mainTextBlack">
            {TRAINER_NOTES.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 2: Створити `components/calcs-page/CaloriesNextSteps.tsx`**

```tsx
import { SYTNO_URL } from '@/const';

const STEPS = [
  'Тримайтеся цільової калорійності 2–3 тижні: так буде видно реальну реакцію тіла.',
  'Зважуйтеся в однакових умовах (зранку, натщесерце) і оцінюйте прогрес за місячним трендом: вода дає щоденні коливання.',
  'Нормальний темп — 0,5–1% маси тіла на тиждень.',
  'Якщо вага тривалий час стоїть при дотриманні раціону, зменште калорійність на 100–150 ккал: норму підбирають методом проб і помилок.',
  'Після кожних 4–5 кг перерахуйте норму: легше тіло витрачає менше.',
];

const LIFEHACK =
  'Раціон із великою кількістю обʼємних і низькокалорійних продуктів (овочів, фруктів, нежирного мʼяса) — ключ до комфортного схуднення. Така їжа заповнює шлунок і тисне на його стінки, що активує рецептори ситості й надсилає мозку сигнал про насичення. Ви зʼїдаєте звичний за обʼємом обід, але отримуєте значно менше калорій. Так можна уникати постійного голоду і створювати природний дефіцит без жорстких заборон.';

export const CaloriesNextSteps = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Що робити з результатом
      </h2>
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <ol className="flex flex-col gap-2 list-decimal list-inside text-base lg:text-lg">
          {STEPS.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <aside className="mt-8 p-4 md:p-6 rounded-lg border-l-4 border-main bg-orange-50 dark:bg-transparent text-left">
          <p className="mb-3 text-lg font-bold text-neutral-800 dark:text-mainTitleBlack">
            Лайфхак тренера: як тримати дефіцит без голоду
          </p>
          <p className="text-base lg:text-lg text-neutral-700 dark:text-mainTextBlack">
            {LIFEHACK}
          </p>
        </aside>
        <p className="mt-6 text-base lg:text-lg">
          Якщо рахувати щодня не хочеться, застосунок Sytno складе меню під вашу ціль.{' '}
          <a
            href={SYTNO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-mainTitle dark:text-mainTitleBlack"
          >
            Спробувати Sytno
          </a>
        </p>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 3: Створити `components/calcs-page/CalcSources.tsx`**

```tsx
import type { CalcSource } from '@/const/calcSeo';

export const CalcSources = ({ sources }: { sources: CalcSource[] }) => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container pb-6 md:pb-8 mx-auto">
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-mainTitle dark:text-mainTitleBlack">
          Джерела
        </h2>
        <ol className="flex flex-col gap-2 list-decimal list-inside text-sm">
          {sources.map(source => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-mainTitle dark:text-mainTitleBlack"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 4: Підключити секції в `page.tsx`**

Додати імпорти після `import { CaloriesFormula } from '@/components/calcs-page/CaloriesFormula';`:

```tsx
import { CaloriesGymBurn } from '@/components/calcs-page/CaloriesGymBurn';
import { CaloriesNextSteps } from '@/components/calcs-page/CaloriesNextSteps';
import { CalcSources } from '@/components/calcs-page/CalcSources';
import { CALORIES_SOURCES } from '@/components/calcs-page/caloriesContent';
```

Замінити блок

```tsx
      <CaloriesDeficitTable />
      <CaloriesFaq />
      <CalcByline calcId="calories-calculator" />
```

на

```tsx
      <CaloriesDeficitTable />
      <CaloriesGymBurn />
      <CaloriesNextSteps />
      <CaloriesFaq />
      <CalcSources sources={CALORIES_SOURCES} />
      <CalcByline calcId="calories-calculator" />
```

- [ ] **Step 5: Перевірка в зібраній сторінці**

```bash
npx tsc --noEmit
npm run build 2>&1 | grep -E "Compiled|Failed|rror" | head -5
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
curl -s --retry 30 --retry-delay 1 --retry-connrefused -o /dev/null http://localhost:3100/calcs/calories-calculator
curl -s http://localhost:3100/calcs/calories-calculator | sed 's/<!-- -->//g' > .lighthouse/pr6-task5.html
for p in "Витрата калорій за годину тренування" "Досвід тренера Юрія Теслюка" "Лайфхак тренера" "Спробувати Sytno" "pubmed.ncbi.nlm.nih.gov/2305711" "Оновлено: 6 листопада 2026"; do printf '%s: ' "$p"; grep -o "$p" .lighthouse/pr6-task5.html | wc -l; done
sed 's/.*Витрата калорій за годину тренування//' .lighthouse/pr6-task5.html | grep -o '<td class="py-2 pr-4">[0-9]*</td>' | head -4
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: збірка успішна; кожен рядок ≥ 1 («pubmed…2305711» ≥ 2: список джерел і JSON-LD; «Спробувати Sytno» 1, бо CTA результату рендериться лише після введення даних); перші числові комірки після підпису таблиці витрати (таблиця норм стоїть вище, тому вивід обрізано до підпису) `210`, `280`, `360`, `480`.

- [ ] **Step 6: Commit**

```bash
git add components/calcs-page/CaloriesGymBurn.tsx components/calcs-page/CaloriesNextSteps.tsx components/calcs-page/CalcSources.tsx app/calcs/calories-calculator/page.tsx
git commit -m "feat(calories): gym burn table with trainer notes, next steps with Sytno, sources list"
```

---

### Task 6: фінальна перевірка і результати

**Files:**
- Modify: `docs/superpowers/plans/2026-11-06-calories-formula-content-pr6.md` (розділ «Результати PR 6»)

- [ ] **Step 1: Калькулятор не змінено**

```bash
git diff main --stat -- components/calcs-page/CaloriesCalcList.tsx components/calcs-page/CaloriesResult.tsx components/calcs-page/ButttonGroup.tsx components/calcs-page/CalcRating.tsx components/calcs-page/InputSkeleton.tsx lib/calories.ts app/calcs/calories-calculator/layout.tsx
```

Очікувано: порожній вивід.

- [ ] **Step 2: Тести, збірка, HTML, JSON-LD, Lighthouse**

```bash
npm test 2>&1 | tail -4
npm run build 2>&1 | grep -E "Compiled|Failed|rror" | head -5
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
curl -s --retry 30 --retry-delay 1 --retry-connrefused -o /dev/null http://localhost:3100/calcs/calories-calculator
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/pr6.html
node -e 'const h=require("fs").readFileSync(".lighthouse/pr6.html","utf8");const g=[...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).flatMap(d=>d["@graph"]||[d]);const app=g.find(x=>x["@type"]==="WebApplication");const faq=g.find(x=>x["@type"]==="FAQPage");console.log("citations",app.citation.length,"faq",faq.mainEntity.length,"modified",app.dateModified)'
curl -s http://localhost:3100/sitemap.xml | grep -A1 "/calcs" | grep -o "<lastmod>[^<]*" | sort | uniq -c
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npx --yes lighthouse@12 http://localhost:3100/calcs/calories-calculator --only-categories=performance,accessibility,seo --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --output=json --output-path=.lighthouse/pr6.json --quiet
node -e "const r=require('./.lighthouse/pr6.json');const c=r.categories;console.log('perf',Math.round(c.performance.score*100),'a11y',Math.round(c.accessibility.score*100),'seo',Math.round(c.seo.score*100));const f=Object.values(r.audits).filter(a=>a.score!==null&&a.score<1&&a.scoreDisplayMode==='binary').map(a=>a.id);console.log('failing:',f.join(', ')||'none')"
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: 85 тестів; збірка успішна; `citations 4 faq 11 modified 2026-11-06`; у sitemap одна дата `2026-11-06` (калорії) і три `2026-09-17` (хаб, ІМТ, жир); performance ≥ 90, accessibility 100, SEO 100, `failing: none`.

- [ ] **Step 3: Ручна перевірка в браузері** (`npm run dev`, робить контролер або користувач): калькулятор вгорі виглядає і працює як раніше (жінка, 30, 170, 65, помірна, мета «схуднути» → норма 2170, ціль 1850); нові секції в порядку з розділу 4 спеку; світла і темна тема; ширина 375 px: таблиці скролляться всередині блоку, сторінка без горизонтального скролу. Зупинити dev-сервер.

- [ ] **Step 4: Записати результати** — дописати в кінець цього файлу:

```markdown
## Результати PR 6

| Метрика | До (PR 5) | PR 6 |
|---|---|---|
| Performance (mobile, local) | 96 | … |
| Accessibility | 100 | … |
| SEO | 100 | … |
| Тестів | 73 | 85 |
| Слів на сторінці (видимий текст) | 1069 | … |

Після деплою: Rich Results Test, у Search Console «Перевірити URL» → «Запросити індексування».
Через 4–6 тижнів: чи є сторінка серед джерел AI Overview за «розрахунок калорій» і
«калькулятор калорій»; кліки сторінки за 28 днів (база 1040) і запит «розрахунок калорій»
(база 12 кліків, 291 показ).
```

Кількість слів: `node -e 'const h=require("fs").readFileSync(".lighthouse/pr6.html","utf8").replace(/<script[\s\S]*?<\/script>/g," ").replace(/<style[\s\S]*?<\/style>/g," ").replace(/<[^>]+>/g," ");console.log(h.split(/\s+/).filter(Boolean).length)'`.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-11-06-calories-formula-content-pr6.md
git commit -m "docs(plan): record PR 6 verification results"
```

Далі гілку завершує skill `superpowers:finishing-a-development-branch`.
