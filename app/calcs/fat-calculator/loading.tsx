import SceletonForCalc from '@/components/sceleton/sceletonForCalc';
import { FAT_H1, FAT_LEAD } from '@/components/calcs-page/fatHero';

export default function Loading() {
  return (
    <main>
      <section className="bg-[#2E2F42] md:bg-hero-photo bg-cover bg-center">
        <div className="div-container py-4 md:py-[44px] mx-auto flex flex-col gap-3 md:gap-8">
          <div className="h-5 w-40 rounded bg-gray-500/60" aria-hidden="true" />
          <h1 className="text-3xl md:text-5xl font-bold text-center text-mainTitleBlack">
            {FAT_H1}
          </h1>
          <p className="text-base md:text-lg text-center text-mainTitleBlack pb-2 md:pb-6">
            {FAT_LEAD}
          </p>
        </div>
      </section>
      <section className="bg-white dark:bg-darkBody">
        <div className="div-container py-[20px] md:py-[44px] mx-auto text-center">
          <SceletonForCalc />
        </div>
      </section>
    </main>
  );
}
