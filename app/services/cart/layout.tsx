import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Корзина товарів спортклубу Адреналін',
  description:
    'У вашій корзині: 1.Абонемент 2.Персональне тренування з тренером 3.План харчування / тренування',
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
