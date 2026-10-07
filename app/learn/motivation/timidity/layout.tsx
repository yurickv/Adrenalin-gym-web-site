import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Подолання тривожності в тренажерному залі',
  description:
    'Розвиток впевненості: Стратегії подолання тривожності та соромязливості, повязаних із заняттями спортом в спортзалі.',
  alternates: canonicalFor('/learn/motivation/timidity'),
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
