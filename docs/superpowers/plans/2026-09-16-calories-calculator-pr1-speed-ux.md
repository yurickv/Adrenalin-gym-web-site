# PR 1: швидкість і UX сторінки калькулятора калорій. План реалізації

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Зменшити LCP сторінки `/calcs/calories-calculator` на мобільному з 6,8 с до 2,5 с і показати форму калькулятора без прокрутки, не змінюючи інші калькулятори.

**Architecture:** Сторінка лишається статичною Next.js App Router сторінкою. Ми прибираємо все, що затримує перший кадр (hero-фото як LCP, Google Analytics у критичному шляху, мертвий `@import` шрифту), переставляємо блоки так, щоб форма йшла одразу за H1, замінюємо поп-ап контекстним CTA, додаємо og:image через `opengraph-image.tsx`, `metadataBase` і реальні дати в sitemap. Логіка sitemap виноситься в чистий модуль `lib/sitemap.ts` з unit-тестами (vitest), решта перевіряється збіркою, `curl` і Lighthouse.

**Tech Stack:** Next.js 14.2.35 (App Router), React 18, TypeScript 5.1 strict, Tailwind 3.3, `next/font/google`, `next/script`, `next/og` ImageResponse, vitest, Lighthouse 12 CLI, Chrome headless.

**Spec:** `docs/superpowers/specs/2026-09-16-calories-calculator-seo-design.md`, розділ 4.

**Гілка:** `feat/calories-calculator-seo` (уже створена від `main`).

## Global Constraints

- Домен сайту: `https://gym-adrenalin.com.ua`.
- Title template у кореневому layout: `'%s | Adrenalin Gym'`; default title: `'Тренажерний зал Адреналін у Тернополі'`.
- Три калькулятори, головна і пости блогу використовують `title: { absolute: ... }`.
- Колір hero на мобільному: `#2E2F42`; акцент: `#f97316`.
- Inter: `subsets: ['latin', 'cyrillic']`, `display: 'swap'`, `variable: '--font-inter'`.
- Google Analytics: вставляється клієнтом через 3 с після монтування або при першій взаємодії, URL `https://www.googletagmanager.com/gtag/js?id=${ga_id}`, без `ga_id` компонент нічого не робить.
- Sitemap: маршрути, що починаються з `/calcs`, отримують `CALC_DATE_MODIFIED`; решта статичних маршрутів `SITE_CONTENT_LASTMOD = '2026-08-29'`; пости `createdAt` у форматі `YYYY-MM-DD`; полів `changeFrequency` і `priority` немає.
- Посилання на Sytno завжди з UTM: `https://nutriday.com.ua/?utm_source=partner&utm_medium=referral&utm_campaign=gym-adrenalin`.
- Змінюється тільки макет сторінки калорій. Сторінки ІМТ і жиру отримують лише `title.absolute`.
- У робочому дереві є незакоммічена правка description у `app/calcs/calories-calculator/layout.tsx`. Її не відкочувати: вона потрапить у коміт Task 5, а PR 2 замінить description повністю.
- Середовище: Windows 11, Git Bash, Node 24, Chrome `C:/Program Files/Google/Chrome/Application/chrome.exe`. Production-сервер для перевірок піднімаємо на порту 3100, щоб не конфліктувати з `next dev` на 3000.
- Команди довші за кілька тисяч символів через Bash не передавати (обмеження Windows); великі файли писати інструментом Write.
- ESLint у репозиторії не встановлений і конфігурації немає (`npm run lint` не працює з 2023 року); у PR 1 лінт не запускаємо, це окрема задача.
- Chrome напряму (screenshot, dump-dom) запускати з прапорцями `--no-sandbox --do-not-de-elevate`, інакше в підвищеній оболочці він переспавнюється і не віддає результат.

## Структура файлів

| Файл | Дія | Відповідальність |
|---|---|---|
| `scripts/lh-summary.mjs` | створити | друк ключових метрик із JSON Lighthouse |
| `.gitignore` | змінити | ігнорувати `.lighthouse/` |
| `app/layout.tsx` | змінити | Inter із кирилицею і CSS-змінною; GA у body; `metadataBase` і title template |
| `app/globals.css` | змінити | прибрати `@import` Poppins і `font-family` у body |
| `tailwind.config.js` | змінити | `font-poppins` → Inter; фон `hero-photo` |
| `components/GoogleAnalytics.tsx` | змінити | клієнтський компонент: gtag через 3 с або при взаємодії, правильний URL |
| `components/Header.tsx` | змінити | прибрати дубльований `ToastContainer` |
| `const/index.ts` | змінити | `SYTNO_URL` |
| `components/calcs-page/ButttonGroup.tsx` | змінити | використовує `SYTNO_URL` |
| `components/calcs-page/CaloriesCalcFormula.tsx` | змінити | контекстний CTA після результату |
| `components/calcs-page/SurveyPopup.tsx` | видалити | поп-ап більше не потрібен |
| `app/calcs/layout.tsx` | видалити | існував лише заради поп-апу |
| `app/calcs/calories-calculator/page.tsx` | змінити | макет tool-first |
| `app/calcs/calories-calculator/layout.tsx` | змінити | `title.absolute`, `twitter.card` |
| `app/calcs/calories-calculator/opengraph-image.tsx` | створити | og:image 1200×630 |
| `assets/fonts/Inter-Bold.ttf`, `assets/fonts/OFL.txt` | створити | шрифт для og:image і ліцензія |
| `app/calcs/imt-calculator/layout.tsx`, `app/calcs/fat-calculator/layout.tsx` | змінити | `title.absolute` |
| `app/page.tsx` | змінити | `title.absolute` |
| `app/blog/[id]/page.tsx` | змінити | `title.absolute` |
| `const/routeSitemap.ts` | змінити | `SITE_CONTENT_LASTMOD` |
| `lib/sitemap.ts`, `lib/sitemap.test.ts` | створити | побудова записів sitemap і тести |
| `app/sitemap.ts` | змінити | делегує в `lib/sitemap.ts` |
| `vitest.config.mts`, `package.json` | створити / змінити | тестовий раннер |

