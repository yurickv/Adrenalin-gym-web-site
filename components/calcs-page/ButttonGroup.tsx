import { Button } from '../Button';
import { ButtonSecond } from '../ButtonSecond';

export const ButtonGroup = () => {
  return (
    <>
      <p className="mt-12 text-mainText dark:text-mainTextBlack">
        Дізнайся більше про здорове харчування
      </p>
      <ButtonSecond
        route="/learn/nutrition"
        text="Все про харчування"
        width="mx-auto mt-4 w-full md:w-[284px]"
      />
      <p className="mt-12 text-mainText dark:text-mainTextBlack">
        Дізнайся про легкий сервіс складання денних меню
      </p>
      <Button
        route="https://nutri-day-landing.vercel.app/"
        text="Склади своє меню"
        width="mx-auto mt-4 w-full md:w-[284px]"
      />
    </>
  );
};
