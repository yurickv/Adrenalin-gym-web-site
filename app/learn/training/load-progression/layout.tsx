import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Збільшення навантаження, прогресія в тренуванні',
  description:
    'Як ефективно збільшувати робочі ваги? Які є види збільшення навантаження в спортзалі? Обєм тренування, види складності вправ, циклічність в тренуваннях, види тренувальних програм.',
  alternates: canonicalFor('/learn/training/load-progression'),
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
