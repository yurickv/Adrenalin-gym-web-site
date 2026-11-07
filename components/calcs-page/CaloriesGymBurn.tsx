import { BURN_WEIGHTS, GYM_ACTIVITIES, formatMet, kcalPerHour } from '@/lib/activityBurn';

const TRAINER_NOTES = [
  'Люди зазвичай сильно переоцінюють, скільки калорій спалюють на тренуванні, і водночас недооцінюють, скільки зʼїли, або помиляються в розрахунках. Звідси хибне відчуття «компенсації»: бургер після залу перекриває всю витрачену енергію.',
  'Тренування становлять лише невелику частку, близько 10%, загальних енерговитрат за тиждень. Трекери й кардіотренажери часто завищують цифри, бо не враховують природну компенсацію: після втомливого тренування ви менше рухаєтеся в побуті.',
  'Схуднення відбувається за рахунок дефіциту калорій, і створює його насамперед харчування. Силові вправи потрібні, щоб зберегти мʼязи і тонус: з ними організм втрачає жир, а не мускулатуру. Кардіо корисне для серця і загального здоровʼя.',
  'Більшість людей неусвідомлено «доїдає» спалене: після інтенсивного навантаження зростає апетит, а ще хочеться винагородити себе за тренування. Це зводить нанівець невеликий дефіцит, створений у залі, і гальмує схуднення.',
];

export const CaloriesGymBurn = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Скільки калорій спалює тренування в залі
      </h2>
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <p className="mb-6 text-base lg:text-lg">
          Орієнтовні витрати за годину заняття за довідником Compendium of Physical
          Activities (2024): ккал ≈ MET × вага (кг) × години. Цифра включає енергію,
          яку тіло витратило б і у спокої (близько 1 MET), тож «додаткових» калорій
          ще менше.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base border-collapse">
            <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
              Витрата калорій за годину тренування
            </caption>
            <thead>
              <tr className="border-b border-gray-400">
                <th scope="col" className="py-2 pr-4">Заняття</th>
                <th scope="col" className="py-2 pr-4">MET</th>
                {BURN_WEIGHTS.map(weight => (
                  <th key={weight} scope="col" className="py-2 pr-4">
                    {weight} кг
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GYM_ACTIVITIES.map(activity => (
                <tr key={activity.code} className="border-b border-gray-300">
                  <th scope="row" className="py-2 pr-4 font-normal">{activity.label}</th>
                  <td className="py-2 pr-4">{formatMet(activity.met)}</td>
                  {BURN_WEIGHTS.map(weight => (
                    <td key={weight} className="py-2 pr-4">
                      {kcalPerHour(activity.met, weight)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="mt-8 p-4 md:p-6 rounded-lg border-l-4 border-main bg-orange-50 dark:bg-transparent text-left">
          <p className="mb-3 text-lg font-bold text-neutral-800 dark:text-mainTitleBlack">
            Досвід тренера Юрія Теслюка
          </p>
          <ul className="flex flex-col gap-3 list-disc list-inside text-base lg:text-lg text-neutral-700 dark:text-mainTextBlack">
            {TRAINER_NOTES.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  </section>
);
