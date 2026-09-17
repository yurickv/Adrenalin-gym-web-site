import type { Sex } from '@/lib/calories';

// Спільний вигляд перемикачів (стать, мета) для форм калькуляторів.
export const toggleClass = (active: boolean) =>
  `cursor-pointer flex items-center justify-center tracking-widest truncate font-semibold text-lg rounded-xl p-2
   focus-within:ring-2 focus-within:ring-main focus-within:ring-offset-1
   hover:bg-[#ECECEC] dark:hover:bg-[#d4d4d4] dark:hover:text-mainTitle ${
     active
       ? 'bg-[#D9D9D9] dark:bg-[#d4d4d4] text-orange-800'
       : 'text-neutral-700 dark:text-mainTextBlack'
   }`;

export const SEX_OPTIONS: Array<{ value: Sex; label: string }> = [
  { value: 'female', label: 'Жінка' },
  { value: 'male', label: 'Чоловік' },
];
