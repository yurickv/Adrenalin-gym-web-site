import Link from 'next/link';
import { FAT_CATEGORIES, fatRangeLabel, HEALTHY_RANGE } from '@/lib/bodyFat';
import type { Sex } from '@/lib/calories';

const linkClass = 'text-mainTitle dark:text-mainTitleBlack underline';

const NormTable = ({ sex, title }: { sex: Sex; title: string }) => (
  <div className="mt-8 overflow-x-auto">
    <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
      <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
        {title}
      </caption>
      <thead>
        <tr className="border-b border-gray-400">
          <th scope="col" className="py-2 pr-4">Відсоток жиру</th>
          <th scope="col" className="py-2">Оцінка</th>
        </tr>
      </thead>
      <tbody>
        {FAT_CATEGORIES[sex].map((category, index) => (
          <tr key={category.label} className="border-b border-gray-300">
            <th scope="row" className="py-2 pr-4 font-normal">
              {fatRangeLabel(FAT_CATEGORIES[sex], index)}
            </th>
            <td className="py-2">{category.label}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DescriptionFat = () => {
  return (
    <div className="text-mainText dark:text-mainTextBlack">
      <ul className="flex flex-col gap-6 text-base lg:text-lg text-justify">
        <li>
          Калькулятор рахує відсоток жиру двома способами. За обхватами шиї, талії і стегон
          працює метод ВМС США: потрібна лише сантиметрова стрічка. За трьома шкірними
          складками працює формула Джексона-Поллока: потрібен каліпер або лінійка і помічник.
        </li>
        <li>
          Здоровий діапазон: <strong>{HEALTHY_RANGE.male[0]}–{HEALTHY_RANGE.male[1]}%</strong>{' '}
          для чоловіків і{' '}
          <strong>{HEALTHY_RANGE.female[0]}–{HEALTHY_RANGE.female[1]}%</strong> для жінок. У
          цьому випадку фігура виглядає спортивною, у міру рельєфною, а здоровʼя не страждає.
        </li>
        <li>
          З віком при незмінному підшкірному прошарку загальна кількість жиру росте:
          накопичується внутрішньомʼязовий жир і жир навколо внутрішніх органів.
        </li>
        <li>
          Чоловіки з <strong>30%</strong> жиру і жінки з <strong>35%</strong> мають явні ознаки
          ожиріння, а разом з ними ростуть ризики для серця і судин.
        </li>
        <li>
          Обидва методи мають похибку 3–4%. Для самоконтролю важливіша не абсолютна точність,
          а однакові умови вимірів: той самий час доби, та сама стрічка, ті самі точки.
        </li>
        <li>
          Знаючи свою форму, розрахуйте{' '}
          <Link href="/calcs/calories-calculator" className={linkClass}>
            денну норму калорій і дефіцит для схуднення
          </Link>
          .
        </li>
        <li>
          Короткі статті про{' '}
          <Link href="/learn/nutrition/diet-for-weight-lost" className={linkClass}>
            Раціон при схудненні
          </Link>{' '}
          та{' '}
          <Link href="/learn/nutrition/diet-for-gaining-weight" className={linkClass}>
            Раціон при наборі ваги
          </Link>
          .
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 text-mainTitle dark:text-mainTitleBlack">
        Як виміряти обхвати
      </h3>
      <ul className="flex flex-col gap-1 text-justify mt-3 list-disc list-inside">
        <li>Шия: під гортанню, стрічка трохи нахилена вперед-вниз, не стискає.</li>
        <li>
          Талія: чоловіки на рівні пупа, жінки в найвужчому місці; горизонтально, живіт не
          втягувати, вимір після спокійного видиху.
        </li>
        <li>Стегна (для жінок): у найширшому місці сідниць, стрічка горизонтально.</li>
        <li>Зріст без взуття. Усі виміри в сантиметрах, стрічка щільна, але не врізається.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 text-mainTitle dark:text-mainTitleBlack">
        Як виміряти шкірні складки
      </h3>
      <ul className="flex flex-col gap-1 text-justify mt-3 list-disc list-inside">
        <li>
          Відтягніть шкіру вказівним і великим пальцями в потрібному місці і виміряйте товщину
          складки каліпером або лінійкою.
        </li>
        <li>Груди (чоловіки): діагональна складка посередині між передньою пахвовою лінією і соском.</li>
        <li>Трицепс (жінки): вертикальна складка на задній середній лінії руки між плечем і ліктем.</li>
        <li>Живіт (чоловіки): вертикальна складка за 2 см від пупа.</li>
        <li>
          Над клубовою кісткою (жінки): діагональна складка над гребенем таза по передній
          пахвовій лінії.
        </li>
        <li>Стегно: вертикальна складка на передній поверхні посередині між пахом і коліном.</li>
      </ul>

      <NormTable sex="male" title="Норма відсотка жиру для чоловіків" />
      <NormTable sex="female" title="Норма відсотка жиру для жінок" />

      <p className="mt-6 text-sm">
        Джерела: метод ВМС США за обхватами (Hodgdon &amp; Beckett, 1984); каліперометрія за
        формулою Джексона-Поллока; орієнтовні норми{' '}
        <a
          href="https://www.acsm.org"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Американського коледжу спортивної медицини (ACSM)
        </a>
        .
      </p>
    </div>
  );
};
