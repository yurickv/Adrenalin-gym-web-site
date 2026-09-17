import Link from 'next/link';
import { ButtonGroup } from '@/components/calcs-page/ButttonGroup';
import { CalcTitle } from '@/components/calcs-page/CalcsTitle';
import { DescriptionIMT } from '@/components/calcs-page/IMTDescription';
import { ImtCalcList } from '@/components/calcs-page/ImtCalcList';
import { ImtFaq } from '@/components/calcs-page/ImtFaq';
import { ImtJsonLd } from '@/components/calcs-page/ImtJsonLd';
import { CalcByline } from '@/components/calcs-page/CalcByline';
import { CalcRating } from '@/components/calcs-page/CalcRating';
import { BmiCategoryTable } from '@/components/calcs-page/BmiCategoryTable';
import { BmiHeightWeightTable } from '@/components/calcs-page/BmiHeightWeightTable';
import { BmiAgeTable } from '@/components/calcs-page/BmiAgeTable';
import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import { getCalcRating } from '@/app/_services/calcRating.service';

export const revalidate = 3600;

const ImtCalc = async () => {
  const rating = await getCalcRating('imt-calculator');

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
                <span className="font-semibold"> &gt; Індекс маси тіла</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Калькулятор ІМТ: індекс маси тіла і норма ваги
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Введіть зріст і вагу і дізнайтесь ІМТ, норму ваги та ідеальну вагу
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
              <ImtCalcList />
              <ButtonGroup />
              <CalcRating calcId="imt-calculator" initial={rating} />
            </div>

            <div className="basis-1/2 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-mainTitle dark:text-mainTitleBlack">
                Розрахунок індексу маси тіла онлайн
              </h2>
              <p className="mt-4 text-base md:text-lg text-mainText dark:text-mainTextBlack">
                Індекс маси тіла (ІМТ) — це співвідношення ваги та зросту, яке показує, чи
                відповідає вага нормі: вага в кілограмах, поділена на квадрат зросту в метрах.
                Нормальний ІМТ — 18,5–24,9. Калькулятор також показує норму ваги для вашого
                зросту, ідеальну вагу за формулою Девіна і орієнтовну норму для вашого віку.
              </p>
              <DescriptionIMT />
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-mainTitle dark:text-mainTitleBlack">
              Фітнес-калькулятори
            </h2>
            <CalcTitle page={0} />
          </div>
        </div>
      </section>

      <BmiCategoryTable />
      <BmiHeightWeightTable />
      <BmiAgeTable />
      <ImtFaq />
      <CalcByline />
      <ImtJsonLd rating={rating} />
    </main>
  );
};

export default ImtCalc;
