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
