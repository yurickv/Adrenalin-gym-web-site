import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Пошук мотивації для занять в тренажерному залі',
  description:
    'Мотивація для тренувань в тренажерному залі, покрокова стратегія для підтримки свого настою для перемог і досягнень.',
  alternates: canonicalFor('/learn/motivation/finding-motivation'),
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
