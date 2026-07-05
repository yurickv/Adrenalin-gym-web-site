import Link from 'next/link';
import { ButtonGroup } from '@/components/calcs-page/ButttonGroup';
import { CalcTitle } from '@/components/calcs-page/CalcsTitle';
import { DescriptionIMT } from '@/components/calcs-page/IMTDescription';
import { ImtCalcList } from '@/components/calcs-page/ImtCalcList';
import { ImtFaq } from '@/components/calcs-page/ImtFaq';
import { ImtJsonLd } from '@/components/calcs-page/ImtJsonLd';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Image from 'next/image';
import profilePic from '../../../public/bg-hero.webp';
import SceletonForCalc from '@/components/sceleton/sceletonForCalc';

const ImtCalc = () => {
  return (
    <main>
      <section className="relative bg-hero-bg">
        <div
          className="div-container  
        py-[20px] md:py-[44px]  mx-auto text-center flex flex-col gap-5 md:gap-10 z-10 relative"
        >
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
                <span className="font-semibold"> &gt; Індекс маси тіла</span>
              </li>
            </ol>
          </nav>
          <h1 className="title mb-14 text-mainTitleBlack">
            Калькулятор індексу маси тіла (ІМТ)
          </h1>
        </div>
        <Image
          alt="Калькулятор індексу маси тіла — тренажерний зал Адреналін"
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
        <div className="div-container py-[20px] md:py-[44px]  mx-auto text-center ">
          <CalcTitle page={0} />
          <h2 className="title text-mainTitle dark:text-mainTitleBlack">
            Розрахунок індексу маси тіла онлайн
          </h2>
          <p className="font-bold text-base md:text-lg my-10 md:my-12 text-mainText dark:text-mainTextBlack">
            Для отримання розрахунку переміщуйте мишкою повзунок на лінії, або
            введіть дані вручну
          </p>
          <div className="flex flex-col items-center md:items-start md:flex-row gap-10 md:gap-6 justify-between lg:justify-evenly">
            <div
              className="p-12 bg-[#F5F5F5] dark:bg-[#676465] flex flex-col max-w-[500px] text-center 
            shadow-[0px_4px_20px_0px_rgba(133,119,123,0.30)] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]"
            >
              <ImtCalcList />
              <ButtonGroup />
            </div>
            <DescriptionIMT />
          </div>
        </div>
      </section>
      <ImtFaq />
      <ImtJsonLd />
    </main>
  );
};
export default ImtCalc;