---

### Task 0: базові вимірювання і допоміжний скрипт

**Files:**
- Create: `scripts/lh-summary.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `node scripts/lh-summary.mjs <path-to-lighthouse.json>` друкує performance, симульовані й спостережувані FCP/LCP, LCP-елемент і його фази, перші 12 мережевих запитів. Використовується в Task 0 і Task 7.

- [ ] **Step 1: Створити скрипт зведення Lighthouse**

Файл `scripts/lh-summary.mjs`:

```js
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/lh-summary.mjs <lighthouse.json>');
  process.exit(1);
}

const report = JSON.parse(readFileSync(file, 'utf8'));
const audits = report.audits;
const metrics = audits.metrics.details.items[0];
const ms = value => `${Math.round(value)} ms`;

console.log(`URL: ${report.finalDisplayedUrl}`);
console.log(`Performance: ${Math.round(report.categories.performance.score * 100)}`);
console.log(
  `Simulated: FCP ${ms(metrics.firstContentfulPaint)} | LCP ${ms(metrics.largestContentfulPaint)} | TBT ${ms(metrics.totalBlockingTime)} | CLS ${metrics.cumulativeLayoutShift.toFixed(3)}`
);
console.log(
  `Observed:  FCP ${ms(metrics.observedFirstContentfulPaint)} | LCP ${ms(metrics.observedLargestContentfulPaint)} | load ${ms(metrics.observedLoad)}`
);

const lcpAudit = audits['largest-contentful-paint-element'];
const lcpNode = lcpAudit?.details?.items?.[0]?.items?.[0]?.node;
console.log(`LCP element: ${lcpNode?.snippet?.slice(0, 160) ?? 'n/a'}`);
for (const phase of lcpAudit?.details?.items?.[1]?.items ?? []) {
  console.log(`  ${phase.phase}: ${ms(phase.timing)}`);
}

const requests = audits['network-requests']?.details?.items ?? [];
const start = requests[0]?.networkRequestTime ?? 0;
console.log('First 12 requests:');
for (const req of requests.slice(0, 12)) {
  const offset = String(Math.round(req.networkRequestTime - start)).padStart(5);
  console.log(
    `  ${offset} ms ${(req.resourceType ?? '').padEnd(10)} ${String(req.transferSize).padStart(7)} B ${req.url.slice(0, 90)}`
  );
}
```

- [ ] **Step 2: Додати `.lighthouse/` до `.gitignore` і створити папку**

```bash
grep -qx '.lighthouse/' .gitignore || printf '\n# local Lighthouse reports\n.lighthouse/\n' >> .gitignore
mkdir -p .lighthouse
```

- [ ] **Step 3: Зібрати поточний стан і підняти production-сервер**

```bash
npm run build 2>&1 | tail -25
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/calcs/calories-calculator
```

Очікувано: у виводі build є рядок `○ /calcs/calories-calculator` без помилок; `curl` друкує `200`.

- [ ] **Step 4: Зняти базовий Lighthouse і зберегти зведення**

```bash
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npx --yes lighthouse@12 http://localhost:3100/calcs/calories-calculator --only-categories=performance --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --output=json --output-path=.lighthouse/before.json --quiet
node scripts/lh-summary.mjs .lighthouse/before.json | tee .lighthouse/before.txt
```

Очікувано: `Performance` близько 70-75, `LCP element` містить `<img alt="Калькулятор калорій`, фаза `Render Delay` понад 3000 ms.

- [ ] **Step 5: Зупинити сервер**

```bash
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lh-summary.mjs .gitignore
git commit -m "chore(perf): add Lighthouse summary script and ignore local reports"
```

---

### Task 1: шрифти. Inter із кирилицею, без мертвого `@import` Poppins

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css:1-24`
- Modify: `tailwind.config.js:75-77`

**Interfaces:**
- Produces: CSS-змінна `--font-inter` на `<html>`; клас `font-poppins` рендерить Inter.

- [ ] **Step 1: Оновити підключення Inter у `app/layout.tsx`**

Замінити верх файлу і тег `<html>`:

```tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={inter.variable}>
      <head>
        <GoogleAnalytics ga_id={process.env.GTM_ID} />
        <LocalBusinessSchema />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col">
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
```

Рядки `import dynamic from 'next/dynamic';` і закоментований `const Footer = dynamic(...)` видалити.

- [ ] **Step 2: Прибрати Poppins із `app/globals.css`**

Видалити рядок:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
```

