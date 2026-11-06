import type { ReactNode } from 'react';
import { SYTNO_TELEGRAM_URL } from '@/const';

export const SytnoTelegramCta = ({ children }: { children: ReactNode }) => {
  return (
    <aside className="mt-8 p-4 md:p-6 rounded-lg border-l-4 border-main bg-orange-50 dark:bg-transparent text-left">
      <p className="font-poppins text-lg leading-normal text-neutral-700 dark:text-mainTextBlack">
        {children}
      </p>
      <a
        href={SYTNO_TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 font-poppins text-lg font-semibold underline underline-offset-4 text-mainTitle dark:text-mainTitleBlack"
      >
        Підписатися на Telegram-канал Sytno &rarr;
      </a>
    </aside>
  );
};
