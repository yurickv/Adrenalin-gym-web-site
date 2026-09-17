import { ImageResponse } from 'next/og';

export const alt =
  'Калькулятор відсотка жиру в організмі від тренажерного залу Адреналін: за обхватами і складками, норми для чоловіків і жінок';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Node.js-рантайм цього роуту в Next 14.2 не збирається на Windows: його
// фолбек-шрифт резолвиться через path.join на file://-URL, а path.join
// ламає цю схему на Windows (заміняє / на \). Проєкт розробляється на
// Windows, тому для робочих локальних білдів потрібен саме edge-рантайм.
// На Vercel роут кешується на CDN, тож рендеринг на льоту не додає витрат.
export const runtime = 'edge';

// Гліфи шрифту обмежені українським і латинським алфавітом, цифрами і базовою
// пунктуацією (див. Task 5 плану PR 1). Інші символи зрендеряться порожніми.
// Канонічна копія шрифту і його ліцензія лежать в assets/fonts/Inter-Bold.ttf
// та assets/fonts/OFL.txt; тут файл продубльований лише тому, що бандлеру
// роуту потрібен колокований асет — обидві копії мають лишатися побайтово
// ідентичними.
let fontPromise: Promise<ArrayBuffer> | null = null;

function loadFont(): Promise<ArrayBuffer> {
  if (!fontPromise) {
    fontPromise = fetch(new URL('./Inter-Bold.ttf', import.meta.url))
      .then(res => res.arrayBuffer())
      .catch(error => {
        fontPromise = null;
        console.error(
          'opengraph-image: не вдалося завантажити Inter-Bold.ttf',
          error
        );
        throw error;
      });
  }
  return fontPromise;
}

export default async function Image() {
  const fontData = await loadFont();

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
            Калькулятор відсотка жиру
          </div>
          <div style={{ fontSize: 36, color: '#D4D4D4' }}>
            за обхватами · за складками · норми для чоловіків і жінок
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