і замінити правило `body`:

```css
body {
  color: #737373;
}
```

(було `color: #737373; font-family: 'Poppins';`).

- [ ] **Step 3: Перемапити `font-poppins` на Inter у `tailwind.config.js`**

```js
      fontFamily: {
        poppins: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
```

- [ ] **Step 4: Зібрати і перевірити підключення шрифтів**

```bash
npm run build 2>&1 | tail -5
grep -c "fonts.googleapis" .next/static/css/*.css
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
grep -oE '<html[^>]*>' .lighthouse/page.html
grep -oE 'rel="preload" href="/_next/static/media/[^"]+woff2"' .lighthouse/page.html | wc -l
grep -c "Poppins" .lighthouse/page.html
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `grep -c fonts.googleapis` друкує `0` для кожного CSS; тег `<html lang="uk" class="__variable_...">`; кількість preload woff2 дорівнює `2`; `Poppins` у HTML `0`.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css tailwind.config.js
git commit -m "perf(fonts): preload cyrillic Inter and drop ignored Poppins import"
```

---

### Task 2: Google Analytics після першого кадру

**Files:**
- Modify: `components/GoogleAnalytics.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/Header.tsx:8` і кінець компонента

**Interfaces:**
- Consumes: `process.env.GTM_ID`.
- Produces: клієнтський компонент `GoogleAnalytics({ ga_id })`, який нічого не рендерить і вставляє gtag через `GA_DELAY_MS = 3000` мс після монтування або при першій взаємодії користувача, що настане раніше.

Чому не `next/script` зі `strategy="lazyOnload"`: вимірювання на проді показали, що перший кадр малюється лише після виконання останнього скрипта (спостережуваний FCP 1,3-2,4 с при `load` 0,75-0,87 с). `lazyOnload` вставляє gtag одразу після `load`, тобто все одно до першого кадру, і Lighthouse далі рахує 285 KB GA у залежностях LCP. Затримка 3 с або перша взаємодія гарантовано виносить GA за межі першого кадру.

- [ ] **Step 1: Переписати `components/GoogleAnalytics.tsx`**

```tsx
'use client';

import { useEffect } from 'react';

export const GA_DELAY_MS = 3000;

const INTERACTION_EVENTS = [
  'pointerdown',
  'keydown',
  'scroll',
  'touchstart',
] as const;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function injectGtag(gaId: string) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag очікує саме обʼєкт arguments, як в офіційному сніпеті Google
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId);

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);
}

const GoogleAnalytics = ({ ga_id }: { ga_id?: string }) => {
  useEffect(() => {
    if (!ga_id) return;

    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      cleanup();
      injectGtag(ga_id);
    };
    const timer = window.setTimeout(load, GA_DELAY_MS);
    INTERACTION_EVENTS.forEach(event =>
      window.addEventListener(event, load, { once: true, passive: true })
    );

    function cleanup() {
      window.clearTimeout(timer);
      INTERACTION_EVENTS.forEach(event =>
        window.removeEventListener(event, load)
      );
    }

    return cleanup;
  }, [ga_id]);

  return null;
};

export default GoogleAnalytics;
```

- [ ] **Step 2: Перенести компонент із `<head>` у `<body>` в `app/layout.tsx`**

```tsx
    <html lang="uk" className={inter.variable}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col">
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </div>
        <GoogleAnalytics ga_id={process.env.GTM_ID} />
      </body>
    </html>
```

- [ ] **Step 3: Прибрати дубльований `ToastContainer` із `components/Header.tsx`**

Видалити рядок імпорту:

```tsx
import { ToastContainer } from 'react-toastify';
```

і рядок перед закриттям `</header>`:

```tsx
      <ToastContainer />
```

Кінець компонента має виглядати так:

```tsx
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 4: Зібрати і перевірити HTML та момент вставки gtag**

```bash
npm run build 2>&1 | tail -5
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
grep -c "googletagmanager" .lighthouse/page.html
grep -o 'class="Toastify"' .lighthouse/page.html | wc -l
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-sandbox --do-not-de-elevate --virtual-time-budget=1500 --dump-dom http://localhost:3100/calcs/calories-calculator 2>/dev/null | grep -c "googletagmanager.com/gtag/js?id="
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-sandbox --do-not-de-elevate --virtual-time-budget=8000 --dump-dom http://localhost:3100/calcs/calories-calculator 2>/dev/null | grep -c "googletagmanager.com/gtag/js?id="
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: у серверному HTML `googletagmanager` `0` і `class="Toastify"` рівно `1`; DOM після 1,5 с віртуального часу без gtag (`0`), після 8 с з одним тегом gtag (`1`). Перевірка потребує `GTM_ID` у `.env` (він там є, GA вантажився у Task 0).

- [ ] **Step 5: Commit**

```bash
git add components/GoogleAnalytics.tsx app/layout.tsx components/Header.tsx
git commit -m "perf(analytics): inject gtag after 3 s or first interaction, fix script url, single ToastContainer"
```

---

### Task 3: поп-ап стає контекстним CTA після результату

