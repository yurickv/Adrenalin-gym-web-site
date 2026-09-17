import { fatFaq } from './FatFaq';
import {
  CALC_AUTHOR,
  CALC_PUBLISHER,
  CALC_DATE_PUBLISHED,
  CALC_DATE_MODIFIED,
} from '@/const/calcSeo';
import { buildAggregateRating, type RatingStats } from '@/lib/calcRating';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/fat-calculator`;

export const FatJsonLd = ({ rating }: { rating: RatingStats | null }) => {
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
            name: 'Калькулятор відсотка жиру',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'Калькулятор відсотка жиру в організмі',
        url: PAGE_URL,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'UAH' },
        ...(aggregateRating ? { aggregateRating } : {}),
        description:
          'Безкоштовний онлайн-калькулятор відсотка жиру в організмі: за обхватами шиї, талії і стегон (метод ВМС США) або за трьома шкірними складками (Джексон-Поллок), з нормами для чоловіків і жінок та розрахунком жирової маси.',
        inLanguage: 'uk',
        featureList: [
          'Метод за обхватами без каліпера (ВМС США)',
          'Метод за трьома шкірними складками (Джексон-Поллок)',
          'Категорії і норми окремо для чоловіків і жінок',
          'Жирова і суха маса за вагою',
        ],
        author: CALC_AUTHOR,
        publisher: CALC_PUBLISHER,
        datePublished: CALC_DATE_PUBLISHED,
        dateModified: CALC_DATE_MODIFIED,
        citation: {
          '@type': 'CreativeWork',
          name: 'Норми відсотка жиру Американського коледжу спортивної медицини (ACSM)',
          url: 'https://www.acsm.org',
        },
      },
      {
        '@type': 'HowTo',
        name: 'Як розрахувати відсоток жиру за обхватами',
        description:
          'Покрокова інструкція, як визначити відсоток жиру сантиметровою стрічкою за методом ВМС США.',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Оберіть метод і стать', text: 'Залиште метод «За обхватами» і виберіть стать.' },
          { '@type': 'HowToStep', position: 2, name: 'Виміряйте шию', text: 'Обхват шиї під гортанню, стрічка не стискає.' },
          { '@type': 'HowToStep', position: 3, name: 'Виміряйте талію і стегна', text: 'Талія на рівні пупа (жінки — у найвужчому місці), для жінок також стегна в найширшому місці.' },
          { '@type': 'HowToStep', position: 4, name: 'Введіть зріст і виміри', text: 'Усі значення в сантиметрах; за бажанням додайте вагу, щоб побачити кілограми жиру.' },
          { '@type': 'HowToStep', position: 5, name: 'Отримайте результат', text: 'Калькулятор покаже відсоток жиру, категорію для вашої статі, жирову і суху масу.' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: fatFaq.map(item => ({
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
