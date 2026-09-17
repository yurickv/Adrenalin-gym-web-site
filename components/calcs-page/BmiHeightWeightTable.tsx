import { devineIdealWeight, HEIGHT_TABLE_ROWS, normalWeightRange } from '@/lib/bmi';

export const BmiHeightWeightTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Норма ваги за зростом
      </h2>
      <p className="max-w-[900px] mx-auto mb-6 text-base lg:text-lg text-mainText dark:text-mainTextBlack">
        Діапазон норми відповідає ІМТ 18,5–24,9. Ідеальна вага за формулою Девіна — одне
        орієнтовне число всередині цього діапазону, окремо для жінок і чоловіків.
      </p>
      <div className="max-w-[900px] mx-auto overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Норма ваги і ідеальна вага для зросту 150–195 см
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th scope="col" className="py-2 pr-4">Зріст</th>
              <th scope="col" className="py-2 pr-4">Норма ваги, кг</th>
              <th scope="col" className="py-2 pr-4">Ідеальна вага, жінки</th>
              <th scope="col" className="py-2">Ідеальна вага, чоловіки</th>
            </tr>
          </thead>
          <tbody>
            {HEIGHT_TABLE_ROWS.map(height => {
              const range = normalWeightRange(height);
              return (
                <tr key={height} className="border-b border-gray-300">
                  <th scope="row" className="py-2 pr-4 font-normal">{height} см</th>
                  <td className="py-2 pr-4">
                    {range.min}–{range.max}
                  </td>
                  <td className="py-2 pr-4">{devineIdealWeight('female', height)} кг</td>
                  <td className="py-2">{devineIdealWeight('male', height)} кг</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);