**Files:**
- Modify: `const/index.ts`
- Modify: `components/calcs-page/ButttonGroup.tsx`
- Modify: `components/calcs-page/CaloriesCalcFormula.tsx`
- Delete: `components/calcs-page/SurveyPopup.tsx`
- Delete: `app/calcs/layout.tsx`

**Interfaces:**
- Produces: `SYTNO_URL` у `const/index.ts` (рядок з UTM). Task 4 і PR 2 використовують його.

- [ ] **Step 1: Додати константу в `const/index.ts`**

Дописати в кінець файлу:

```ts
export const SYTNO_URL =
  'https://nutriday.com.ua/?utm_source=partner&utm_medium=referral&utm_campaign=gym-adrenalin';
```

- [ ] **Step 2: Використати константу в `components/calcs-page/ButttonGroup.tsx`**

```tsx
import { Button } from '../Button';
import { ButtonSecond } from '../ButtonSecond';
import { SYTNO_URL } from '@/const';

export const ButtonGroup = () => {
  return (
    <>
      <p className="mt-12 text-mainText dark:text-mainTextBlack">
        Дізнайся більше про здорове харчування
      </p>
      <ButtonSecond
        route="/learn/nutrition/basics"
        text="Все про харчування"
        width="mx-auto mt-4 w-full md:w-[284px]"
      />
      <p className="mt-12 text-mainText dark:text-mainTextBlack">
        Дізнайся про легкий сервіс складання денних меню
      </p>
      <Button
        route={SYTNO_URL}
        text="Склади своє меню"
        width="mx-auto mt-4 w-full md:w-[284px]"
      />
    </>
  );
};
```

- [ ] **Step 3: Додати CTA в `components/calcs-page/CaloriesCalcFormula.tsx`**

```tsx
import { SYTNO_URL } from '@/const';

interface CaloriesProps {
  weight: string;
  height: string;
  age: string;
  sex: boolean;
  activity: number;
}

export const CaloriesCalcFormula = ({
  age,
  sex,
  weight,
  height,
  activity,
}: CaloriesProps) => {
  let param = weight && height;
  let basis = 0;

  if (param && age) {
    if (sex) {
      basis = Math.round(
        (10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5) *
          activity
      );
    } else {
      basis = Math.round(
        (10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161) *
          activity
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <p className="font-bold text-lg text-mainTitle dark:text-mainTitleBlack">
          Денна потреба калорій:
        </p>
        <p className="rounded-xl p-2 text-main font-bold text-lg bg-[#D9D9D9] inline-block w-20 ">
          {basis}
        </p>
      </div>
      {basis > 0 && (
        <p
          aria-live="polite"
          className="text-sm text-left text-mainText dark:text-mainTextBlack"
        >
          Під вашу норму {basis} ккал застосунок Sytno складе меню на день.{' '}
          <a
            href={SYTNO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-mainTitle dark:text-mainTitleBlack"
          >
            Спробувати Sytno
          </a>
        </p>
      )}
    </div>
  );
};
```

- [ ] **Step 4: Видалити поп-ап і layout**

```bash
git rm -q components/calcs-page/SurveyPopup.tsx app/calcs/layout.tsx
grep -rn "SurveyPopup" app components; echo "grep exit: $?"
```

Очікувано: `grep` нічого не знаходить, `grep exit: 1`.

- [ ] **Step 5: Зібрати і перевірити**

```bash
npm run build 2>&1 | tail -5
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
grep -c "Хочете легко" .lighthouse/page.html
grep -o "utm_campaign=gym-adrenalin" .lighthouse/page.html | wc -l
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `Хочете легко` `0`; UTM-посилання в HTML `1` (кнопка в `ButtonGroup`; CTA в результаті зʼявляється лише після введення даних).

- [ ] **Step 6: Ручна перевірка CTA**

```bash
npm run dev
```

Відкрити `http://localhost:3000/calcs/calories-calculator`, ввести вік 30, зріст 170, вагу 65. Очікувано: під числом результату зʼявляється рядок "Під вашу норму ... ккал застосунок Sytno складе меню на день. Спробувати Sytno", поп-ап через 15 секунд не зʼявляється. Зупинити dev-сервер.

- [ ] **Step 7: Commit**

```bash
git add const/index.ts components/calcs-page/ButttonGroup.tsx components/calcs-page/CaloriesCalcFormula.tsx
git commit -m "feat(calcs): replace timed popup with contextual Sytno CTA after result"
```

---

### Task 4: макет tool-first сторінки калорій

**Files:**
- Modify: `tailwind.config.js` (блок `backgroundImage`)
- Modify: `app/calcs/calories-calculator/page.tsx` (повна заміна)

**Interfaces:**
- Consumes: `CaloriesCalcList`, `ButtonGroup`, `CalcTitle`, `CaloriesDescription`, `CaloriesFaq`, `CalcByline`, `CaloriesJsonLd` без змін.
- Produces: порядок DOM: nav → h1 → підводка → форма → опис (з H2) → вкладки → FAQ → байлайн → JSON-LD.

- [ ] **Step 1: Додати фон із фото для десктопа в `tailwind.config.js`**

У `theme.extend.backgroundImage` додати рядок після `'hero-bg'`:

```js
        'hero-photo':
          "linear-gradient(to right, rgba(46, 47, 66, 0.5), rgba(46, 47, 66, 0.5)), url('/bg-hero.webp')",
```

