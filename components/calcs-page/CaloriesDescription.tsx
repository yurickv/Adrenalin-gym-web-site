import Link from 'next/link';

export const CaloriesDescription = () => {
  return (
    <div className="basis-1/2 text-mainText dark:text-mainTextBlack">
      <p className="mt-6 text-base lg:text-lg  text-justify">
        Скільки калорій треба, щоб схуднути, наростити м’язову масу або утримати
        свою теперішню вагу? Цей показник для кожного індивідуальний. Введіть
        свої дані, і калькулятор калорій за формулою Міффліна-Сан Жеора
        розрахує оптимальне значення саме для вас, враховуючи: стать, вік,
        зріст, теперішню вагу та активність
      </p>
      <p className="mt-6 text-base lg:text-lg  text-justify">
        Щоб схуднути, скоротіть кількість споживаних калорій в день на{' '}
        <strong> 10-15%</strong>. Якщо ви хочете набрати вагу, збільште на{' '}
        <strong>10-15%</strong> кількість калорій в день. Важливо: не
        рекомендується зменшувати загальну кількість калорій в день менше 1200
        калорій , так як це небезпечно для вашого здоров'я. Також не
        рекомендується втрачати більше 0,8 - 1 кг в тиждень.
      </p>
      <p className="mt-6 text-base lg:text-lg  text-justify">
        Для більш збалансованого схуднення на 0,5 - 0,8 кг на тиждень скоротіть
        споживання калорій на 5-7% , а решту 5-7% калорій втрачайте, виконуючи
        фізичні вправи для схуднення. Цей підхід запобігає зменшення вашого
        рівня метаболізму (обміну речовин) і допоможе зберегти м'язову масу. В
        такому випадку результат буде довготривалим.
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

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-base border-collapse">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Коефіцієнти рівня активності
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th className="py-2 pr-4">Рівень активності</th>
              <th className="py-2">Коефіцієнт</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">Сидячий спосіб життя</td>
              <td className="py-2">1,2</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">Легка активність (1–3 тренування/тиждень)</td>
              <td className="py-2">1,375</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">Помірна активність (3–5 тренувань/тиждень)</td>
              <td className="py-2">1,55</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 pr-4">Висока активність (6–7 тренувань/тиждень)</td>
              <td className="py-2">1,725</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Дуже висока (важка фізична праця)</td>
              <td className="py-2">1,9</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm">
        Джерело: рівняння базального метаболізму Mifflin-St Jeor (1990);
        рекомендації щодо харчування —{' '}
        <a
          href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mainTitle dark:text-mainTitleBlack underline"
        >
          Всесвітня організація охорони здоров’я (ВООЗ)
        </a>
        .
      </p>
    </div>
  );
};
