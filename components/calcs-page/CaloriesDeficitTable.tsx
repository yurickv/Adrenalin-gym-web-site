import { formatKg, safeMinimum, weeklyLossKg } from '@/lib/calories';

const BASE = 2000;
const DEFICITS = [10, 15, 20];

export const CaloriesDeficitTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Дефіцит калорій для схуднення: скільки віднімати
      </h2>
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <p className="mb-6 text-base lg:text-lg">
          Дефіцит калорій — це різниця між нормою і тим, що ви з'їдаєте. Для сталого
          схуднення достатньо 10–20% від норми, оптимально 15%. Приклад для норми {BASE} ккал:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base border-collapse">
            <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
              Дефіцит калорій і орієнтовна втрата ваги
            </caption>
            <thead>
              <tr className="border-b border-gray-400">
                <th scope="col" className="py-2 pr-4">Дефіцит</th>
                <th scope="col" className="py-2 pr-4">ккал на день</th>
                <th scope="col" className="py-2 pr-4">Мінус на день</th>
                <th scope="col" className="py-2">Втрата за тиждень</th>
              </tr>
            </thead>
            <tbody>
              {DEFICITS.map(percent => {
                const perDay = Math.round((BASE * percent) / 100);
                return (
                  <tr key={percent} className="border-b border-gray-300">
                    <th scope="row" className="py-2 pr-4 font-normal">{percent}%</th>
                    <td className="py-2 pr-4">{BASE - perDay}</td>
                    <td className="py-2 pr-4">{perDay} ккал</td>
                    <td className="py-2">≈ {formatKg(weeklyLossKg(perDay))} кг</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ul className="mt-6 flex flex-col gap-2 list-disc list-inside text-base lg:text-lg">
          <li>
            Не опускайтеся нижче {safeMinimum('female')} ккал для жінок і{' '}
            {safeMinimum('male')} ккал для чоловіків.
          </li>
          <li>Не більше 0,5–1 кг на тиждень: швидше втрачаються мʼязи і вода.</li>
          <li>Після кожних 4–5 кг перерахуйте норму: легше тіло витрачає менше.</li>
          <li>Розрахунок орієнтовний: 1 кг жиру ≈ 7700 ккал, реальний темп коливається.</li>
        </ul>
      </div>
    </div>
  </section>
);
