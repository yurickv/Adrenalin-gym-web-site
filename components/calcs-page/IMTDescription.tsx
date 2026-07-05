import Link from 'next/link';

export const DescriptionIMT = () => {
  return (
    <div className="basis-1/2 text-mainText dark:text-mainTextBlack">
      <ul className="flex flex-col gap-6 text-base lg:text-lg text-justify">
      <li>
        Індекс маси тіла (ІМТ) розраховується за формулою: вага в кілограмах,
        поділена на квадрат зросту в метрах (ІМТ = вага / зріст²). Це простий
        спосіб оцінити, чи відповідає ваша вага зросту.
      </li>
      <li>
        Якщо індекс маси тіла (ІМТ) менше <strong>18,5</strong> – вага
        недостатня. Підвищується ризик виникнення таких розладів здоров’я, як
        аменорея у жінок (відсутність місячних), крихкість кісток, нестача
        поживних речовин для здорового функціонування усіх систем організму.
      </li>
      <li>
        Якщо індекс маси тіла (ІМТ) становить <strong>18,5 - 24,9</strong> –
        вага у нормі. «Ідеальний» ІМТ для людей віком до 25 років -{' '}
        <strong>22 - 23</strong>. Якщо ІМТ наближується до показника{' '}
        <strong>25</strong>, почніть контролювати об’єм талії і пам’ятайте про
        про фізичну активність.
      </li>

      <li>
        {' '}
        Якщо індекс маси тіла (ІМТ) становить <strong>25.0-29,9</strong> - то у
        Вас надлишкова вага, що є фактором високого ризику виникнення
        серцево-судинних захворювань, цукрового діабету, порушень статевої
        функції та інших захворювань. Намагайтеся зменшити вагу, почніть
        правильно харчуватися і займатися спортом.
      </li>
      <li>
        Якщо індекс маси тіла (ІМТ) більше <strong>30</strong> - у вас велика
        надмірна вага (ожиріння). Вам треба худнути до більш низьких значень
        ІМТ, щоб здорово жити. Високий індекс маси тіла пов'язаний з підвищеним
        ризиком смертності від будь-яких причин, включаючи діабет, хвороби
        серцево-судинної системи, гіпертонію і артрит.
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
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-base border-collapse">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Таблиця категорій індексу маси тіла
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th className="py-2 pr-4">Індекс маси тіла (ІМТ)</th>
              <th className="py-2">Категорія</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">менше 18,5</td>
              <td className="py-2">Недостатня вага</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">18,5 – 24,9</td>
              <td className="py-2">Норма</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">25,0 – 29,9</td>
              <td className="py-2">Надлишкова вага</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">30,0 і більше</td>
              <td className="py-2">Ожиріння</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm">
        Джерело: класифікація ІМТ за даними{' '}
        <a
          href="https://www.who.int/health-topics/obesity"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mainTitle dark:text-mainTitleBlack underline"
        >
          Всесвітньої організації охорони здоров’я (ВООЗ)
        </a>
        .
      </p>
    </div>
  );
};