- [ ] **Step 2: Переписати `app/calcs/calories-calculator/page.tsx`**

```tsx
import { ButtonGroup } from '@/components/calcs-page/ButttonGroup';
import { CalcTitle } from '@/components/calcs-page/CalcsTitle';
import { CaloriesCalcList } from '@/components/calcs-page/CaloriesCalcList';
import { CaloriesDescription } from '@/components/calcs-page/CaloriesDescription';
import { CaloriesFaq } from '@/components/calcs-page/CaloriesFaq';
import { CaloriesJsonLd } from '@/components/calcs-page/CaloriesJsonLd';
import { CalcByline } from '@/components/calcs-page/CalcByline';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Link from 'next/link';

const CaloriesCalc = () => {
  return (
    <main>
      <section className="bg-[#2E2F42] md:bg-hero-photo bg-cover bg-center">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <nav
            aria-label="Хлібні крихти"
            className="text-left text-mainTitleBlack"
          >
            <ol className="flex gap-2 items-center">
              <li>
                <Link href="/" className="flex gap-2 items-center">
                  <HomeIcon />
                  <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/calcs"
                  className="flex gap-2 items-center font-semibold"
                >
                  <span className="sr-only md:not-sr-only">
                    &gt; Калькулятори
                  </span>
                </Link>
              </li>
              <li>
                <span className="font-semibold"> &gt; Потреба калорій</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Калькулятор калорій для схуднення та набору ваги
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Введіть дані і отримайте денну норму калорій за 10 секунд
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
              <p className="text-sm mb-4 text-mainText dark:text-mainTextBlack">
                Переміщуйте повзунок або введіть значення вручну
              </p>
              <CaloriesCalcList />
              <ButtonGroup />
            </div>

            <div className="basis-1/2 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-mainTitle dark:text-mainTitleBlack">
                Розрахунок денної норми калорій онлайн
              </h2>
              <p className="mt-4 text-base md:text-lg text-mainText dark:text-mainTextBlack">
                Калькулятор калорій розраховує денну норму калорій за формулою
                Міффліна-Сан Жеора з урахуванням статі, віку, зросту, ваги та
                рівня активності. Щоб схуднути, створюють дефіцит 10–15%, щоб
                набрати вагу — профіцит 10–15% від норми.
              </p>
              <CaloriesDescription />
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <p className="text-sm uppercase tracking-wide mb-4 text-mainText dark:text-mainTextBlack">
              Інші калькулятори
            </p>
            <CalcTitle page={2} />
          </div>
        </div>
      </section>

      <CaloriesFaq />
      <CalcByline />
      <CaloriesJsonLd />
    </main>
  );
};

export default CaloriesCalc;
```

- [ ] **Step 3: Зібрати, перевірити порядок DOM і зробити скріншоти**

```bash
npm run build 2>&1 | tail -5
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
for pat in '<h1' '<form' 'Розрахунок денної норми' 'Індекс маси тіла' 'Часті питання'; do printf "%8s  %s\n" "$(grep -b -o -m1 "$pat" .lighthouse/page.html | head -1 | cut -d: -f1)" "$pat"; done
grep -c 'data-nimg="fill"' .lighthouse/page.html
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-sandbox --do-not-de-elevate --hide-scrollbars --window-size=412,915 --screenshot="$PWD/.lighthouse/shot-412.png" http://localhost:3100/calcs/calories-calculator
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-sandbox --do-not-de-elevate --hide-scrollbars --window-size=360,640 --screenshot="$PWD/.lighthouse/shot-360.png" http://localhost:3100/calcs/calories-calculator
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-sandbox --do-not-de-elevate --hide-scrollbars --window-size=1366,900 --screenshot="$PWD/.lighthouse/shot-1366.png" http://localhost:3100/calcs/calories-calculator
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: зсуви зростають у порядку `<h1` < `<form` < `Розрахунок денної норми` < `Індекс маси тіла` < `Часті питання`; `data-nimg="fill"` дорівнює `0` (hero-фото як `<img>` зникло). Переглянути три PNG інструментом Read: на 412×915 і 360×640 видно H1, підводку і початок картки з полем "Стать"; на 1366 hero з фото, форма ліворуч, опис праворуч.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js app/calcs/calories-calculator/page.tsx
git commit -m "feat(calories): tool-first layout, hero photo only from md breakpoint"
```

---

### Task 5: metadataBase, title template, og:image

**Files:**
- Create: `assets/fonts/Inter-Bold.ttf`, `assets/fonts/OFL.txt`
- Create: `app/calcs/calories-calculator/opengraph-image.tsx`
- Modify: `app/layout.tsx` (додати `metadata`)
- Modify: `app/calcs/calories-calculator/layout.tsx`
- Modify: `app/calcs/imt-calculator/layout.tsx`, `app/calcs/fat-calculator/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/blog/[id]/page.tsx`

**Interfaces:**
- Produces: кореневий `metadata` з `metadataBase` і `title.template`; og:image за адресою `/calcs/calories-calculator/opengraph-image`.

- [ ] **Step 1: Завантажити шрифт для og:image**

Google Fonts із UA старого Firefox віддає TrueType, параметр `text` обмежує набір гліфів українським і латинським алфавітом, цифрами і пунктуацією:

