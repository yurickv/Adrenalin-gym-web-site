export function rangeError(
  value: string,
  min: number,
  max: number
): string | undefined {
  if (value.trim() === '') return undefined;
  const n = Number(value);
  if (Number.isNaN(n) || n < min) return `Не менше ${min}`;
  if (n > max) return `Не більше ${max}`;
  return undefined;
}
