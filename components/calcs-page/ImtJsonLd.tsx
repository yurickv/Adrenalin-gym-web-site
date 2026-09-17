import { imtFaq } from './ImtFaq';
import {
  CALC_AUTHOR,
  CALC_PUBLISHER,
  CALC_DATE_PUBLISHED,
  CALC_DATE_MODIFIED,
} from '@/const/calcSeo';
import { buildAggregateRating, type RatingStats } from '@/lib/calcRating';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/imt-calculator`;

export const ImtJsonLd = ({ rating }: { rating: RatingStats | null }) => {
  const aggregateRating = buildAggregateRating(rating);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Калькулятори',
            item: `${SITE_URL}/calcs`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Калькулятор індексу маси тіла',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'Калькулятор індексу маси тіла (ІМТ)',
        url: PAGE_URL,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'UAH' },
        ...(aggregateRating ? { aggregateRating } : {}),
        description:
          'Безкоштовний онлайн-калькулятор ІМТ: індекс маси тіла з категорією за ВООЗ, норма ваги для зросту, ідеальна вага за формулою Девіна і орієнтовна норма ІМТ за віком.',
        inLanguage: 'uk',
        featureList: [
          'Індекс маси тіла з одним знаком',
          'Категорія за класифікацією ВООЗ (6 класів)',
          'Норма ваги для вашого зросту і різниця до неї',
          'Ідеальна вага за формулою Девіна для жінок і чоловіків',
          'Орієнтовна норма ІМТ за віком',
        ],
        author: CALC_AUTHOR,
        publisher: CALC_PUBLISHER,
        datePublished: CALC_DATE_PUBLISHED,
        dateModified: CALC_DATE_MODIFIED,
        citation: {
          '@type': 'CreativeWork',
          name: 'Класифікація індексу маси тіла за даними Всесвітньої організації охорони здоров’я (ВООЗ)',
          url: 'https://www.who.int/health-topics/obesity',
        },
      },
      {
        '@type': 'HowTo',
        name: 'Як розрахувати індекс маси тіла (ІМТ)',
        description:
          'Покрокова інструкція, як визначити ІМТ, норму ваги та ідеальну вагу за зростом.',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Оберіть стать', text: 'Виберіть свою стать — жінка або чоловік; вона потрібна для ідеальної ваги за Девіном.' },
          { '@type': 'HowToStep', position: 2, name: 'Вкажіть вік за бажанням', text: 'Якщо ввести вік, калькулятор додатково покаже норму ІМТ для вашої вікової групи.' },
          { '@type': 'HowToStep', position: 3, name: 'Введіть зріст і вагу', text: 'Вкажіть зріст у сантиметрах і вагу в кілограмах.' },
          { '@type': 'HowToStep', position: 4, name: 'Отримайте результат', text: 'Калькулятор покаже ІМТ, категорію за ВООЗ, норму ваги для зросту, скільки кілограмів до неї, та ідеальну вагу.' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: imtFaq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