```bash
mkdir -p assets/fonts
UA="Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"
TEXT=$(node -e "process.stdout.write(encodeURIComponent('АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюяABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;!?%()-–·/'))")
CSS=$(curl -sS -A "$UA" "https://fonts.googleapis.com/css2?family=Inter:wght@700&text=$TEXT")
FONT_URL=$(echo "$CSS" | grep -oE "https://fonts.gstatic.com/[^)]+" | head -1)
echo "font url: $FONT_URL"
curl -sS -o assets/fonts/Inter-Bold.ttf "$FONT_URL"
curl -sS -o assets/fonts/OFL.txt https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt
node -e "const b=require('fs').readFileSync('assets/fonts/Inter-Bold.ttf');console.log(b.length,'bytes, tag',b.subarray(0,4).toString('hex'))"
head -3 assets/fonts/OFL.txt
```

Очікувано: `font url` починається з `https://fonts.gstatic.com/`; розмір 15-80 тисяч байтів, tag `00010000`; у `OFL.txt` є рядки ліцензії SIL Open Font License.

- [ ] **Step 2: Створити `app/calcs/calories-calculator/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const alt =
  'Калькулятор калорій онлайн від тренажерного залу Адреналін: норма на день, дефіцит для схуднення, БЖВ';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Гліфи шрифту обмежені українським і латинським алфавітом, цифрами і базовою
// пунктуацією (див. Task 5 плану PR 1). Інші символи зрендеряться порожніми.
const interBold = fetch(
  new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)
).then(res => res.arrayBuffer());

export default async function Image() {
  const fontData = await interBold;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#2E2F42',
          color: '#FAFAFA',
          fontFamily: 'Inter',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 30,
            color: '#F97316',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: '#F97316',
              display: 'flex',
            }}
          />
          <span>Adrenalin Gym</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 76, lineHeight: 1.1 }}>
            Калькулятор калорій онлайн
          </div>
          <div style={{ fontSize: 36, color: '#D4D4D4' }}>
            Норма на день · дефіцит для схуднення · БЖВ
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 28,
            color: '#D4D4D4',
          }}
        >
          <span>Безкоштовно, без реєстрації</span>
          <span>gym-adrenalin.com.ua</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Inter', data: fontData, style: 'normal', weight: 700 }],
    }
  );
}
```

- [ ] **Step 3: Додати кореневий `metadata` в `app/layout.tsx`**

Додати імпорт типу і експорт перед `RootLayout`:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://gym-adrenalin.com.ua'),
  title: {
    default: 'Тренажерний зал Адреналін у Тернополі',
    template: '%s | Adrenalin Gym',
  },
};
```

- [ ] **Step 4: Абсолютні title там, де суфікс обрізав би заголовок**

`app/calcs/calories-calculator/layout.tsx`, поле `title` і новий блок `twitter` (description не чіпати):

```tsx
export const metadata: Metadata = {
  title: {
    absolute: 'Калькулятор калорій для схуднення та набору ваги онлайн',
  },
  twitter: {
    card: 'summary_large_image',
  },
  description:
```

(решта обʼєкта без змін.)

`app/calcs/imt-calculator/layout.tsx`:

```tsx
  title: {
    absolute: 'Калькулятор індексу маси тіла (ІМТ) онлайн — розрахунок ваги',
  },
```

`app/calcs/fat-calculator/layout.tsx`:

```tsx
  title: {
    absolute: 'Калькулятор відсотка жиру в організмі для чоловіків та жінок',
  },
```

`app/page.tsx`:

```tsx
  title: { absolute: 'Спортзал в Тернополі Адреналін' },
```

`app/blog/[id]/page.tsx`, у `generateMetadata`:

```tsx
    title: { absolute: post.title },
```

- [ ] **Step 5: Зібрати і перевірити мета-теги та картинку**

```bash
npm run build 2>&1 | tail -8
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/calcs/calories-calculator > .lighthouse/page.html
grep -oE '<title>[^<]*</title>' .lighthouse/page.html
grep -oE '<meta (property|name)="(og:image[a-z:]*|twitter:card|twitter:image)" content="[^"]*"' .lighthouse/page.html
curl -s http://localhost:3100/blog | grep -oE '<title>[^<]*</title>'
curl -s http://localhost:3100/ | grep -oE '<title>[^<]*</title>'
curl -s -o .lighthouse/og.png -w "%{http_code} %{content_type} %{size_download}\n" http://localhost:3100/calcs/calories-calculator/opengraph-image
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано:
- title калорій: `Калькулятор калорій для схуднення та набору ваги онлайн` без суфікса;
- `og:image` = `https://gym-adrenalin.com.ua/calcs/calories-calculator/opengraph-image?...`, `og:image:width` 1200, `og:image:height` 630, `og:image:alt` присутній, `twitter:card` = `summary_large_image`, `twitter:image` присутній;
- `/blog`: `Блог, корисні статті | Adrenalin Gym`; `/`: `Спортзал в Тернополі Адреналін`;
- картинка: `200 image/png` і розмір понад 20000 байтів. Відкрити `.lighthouse/og.png` інструментом Read і переконатися, що кирилиця відрендерена, а не порожні прямокутники.

Якщо `npm run build` падає з `Module not found` на URL шрифту, скопіювати файл поруч із маршрутом (`cp assets/fonts/Inter-Bold.ttf app/calcs/calories-calculator/Inter-Bold.ttf`) і замінити шлях у `opengraph-image.tsx` на `new URL('./Inter-Bold.ttf', import.meta.url)`; це варіант з офіційної документації Next.

- [ ] **Step 6: Commit**

```bash
git add assets/fonts/Inter-Bold.ttf assets/fonts/OFL.txt app/calcs/calories-calculator/opengraph-image.tsx app/layout.tsx app/calcs/calories-calculator/layout.tsx app/calcs/imt-calculator/layout.tsx app/calcs/fat-calculator/layout.tsx app/page.tsx "app/blog/[id]/page.tsx"
git commit -m "seo(calories): og image, twitter card, metadataBase and brand title template"
```

---

### Task 6: sitemap із реальними датами, vitest

**Files:**
- Modify: `package.json` (`scripts.test`, devDependency `vitest`)
- Create: `vitest.config.mts`
- Modify: `const/routeSitemap.ts`
- Create: `lib/sitemap.ts`
- Create: `lib/sitemap.test.ts`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `CALC_DATE_MODIFIED` з `const/calcSeo.ts`; `postHttpService.getPosts({ limit })` повертає `{ posts: Array<{ id: string; createdAt?: string }> }`.
- Produces: `SITE_CONTENT_LASTMOD` у `const/routeSitemap.ts`; `lastModifiedForRoute(route: string): string` і `buildSitemap(posts: SitemapPost[]): MetadataRoute.Sitemap` у `lib/sitemap.ts`; команда `npm test`.

- [ ] **Step 1: Встановити vitest і додати скрипт**

```bash
npm install --save-dev vitest
node -e "const p=require('./package.json');p.scripts.test='vitest run';require('fs').writeFileSync('package.json',JSON.stringify(p,null,2)+'\n')"
grep -n '"test"' package.json
```

Очікувано: рядок `"test": "vitest run"` у `scripts`.

- [ ] **Step 2: Створити `vitest.config.mts`**

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: { '@': root },
  },
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: Додати константу дати в `const/routeSitemap.ts`**

