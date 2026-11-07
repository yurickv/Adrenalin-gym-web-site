import { SYTNO_URL } from '@/const';

const STEPS = [
  'Тримайтеся цільової калорійності 2–3 тижні: так буде видно реальну реакцію тіла.',
  'Зважуйтеся в однакових умовах (зранку, натщесерце) і оцінюйте прогрес за місячним трендом: вода дає щоденні коливання.',
  'Нормальний темп — 0,5–1% маси тіла на тиждень.',
  'Якщо вага тривалий час стоїть при дотриманні раціону, зменште калорійність на 100–150 ккал: норму підбирають методом проб і помилок.',
  'Після кожних 4–5 кг перерахуйте норму: легше тіло витрачає менше.',
];

const LIFEHACK =
  'Раціон із великою кількістю обʼємних і низькокалорійних продуктів (овочів, фруктів, нежирного мʼяса) — ключ до комфортного схуднення. Така їжа заповнює шлунок і тисне на його стінки, що активує рецептори ситості й надсилає мозку сигнал про насичення. Ви зʼїдаєте звичний за обʼємом обід, але отримуєте значно менше калорій. Так можна уникати постійного голоду і створювати природний дефіцит без жорстких заборон.';

export const CaloriesNextSteps = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Що робити з результатом
      </h2>
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <ol className="flex flex-col gap-2 list-decimal list-inside text-base lg:text-lg">
          {STEPS.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <aside className="mt-8 p-4 md:p-6 rounded-lg border-l-4 border-main bg-orange-50 dark:bg-transparent text-left">
          <p className="mb-3 text-lg font-bold text-neutral-800 dark:text-mainTitleBlack">
            Лайфхак тренера: як тримати дефіцит без голоду
          </p>
          <p className="text-base lg:text-lg text-neutral-700 dark:text-mainTextBlack">
            {LIFEHACK}
          </p>
        </aside>
        <p className="mt-6 text-base lg:text-lg">
          Якщо рахувати щодня не хочеться, застосунок Sytno складе меню під вашу ціль.{' '}
          <a
            href={SYTNO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-mainTitle dark:text-mainTitleBlack"
          >
            Спробувати Sytno
          </a>
        </p>
      </div>
    </div>
  </section>
);
