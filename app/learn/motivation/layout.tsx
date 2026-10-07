import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Мотивація для тренувань в тренажерному залі',
  description:
    'Мотивація і дисципліна при тренуваннях в спортклубі, як почати тренуватись і перестати відкладати на завтра',
  alternates: canonicalFor('/learn/motivation'),
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
