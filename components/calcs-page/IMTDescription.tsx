import Link from 'next/link';

export const DescriptionIMT = () => {
  return (
    <div className="text-mainText dark:text-mainTextBlack">
      <ul className="flex flex-col gap-6 text-base lg:text-lg text-justify">
      <li>
        Індекс маси тіла (ІМТ) розраховується за формулою: вага в кілограмах,
        поділена на квадрат зросту в метрах (ІМТ = вага / зріст²). Це простий
        спосіб оцінити, чи відповідає ваша вага зросту.
      </li>
      <li>
        Якщо індекс маси тіла (ІМТ) менше <strong>18,5</strong> – вага
        недостатня. Підвищується ризик виникнення таких розладів здоровʼя, як
        аменорея у жінок (відсутність місячних), крихкість кісток, нестача
        поживних речовин для здорового функціонування усіх систем організму.
      </li>
      <li>
        Якщо індекс маси тіла (ІМТ) становить <strong>18,5 - 24,9</strong> –
        вага у нормі. «Ідеальний» ІМТ для людей віком до 25 років -{' '}
        <strong>22 - 23</strong>. Якщо ІМТ наближується до показника{' '}
        <strong>25</strong>, почніть контролювати обʼєм талії і памʼятайте про
        про фізичну активність.
      </li>

      <li>
        {' '}
        Якщо індекс маси тіла (ІМТ) становить <strong>25,0–29,9</strong> - то у
        Вас надлишкова вага, що є фактором високого ризику виникнення
        серцево-судинних захворювань, цукрового діабету, порушень статевої
        функції та інших захворювань. Намагайтеся зменшити вагу, почніть
        правильно харчуватися і займатися спортом.
      </li>
      <li>
        Якщо індекс маси тіла (ІМТ) <strong>30 і більше</strong> – ожиріння I–III
        ступеня (див. таблицю категорій нижче). Високий індекс маси тіла повʼязаний
        з підвищеним ризиком смертності від будь-яких причин, включаючи діабет,
        хвороби серцево-судинної системи, гіпертонію і артрит.
      </li>
      <li>
        Знаючи свою форму, розрахуйте{' '}
        <Link
          href="/calcs/calories-calculator"
          className="text-mainTitle dark:text-mainTitleBlack underline"
        >
          денну норму калорій і дефіцит для схуднення
        </Link>
        .
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
      <p className="mt-6 text-sm">
        Джерело: класифікація ІМТ за даними{' '}
        <a
          href="https://www.who.int/health-topics/obesity"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mainTitle dark:text-mainTitleBlack underline"
        >
          Всесвітньої організації охорони здоровʼя (ВООЗ)
        </a>
        .
      </p>
    </div>
  );
};