Дописати на початок файлу:

```ts
// Дата останнього змістовного коміту статичних сторінок. Оновлювати вручну,
// коли змінюється текст сторінок поза /calcs.
export const SITE_CONTENT_LASTMOD = '2026-08-29';
```

- [ ] **Step 4: Написати тести `lib/sitemap.test.ts` (спочатку падають)**

```ts
import { describe, it, expect } from 'vitest';
import { buildSitemap, lastModifiedForRoute, SITE_URL } from './sitemap';
import { CALC_DATE_MODIFIED } from '@/const/calcSeo';
import { SITE_CONTENT_LASTMOD, routeSitemap } from '@/const/routeSitemap';

describe('lastModifiedForRoute', () => {
  it('uses the calculators date for /calcs routes', () => {
    expect(lastModifiedForRoute('/calcs')).toBe(CALC_DATE_MODIFIED);
    expect(lastModifiedForRoute('/calcs/calories-calculator')).toBe(
      CALC_DATE_MODIFIED
    );
  });

  it('uses the site content date for every other route', () => {
    expect(lastModifiedForRoute('')).toBe(SITE_CONTENT_LASTMOD);
    expect(lastModifiedForRoute('/learn/intro')).toBe(SITE_CONTENT_LASTMOD);
  });
});

describe('buildSitemap', () => {
  it('lists every static route with an absolute url and lastModified', () => {
    const entries = buildSitemap([]);

    expect(entries).toHaveLength(routeSitemap.length);
    expect(entries[0]).toEqual({
      url: SITE_URL,
      lastModified: SITE_CONTENT_LASTMOD,
    });
    expect(
      entries.find(entry => entry.url === `${SITE_URL}/calcs/calories-calculator`)
    ).toEqual({
      url: `${SITE_URL}/calcs/calories-calculator`,
      lastModified: CALC_DATE_MODIFIED,
    });
  });

  it('adds blog posts after static routes with createdAt as a date', () => {
    const entries = buildSitemap([
      { id: 'veteran-sport', createdAt: '2026-05-01T10:20:30.000Z' },
    ]);

    expect(entries.at(-1)).toEqual({
      url: `${SITE_URL}/blog/veteran-sport`,
      lastModified: '2026-05-01',
    });
  });

  it('omits lastModified for posts without createdAt', () => {
    const entries = buildSitemap([{ id: 'old-post' }]);

    expect(entries.at(-1)).toEqual({ url: `${SITE_URL}/blog/old-post` });
  });

  it('never emits changeFrequency or priority', () => {
    const entries = buildSitemap([
      { id: 'x', createdAt: '2026-01-01T00:00:00.000Z' },
    ]);

    for (const entry of entries) {
      expect(entry).not.toHaveProperty('changeFrequency');
      expect(entry).not.toHaveProperty('priority');
    }
  });
});
```

- [ ] **Step 5: Запустити тести і переконатися, що вони падають**

```bash
npm test 2>&1 | tail -15
```

Очікувано: `FAIL lib/sitemap.test.ts` з помилкою на кшталт `Failed to resolve import "./sitemap"`.

