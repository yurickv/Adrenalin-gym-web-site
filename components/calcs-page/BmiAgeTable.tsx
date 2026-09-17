import { AGE_BMI_NORMS } from '@/lib/bmi';

const ageLabel = (from: number, to: number) => (to >= 100 ? `${from} і старше` : `${from}–${to}`);

export const BmiAgeTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Норма ІМТ за віком
      </h2>
      <div className="max-w-[900px] mx-auto overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Орієнтовна норма ІМТ для різного віку
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th scope="col" className="py-2 pr-4">Вік, років</th>
              <th scope="col" className="py-2">Норма ІМТ</th>
            </tr>
          </thead>
          <tbody>
            {AGE_BMI_NORMS.map(row => (
              <tr key={row.from} className="border-b border-gray-300">
                <th scope="row" className="py-2 pr-4 font-normal">{ageLabel(row.from, row.to)}</th>
                <td className="py-2">
                  {row.min}–{row.max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="max-w-[900px] mx-auto mt-4 text-sm text-mainText dark:text-mainTextBlack">
        ВООЗ не коригує ІМТ за віком. Таблиця орієнтовна і відображає, що після 50 років трохи
        вища вага не шкодить здоровʼю, а після 65 навіть захищає від втрати мʼязів. Введіть вік
        у калькулятор, і він покаже норму для вашої вікової групи.
      </p>
    </div>
  </section>
);
