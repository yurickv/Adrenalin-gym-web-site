'use client';
import { NavLinks } from '@/const';
import Link from 'next/link';
import { Insta } from './icons/Instagram';
import { Phone } from './icons/Phone';
import { Popover, Transition } from '@headlessui/react';
import { ShevronDown } from './icons/forPopMenu/Shevron';
import { Fragment } from 'react';
import { AdrenalinIcon } from './icons/logo/AdrenalinIcon';
import { GymIcon } from './icons/logo/GymIcon';
import { BarbellIcon } from './icons/logo/BarbellIcon';

const Footer: React.FC = () => {
  const products = [
    { name: 'Індекс маси тіла', href: '/calcs/imt-calculator' },
    { name: 'Відсоток жиру в тілі', href: '/calcs/fat-calculator' },
    {
      name: 'Потреба калорій',
      href: '/calcs/calories-calculator',
    },
    { name: 'Усі калькулятори', href: '/calcs' },
  ];

  return (
    <footer className="bg-white dark:bg-darkBody">
      <div
        className="grid grid-cols-2 gap-10 justify-start justify-items-center md:grid-cols-none
        md:flex  md:justify-between  lg:items-start mx-auto border-t-2 border-main
      max-w-[640px] md:max-w-[1279px] lg:max-w-[1439px] xl:max-w-[1919px] 
      py-[40px] md:pt-[44px] md:pb-[88px] lg:py-[88px] 
      px-4 md:px-[40px] lg:px-[66px] xl:px-[132px] antialiased"
      >
        <Link
          aria-label="Повернення до головної сторінки"
          className="transition-colors duration-300 col-span-2 flex md:flex-col gap-3 
          md:gap-2  md:items-center mt-12"
          href="/"
        >
          <span className="sr-only md:not-sr-only">
            <BarbellIcon />
          </span>
          <AdrenalinIcon />
          <GymIcon />
        </Link>
        <nav className="md:!w-[220px] flex flex-col gap-6">
          <h4 className="ml-2 font-bold text-mainTitle dark:text-mainTitleBlack">
            Клієнтам
          </h4>
          <ul className="md:flex md:flex-wrap md:justify-between gap-4 text-small  text-base ">
            <li key="calcs">
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`
                ${
                  open
                    ? 'bg-orange-100 !text-main dark:bg-hoverBlack dark:!text-mainTitle'
                    : ''
                } group flex items-center gap-x-1 
                  font-poppins hover:text-main hover:bg-orange-100 
                dark:hover:bg-hoverBlack dark:hover:text-mainTitle
                text-mainTitle dark:text-mainTitleBlack rounded-lg p-2 outline-none`}
                    >
                      Калькулятори
                      <div
                        className={`${
                          open
                            ? 'bg-orange-100 !text-main rotate-180 dark:bg-hoverBlack'
                            : ''
                        } 
                    h-5 w-5 flex-none text-gray-400 group-hover:text-main`}
                      >
                        <ShevronDown aria-hidden="true" />
                      </div>
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      unmount={false}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel
                        unmount={false}
                        className="absolute left-1/4 top-full z-10 mt-2 w-screen max-w-[250px]
                    overflow-hidden rounded-3xl bg-white dark:bg-[#676465] shadow-lg transition-all duration-300"
                      >
                        <ul className=" p-2">
                          {products.map(item => (
                            <li
                              key={item.name}
                              className="group relative flex items-center gap-x-4 rounded-lg p-2 text-sm 
                            leading-6 hover:bg-orange-100 dark:bg-[#676465] dark:hover:bg-mainText"
                            >
                              <div className="flex-auto">
                                <a
                                  href={item.href}
                                  className="block font-semibold text-mainTitle dark:text-white  hover:text-main 
                                dark:hover:text-orange-400 tracking-wider"
                                >
                                  {item.name}
                                  <span className="absolute inset-0" />
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </li>
            {NavLinks.map(link => (
              <li
                key={link.key}
                className={`flex items-center  hover:text-main font-poppins rounded-lg p-2
                 hover:bg-orange-100 transition-colors duration-300
                  dark:hover:bg-hoverBlack dark:hover:text-mainTitle
                text-mainTitle dark:text-mainTitleBlack`}
              >
                <Link href={link.href}>{link.text}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-6 lg:justify-center">
          <h4 className="font-bold ml-2 text-mainTitle dark:text-mainTitleBlack">
            Будь з нами на звязку
          </h4>
          <ul className="flex flex-col gap-4">
            <li>
              <a
                href="tel:+38(097)8836689"
                className="flex gap-2 items-center group hover:text-main font-poppins rounded-lg p-2
               hover:bg-orange-100 transition-all duration-300
                dark:hover:bg-hoverBlack "
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-main group-hover:text-main">
                  <Phone />
                </span>
                <div
                  className="text-mainText dark:text-mainTextBlack group-hover:text-main 
              dark:group-hover:text-mainTitle font-poppins"
                >
                  <span className="hidden min-[450px]:inline-block">+38</span>{' '}
                  097 883 6689
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/gym.adrenalin/?hl=uk"
                className="flex gap-2 items-center group hover:text-main font-poppins rounded-lg p-2
               hover:bg-orange-100 transition-all duration-300
                dark:hover:bg-hoverBlack "
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-main group-hover:text-main">
                  <Insta />
                </span>
                <span
                  className="text-mainText dark:text-mainTextBlack group-hover:text-main 
              dark:group-hover:text-mainTitle font-poppins"
                >
                  adrenalin.gym
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
