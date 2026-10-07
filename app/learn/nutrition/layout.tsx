import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Здорове харчування',
  description:
    'Здорове харчування при наборі мязової маси чи схудненні. Схуднення без дієт. Набір мязової маси швидко.',
  alternates: canonicalFor('/learn/nutrition'),
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
  return <>{children}</>;
}
