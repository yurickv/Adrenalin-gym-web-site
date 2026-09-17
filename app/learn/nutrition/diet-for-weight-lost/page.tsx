import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Image from 'next/image';
import profilePic from '../../../../public/bg-hero.webp';
import Link from 'next/link';
import { Sidebar } from '../../Sidebar';
import { ButtonSecond } from '@/components/ButtonSecond';
import { Button } from '@/components/Button';

const DietForWeightLost = () => {
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
              схудненні
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
              Раціон при схудненні
            </h2>

            <h2 className="h2-list-title mt-2 text-center">
              Худнути легко - змініть свої харчові звички
            </h2>
            <p className="p-text">
              Коли ми відчуваємо голод? Голод це певний стан організму, коли той
              сигналізує, що важливі речовини в крові уже майже закінчилися і є
              потреба їх поповнити.
            </p>
            <p className="p-text">
              Відчуття ситості приходить рефлекторно на розтягнення стінок
              шлунку, або уже через 1,5 - 2 години після поповнення крові
              основними речовинами, в першу чергу – глюкозою (цукри).
            </p>
            <p className="p-text">
              Тому велика порція салату, що має низку калорійність, дасть таке
              саме відчуття ситості, як і шматок жирного м'яса, але через
              хвилини, а м'ясо - лише через 1,5 години. Вибір за вами!
            </p>
            <p className="p-text">
              Оптимальний режим харчування позитивно впливає на весь процес
              травлення,{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                регулярні основні прийоми їжі
              </span>{' '}
              та перекуси запобігають надмірним коливанням рівнів гормонів, які
              відповідають за відчуття голоду/насичення та{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                забезпечують помірне споживання їжі із тривалим відчуттям
                ситості.
              </span>{' '}
            </p>
            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                Голод та апетит – це абсолютно різні речі.
              </span>{' '}
              Голод – це потреба організму. А апетит – це потреба душі. Їсти з
              апетитом означає отримувати задоволення від їжі. Наприклад,
              улюблену цукерку ми завжди їмо з задоволенням, навіть якщо
              тільки-но з’їли хорошу порцію їжі, тобто не обов‘язково для цього
              бути голодним.
            </p>
            <p className="p-text">
              В кожного є певна{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                денна потреба в калоріях та в поживних речовинах.
              </span>{' '}
              Ці калорії витрачаються на підтримання діяльності тіла, фізичну
              активність, травлення їжі, ріст та відновлення. Індивідуальну
              денну потребу калорій можна визначити за допомогою{' '}
              <Link
                href="/calcs/calories-calculator"
                className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
              >
                калькулятора калорій для схуднення
              </Link>
              .
            </p>
            <p className="p-text">
              Якщо з’їли більше калорій ніж витратили, то надлишкові
              відкладаються в жирових клітинах. Якщо довго переїдати калорії, то
              людина набирає лишню вагу. Визначити, в якій ви формі, легко за
              допомогою наших інструментів:{' '}
              <Link
                href="/calcs/imt-calculator"
                className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
              >
                калькулятор ІМТ
              </Link>{' '}
              та{' '}
              <Link
                href="/calcs/fat-calculator"
                className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
              >
                калькулятор відсотка жиру в організмі
              </Link>
              .
            </p>
            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                Пам’ятайте – значення мають довгострокові дії, тобто те як ви
                їсте постійно.
              </span>{' '}
              Тому дієти часто мало ефективні – вага вертається (бо харчові
              звички, які привели до ожиріння залишились ті самі).
            </p>
            <Image
              src="/fotoLearning/thin woman shows abs.webp"
              alt="thin woman shows abs"
              sizes="100vw"
              className="w-auto h-auto mt-6 rounded-lg "
              width={500}
              height={300}
              loading="lazy"
            />
            <h2 className="h2-list-title mt-6 text-center">
              Основні моменти для жиро спалення і приведення себе в бажану
              форму:
            </h2>
            <ul className="ul-list !list-image-none">
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  1. Режим харчування.
                </span>{' '}
                Організуйте собі триразове харчування: сніданок, обід, легка
                вечеря. Нормальні сніданки (а не чашка кави/чаю) і ситний обід
                мають забезпечити 70-80% усіх калорій за день. Дуже поширено
                (нажаль) коли без сніданків (не має часу) і обідів (не має де
                пообідати) люди приходять ввечері і наїдаються «від пуза», бо ж
                голодні як «собака»). Природно що організм не встигає витратити
                ці всі калорії до сну і вони відкладаються в жирових клітинах.
              </li>

              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  2. Баланс продуктів з високою і низькою харчовою цінністю
                </span>{' '}
                (наприклад каша/майонез). Віддаємо перевагу продуктам з довгими
                вуглеводами (каші, хліб з висівками, макарони твердих сортів
                пшениці), білковим не жирним продуктам та овочам з фруктами
                (мають становити до 50% усієї їжі). Тобто можна набрати свою{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack">
                  денну
                </span>{' '}
                норму калорій з’ївши 300гр. печива чи цукерків, але поживних
                речовин (білків, клітковини) в них обмаль.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  3. Калорії всьому голова.
                </span>{' '}
                Тут все просто – з’їдаєш більше денної норми калорій –
                поправляєшся, менше – худнеш. Достатньо лише на 10-15% змінити
                споживання і в довготривалому періоді вага почне змінюватись. В
                середньому жінки (і чоловіки), які регулярно тренуються в
                спортзалі і дотримуються цих порад{' '}
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack">
                  худнуть ~ 4 кг в місяць{' '}
                  <span className="underline underline-offset-4 decoration-wavy">
                    без дієт
                  </span>
                  .
                </span>{' '}
                Підрахунок з’їдених продуктів (їхньої калорійності та поживних
                речовин) найкраще вести в мобільних додатках (наприклад{' '}
                <Link
                  href="https://play.google.com/store/apps/details?id=cz.psc.android.kaloricketabulky&hl=ua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  «Таблиця калорійності»
                </Link>{' '}
                та ін.).
              </li>
            </ul>
            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                Популярний міф у схудненні
              </span>{' '}
              – я нічого не буду їсти і схудну. Якщо сильно обмежити споживання
              калорій на 50%, то ви почнете менше або{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                взагалі перестанете худнути.
              </span>{' '}
              Бо організм уповільнить обмін речовин і відповідно спалення
              калорій також знизиться, як наслідок швидка втомлюваність, апатія
              і довге відновлення після навантажень.
            </p>
            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                Ще один міф у схудненні
              </span>{' '}
              – я регулярно переїдаю, але я все те відпрацюю в спортзалі (на
              роботі чи деінде).{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                Легше НЕ з’їсти лишню булку, ніж її потім спалити
              </span>{' '}
              фізичною активністю.
            </p>
            <Image
              src="/fotoLearning/man-holding-measuring-tape-around-waist.webp"
              alt="muscular man holding measuring tape around waist"
              sizes="100vw"
              className="w-auto h-auto mt-6 rounded-lg "
              width={500}
              height={300}
              loading="lazy"
            />
            <p className="p-text">
              Спортзал допоможе підтягнути фігуру і тримати її в тонусі.
              Чоловіки підкачають м’язи в тренажерному залі, жінки зможуть
              підтримати і покращити їх форму (не накачатись). В процесі
              відновлення після спортзалу організм посилено споживає калорії і
              поживні речовини{' '}
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                ще 24 год. після тренування.
              </span>{' '}
              Крім того м’язи споживають досить багато калорій навіть в спокої.
              Тому спортивним людям набагато легше худнути і тримати себе в
              тонусі (а не лише через те, що вони багато тренуються).
            </p>
            <h3 className="h2-list-title my-6 text-center">
              Тому найкраща стратегія до підтягнутого спортивного тіла -
              поєднувати наші рекомандації з харчування і регулярні тренування в
              спортзалі.
            </h3>
            <p className="p-text">
              <span className="font-semibold text-mainTitle dark:text-mainTitleBlack ">
                Висновок:
              </span>{' '}
              схуднути можна змінивши свої харчові звички та збільшивши фізичну
              активність. Наша фізична форма і вигляд – це те як ми харчуємось і
              який спосіб життя ведемо (можна вести сидячий спосіб життя, але 3
              рази в тиждень спортзалу це компенсує). Тобто організм просто
              адаптується до того, що ВИ йому даєте (в плані їжі та
              навантажень). Якщо не впевнені в чомусь, то зверніться до наших
              тренерів за порадою, а краще запишіться{' '}
              <Link
                href="/services#coach-training"
                className="underline underline-offset-4 font-semibold text-mainTitle dark:text-mainTitleBlack"
              >
                сьогодні на персональне тренування.
              </Link>
            </p>
            <div className="flex gap-6 mt-8 justify-end pt-8 border-t-2 border-main ">
              <ButtonSecond
                route="/learn/nutrition/before-after-training"
                text="&#10094; ПОПЕРЕДНЯ"
              />
              <Button
                route="/learn/nutrition/diet-for-gaining-weight"
                text="НАСТУПНА &#10095;"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default DietForWeightLost;
