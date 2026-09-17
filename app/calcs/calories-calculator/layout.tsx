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
