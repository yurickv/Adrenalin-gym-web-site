// Число з рядка форми: undefined/порожнє/нечислове/нульове і від'ємне → null.
export function toPositiveNumber(value: string): number | null {
  const n = Number(value);
  return value.trim() !== '' && Number.isFinite(n) && n > 0 ? n : null;
}
