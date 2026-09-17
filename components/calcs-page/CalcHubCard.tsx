import Link from 'next/link';
import { ButtonSecond } from '../ButtonSecond';
import type { HubCard } from './calcHubContent';

export const CalcHubCard = ({ href, title, lead, inputs, useCase }: HubCard) => (
  <article
    className="flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-[#F5F5F5] dark:bg-[#676465]
    shadow-[0px_4px_20px_0px_rgba(133,119,123,0.30)] dark:shadow-[0px_4px_15px_0px_rgba(116,116,116,0.30)]"
  >
    <h2 className="text-xl md:text-2xl font-bold text-mainTitle dark:text-mainTitleBlack">
      <Link href={href} className="hover:text-main dark:hover:text-orange-300">
        {title}
      </Link>
    </h2>
    <p className="text-base lg:text-lg text-neutral-700 dark:text-mainTextBlack">{lead}</p>
    <p className="text-sm text-neutral-600 dark:text-mainTextBlack">
      <span className="font-semibold">Потрібно:</span> {inputs}.
    </p>
    <p className="text-sm text-neutral-600 dark:text-mainTextBlack">
      <span className="font-semibold">Корисно, коли</span> {useCase}
    </p>
    <ButtonSecond route={href} text="Відкрити калькулятор" width="mt-auto w-full md:w-[284px]" />
  </article>
);
