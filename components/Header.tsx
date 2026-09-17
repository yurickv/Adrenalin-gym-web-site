'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';

import { NavLinks } from '@/const';
import { Barbell } from './icons/Barbell';
import { BurgerMenu } from './icons/BurgerMenu';
import { ShevronDown } from './icons/forPopMenu/Shevron';
import { IMTCalcIcon } from './icons/forPopMenu/IMTCalcIcon';
import { FatCalcIcon } from './icons/forPopMenu/FatCalcIcon';
import { CaloriesCalcIcon } from './icons/forPopMenu/CaloriesCalcIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { HomeIcon } from './icons/forPopMenu/HomeIcon';
import { Search } from '@/components/Search';
import { AdrenalinIcon } from './icons/logo/AdrenalinIcon';
import { GymIcon } from './icons/logo/GymIcon';
import { Basket } from './icons/Basket';
import { DarkModeToggle } from './DarkModeToggle';
import { CartLocalStorageService } from '@/app/_services/cartLocalStorageService';
import { SHOPPING_CART } from '@/const/localstorageKeys';

const Header: React.FC = () => {
  const params = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsQuantity, setProductsQuantity] = useState(0);
  // const searchParams = useSearchParams();
  // const search = searchParams.get('search');

  // const searchParams = new URLSearchParams(
  //   typeof window !== 'undefined' ? window.location.search : ''
  // );

  const cartLocalStorageService = new CartLocalStorageService(SHOPPING_CART);
  useEffect(() => {
    const isProductsExists = () => {
      const productsQuantity = cartLocalStorageService.get();

      if (!productsQuantity?.length) {
        return setProductsQuantity(0);
      }
      setProductsQuantity(productsQuantity.length);
    };
    window.addEventListener('storage', isProductsExists);
    isProductsExists();
  }, []);

  const calcHeader = [
    {
      name: 'Індекс маси тіла',
      description: 'Калькулятор для визначення індексу маси тіла',
      href: '/calcs/imt-calculator',
      icon: <IMTCalcIcon />,
    },
    {
      name: 'Відсоток жиру в тілі',
      description: 'Калькулятор для визначення відсотку жиру в тілі',
      href: '/calcs/fat-calculator',
      icon: <FatCalcIcon />,
    },
    {
      name: 'Потреба калорій',
      description: 'Калькулятор для визначення денної потреби калорій',
      href: '/calcs/calories-calculator',
      icon: <CaloriesCalcIcon />,
    },
    {
      name: 'Усі калькулятори',
      description: 'Огляд трьох калькуляторів на одній сторінці',
      href: '/calcs',
      icon: <HomeIcon />,
    },
  ];

  return (
    <header className="bg-white dark:bg-darkBody">
      <div
        className="sm:max-w-[640px] md:max-w-[1279px] lg:max-w-[1439px] xl:max-w-[1919px]
    sm:px-4 md:px-[40px] lg:px-[66px] xl:px-[132px]
    flex justify-between items-center py-5 border-b  gap-4 mr-auto ml-auto"
      >
        <div className="flex  lg:hidden hover:text-main">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-mainTextBlack"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <BurgerMenu aria-hidden="true" />
          </button>
        </div>
        <nav className="flex  md:gap-5 lg:gap-10">
          <Link
            className="flex items-center gap-2 text-main hover:text-hover transition-colors duration-300"
            href="/"
          >
            <span className="sr-only">Adrenalin gym</span>
            <div className="flex flex-col items-center">
              <AdrenalinIcon />
              <GymIcon />
            </div>
            {params === '/' && <Barbell />}
          </Link>

          <Popover.Group className="hidden lg:flex md:gap-x-2 lg:gap-x-7">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
                ${
                  open
                    ? 'bg-orange-100 !text-main  dark:bg-hoverBlack dark:!text-mainTitle'
                    : ''
                }
                  group flex items-center gap-1 font-poppins hover:text-main hover:bg-orange-100 
                  dark:hover:bg-hoverBlack dark:hover:text-mainTitle
             text-mainTitle dark:text-mainTitleBlack rounded-lg px-3 py-2 outline-none`}
                  >
                    Калькулятори
                    <div
                      className={`
                ${
                  open
                    ? 'bg-orange-100 !text-main rotate-180 dark:bg-hoverBlack'
                    : ''
                } h-5 w-5 flex-none text-mainTitle dark:text-mainTitleBlack group-hover:text-main`}
                    >
                      <ShevronDown aria-hidden="true" />
                    </div>
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel
                      className="absolute -left-1/2 top-full z-40 mt-3 w-screen max-w-md 
                  overflow-hidden rounded-3xl bg-white dark:bg-[#676465] shadow-lg ring-1 ring-gray-900/5 transition-all duration-300"
                    >
                      <ul className="p-4">
                        {calcHeader.map(item => (
                          <li
                            key={item.name}
                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6
                           hover:bg-orange-100 dark:bg-[#676465] dark:hover:bg-mainText"
                          >
                            <div
                              className="flex h-11 w-11 flex-none items-center justify-center rounded-lg
                           bg-orange-100 dark:bg-hoverBlack group-hover:bg-white"
                            >
                              <div
                                className="h-6 w-6 text-mainTitle dark:text-white group-hover:text-main"
                                aria-hidden="true"
                              >
                                {item.icon}
                              </div>
                            </div>
                            <div className="flex-auto">
                              <a
                                href={item.href}
                                className="block font-semibold text-mainTitle dark:text-white
                                  hover:text-main dark:hover:text-orange-400 tracking-wider"
                              >
                                {item.name}
                                <span className="absolute inset-0" />
                              </a>
                              <p className="mt-1 text-mainText dark:text-mainTextBlack">
                                {item.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>

            <ul className="flex text-small md:gap-2 lg:gap-7 text-base">
              {NavLinks.map(link => (
                <li
                  key={link.key}
                  className={`flex items-center gap-2 focus:text-main hover:text-main rounded-lg focus:bg-orange-100 hover:bg-orange-100 
                 dark:focus:bg-hoverBlack dark:hover:bg-hoverBlack dark:focus:text-mainTitle dark:hover:text-mainTitle ${
                   params === link.href
                     ? 'text-main pr-2'
                     : 'text-mainTitle dark:text-mainTitleBlack'
                 } transition-colors duration-300 cursor-pointer`}
                >
                  <Link href={link.href} className={`font-poppins px-3 py-2`}>
                    {link.text}
                  </Link>
                  {params === link.href && <Barbell />}
                </li>
              ))}
            </ul>
          </Popover.Group>
        </nav>
        <div className="flex md:gap-4 text-main relative">
          {/* <div className="hidden lg:block">
            <Search search={searchParams} />
          </div> */}
          <Link
            href="/services/cart"
            aria-label="cart with selected services"
            className="rounded-md hover:bg-orange-100 dark:hover:bg-hoverBlack dark:hover:text-mainTitle
                 text-mainTitle dark:text-mainTitleBlack p-2 text-base font-medium hover:text-main
                 hover:text-opacity-100 outline-none transition-all duration-300 relative group"
          >
            <Basket />
            {productsQuantity > 0 ? (
              <div className="p-1 top-1/4 right-1 bg-main group-hover:bg-hover transition-colors absolute rounded-full"></div>
            ) : null}
          </Link>
          <DarkModeToggle />
        </div>
        <Dialog
          as="div"
          className="z-50 lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-backgroundBlack
                       px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          >
            <div className="flex items-center justify-between">
              <a
                href="/"
                aria-label="back to main page"
                className="-m-1.5 p-1.5 flex gap-2 items-center text-main"
              >
                <HomeIcon />
                <span className="sr-only">Adrenalin Gym</span>
                <div className="flex gap-3">
                  <AdrenalinIcon />
                  <GymIcon />
                </div>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-mainText dark:text-mainTextBlack"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-main">
                <ul className="space-y-2 py-6">
                  <li className="-mx-3" key="calcs">
                    <Disclosure as="div">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={` ${
                              open
                                ? 'bg-orange-100 dark:bg-hoverBlack !text-main dark:!text-mainTitle'
                                : ''
                            } flex w-full items-center rounded-lg py-2 
                      pl-3 pr-3.5 text-base font-semibold leading-7
                       text-mainTitle dark:text-mainTitleBlack dark:hover:text-mainTitle
                       hover:bg-orange-100 dark:hover:bg-hoverBlack hover:text-main`}
                          >
                            Калькулятори &nbsp;
                            <div
                              className={` ${open ? 'rotate-180' : ''}
                            h-5 w-5 flex-none text-main dark:text-orange-600`}
                            >
                              <ShevronDown aria-hidden="true" />
                            </div>
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-2 tracking-wider">
                            <ul>
                              {[...calcHeader].map(item => (
                                <li key={item.name}>
                                  <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7
                             text-mainText dark:text-mainTextBlack hover:bg-orange-100 tracking-wider
                             dark:hover:bg-mainText hover:text-main dark:hover:text-orange-400"
                                  >
                                    {item.name}
                                  </Disclosure.Button>
                                </li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </li>
                  {NavLinks.map(link => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 
                   text-mainTitle hover:text-main focus:text-main dark:text-mainTitleBlack dark:hover:text-mainTitle
                   dark:focus:text-mainTitle hover:bg-orange-100 dark:hover:bg-hoverBlack dark:focus:bg-hoverBlack"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* <div className="py-10 flex gap-8 text-main items-center justify-center">
                  <Search
                    search={searchParams}
                    handleCloseMobileMenu={setMobileMenuOpen}
                  />
                </div> */}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
