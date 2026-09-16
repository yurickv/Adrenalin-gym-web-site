import { ImageResponse } from 'next/og';

export const alt =
  'Калькулятор калорій онлайн від тренажерного залу Адреналін: норма на день, дефіцит для схуднення, БЖВ';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Node.js runtime цього роуту падає при білді на Windows: скомпільований
// next/dist/compiled/@vercel/og/index.node.js резолвить свій вбудований
// фолбек-шрифт через path.join(import.meta.url, ...), а path.join ламає
// схему file:// на Windows (заміняє / на \). Edge runtime використовує
// інший бандл (index.edge.js) без цього виклику.
export const runtime = 'edge';

// Гліфи шрифту обмежені українським і латинським алфавітом, цифрами і базовою
// пунктуацією (див. Task 5 плану PR 1). Інші символи зрендеряться порожніми.
const interBold = fetch(
  new URL('./Inter-Bold.ttf', import.meta.url)
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
