import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Раціон при схудненні',
  description:
    'Методи скидання ваги (схуднення) без дієт, індивідуальна денна потреба калорій, міфи у схудненні. Апетит і голод - в чому різниця? ',
  alternates: canonicalFor('/learn/nutrition/diet-for-weight-lost'),
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
