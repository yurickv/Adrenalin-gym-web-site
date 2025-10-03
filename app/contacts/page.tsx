import type { Metadata } from 'next';
import Link from 'next/link';
import { Insta } from '@/components/icons/Instagram';
import { Location } from '@/components/icons/Location';
import { Phone } from '@/components/icons/Phone';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Image from 'next/image';
import profilePic from '../../public/bg-hero.webp';

export const metadata: Metadata = {
  title: 'Контакти спортклубу Абреналін',
  description:
    'Контактні дані за якими можна з звязатись з тренажерним залом Адреналін: адреса, номери телефонів, посилання на соціальні мережі, розміщення на карті Google',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'max-snippet': -1,
    },
  },
};

const Contacts = () => {
  return (
    <main>
      <section className="relative bg-hero-bg">
        <div className="div-container py-[20px] md:py-[44px] mx-auto text-center flex flex-col gap-5 md:gap-10 lg:gap-14 z-10 relative">
          <h3 className="text-left text-mainTitleBlack flex gap-2">
            <Link href="/" className="flex gap-2 items-center">
              <HomeIcon />
              <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
            </Link>
            <span className="font-semibold"> &gt; Контакти</span>
          </h3>
          <h1 className="title mb-14 text-mainTitleBlack">Контакти</h1>
        </div>
        <Image
          alt="Adrenalin gym foto"
          src={profilePic}
          placeholder="blur"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </section>
      <section className="py-[40px] md:py-[44px] lg:py-[88px] bg-white dark:bg-darkBody">
        <div
          className="div-container flex flex-col 
        md:flex-row justify-between gap-6"
        >
          <div className="max-[449px]:text-center min-[450px]:flex gap-4 justify-between md:block">
            <div className="flex flex-col gap-5  max-[449px]:mx-auto pb-4 min-[450px]:pb-0 max-w-[205px] md:max-w-full">
              <p className="text-xl md:text-2xl font-semibold min-[450px]:mb-4 text-mainTitle dark:text-mainTitleBlack">
                Де нас знайти?
              </p>
              <Link
                href="https://goo.gl/maps/LJuXJQ9Kkhcb7FVT7"
                target="_blank"
                rel="noopener noreferrer"
                className="group   transition-colors duration-300 text-main flex gap-4 items-center text-start"
              >
                <div className="min-w-[24px]">
                  <Location />
                </div>

                <span
                  className="text-mainText dark:text-mainTextBlack  text-lg 
                 group-hover:text-main transition-colors duration-300"
                >
                  м.Тернопіль, вул.Сахарова 10
                </span>
              </Link>
              <div className="transition-colors duration-300 text-main flex gap-4 items-center">
                <Phone />
                <span className="text-mainText dark:text-mainTextBlack text-lg text-start">
                  <Link
                    href="tel:+380979601371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-main transition-colors duration-300"
                  >
                    +38 097 960 1371
                  </Link>{' '}
                  <br />{' '}
                  <Link
                    href="tel:+380978836689"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-main transition-colors duration-300"
                  >
                    +38 097 883 6689
                  </Link>
                </span>
              </div>

              <Link
                href="https://www.instagram.com/gym.adrenalin/?hl=uk"
                target="_blank"
                rel="noopener noreferrer"
                className="group   transition-all duration-200  flex gap-4 items-center"
              >
                {' '}
                <div className=" text-main">
                  <Insta />
                </div>
                <span
                  className=" text-lg  text-mainText dark:text-mainTextBlack
                 transition-all duration-200 group-hover:text-main"
                >
                  @gym.adrenalin
                </span>
              </Link>
            </div>
            <div className="max-[449px]:mt-6 md:mt-6 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-mainTitle dark:text-mainTitleBlack">
                  Графік роботи:
                </p>
                <ul className="my-4 text-mainText dark:text-mainTextBlack font-semibold">
                  <li>
                    <span className="">пн - пт</span> — 11:00-21:00
                  </li>
                  <li>
                    <span className="">сб</span> — 12:00-19:00
                  </li>
                  <li>
                    <span className="">нд</span> — вихідний
                  </li>
                </ul>
              </div>

              <Link
                className="mt-4 text-mainText dark:text-mainTextBlack underline"
                href="/oferta"
              >
                Договір Публічної Оферти
              </Link>
            </div>
          </div>

          <div className="h-[300px] md:h-[450px] lg:h-[600px] w-full">
            <iframe
              aria-label="Google maps"
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4352.582420173576!2d25.640675527511817!3d49.55410347310727!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473033e3dcc7a371%3A0x8253e4a830a8921d!2z0KLRgNC10L3QsNC20LXRgNC90LjQuSDQt9Cw0Lsg0JDQtNGA0LXQvdCw0LvRltC9!5e0!3m2!1suk!2sua!4v1692117465058!5m2!1suk!2sua"
              width="800"
              height="600"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contacts;
