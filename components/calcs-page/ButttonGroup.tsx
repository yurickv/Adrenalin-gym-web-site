import { Button } from '../Button';
import { ButtonSecond } from '../ButtonSecond';
import { SYTNO_URL } from '@/const';

export const ButtonGroup = () => {
  return (
    <>
      <p className="mt-12 text-neutral-600 dark:text-mainTextBlack">
        Дізнайся більше про здорове харчування
      </p>
      <ButtonSecond
        route="/learn/nutrition/basics"
        text="Все про харчування"
        width="mx-auto mt-4 w-full md:w-[284px]"
      />
      <p className="mt-12 text-neutral-600 dark:text-mainTextBlack">
        Дізнайся про легкий сервіс складання денних меню
      </p>
      <Button
        route={SYTNO_URL}
        text="Склади своє меню"
        width="mx-auto mt-4 w-full md:w-[284px]"
      />
    </>
  );
};
