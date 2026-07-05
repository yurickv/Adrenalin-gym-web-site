import { ButtonGroup } from '@/components/calcs-page/ButttonGroup';
import { CalcTitle } from '@/components/calcs-page/CalcsTitle';
import { CaloriesCalcList } from '@/components/calcs-page/CaloriesCalcList';
import { CaloriesDescription } from '@/components/calcs-page/CaloriesDescription';
import { CaloriesFaq } from '@/components/calcs-page/CaloriesFaq';
import { CaloriesJsonLd } from '@/components/calcs-page/CaloriesJsonLd';
import { CalcByline } from '@/components/calcs-page/CalcByline';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Link from 'next/link';
import Image from 'next/image';
import profilePic from '../../../public/bg-hero.webp';

const CaloriesCalc = () => {
  return (
    <main>
      <section className="relative bg-hero-bg">
        <div className="div-container py-[20px] md:py-[44px]  mx-auto text-center flex flex-col gap-5 md:gap-10 z-10 relative">
          <nav
            aria-label="Хлібні крихти"
            className="text-left text-mainTitleBlack"
          >
            <ol className="flex gap-2 items-center">
              <li>
                <Link href="/" className="flex gap-2 items-center">
                  <HomeIcon />
                  <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/calcs"
                  className="flex gap-2 items-center font-semibold"
                >
                  <span className="sr-only md:not-sr-only">
                    &gt; Калькулятори
                  </span>
                </Link>
              </li>
              <li>
                <span className="font-semibold"> &gt; Потреба калорій</span>
              </li>
            </ol>
          </nav>
          <h1 className="title mb-14 text-mainTitleBlack">
            Калькулятор калорій для схуднення та набору ваги
          </h1>
        </div>
        <Image
          alt="Калькулятор калорій — тренажерний зал Адреналін"
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
      <section className="bg-white dark:bg-darkBody">
        <div className="div-container  py-[20px] md:py-[44px]  mx-auto text-center">
          <CalcTitle page={2} />
          <h2 className="title text-mainTitle dark:text-mainTitleBlack">
            Розрахунок денної норми калорій онлайн
          </h2>
          <p className="max-w-[820px] mx-auto mt-6 text-base md:text-lg text-mainText dark:text-mainTextBlack">
            Калькулятор калорій розраховує денну норму калорій за формулою
            Міффліна-Сан Жеора з урахуванням статі, віку, зросту, ваги та рівня
            активності. Щоб схуднути, створюють дефіцит 10–15%, щоб набрати вагу
            — профіцит 10–15% від норми.
          </p>
          <p className="font-bold text-base md:text-lg my-10 md:my-12 text-mainText dark:text-mainTextBlack">
            Для отримання розрахунку переміщуйте мишкою повзунок на лінії, або
            введіть дані вручну
          </p>
          <div className="flex flex-col items-center md:items-start md:block min-[1028px]:flex min-[1028px]:flex-row gap-10 md:gap-6 justify-between lg:justify-evenly">
            <div
              className="p-12 bg-[#F5F5F5] dark:bg-[#676465] flex flex-col max-w-[500px] 
            text-center basis-1/2 float-left max-h-[960px] md:mr-6 md:mb-6
            shadow-[0px_4px_20px_0px_rgba(133,119,123,0.30)] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]"
            >
              <CaloriesCalcList />
              <ButtonGroup />
            </div>
            <CaloriesDescription />
          </div>
        </div>
      </section>
      <CaloriesFaq />
      <CalcByline />
      <CaloriesJsonLd />
    </main>
  );
};
export default CaloriesCalc;
