import { BMI_CATEGORY_LABELS, BMI_CATEGORY_ORDER } from '@/lib/bmi';

export const BmiCategoryTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Категорії ІМТ за ВООЗ
      </h2>
      <div className="max-w-[900px] mx-auto overflow-x-auto">
        <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
          <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
            Класифікація індексу маси тіла для дорослих
          </caption>
          <thead>
            <tr className="border-b border-gray-400">
              <th scope="col" className="py-2 pr-4">ІМТ</th>
              <th scope="col" className="py-2 pr-4">Категорія</th>
              <th scope="col" className="py-2">Що робити</th>
            </tr>
          </thead>
          <tbody>
            {BMI_CATEGORY_ORDER.map(key => {
              const category = BMI_CATEGORY_LABELS[key];
              return (
                <tr key={key} className="border-b border-gray-300">
                  <th scope="row" className="py-2 pr-4 font-normal">{category.range}</th>
                  <td className="py-2 pr-4">{category.label}</td>
                  <td className="py-2">{category.advice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="max-w-[900px] mx-auto mt-4 text-sm text-mainText dark:text-mainTextBlack">
        Джерело: класифікація ВООЗ для дорослих від 18 років. У спортсменів із великою мʼязовою
        масою ІМТ завищує оцінку жиру, тому доповніть його виміром відсотка жиру.
      </p>
    </div>
  </section>
);
