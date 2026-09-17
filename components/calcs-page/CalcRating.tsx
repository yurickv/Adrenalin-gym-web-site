'use client';

import { useEffect, useState } from 'react';
import {
  isValidRatingValue,
  RATING_MAX,
  RATING_MIN,
  ratingStorageKey,
  type CalcId,
  type RatingStats,
} from '@/lib/calcRating';

type Props = { calcId: CalcId; initial: RatingStats | null };
type Status = 'idle' | 'pending' | 'voted' | 'duplicate' | 'error';

const STARS = Array.from(
  { length: RATING_MAX - RATING_MIN + 1 },
  (_, i) => RATING_MIN + i
);

function readStoredVote(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    const value = raw === null ? null : Number(raw);
    return isValidRatingValue(value) ? value : null;
  } catch {
    return null;
  }
}

export const CalcRating = ({ calcId, initial }: Props) => {
  const key = ratingStorageKey(calcId);
  const [stats, setStats] = useState<RatingStats | null>(initial);
  const [vote, setVote] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const stored = readStoredVote(key);
    if (stored !== null) {
      setVote(stored);
      setStatus('voted');
    }
  }, [key]);

  const submit = async (value: number) => {
    if (status === 'pending' || status === 'voted' || status === 'duplicate') return;
    setStatus('pending');
    setVote(value);
    try {
      const res = await fetch(`/api/calc-rating/${calcId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (res.status === 409) {
        setStatus('duplicate');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const next = (await res.json()) as RatingStats;
      setStats(next);
      setStatus('voted');
      try {
        localStorage.setItem(key, String(value));
      } catch {
        /* приватний режим: голос збережено лише на сервері */
      }
    } catch {
      setVote(null);
      setStatus('error');
    }
  };

  const locked = status === 'voted' || status === 'duplicate' || status === 'pending';
  const shown = hover ?? vote ?? 0;

  return (
    <div className="mt-10 text-center">
      <p
        id={`${calcId}-rating-label`}
        className="font-semibold text-mainTitle dark:text-mainTitleBlack"
      >
        Чи корисний калькулятор?
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${calcId}-rating-label`}
        className="mt-2 flex justify-center gap-1"
        onMouseLeave={() => setHover(null)}
      >
        {STARS.map(value => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={vote === value}
            aria-label={`Оцінити ${value} з ${RATING_MAX}`}
            disabled={locked}
            onMouseEnter={() => !locked && setHover(value)}
            onFocus={() => !locked && setHover(value)}
            onBlur={() => setHover(null)}
            onClick={() => submit(value)}
            className={`text-3xl leading-none px-1 rounded focus-visible:ring-2 focus-visible:ring-main disabled:cursor-default ${
              value <= shown
                ? 'text-orange-500'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-[1.5rem] text-sm text-neutral-600 dark:text-mainTextBlack" aria-live="polite">
        {status === 'voted' && stats && stats.count > 0
          ? `Дякуємо! Середня оцінка ${stats.average.toFixed(1)} з ${RATING_MAX}, голосів: ${stats.count}`
          : status === 'voted'
          ? 'Дякуємо за оцінку!'
          : status === 'duplicate'
          ? 'Ви вже оцінювали цей калькулятор сьогодні'
          : status === 'error'
          ? 'Не вдалося зберегти оцінку, спробуйте пізніше'
          : stats && stats.count > 0
          ? `Середня оцінка ${stats.average.toFixed(1)} з ${RATING_MAX}, голосів: ${stats.count}`
          : ''}
      </p>
    </div>
  );
};
