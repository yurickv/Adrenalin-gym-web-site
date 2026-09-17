import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ціни на послуги спортклубу Адреналін',
  description:
    'Ціни на послуги тренажерного залу Adrenalin: 1. Абонемент в спортклуб 2. Персональне тренування з тренером 3. План харчування / тренування',
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
