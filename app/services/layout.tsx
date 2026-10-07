import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Ціни на послуги спортклубу Адреналін',
  description:
    'Ціни на послуги тренажерного залу Adrenalin: 1. Абонемент в спортклуб 2. Персональне тренування з тренером 3. План харчування / тренування',
  alternates: canonicalFor('/services'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'max-snippet': -1,
    },
  },
};
export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
