'use client';

import React, { useState } from 'react';
import { InputSkeleton } from './InputSkeleton';
import * as yup from 'yup';
import { CaloriesCalcFormula } from './CaloriesCalcFormula';

const schema = yup.object().shape({
  age: yup.number().positive().min(14, 'Не менше 14').max(130, 'Не більше 130'),

  height: yup
    .number()
    .positive()
    .min(100, 'Не менше 100')
    .max(220, 'Не більше 220'),

  weight: yup
    .number()
    .positive()
    .min(40, 'Не менше 40')
    .max(130, 'Не більше 130'),
});

export const CaloriesCalcList = () => {
  const [sex, setSex] = useState<boolean>(true);
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activity, setActivity] = useState<number>(1.2);

  const [errors, setErrors] = useState<{
    age?: string;
    height?: string;
    weight?: string;
  }>({});

  const changeAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };
  const changeWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
  };
  const changeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value);
  };

  const validate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await schema.validate(
        { [e.target.name]: e.target.value },
        { abortEarly: false }
      );
      setErrors({});
    } catch (err) {
      const validationErrors: Record<string, string> = {};
      (err as yup.ValidationError).inner.forEach(error => {
        if (error.path) {
          validationErrors[error.path] = error.message;
        }
      });
      setErrors(validationErrors);
    }
  };

  return (
    <form className="flex flex-col gap-7 ">
      <label htmlFor="sex" className="font-bold flex items-center gap-3">
        <span className="p-2 text-lg text-mainTitle dark:text-mainTitleBlack">
          Стать:{' '}
        </span>
        <label
          htmlFor="woman"
          className={`cursor-pointer flex items-center justify-center tracking-widest
          dark:hover:bg-[#d4d4d4] dark:hover:text-mainText 
          truncate font-semibold text-lg rounded-xl p-2  hover:bg-[#ECECEC] ${
            !sex
              ? 'bg-[#D9D9D9] dark:bg-[#d4d4d4] text-main'
              : 'dark:text-mainTextBlack'
          } `}
        >
          Жінка{' '}
        </label>
        <input
          id="woman"
          name="sex"
          type="radio"
          value="Жінка"
          className="appearance-none"
          checked={!sex}
          onChange={() => setSex(false)}
        />
        <label
          htmlFor="man"
          className={`cursor-pointer flex items-center justify-center tracking-widest
          dark:hover:bg-[#d4d4d4] dark:hover:text-mainText 
          truncate font-semibold text-lg rounded-xl p-2  hover:bg-[#ECECEC] ${
            sex
              ? 'bg-[#D9D9D9] dark:bg-[#d4d4d4] text-main '
              : 'dark:text-mainTextBlack'
          } `}
        >
          Чоловік{' '}
        </label>
        <input
          id="man"
          name="sex"
          type="radio"
          value="Чоловік"
          className="appearance-none"
          checked={sex}
          onChange={() => setSex(true)}
        />
      </label>

      <InputSkeleton
        text={'Вік, років:'}
        name="age"
        max={130}
        min={14}
        value={age}
        setAny={changeAge}
        onBlur={validate}
        error={errors.age}
      />
      <InputSkeleton
        text={'Зріст (см):'}
        name="height"
        max={220}
        min={100}
        value={height}
        setAny={changeHeight}
        onBlur={validate}
        error={errors.height}
      />
      <InputSkeleton
        text={'Вага (кг):'}
        name="weight"
        max={130}
        min={40}
        value={weight}
        setAny={changeWeight}
        onBlur={validate}
        error={errors.weight}
      />
      <label
        htmlFor="activity"
        className="font-bold -mb-4 text-lg text-mainTitle dark:text-mainTitleBlack"
      >
        Рівень активності
      </label>
      <select
        id="activity"
        name="activity"
        className="max-[440px]:max-w-[280px] min-[768px]:max-w-[340px] min-[880px]:max-w-[380px] min-[980px]:max-w-[404px]
        font-bold border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main 
        text-mainText dark:text-mainTextBlack bg-[#e5e5e5] dark:bg-[#676465]"
        value={activity}
        onChange={e => setActivity(Number(e.target.value))}
      >
        <option value="1.2">
          Сидячий спосіб життя (мало або зовсім без фізичних вправ)
        </option>
        <option value="1.375">
          Легка активність (1-3 дні тренувань на тиждень)
        </option>
        <option value="1.55">
          Помірно активний (3-5 днів тренувань на тиждень)
        </option>
        <option value="1.725">
          Дуже активний (6-7 днів тренувань на тиждень)
        </option>
        <option value="1.9">
          Надзвичайно активний (дуже інтенсивні фізичні вправи або фізична
          робота)
        </option>
      </select>

      <CaloriesCalcFormula
        age={age}
        sex={sex}
        weight={weight}
        height={height}
        activity={activity}
      />
    </form>
  );
};
