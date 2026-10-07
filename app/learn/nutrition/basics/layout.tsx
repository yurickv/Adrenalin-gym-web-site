import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Основи здорового харчування',
  description:
    'Для чого ми їмо? Здорове харчування - це просто. Як їсти і не переїдати. Жири, корисні вуглеводи і білки в продуктах.',
  alternates: canonicalFor('/learn/nutrition/basics'),
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
