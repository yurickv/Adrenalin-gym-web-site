import { HomeIcon } from '@/components/icons/forPopMenu/HomeIcon';
import Image from 'next/image';
import profilePic from '../../../public/bg-hero.webp';
import Link from 'next/link';
import { Sidebar } from '../Sidebar';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/canonical';

export const metadata: Metadata = {
  title: 'Вступ. Перед початком тренувань в тренажерному залі',
  description:
    'Чому важливо тренуватись та вести активний спосіб життя, що буде при сидячому способі життя. Тренування як стиль життя успішної людини',
  alternates: canonicalFor('/learn/intro'),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      'max-snippet': -1,
    },
  },
};

const Intro = () => {
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
              &gt; <Link href="/learn">Навчання</Link> &gt; Вступ
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
              Тренування як стиль життя успішної людини
            </h2>
            <p className="p-text">
              Наше тіло створене для руху. Саме завдяки руху ми можемо
              взаємодіяти з навколишнім світом, виконувати повсякденні завдання
              та досягати своїх цілей.
            </p>
            <p className="p-text">
              Раніше, сотні років тому, життя було більш активним. Щоб вижити,
              людині доводилося багато працювати фізично. Однак технічний
              прогрес суттєво спростив наше життя. Ми стали менше рухатися, і це
              призвело до проблем зі здоров'ям. Сидяче життя негативно впливає
              на наше тіло. Воно слабшає, м'язи зменшуються, а обмін речовин
              сповільнюється. Це може привести до ожиріння, серцево-судинних
              захворювань, а також до проблем з опорно-руховим апаратом.
            </p>

            <p className="p-text !font-semibold text-mainTitle dark:text-mainTitleBlack">
              Взагалі наша фізична форма – це результат пристосування до
              фізичних навантажень і харчування. Тобто це динамічна (постійно
              змінна) величина.
            </p>
            <p className="p-text">
              Впевнені, успішні люди розуміють важливість фізичної активності.
              Вони ведуть активний спосіб життя, регулярно займаються спортом і
              стежать за своїм харчуванням.
            </p>
            <p className="p-text">
              Тренування - це не просто спосіб схуднути або набрати м'язову
              масу. Це спосіб покращити своє здоров'я, підвищити рівень енергії
              та досягти своїх цілей. Для цього достатньо 3 рази в тиждень по 1
              год. - регулярні тренування протягом тривалого часу. Як бонус – ви
              практично ніколи не будете хворіти. Пропонуємо пройти цей шлях з
              нами.
            </p>
            <h2 className="h2-list-title mt-2">
              Як тренування впливає на успіх?
            </h2>
            <ul className="ul-list">
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  Підвищує впевненість в собі.{' '}
                </span>
                Ви стаєте і відчуваєте себе привабливим, здоровим і фізично
                сильним, ви почуваєтесь впевненіше. Це допоможе вам досягти
                успіху в кар'єрі та особистому житті.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  Покращується зовнішній вигляд.{' '}
                </span>
                Це банальна істина, але регулярно займаючись спортом,
                виглядатимеш більш привабливо. Це може допомогти покращити свої
                соціальні контакти та досягти успіху в кар'єрі.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  Розвиваються лідерські якості.{' '}
                </span>
                Людина, яка вміє контролювати своє тіло, швидше за все, також
                вміє контролювати себе та свої емоції. Це є важливою
                характеристикою успішного лідера. Також дисципліна буде на
                висоті – обов’язкова умова для досягнення успіху.
              </li>
              <li className="p-text">
                <span className="font-semibold text-mainTitle dark:text-mainTitleBlack mt-2">
                  Зменшує стрес і піднімає стресостійкість{' '}
                </span>
                Фізична активність є природним антидепресантом. Вона допомагає
                зняти стрес, тривогу та депресію. Людина, яка регулярно
                займається спортом, краще справляється зі стресом. Це важливо в
                сучасному світі, де стрес є одним з головних факторів, що
                негативно впливають на наше здоров'я та успіх.
              </li>
            </ul>
            <p className="p-text">
              Давате зараз почнем шлях до Вашого тіла мрії. Тренування в
              тренажерному залі стоять на трьох китах - основах: власне
              тренування, адекватне харчування і відпочинок. Далі ми про це і
              поговоримо.
            </p>
            <Image
              src="/fotoLearning/happy-female.webp"
              alt="happy-female"
              sizes="100vw"
              className="w-full h-auto mt-6 rounded-lg"
              width={500}
              height={300}
              loading="lazy"
            />
            <div className="flex gap-6 mt-8 justify-end pt-8 border-t-2 border-main">
              <Button
                route="/learn/training/warm-up"
                text="НАСТУПНА &#10095;"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Intro;
