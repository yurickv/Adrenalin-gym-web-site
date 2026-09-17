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
