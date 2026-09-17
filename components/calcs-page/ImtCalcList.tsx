'use client';

import React, { useState } from 'react';
import { InputSkeleton } from './InputSkeleton';
import { ImtResult } from './ImtResult';
import { SEX_OPTIONS, toggleClass } from './formStyles';
import { BMI_LIMITS } from '@/lib/bmi';
import type { Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';

type Field = keyof typeof BMI_LIMITS;

export const ImtCalcList = () => {
  const [sex, setSex] = useState<Sex>('male');
  const [values, setValues] = useState<Record<Field, string>>({
    height: '',
    weight: '',
    age: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const change = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validate = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setErrors(prev => ({
      ...prev,
      [field]: rangeError(e.target.value, BMI_LIMITS[field].min, BMI_LIMITS[field].max),
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
        text="Зріст (см):"
        name="height"
        min={BMI_LIMITS.height.min}
        max={BMI_LIMITS.height.max}
        value={values.height}
        setAny={change('height')}
        onBlur={validate('height')}
        error={errors.height}
      />
      <InputSkeleton
        text="Вага (кг):"
        name="weight"
        min={BMI_LIMITS.weight.min}
        max={BMI_LIMITS.weight.max}
        value={values.weight}
        setAny={change('weight')}
        onBlur={validate('weight')}
        error={errors.weight}
      />
      <InputSkeleton
        text="Вік, років (за бажанням):"
        name="age"
        min={BMI_LIMITS.age.min}
        max={BMI_LIMITS.age.max}
        value={values.age}
        setAny={change('age')}
        onBlur={validate('age')}
        error={errors.age}
        noRange
      />

      <ImtResult sex={sex} heightCm={values.height} weightKg={values.weight} age={values.age} />
    </form>
  );
};
