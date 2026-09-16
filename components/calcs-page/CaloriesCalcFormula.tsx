import { SYTNO_URL } from '@/const';

interface CaloriesProps {
  weight: string;
  height: string;
  age: string;
  sex: boolean;
  activity: number;
}

export const CaloriesCalcFormula = ({
  age,
  sex,
  weight,
  height,
  activity,
}: CaloriesProps) => {
  let param = weight && height;
  let basis = 0;

  if (param && age) {
    if (sex) {
      basis = Math.round(
        (10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5) *
          activity
      );
    } else {
      basis = Math.round(
        (10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161) *
          activity
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <p className="font-bold text-lg text-mainTitle dark:text-mainTitleBlack">
          Денна потреба калорій:
        </p>
        <p className="rounded-xl p-2 text-main font-bold text-lg bg-[#D9D9D9] inline-block w-20 ">
          {basis}
        </p>
      </div>
      {basis > 0 && (
        <p
          aria-live="polite"
          className="text-sm text-left text-mainText dark:text-mainTextBlack"
        >
          Під вашу норму {basis} ккал застосунок Sytno складе меню на день.{' '}
          <a
            href={SYTNO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline text-mainTitle dark:text-mainTitleBlack"
          >
            Спробувати Sytno
          </a>
        </p>
      )}
    </div>
  );
};
