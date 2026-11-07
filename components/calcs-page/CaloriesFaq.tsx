import { caloriesFaq } from './caloriesContent';

export const CaloriesFaq = () => {
  return (
    <section className="bg-white dark:bg-darkBody">
      <div className="div-container py-[20px] md:py-[44px] mx-auto">
        <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-8 md:mb-12">
          Часті питання про розрахунок калорій
        </h2>
        <div className="flex flex-col gap-6 max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
          {caloriesFaq.map(item => (
            <div key={item.question}>
              <h3 className="text-lg font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
                {item.question}
              </h3>
              <p className="text-base lg:text-lg text-justify">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
