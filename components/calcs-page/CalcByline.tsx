import {
  CALC_AUTHOR,
  CALC_DATE_MODIFIED,
  CALC_DATE_MODIFIED_LABEL,
} from '@/const/calcSeo';

export const CalcByline = () => {
  return (
    <section className="bg-white dark:bg-darkBody">
      <div className="div-container pb-8 md:pb-12 mx-auto">
        <p className="max-w-[900px] mx-auto text-sm text-center text-mainText dark:text-mainTextBlack">
          Матеріал підготував тренер{' '}
          <span className="font-semibold">{CALC_AUTHOR.name}</span>.{' '}
          <time dateTime={CALC_DATE_MODIFIED}>
            Оновлено: {CALC_DATE_MODIFIED_LABEL}
          </time>
          .
        </p>
        <p className="max-w-[900px] mx-auto mt-3 text-xs text-center text-neutral-600 dark:text-mainTextBlack">
          Розрахунки орієнтовні і не замінюють консультацію лікаря чи дієтолога. За
          хронічних захворювань, вагітності або віку до 18 років узгодьте раціон із
          фахівцем.
        </p>
      </div>
    </section>
  );
};
