import Link from 'next/link';

export const DescriptionFat = () => {
  return (
    <div className="basis-1/2">
      <ul className="flex flex-col gap-6 text-base lg:text-lg text-justify text-mainText dark:text-mainTextBlack">
        <li>
          Оптимальною кількістю жиру в тілі є <strong>12-20%</strong> для
          чоловіків і <strong>16-24%</strong> для жінок. У цьому випадку фігура
          виглядає спортивною, у міру рельєфною, а здоров'я не страждає.
        </li>
        <li>
          З віком, при постійному підшкірному прошарку жиру загальна його
          кількість росте: накопичується внутрішньом'язовий жир та жирові
          клітини, що огортають внутрішні органи.
        </li>
        <li>
          Чоловіки з <strong>30%</strong> жиру і жінки з <strong>35%</strong>{' '}
          мають явні зовнішні ознаки ожиріння. Окрім естетики, починаються
          проблеми зі здоров'ям: різко збільшується кількість проблем з серцем
          та судинами.
        </li>
        <li>
          Даний калькулятор вираховує показник кількості жиру в організмі за
          формулою Джексона-Поллока, базуючись на розмірах жирових складок на
          грудях, животі і стегні (можна виміряти за допомогою спеціального
          каліпера або простої лінійки). Цей метод розрахунку кількості жиру в
          організмі є одним із найбільш точних.
        </li>
        <li>
          {' '}
          Короткі статті про{' '}
          <Link
            href="/learn/nutrition/diet-for-weight-lost"
            className="text-mainTitle dark:text-mainTitleBlack underline"
          >
            Раціон при схудненні
          </Link>{' '}
          та{' '}
          <Link
            href="/learn/nutrition/diet-for-gaining-weight"
            className="text-mainTitle dark:text-mainTitleBlack underline"
          >
            Раціон при наборі ваги
          </Link>
        </li>
      </ul>

      <p className="text-lg font-semibold mt-6 text-mainTitle dark:text-mainTitleBlack">
        Як виміряти шкірні складки:
      </p>
      <ul className="flex flex-col gap-1 text-justify mt-3 list-disc list-inside text-mainText dark:text-mainTextBlack">
        <li>
          Відтягнути шкіру вказівним і великим пальцем в потрібному місці і
          заміряти відстань між пальцями (товщину складки). Або скористатись
          каліпером.
        </li>
        <li>
          Груди – складка виміряється по зовнішньому краю великого грудного.
        </li>
        <li>
          Живіт — вертикальна складка біля пупка (на відставні 2 см), там, де
          найбільше жиру (для чоловіків). Або вертикальна складка збоку на рівні
          пупка, там, де найбільше жиру (для жінок).
        </li>
        <li>
          Стегно — вертикальна складка на передній середній лінії стегна, між
          бедром і коліном.
        </li>
        <li>
          Тріцепс - вертикальна складка на задній середній лінії руки, між
          плечем і ліктем
        </li>
      </ul>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Норма відсотка жиру для чоловіків
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th className="py-2 pr-4">Відсоток жиру</th>
              <th className="py-2">Оцінка</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">до 6%</td>
              <td className="py-2">Мінімальний рівень</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">6–13%</td>
              <td className="py-2">Спортсмен, атлетична статура</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">13–17%</td>
              <td className="py-2">Гарна фізична форма</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">17–21%</td>
              <td className="py-2">Середній рівень</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">21–25%</td>
              <td className="py-2">Прийнятний рівень</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">понад 25%</td>
              <td className="py-2">Зайва вага</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Норма відсотка жиру для жінок
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th className="py-2 pr-4">Відсоток жиру</th>
              <th className="py-2">Оцінка</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">до 10%</td>
              <td className="py-2">Виснаження (небезпечно)</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">10–14%</td>
              <td className="py-2">Мінімальний для здоров’я</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">14–16%</td>
              <td className="py-2">Спортсменка, атлетична статура</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">16–20%</td>
              <td className="py-2">Аматорка спорту, гарна форма</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">20–24%</td>
              <td className="py-2">Прийнятний рівень</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">24–30%</td>
              <td className="py-2">Середній рівень</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">понад 30%</td>
              <td className="py-2">Зайва вага</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-mainText dark:text-mainTextBlack">
        Джерело: метод каліперометрії за формулою Джексона-Поллока; орієнтовні
        норми —{' '}
        <a
          href="https://www.acsm.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mainTitle dark:text-mainTitleBlack underline"
        >
          Американський коледж спортивної медицини (ACSM)
        </a>
        .
      </p>
    </div>
  );
};
