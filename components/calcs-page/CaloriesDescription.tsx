import Link from 'next/link';

export const CaloriesDescription = () => {
  return (
    <div className="text-mainText dark:text-mainTextBlack">
      <p className="mt-6 text-base lg:text-lg  text-justify">
        Скільки калорій треба, щоб схуднути, наростити мʼязову масу або утримати
        свою теперішню вагу? Цей показник для кожного індивідуальний. Введіть
        свої дані, і калькулятор калорій за формулою Міффліна-Сан Жеора
        розрахує оптимальне значення саме для вас, враховуючи: стать, вік,
        зріст, теперішню вагу та активність
      </p>
      <p className="mt-6 text-base lg:text-lg  text-justify">
        Дефіцит калорій створює харчування, а силові тренування бережуть мʼязи:
        так організм втрачає жир, а не мускулатуру, обмін речовин менше
        сповільнюється, і результат тримається довго. Безпечний темп — не більше
        0,5–1% маси тіла на тиждень; оцінюйте його за місячним трендом, бо вода
        дає щоденні коливання.
      </p>
      <p className="text-lg font-bold mt-6 text-mainTitle dark:text-mainTitleBlack">
        Пам'ятайте, що надміру ваги сприяє ряд факторів:
      </p>
      <ul className="flex flex-col gap-1 text-justify mt-3 list-disc list-inside">
        <li>малоактивний спосіб життя;</li>
        <li>
          похибки в режимі харчування (надмірне споживання вуглеводів, жирів,
          солі, солодких і алкогольних напоїв, прийом їжі на ніч і ін);
        </li>
        <li>психологічне переїдання;</li>
        <li>фізіологічні стани (лактація, вагітність, клімакс);</li>
        <li>деякі ендокринні патології;</li>
        <li>
          стреси, недосипання, вживання психотропних і гормональних препаратів
          (стероїди, інсуліну, протизаплідних таблеток) і тощо.
        </li>
      </ul>
      <div>
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
      </div>
    </div>
  );
};
