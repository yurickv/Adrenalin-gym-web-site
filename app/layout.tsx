import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gym-adrenalin.com.ua'),
  title: {
    default: 'Тренажерний зал Адреналін у Тернополі',
    template: '%s | Adrenalin Gym',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={inter.variable}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col">
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </div>
        <GoogleAnalytics ga_id={process.env.GTM_ID} />
      </body>
    </html>
  );
}
