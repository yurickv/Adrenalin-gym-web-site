import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Image from 'next/image';
import profilePic from '../../../../public/bg-hero.webp';
import Link from 'next/link';
import { Sidebar } from '../../Sidebar';
import { ButtonSecond } from '@/components/ButtonSecond';
import { Button } from '@/components/Button';

const BasicsNutrition = () => {
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
              <Link href="/learn/nutrition">Харчування</Link> &gt; Основи
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
              Основи збалансованого харчування
            </h2>
            <h2 className="h2-list-title mt-2 text-center">
              Збалансоване харчування - основа здоров’я, гарного вигляду і
              самопочуття
            </h2>
            <p className="p-text">
              Для чого ми взагалі їмо? Перш за все, для того, щоб існувати.
              Кожна клітинка нашого організму потребує енергії для
              життєдіяльності та відновлення. Людина не вміє добувати енергію з
              повітря, зі світла. Єдиним джерелом енергії для людини є їжа, яка
              розщеплюється в травному каналі. А речовини, що утворюються, є
              матеріалом для відбудови клітин, тканин та органів.{' '}
            </p>
            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                Кожен продукт несе певну кількість енергії
              </span>
              , що вимірюється в калоріях. Індивідуальну денну потребу калорій
              можна визначити за допомогою{' '}
              <Link
                href="/calcs/calories-calculator"
                className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
              >
                калькулятора денної норми калорій
              </Link>
              .
            </p>
            <p className="p-text">
              Окрім енергії, кожен{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                продукт несе корисні поживні речовини: білки, жири, вуглеводи,
                мікро- та макроелементи.
              </span>{' '}
              Саме їхня кількість та якість засвоєння характеризує{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                харчову цінність продукту.
              </span>
            </p>
            <p className="p-text">
              Кількість калорій двох продуктів може бути однакова, але один
              продукт містить лише вуглеводи (цукор), інший – лише жири (олія),
              а є продукти, які при тій самій калорійності мають збалансований
              склад по білках, жирах та вуглеводах. Наприклад, порція гречки та
              макаронів однакові за калорійністю. Але за своєю харчовою цінністю
              гречана каша є кращою.
            </p>
            <p className="p-text">
              Важливим є баланс продуктів, як видно на фото нижче. В цій{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                тарілці здорового збалансованого харчування 5 секторів:
              </span>
            </p>
            <ul className="ul-list">
              <li className="p-text">
                Перший і найбільший сектор – це{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  овочі
                </span>{' '}
                (буряк, морква, цибуля та часник, гарбуз, капусту та кабачок,
                огірки-помідори та інші). Подумайте, як часто ви вживаєте овочі?
                Також в цьому сегменті є{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  бобові
                </span>{' '}
                (горошок і квасоля, а також менш популярні поки що нут,
                сочевиця, соя);
              </li>
              <li className="p-text">
                Другий сегмент за годинниковою стрілкою{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  фрукти та ягоди
                </span>{' '}
                : яблука, груші, абрикоси, сливи, банани, апельсини. Також
                ягоди: – полуниця, чорниця, малина, смородина, ожина та інші.
              </li>
              <li className="p-text">
                Третій сектор -{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  молочна та кисломолочна продукція
                </span>{' '}
              </li>
              <li className="p-text">
                Четвертий сектор –{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  це цільнозернові продукти.
                </span>{' '}
                В першу чергу, це різноманітні крупи. У цьому ж сегменті
                знаходяться хліб та хлібці, але теж бажано цільнозернові, а не
                просто посипані зверху зернятками. І макаронні вироби з твердих
                сортів пшениці. Також у цьому сегменті опинилися горіхи та
                насіння.
              </li>
              <li className="p-text">
                Останній, п’ятий сегмент -{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  риба, м’ясо та яйця,
                </span>{' '}
                вони є чудовими джерелами білків.
              </li>
            </ul>
            <Image
              src="/fotoLearning/plate-of-food.webp"
              alt="foto plate of healsy food"
              sizes="100vw"
              className="w-full h-auto mt-6 rounded-lg "
              width={300}
              height={300}
              loading="lazy"
            />
            <p className="p-text">
              Але ми їмо також для того, щоб{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                задовольнити і психологічні потреби:
              </span>
            </p>
            <ul className="ul-list">
              <li className="p-text">
                відновити психологічний спокій та безпеку (це ще з раннього
                дитинства, коли мама годує немовля і воно заспокоюється);
              </li>
              <li className="p-text">відчути позитивні емоції;</li>
              <li className="p-text">
                бути у єдності з іншими (їмо «за компанію»);
              </li>
              <li className="p-text">
                прагнемо заслужити повагу оточуючих (обираємо престижні продукти
                та модні системи харчування );
              </li>
              <li className="p-text">організувати свій вільний час.</li>
            </ul>
            <p className="p-text">
              Варто усвідомлювати –{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                ми хочемо їсти, щоб насититись чи просто, щоб заспокоїтись чи
                розважитись,
              </span>{' '}
              а можливо просто їмо за компанію (так спільна трапеза сприяє
              налагодженню стосунків також).
            </p>
            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                Висновок:
              </span>{' '}
              Зосереджуйте увагу на процесі споживання їжі – їжте повільно,
              відчувайте запах, свідомо насолоджуйтеся смаком. Щоб легше
              дотримуватися правил здорового харчування, перш ніж щось з’їсти,
              запитайте себе: Навіщо мені ця їжа? Цього дійсно потребує мій
              організм? Як я буду почувати себе та як буду виглядати з часом
              після того, як це з’їм?
            </p>
            <p className="p-text">
              На додачу ще фото з конкретними{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                кроками до здорового харчування
              </span>{' '}
              (ні це не дорого)):
            </p>
            <Image
              src="/fotoLearning/steps-for-healsy-ration.webp"
              alt="foto steps for healsy ration"
              sizes="100vw"
              className="w-full h-auto mt-6 rounded-lg "
              width={300}
              height={300}
              loading="lazy"
            />
            <div className="flex gap-6 mt-8 justify-end pt-8 border-t-2 border-main ">
              <ButtonSecond
                route="/learn/training/load-progression"
                text="&#10094; ПОПЕРЕДНЯ"
              />
              <Button
                route="/learn/nutrition/before-after-training"
                text="НАСТУПНА &#10095;"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default BasicsNutrition;