- [ ] **Step 6: Реалізувати `lib/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { CALC_DATE_MODIFIED } from '@/const/calcSeo';
import { routeSitemap, SITE_CONTENT_LASTMOD } from '@/const/routeSitemap';

export const SITE_URL = 'https://gym-adrenalin.com.ua';

export type SitemapPost = {
  id: string;
  createdAt?: string;
};

export function lastModifiedForRoute(route: string): string {
  return route.startsWith('/calcs') ? CALC_DATE_MODIFIED : SITE_CONTENT_LASTMOD;
}

export function buildSitemap(posts: SitemapPost[]): MetadataRoute.Sitemap {
  const staticEntries = routeSitemap.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: lastModifiedForRoute(route),
  }));

  const postEntries = posts.map(post => ({
    url: `${SITE_URL}/blog/${post.id}`,
    ...(post.createdAt ? { lastModified: post.createdAt.slice(0, 10) } : {}),
  }));

  return [...staticEntries, ...postEntries];
}
```

- [ ] **Step 7: Запустити тести, переконатися, що проходять**

```bash
npm test 2>&1 | tail -15
```

Очікувано: `Test Files  1 passed`, `Tests  6 passed`.

- [ ] **Step 8: Переписати `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import postHttpService from '@/app/_services/post.service';
import { buildSitemap } from '@/lib/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await postHttpService.getPosts({ limit: 100 });
  return buildSitemap(posts ?? []);
}
```

- [ ] **Step 9: Зібрати і перевірити XML**

```bash
npm run build 2>&1 | tail -5
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
curl -s http://localhost:3100/sitemap.xml > .lighthouse/sitemap.xml
grep -c "<changefreq>" .lighthouse/sitemap.xml
grep -c "<priority>" .lighthouse/sitemap.xml
grep -A1 "calories-calculator</loc>" .lighthouse/sitemap.xml
grep -A1 "learn/intro</loc>" .lighthouse/sitemap.xml
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `changefreq` і `priority` по `0`; після `calories-calculator</loc>` рядок `<lastmod>2026-07-05</lastmod>`; після `learn/intro</loc>` рядок `<lastmod>2026-08-29</lastmod>`. Локально пости відсутні, бо API недоступний; це нормально.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vitest.config.mts const/routeSitemap.ts lib/sitemap.ts lib/sitemap.test.ts app/sitemap.ts
git commit -m "seo(sitemap): real lastmod dates, drop changefreq and priority, add vitest"
```

---

### Task 7: фінальна перевірка PR 1

**Files:**
- Modify: `docs/superpowers/plans/2026-09-16-calories-calculator-pr1-speed-ux.md` (розділ "Результати")

- [ ] **Step 1: Повний прогін збірки, лінтера і тестів**

```bash
npm test 2>&1 | tail -5
npm run build 2>&1 | tail -30
```

Очікувано: `6 passed`, у списку маршрутів `○ /calcs/calories-calculator` і `○ /calcs/calories-calculator/opengraph-image`.

- [ ] **Step 2: Lighthouse після змін**

```bash
npx next start -p 3100 > .lighthouse/server.log 2>&1 &
sleep 8
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npx --yes lighthouse@12 http://localhost:3100/calcs/calories-calculator --only-categories=performance --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --output=json --output-path=.lighthouse/after.json --quiet
node scripts/lh-summary.mjs .lighthouse/after.json | tee .lighthouse/after.txt
echo "----- before -----"; cat .lighthouse/before.txt
PID=$(netstat -ano | grep ':3100 ' | grep LISTENING | awk '{print $5}' | head -1); [ -n "$PID" ] && taskkill //PID "$PID" //F
```

Очікувано: `LCP element` це `<h1` або текстовий блок, а не `<img`; симульований LCP менший за базовий щонайменше на 2000 ms; у перших 12 запитах немає `googletagmanager`; серед шрифтів два `woff2` із preload.

Якщо LCP лишається понад 3000 ms, записати фази LCP у розділ "Результати" і продовжити: наступний кандидат на скорочення це JS Header (headlessui, toastify), він поза scope PR 1.

- [ ] **Step 3: Записати результати в план**

Дописати в кінець цього файлу розділ:

```markdown
## Результати PR 1

| Метрика | До | Після |
|---|---|---|
| Performance (mobile, local) | ... | ... |
| LCP simulated | ... | ... |
| LCP element | img hero | ... |
| Observed FCP / LCP | ... | ... |

Скріншоти: `.lighthouse/shot-412.png`, `.lighthouse/shot-360.png`, `.lighthouse/shot-1366.png` (локально, не в git).
```

Заповнити значеннями з `.lighthouse/before.txt` і `.lighthouse/after.txt`.

- [ ] **Step 4: Commit і підготовка до PR**

```bash
git add docs/superpowers/plans/2026-09-16-calories-calculator-pr1-speed-ux.md
git commit -m "docs(plan): record PR 1 verification results"
git log --oneline main..HEAD
```

Далі гілку завершує skill `superpowers:finishing-a-development-branch`. Після деплою на Vercel: PageSpeed Insights для `https://gym-adrenalin.com.ua/calcs/calories-calculator`, Rich Results Test, у Search Console "Перевірка URL" → "Запросити індексування".
