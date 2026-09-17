import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Image from 'next/image';
import profilePic from '../../../../public/bg-hero.webp';
import Link from 'next/link';
import { Sidebar } from '../../Sidebar';
import { ButtonSecond } from '@/components/ButtonSecond';
import { Button } from '@/components/Button';

const DietForGainingWeight = () => {
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
              <Link href="/learn/nutrition">Харчування</Link> &gt; Раціон при
              наборі ваги
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
            <h2 className="h1-title-blog p-6 border-b-2 border-main mb-8">
              Раціон при наборі ваги
            </h2>

            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                Набір м'язової маси – це не лише про тренування в залі, але й
                про те, що ми їмо.
              </span>{' '}
              Молоді люди, особливо від 15 до 25 років, мають великий потенціал
              для будування м'язів, але правильне харчування грає ключову роль в
              цьому процесі.
            </p>
            <p className="p-text">
              Ви повинні розуміти, що усі продукти складаються з білків,
              вуглеводів, жирів, мікро і макро елементів (вітаміни). Якщо
              коротко, то ви повинні з’їдати{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                не менше 1-1,5 гр. білків на 1 кілограм власної ваги
              </span>{' '}
              (наприклад Петро важить 70кг, для відновлення і росту м’язів йому
              треба 105гр. білків в день).
            </p>
            <p className="p-text">
              Також важлива калорійність спожитої їжі (енергія) -{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                ви повинні з’їдати більше калорій на 10-15% ніж ваш базова денна
                потреба в них
              </span>{' '}
              (порахувати{' '}
              <Link
                href="/calcs/calories-calculator"
                className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
              >
                денну норму калорій у калькуляторі калорій
              </Link>
              ).
            </p>
            <p className="p-text">
              Для розуміння скільки ви з’їдаєте є застосунки на телефоні
              (наприклад{' '}
              <Link
                href="https://play.google.com/store/apps/details?id=cz.psc.android.kaloricketabulky&hl=ua"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                «Таблиця калорійності»
              </Link>
              ), в яких просто треба вносити всі спожиті харчі і він сам
              обраховує калорійність, білки і вуглеводи в їжі. Також він по
              ваших даних розраховує потрібні денні норми білків, вуглеводів.
            </p>
            <Image
              src="/fotoLearning/collection-protein-food.webp"
              alt="collection protein food"
              sizes="100vw"
              className="w-auto h-auto mt-6 rounded-lg "
              width={500}
              height={300}
              loading="lazy"
            />
            <p className="p-text">
              Ось декілька порад, як підтримувати ваше здоров'я і досягати цілей
              щодо набору м'язової маси:
            </p>
            <ul className="ul-list !list-image-none">
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  1. Білки – основа М'язів:
                </span>{' '}
                Білки – це будівельні блоки м'язів. Включіть в свій раціон
                харчування багато білків, таких як курятина, риба, яйця, сир та
                ін. молочні продукти. Ці білки допоможуть вам відновити та
                збудувати м'язову тканину.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  2. Вуглеводи – джерело енергії:
                </span>{' '}
                Вуглеводи подають енергію для тренувань та відновлення. Здобутки
                в залі потребують багато сил, і вуглеводи допомагають вам
                подолати це завдання. Каші (вівсяна, гречана та ін.),
                цільнозерновий хліб, фрукти - це чудові джерела здорових
                вуглеводів.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  3. Здорові жири – важливість балансу:
                </span>{' '}
                Здорові жири, які містяться в оливковому маслі, авокадо, горіхах
                та насінні соняшника, сприяють правильному функціонуванню
                організму та підтриманню гормонального балансу.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  4. Вітаміни та мінерали – забезпечте ваше тіло:
                </span>{' '}
                Впевніться, що ваш раціон включає вітаміни та мінерали, такі як
                вітамін D, кальцій та залізо. Вони необхідні для зміцнення
                кісток та забезпечення нормальної роботи м'язів. Вітаміни групи
                В потрібні для відновлення м’язів. Корисно додатково вживати
                таблетовані вітаміни.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  5. Вживайте більше калорій:
                </span>{' '}
                Щоб набрати м'язову масу, потрібно більше калорій, ніж ви
                витрачаєте. Додавайте до свого раціону більше їжі, але робіть це
                розумно і збалансовано. Щоб масонабір не перетворився на
                ожиріння). Врахуйте, що одночасно{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack">
                  набирати вагу і залишатись рельєфним не можливо.
                </span>{' '}
                Просушити прес (для цього потрібен дефіцит карорій) і одночасно
                підкачатись (для цього потрібен надлишок калорій) не вийде.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  6. Регулярні прийоми їжі:
                </span>{' '}
                Розділіть свій раціон на 3-4 прийоми їжі на день. Це допомагає
                підтримувати постійний потік поживних речовин у вашому
                організмі. Важливо також їсти в один і той самий час.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  7. Пийте достатньо води:
                </span>{' '}
                Водний баланс - ключовий для здоров'я та росту м'язів. Пийте
                достатньо води, особливо під час тренувань.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  8. Спільнота та підтримка:
                </span>{' '}
                Приєднуйтесь до фітнес-спільноти або знайомтеся з{' '}
                <Link
                  href="/services#coach-training"
                  className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
                >
                  нашими тренерами
                </Link>
                , які дадуть вам професійні поради та підтримку.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  9. Важливий відпочинок:
                </span>{' '}
                Розробляйте розумний графік тренувань та надайте своєму
                організму час на відновлення. Оптимально тренуватись через день,
                три рази на тиждень.
              </li>
            </ul>
            <p className="p-text">
              Зважаючи на набір м'язової маси, спортивні добавки можуть бути
              корисними. Протеїн це джерело білків для відновлення і росту
              м'язів, гейнери забезпечують енергію та калорії для росту, креатин
              підвищує фізичні можливості (витривалість), а BCAA (амінокислоти
              гарантують швидке відновлення та зменшують втому під час
              тренувань). Проте пам'ятайте, що їх вживання повинно бути
              збалансованим і під контролем фахівця, і що добавки не замінюють
              (лише доповнюють) різноманітне та здорове харчування.
            </p>
            <p className="p-text">
              Запам'ятайте, набір м'язової маси - це процес, який потребує часу
              та терпіння. Поступово збільшуйте навантаження та дотримуйтеся
              збалансованого раціону. З правильним харчуванням та активністю
              ваша мета досяжна. Насолоджуйтеся своїм шляхом до здорової та
              міцної фігури!
            </p>
            <Image
              src="/fotoLearning/man-holds-dumbbell.webp"
              alt="man holds dumbbell"
              sizes="100vw"
              className="w-auto h-auto mt-6 rounded-lg "
              width={500}
              height={300}
              loading="lazy"
            />
            <div className="flex gap-6 mt-8 justify-end pt-8 border-t-2 border-main ">
              <ButtonSecond
                route="/learn/nutrition/diet-for-weight-lost"
                text="&#10094; ПОПЕРЕДНЯ"
              />
              <Button
                route="/learn/recover/enough-rest"
                text="НАСТУПНА &#10095;"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default DietForGainingWeight;
