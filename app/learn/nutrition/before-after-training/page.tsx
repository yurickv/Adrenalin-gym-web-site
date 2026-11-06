import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Image from 'next/image';
import profilePic from '../../../../public/bg-hero.webp';
import Link from 'next/link';
import { Sidebar } from '../../Sidebar';
import { ButtonSecond } from '@/components/ButtonSecond';
import { Button } from '@/components/Button';
import { SytnoTelegramCta } from '@/components/SytnoTelegramCta';

const Timidity = () => {
  return (
    <main>
      <section className="relative bg-hero-bg">
        <div className="div-container py-[20px] md:py-[44px] mx-auto text-center flex flex-col gap-5 md:gap-10 lg:gap-14 z-10 relative">
          <h3 className="text-left text-mainTitleBlack flex gap-2">
            <Link href="/" className="flex gap-2 items-center">
              <HomeIcon />
              <span className="sr-only md:not-sr-only">Adrenalin_gym</span>
            </Link>
            <span className="font-semibold">
              {' '}
              &gt; <Link href="/learn">Навчання</Link> &gt;{' '}
              <Link href="/learn/nutrition">Харчування</Link> &gt; Їжа до і
              після тренування
            </span>
          </h3>
          <h1 className="title mb-14 text-mainTitleBlack">
            Навчальний посібник
          </h1>
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
        <div className="div-container lg:flex gap-6">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <div>
            <h2 className="h1-title-blog p-6 border-b-2 border-main mb-8 text-center">
              Їжа до і після тренування
            </h2>

            <h2 className="h2-list-title mt-2 text-center">
              Заправляємо тренування: Харчування до та після тренування для
              оптимальної енергії та відновлення
            </h2>
            <p className="p-text">
              Харчування відіграє життєво важливу роль у досягненні максимальної
              продуктивності під час тренувань та сприянні оптимальному
              відновленню. Те, що ви їсте до і після тренування, може суттєво
              вплинути на рівень енергії, витривалість і відновлення м'язів. У
              цій статті ми розглянемо ключові елементи перед- та
              післятренувального харчування, які допоможуть вам досягти ваших
              фітнес-цілей з добре підживленим тілом.
            </p>
            <h3 className="h2-list-title mt-4">
              Харчування перед тренуванням:
            </h3>
            <ul className="ul-list !list-image-none">
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  1. Вуглеводи для енергії:{' '}
                </span>
                Споживайте легкозасвоювані вуглеводи перед тренуванням, щоб
                забезпечити себе легкодоступним джерелом енергії. Віддавайте
                перевагу цільним злакам, фруктам або невеликій порції каш з
                низьким вмістом клітковини.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  2. Білок для стабільної працездатності:{' '}
                </span>
                Вживання помірної кількості багатої на білок їжі перед
                тренуванням може допомогти підтримувати м'язову активність під
                час тренування. Розгляньте такі джерела, як грецький йогурт,
                протеїновий коктейль або невелика порція нежирного м'яса.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  3. Гідратація є ключовим фактором:{' '}
                </span>
                Пийте воду або напої, багаті на електроліти, щоб підтримувати
                баланс рідини та оптимальну працездатність.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  4. Час має значення:{' '}
                </span>
                Намагайтеся з'їсти їжу перед тренуванням або перекусити
                приблизно за 1-2 години до тренування. Якщо ви віддаєте перевагу
                меншим перекусам, споживайте їх за 30 хвилин до години до
                тренування. На повний шлунок нормального тренування не вийде.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  5. Уникайте важкої та жирної їжі:{' '}
                </span>
                Уникайте важкої, жирної їжі, яка може викликати дискомфорт під
                час тренування. Це може сповільнити травлення і вплинути на
                рівень енергії.
              </li>
            </ul>
            <Image
              src="/fotoLearning/food.webp"
              alt="sandwich for gym"
              sizes="100vw"
              loading="lazy"
              className="w-auto h-auto mt-6 rounded-lg "
              width={500}
              height={300}
            />
            <h3 className="h2-list-title mt-4">Харчування після тренування:</h3>
            <ul className="ul-list !list-image-none">
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  1. Поповнення запасів глікогену:{' '}
                </span>
                Після тренування заправтеся вуглеводами, щоб поповнити виснажені
                запаси глікогену в м'язах. Найкраще їсти фрукти, цільнозернові
                продукти та солодку картоплю.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  2. Білок для відновлення м'язів:{' '}
                </span>
                Споживайте багаті на білок закуски (батончики) або їжу, щоб
                підтримати відновлення та відновлення м'язів. Нежирні білки,
                такі як куряче м'ясо, тофу або квасоля - чудовий вибір.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  3. Важливою є гідратація:{' '}
                </span>
                Відновлюйте водний баланс після тренування, випиваючи воду або
                спортивний напій з електролітами, щоб замінити рідину, втрачену
                через піт.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  4. Час має вирішальне значення:{' '}
                </span>
                Намагайтеся їсти протягом 45-60 хвилин - години після
                тренування, щоб оптимізувати відновлення. Саме в цей час ваш
                організм найбільш сприйнятливий до засвоєння поживних речовин.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  5. Включіть антиоксиданти:{' '}
                </span>
                Продукти, багаті на антиоксиданти, такі як ягоди і темна листова
                зелень, можуть допомогти зменшити окислювальний стрес,
                викликаний фізичними навантаженнями, і підтримати загальне
                відновлення.
              </li>
            </ul>
            <SytnoTelegramCta>
              Більше порад про харчування простими словами — в Telegram-каналі
              Sytno.
            </SytnoTelegramCta>
            <div className="flex gap-6 mt-8 justify-end pt-8 border-t-2 border-main ">
              <ButtonSecond
                route="/learn/nutrition/basics"
                text="&#10094; ПОПЕРЕДНЯ"
              />
              <Button
                route="/learn/nutrition/diet-for-weight-lost"
                text="НАСТУПНА &#10095;"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Timidity;
