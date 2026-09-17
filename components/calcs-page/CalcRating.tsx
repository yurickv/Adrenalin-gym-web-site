'use client';

import { useEffect, useState } from 'react';
import {
  formatRating,
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

// Кольори підібрано під фон картки (#F5F5F5 / #676465): заповнена зірка
// orange-700 / orange-300, порожня neutral-500 / neutral-300, усі не нижче 3:1.
const starClass = (filled: boolean) =>
  `text-3xl leading-none ${
    filled
      ? 'text-orange-700 dark:text-orange-300'
      : 'text-neutral-500 dark:text-neutral-300'
  }`;

export const CalcRating = ({ calcId, initial }: Props) => {
  const key = ratingStorageKey(calcId);
  const labelId = `${calcId}-rating-label`;
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

  const locked =
    status === 'voted' || status === 'duplicate' || status === 'pending';

  const submit = async (value: number) => {
    if (locked) return;
    setStatus('pending');
    setVote(value);
    try {
      const res = await fetch(`/api/calc-rating/${calcId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (res.status === 409) {
        // Сервер знає про голос з цієї адреси, але не знає його значення.
        setVote(null);
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

  const shown = hover ?? vote ?? 0;
  const statsText =
    stats && stats.count > 0
      ? `Середня оцінка ${formatRating(stats.average)} з ${RATING_MAX}, голосів: ${stats.count}`
      : '';
  const message =
    status === 'voted'
      ? statsText
        ? `Дякуємо! ${statsText}`
        : 'Дякуємо за оцінку!'
      : status === 'duplicate'
      ? 'Ви вже оцінювали цей калькулятор сьогодні'
      : status === 'error'
      ? 'Не вдалося зберегти оцінку, спробуйте пізніше'
      : statsText;

  return (
    <div className="mt-10 text-center">
      <p id={labelId} className="font-semibold text-mainTitle dark:text-mainTitleBlack">
        Чи корисний калькулятор?
      </p>
      {/* Кнопки, а не radio: стрілки не мають надсилати голос, лише клік, Enter або пробіл. */}
      <div
        role="group"
        aria-labelledby={labelId}
        className="mt-2 flex justify-center gap-1"
        onMouseLeave={() => setHover(null)}
      >
        {STARS.map(value => (
          <button
            key={value}
            type="button"
            aria-pressed={vote === value}
            aria-disabled={locked || undefined}
            aria-label={`Оцінити ${value} з ${RATING_MAX}`}
            className={`rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 dark:focus-visible:ring-orange-200 ${
              locked ? 'cursor-default' : 'cursor-pointer'
            } ${starClass(value <= shown)}`}
            onMouseEnter={() => !locked && setHover(value)}
            onFocus={() => !locked && setHover(value)}
            onBlur={() => setHover(null)}
            onClick={() => submit(value)}
          >
            <span aria-hidden="true">★</span>
          </button>
        ))}
      </div>
      <p
        className="mt-2 min-h-[1.5rem] text-sm text-neutral-600 dark:text-mainTextBlack"
        aria-live="polite"
      >
        {status === 'voted' && vote !== null ? (
          <span className="sr-only">
            Ваша оцінка: {vote} з {RATING_MAX}.{' '}
          </span>
        ) : null}
        {message}
      </p>
    </div>
  );
};
