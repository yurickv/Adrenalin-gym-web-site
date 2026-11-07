import type { CalcSource } from '@/const/calcSeo';

export const CalcSources = ({ sources }: { sources: CalcSource[] }) => (
  <section className="bg-white dark:bg-darkBody">
    <div className="div-container pb-6 md:pb-8 mx-auto">
      <div className="max-w-[900px] mx-auto text-mainText dark:text-mainTextBlack">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-mainTitle dark:text-mainTitleBlack">
          Джерела
        </h2>
        <ol className="flex flex-col gap-2 list-decimal list-inside text-sm">
          {sources.map(source => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-mainTitle dark:text-mainTitleBlack"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
