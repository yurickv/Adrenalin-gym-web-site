import Link from 'next/link';
import { ButtonGroup } from '@/components/calcs-page/ButttonGroup';
import { CalcTitle } from '@/components/calcs-page/CalcsTitle';
import { FatCalcList } from '@/components/calcs-page/FatCalcList';
import { DescriptionFat } from '@/components/calcs-page/FatDescription';
import { FatFaq } from '@/components/calcs-page/FatFaq';
import { FatJsonLd } from '@/components/calcs-page/FatJsonLd';
import { CalcByline } from '@/components/calcs-page/CalcByline';
import { CalcRating } from '@/components/calcs-page/CalcRating';
import { FAT_H1, FAT_LEAD } from '@/components/calcs-page/fatHero';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import { getCalcRating } from '@/app/_services/calcRating.service';

export const revalidate = 3600;

const FatCalc = async () => {
  const rating = await getCalcRating('fat-calculator');

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
                <Link href="/calcs" className="flex gap-2 items-center font-semibold">
                  <span className="sr-only md:not-sr-only">&gt; Калькулятори</span>
                </Link>
              </li>
              <li>
                <span className="font-semibold"> &gt; Відсоток жиру в тілі</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            {FAT_H1}
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            {FAT_LEAD}
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-darkBody">
        <div className="div-container py-6 md:py-[44px] mx-auto text-center">
          <div className="flex flex-col items-center md:items-start md:flex-row gap-10 md:gap-6 justify-between lg:justify-evenly">
            <div
              className="p-6 md:p-12 bg-[#F5F5F5] dark:bg-[#676465] flex flex-col w-full max-w-[500px]
            text-center basis-1/2
            shadow-[0px_4px_20px_0px_rgba(133,119,123,0.30)] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]"
            >
              <p className="text-sm mb-4 text-neutral-600 dark:text-mainTextBlack">
                Переміщуйте повзунок або введіть значення вручну
              </p>
              <FatCalcList />
              <ButtonGroup />
              <CalcRating calcId="fat-calculator" initial={rating} />
            </div>

            <div className="basis-1/2 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-mainTitle dark:text-mainTitleBlack">
                Розрахунок відсотка жиру в тілі онлайн
              </h2>
              <p className="mt-4 text-base md:text-lg text-mainText dark:text-mainTextBlack">
                Відсоток жиру показує, яка частка ваги припадає на жирову тканину, і каже про
                форму більше, ніж ІМТ. Калькулятор рахує його за обхватами сантиметровою
                стрічкою або за товщиною шкірних складок і порівнює з нормами для вашої статі.
              </p>
              <DescriptionFat />
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-mainTitle dark:text-mainTitleBlack">
              Фітнес-калькулятори
            </h2>
            <CalcTitle page={1} />
          </div>
        </div>
      </section>

      <FatFaq />
      <CalcByline />
      <FatJsonLd rating={rating} />
    </main>
  );
};

export default FatCalc;
