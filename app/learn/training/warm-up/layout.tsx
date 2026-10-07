import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Розминка перед тренуванням в тренажерному залі',
  description:
    'Призначення розминки. Як і скільки розминатись в тренажерному залі? Види розминки при різних вправах в спортзалі.',
  alternates: canonicalFor('/learn/training/warm-up'),
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
  return (
    <>
      {children}
    </>
  );
}
