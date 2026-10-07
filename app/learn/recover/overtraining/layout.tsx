import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Перетренованість в спортзалі',
  description:
    'Сигнали Перетренованості: зниження продуктивності в тренажерному залі, зростання пульсу в стані спокою, загальна втома, постійні травми.',
  alternates: canonicalFor('/learn/recover/overtraining'),
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
