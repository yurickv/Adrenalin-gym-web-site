import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import { CalcHubCard } from '@/components/calcs-page/CalcHubCard';
import { CalcsHubJsonLd } from '@/components/calcs-page/CalcsHubJsonLd';
import {
  HUB_CARDS,
  HUB_DESCRIPTION,
  HUB_TITLE,
} from '@/components/calcs-page/calcHubContent';
import { CALC_SITE_URL } from '@/const/calcSeo';

const PAGE_URL = `${CALC_SITE_URL}/calcs`;

export const metadata: Metadata = {
  title: { absolute: HUB_TITLE },
  description: HUB_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Адреналін Gym',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
  },
};

const Calcs = () => {
  return (
    <main>
      <section className="bg-[#2E2F42] md:bg-hero-photo bg-cover bg-center">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <nav aria-label="Хлібні крихти" className="text-left text-mainTitleBlack">
            <ol className="flex gap-2 items-center">
              <li>
                <Link href="/" className="flex gap-2 items-center">
                  <HomeIcon />
                  <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
                </Link>
              </li>
              <li>
                <span className="font-semibold"> &gt; Калькулятори</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Фітнес-калькулятори онлайн
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Три безкоштовні інструменти, щоб зрозуміти свою форму і спланувати харчування
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-darkBody">
        <div className="div-container py-8 md:py-[44px] mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {HUB_CARDS.map(card => (
              <CalcHubCard key={card.href} {...card} />
            ))}
          </div>
          <div className="max-w-[820px] mx-auto mt-10 md:mt-14">
            <Image
              src="/fit-blond.webp"
              alt="Дівчина у спортивній формі перевіряє результат тренувань"
              width={500}
              height={300}
              loading="lazy"
              sizes="(min-width: 820px) 820px, 100vw"
              style={{ width: '100%', height: 'auto' }}
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>
      <CalcsHubJsonLd />
    </main>
  );
};

export default Calcs;
