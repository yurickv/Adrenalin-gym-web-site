import { bmrMifflin, macros, PROTEIN_PER_KG, targets, tdee } from '@/lib/calories';
import { CALORIES_EXAMPLE } from './caloriesContent';

const COEFFICIENTS = [
  { label: 'Сидячий спосіб життя', value: '1,2' },
  { label: 'Легка активність (1–3 тренування/тиждень)', value: '1,375' },
  { label: 'Помірна активність (3–5 тренувань/тиждень)', value: '1,55' },
  { label: 'Висока активність (6–7 тренувань/тиждень)', value: '1,725' },
  { label: 'Дуже висока (важка фізична праця)', value: '1,9' },
];

const decimal = (n: number) => String(n).replace('.', ',');

const stepTitle = 'text-lg font-bold text-mainTitle dark:text-mainTitleBlack mb-2';

export const CaloriesFormula = () => {
  const e = CALORIES_EXAMPLE;
  const bmr = bmrMifflin({ sex: e.sex, age: e.age, heightCm: e.heightCm, weightKg: e.weightKg });
  const daily = tdee(bmr, e.activity);
  const t = targets(daily);
  const m = macros(t.loss15, e.weightKg, e.goal);

  return (
    <section className="bg-white dark:bg-darkBody">
      <div className="div-container py-[20px] md:py-[44px] mx-auto">
        <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
          Як розраховується норма калорій: формула Міффліна-Сан Жеора
        </h2>
        <div className="max-w-[900px] mx-auto flex flex-col gap-6 text-base lg:text-lg text-mainText dark:text-mainTextBlack">
          <p>
            Формулу опублікували Міффлін, Сан Жеор та співавтори в American Journal
            of Clinical Nutrition у 1990 році. Розрахунок має три кроки.
          </p>

          <div>
            <h3 className={stepTitle}>
              1. Базовий обмін (BMR) — енергія, яку тіло витрачає у спокої
            </h3>
            <ul className="flex flex-col gap-1 list-disc list-inside">
              <li>
                <span className="font-semibold">Чоловіки:</span> 10 × вага (кг) + 6,25 ×
                зріст (см) − 5 × вік + 5
              </li>
              <li>
                <span className="font-semibold">Жінки:</span> 10 × вага (кг) + 6,25 ×
                зріст (см) − 5 × вік − 161
              </li>
            </ul>
          </div>

          <div>
            <h3 className={stepTitle}>2. Норма калорій = BMR × коефіцієнт активності</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
                  Коефіцієнти рівня активності
                </caption>
                <thead>
                  <tr className="border-b border-gray-400">
                    <th scope="col" className="py-2 pr-4">Рівень активності</th>
                    <th scope="col" className="py-2">Коефіцієнт</th>
                  </tr>
                </thead>
                <tbody>
                  {COEFFICIENTS.map(row => (
                    <tr key={row.value} className="border-b border-gray-300">
                      <th scope="row" className="py-2 pr-4 font-normal">{row.label}</th>
                      <td className="py-2">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className={stepTitle}>3. Поправка на мету</h3>
            <p>
              Для схуднення від норми віднімають 10–20% (оптимально 15%), для набору ваги
              додають 10–15%. Білок — 1,6–2 г на кг ваги залежно від мети, жири — 25%
              калорійності, решта — вуглеводи.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 dark:border-gray-600 p-4 md:p-6">
            <h3 className={stepTitle}>
              Приклад: жінка, {e.age} років, {e.heightCm} см, {e.weightKg} кг, помірна
              активність ({decimal(e.activity)})
            </h3>
            <ol className="flex flex-col gap-1 list-decimal list-inside">
              <li>
                BMR = 10 × {e.weightKg} + 6,25 × {e.heightCm} − 5 × {e.age} − 161 ≈ {bmr} ккал
              </li>
              <li>
                Норма = {bmr} × {decimal(e.activity)} ≈ {daily}, округлено {t.maintain} ккал
              </li>
              <li>Для схуднення (−15%): {t.loss15} ккал</li>
              <li>
                БЖВ: білок {m.proteinG} г ({decimal(PROTEIN_PER_KG[e.goal])} г × {e.weightKg}{' '}
                кг), жири {m.fatG} г, вуглеводи {m.carbsG} г
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
