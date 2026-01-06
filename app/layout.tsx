import './globals.css';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <GoogleAnalytics ga_id={process.env.GTM_ID} />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col">
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
