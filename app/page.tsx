import type { Metadata } from 'next';
import { AboutCalc } from '@/components/main-page/AboutCalc';
import { BlogSection } from '@/components/main-page/BlogSection';
import { GalerySection } from '@/components/main-page/GalerySection';
import { HeroSection } from '@/components/main-page/HeroSection';
import { Motivation } from '@/components/main-page/MotivationSection';
import { ServicesSection } from '@/components/main-page/ServicesSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <AboutCalc />
      <BlogSection />
      <Motivation />
      <GalerySection />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Спортзал в Тернополі Адреналін',
  description:
    'Просторий тренажерний зал Адреналін в м.Тернопіль, зручно для жителів мікрорайонів БАМ, Тинда, Варшавський, без черг. Cилові та кардіо тренажери, персональний тренер (тренування, харчування, всебічна підтримка), система знижок на абонементи. Спортзал',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      'max-snippet': -1,
    },
  },
  keywords: [
    'спортивний клуб',
    'абонемент в спортзал',
    'абонемент в спортзал ціна тернопіль',
    'абонемент в спортзал тернопіль ціни',
    'спортзал',
    'спортзал Тернопіль',
    'спортзали Тернопіль',
    'спорт зал Тернопіль',
    'спортзал БАМ',
    'найкращий тренажерний зал Тернополя',
    'затишний тренажерний зал',
    'спортзал без черг',
    'тренування без черг',
    'зал тернопіль',
    'тренажерний зал',
    'тренажерний зал тернопіль',
    'тренажерні зали тернопіль',
    'персональний тренер',
    'персональні тренування',
    'тренер Тернопіль',
    'спортзал для підлітків',
    'адреналін тернопіль',
    'силові тренування',
    'силові тренування для жінок',
    'силові тренування для підлітків',
    'силові тренування для чоловіків',
    'кардіо тренування',
    'заняття спортом',
    'тренування для схуднення',
    'тренування в спортзалі для схуднення',
    'тренування для набору маси',
    'тренування в спортзалі для набору маси',
    'тренування для накачки м`язів',
    'накачати м`язи',
    'накачати біцепс',
    'доступний тренажерний зал',
    'доступний спортзал',
    'програма тренувань для схуднення в спортзалі',
    'програма тренувань для набору маси',
  ],
  openGraph: {
    title: 'Тренажерний зал Адреналін — БАМ, Тернопіль',
    description:
      'Просторий спортзал без черг. Силові та кардіо тренажери, персональний тренер, програми для схуднення та набору маси.',
    url: 'https://gym-adrenalin.com.ua',
    siteName: 'Адреналін Gym',
    images: [
      {
        url: 'https://gym-adrenalin.com.ua/og-image.jpg',
        width: 958,
        height: 888,
        alt: 'Тренажерний зал Адреналін у Тернополі',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
};
