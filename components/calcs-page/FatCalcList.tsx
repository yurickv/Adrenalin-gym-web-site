'use client';

import React, { useState } from 'react';
import { InputSkeleton } from './InputSkeleton';
import { FatResult, type FatField } from './FatResult';
import { SEX_OPTIONS, toggleClass } from './formStyles';
import { FAT_LIMITS, type FatMethod } from '@/lib/bodyFat';
import type { Sex } from '@/lib/calories';
import { rangeError } from '@/lib/rangeError';

const METHODS: Array<{ value: FatMethod; label: string }> = [
  { value: 'tape', label: 'За обхватами' },
  { value: 'caliper', label: 'За складками' },
];

const LIMIT_OF: Record<FatField, { min: number; max: number }> = {
  height: FAT_LIMITS.height,
  neck: FAT_LIMITS.neck,
  waist: FAT_LIMITS.waist,
  hip: FAT_LIMITS.hip,
  age: FAT_LIMITS.age,
  skinFold: FAT_LIMITS.skinfold,
  skinFoldW: FAT_LIMITS.skinfold,
  skinFoldL: FAT_LIMITS.skinfold,
  weight: FAT_LIMITS.weight,
};

const EMPTY: Record<FatField, string> = {
  height: '',
  neck: '',
  waist: '',
  hip: '',
  age: '',
  skinFold: '',
  skinFoldW: '',
  skinFoldL: '',
  weight: '',
};

export const FatCalcList = () => {
  const [method, setMethod] = useState<FatMethod>('tape');
  const [sex, setSex] = useState<Sex>('male');
  const [values, setValues] = useState<Record<FatField, string>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FatField, string>>>({});

  const change = (field: FatField) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validate = (field: FatField) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setErrors(prev => ({
      ...prev,
      [field]: rangeError(e.target.value, LIMIT_OF[field].min, LIMIT_OF[field].max),
    }));

  const field = (name: FatField, text: string, noRange = false) => (
    <InputSkeleton
      key={name}
      text={text}
      name={name}
      min={LIMIT_OF[name].min}
      max={LIMIT_OF[name].max}
      value={values[name]}
      setAny={change(name)}
      onBlur={validate(name)}
      error={errors[name]}
      noRange={noRange}
    />
  );

  return (
    <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
      <div role="radiogroup" aria-label="Метод" className="flex flex-col gap-2">
        <span className="text-lg font-bold text-left text-mainTitle dark:text-mainTitleBlack">
          Метод
        </span>
        <div className="flex gap-2 flex-wrap">
          {METHODS.map(option => (
            <label key={option.value} className={toggleClass(method === option.value)}>
              <input
                type="radio"
                name="method"
                value={option.value}
                className="sr-only"
                checked={method === option.value}
                onChange={() => setMethod(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

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

      {method === 'tape' ? (
        <>
          {field('height', 'Зріст (см):')}
          {field('neck', 'Обхват шиї (см):')}
          {field('waist', 'Обхват талії (см):')}
          {sex === 'female' && field('hip', 'Обхват стегон (см):')}
          <p className="text-sm text-left text-neutral-600 dark:text-mainTextBlack">
            Стрічка щільно, але не втискається в шкіру; живіт не втягувати.
          </p>
        </>
      ) : (
        <>
          {field('age', 'Вік, років:')}
          <p className="font-bold md:text-lg text-left text-neutral-700 dark:text-mainTextBlack">
            Товщина шкірних складок:
          </p>
          {field('skinFold', sex === 'male' ? 'На грудях (мм):' : 'На трицепсі (мм):')}
          {field('skinFoldW', sex === 'male' ? 'На животі (мм):' : 'Над клубовою кісткою (мм):')}
          {field('skinFoldL', 'На стегні, передня поверхня (мм):')}
        </>
      )}

      {field('weight', 'Вага, кг (за бажанням):', true)}

      <FatResult method={method} sex={sex} values={values} />
    </form>
  );
};
