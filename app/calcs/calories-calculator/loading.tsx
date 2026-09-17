import SceletonForCalc from '@/components/sceleton/sceletonForCalc';

export default function Loading() {
  return (
    <>
      <section className="bg-[#2E2F42]">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <div className="h-5 w-40 rounded bg-gray-500/60" aria-hidden="true" />
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            Калькулятор калорій: норма на день, дефіцит і БЖВ
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            Введіть дані і отримайте норму, дефіцит для схуднення і БЖВ за 10 секунд
          </p>
        </div>
      </section>
      <section className="bg-white dark:bg-darkBody">
        <div className="div-container py-[20px] md:py-[44px] mx-auto text-center">
          <SceletonForCalc />
        </div>
      </section>
    </>
  );
}
