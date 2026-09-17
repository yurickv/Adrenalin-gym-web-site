import { bmrMifflin, targets, tdee, type Sex } from '@/lib/calories';

const AGE_GROUPS = [
  { label: '18–30 років', age: 25 },
  { label: '31–50 років', age: 40 },
  { label: '51–70 років', age: 60 },
];
const ACTIVITIES = [
  { label: 'низька, 1,2', factor: 1.2 },
  { label: 'помірна, 1,55', factor: 1.55 },
  { label: 'висока, 1,725', factor: 1.725 },
];
const PROFILES: Array<{ sex: Sex; title: string; heightCm: number; weightKg: number }> = [
  { sex: 'female', title: 'Жінка, 165 см, 65 кг', heightCm: 165, weightKg: 65 },
  { sex: 'male', title: 'Чоловік, 178 см, 80 кг', heightCm: 178, weightKg: 80 },
];

const norm = (p: (typeof PROFILES)[number], age: number, factor: number) =>
  targets(tdee(bmrMifflin({ ...p, age }), factor)).maintain;

export const CaloriesNormTable = () => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container py-[20px] md:py-[44px] mx-auto">
      <h2 className="title text-center text-mainTitle dark:text-mainTitleBlack mb-6 md:mb-10">
        Норма калорій на день для жінок і чоловіків
      </h2>
      <p className="max-w-[900px] mx-auto mb-6 text-base lg:text-lg text-mainText dark:text-mainTextBlack">
        Орієнтовні норми для підтримання ваги, розраховані тим самим калькулятором за
        формулою Міффліна-Сан Жеора. Ваша особиста норма залежить від зросту і ваги,
        тому введіть свої дані вище.
      </p>
      <div className="grid gap-8 md:grid-cols-2 max-w-[1100px] mx-auto">
        {PROFILES.map(profile => (
          <div key={profile.sex} className="overflow-x-auto">
            <table className="w-full text-left text-base border-collapse text-mainText dark:text-mainTextBlack">
              <caption className="text-left font-bold text-mainTitle dark:text-mainTitleBlack mb-2">
                {profile.title}, ккал на день
              </caption>
              <thead>
                <tr className="border-b border-gray-400">
                  <th scope="col" className="py-2 pr-4">Вік</th>
                  {ACTIVITIES.map(a => (
                    <th key={a.factor} scope="col" className="py-2 pr-4">
                      Активність {a.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGE_GROUPS.map(group => (
                  <tr key={group.age} className="border-b border-gray-300">
                    <th scope="row" className="py-2 pr-4 font-normal">{group.label}</th>
                    {ACTIVITIES.map(a => (
                      <td key={a.factor} className="py-2 pr-4">
                        {norm(profile, group.age, a.factor)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  </section>
);
