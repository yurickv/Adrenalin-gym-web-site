'use client';

import React, { useState } from 'react';
import { InputSkeleton } from './InputSkeleton';
import { CaloriesResult } from './CaloriesResult';
import { ACTIVITY_LEVELS, LIMITS, type Goal, type Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';
import { SEX_OPTIONS, toggleClass } from './formStyles';

type Field = keyof typeof LIMITS;

const GOALS: Array<{ value: Goal; label: string }> = [
  { value: 'loss', label: 'Схуднути' },
  { value: 'maintain', label: 'Підтримати' },
  { value: 'gain', label: 'Набрати' },
];

export const CaloriesCalcList = () => {
  const [sex, setSex] = useState<Sex>('male');
  const [goal, setGoal] = useState<Goal>('loss');
  const [values, setValues] = useState<Record<Field, string>>({
    age: '',
    height: '',
    weight: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [activity, setActivity] = useState<number>(1.2);

  const change = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validate = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setErrors(prev => ({
      ...prev,
      [field]: rangeError(e.target.value, LIMITS[field].min, LIMITS[field].max),
    }));

  return (
    <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
      <div role="radiogroup" aria-label="Стать" className="flex items-center gap-3">
        <span className="p-2 text-lg font-bold text-mainTitle dark:text-mainTitleBlack">
          Стать:
        </span>
        {SEX_OPTIONS.map(option => (
          <label key={option.value} className={toggleClass(sex === option.value)}>
            <input
              type="radio"
              name="sex"
              value={option.value}
              className="sr-only"
              checked={sex === option.value}
              onChange={() => setSex(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <InputSkeleton
        text="Вік, років:"
        name="age"
        min={LIMITS.age.min}
        max={LIMITS.age.max}
        value={values.age}
        setAny={change('age')}
        onBlur={validate('age')}
        error={errors.age}
      />
      <InputSkeleton
        text="Зріст (см):"
        name="height"
        min={LIMITS.height.min}
        max={LIMITS.height.max}
        value={values.height}
        setAny={change('height')}
        onBlur={validate('height')}
        error={errors.height}
      />
      <InputSkeleton
        text="Вага (кг):"
        name="weight"
        min={LIMITS.weight.min}
        max={LIMITS.weight.max}
        value={values.weight}
        setAny={change('weight')}
        onBlur={validate('weight')}
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
        text-neutral-700 dark:text-mainTextBlack bg-[#e5e5e5] dark:bg-[#676465]"
        value={activity}
        onChange={e => setActivity(Number(e.target.value))}
      >
        {ACTIVITY_LEVELS.map(level => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>

      <div role="radiogroup" aria-label="Мета" className="flex flex-col gap-2">
        <span className="text-lg font-bold text-left text-mainTitle dark:text-mainTitleBlack">
          Мета
        </span>
        <div className="flex gap-2 flex-wrap">
          {GOALS.map(option => (
            <label key={option.value} className={toggleClass(goal === option.value)}>
              <input
                type="radio"
                name="goal"
                value={option.value}
                className="sr-only"
                checked={goal === option.value}
                onChange={() => setGoal(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <CaloriesResult
        sex={sex}
        age={values.age}
        heightCm={values.height}
        weightKg={values.weight}
        activity={activity}
        goal={goal}
      />
    </form>
  );
};
