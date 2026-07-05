import { fatFaq } from './FatFaq';
import {
  CALC_AUTHOR,
  CALC_PUBLISHER,
  CALC_DATE_PUBLISHED,
  CALC_DATE_MODIFIED,
} from '@/const/calcSeo';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/fat-calculator`;

export const FatJsonLd = () => {
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
        description:
          'Безкоштовний онлайн-калькулятор для розрахунку відсотка жиру в організмі за методом каліперометрії (формула Джексона-Поллока) для чоловіків і жінок.',
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
        name: 'Як розрахувати відсоток жиру в організмі',
        description:
          'Покрокова інструкція, як визначити процент жиру в тілі за товщиною шкірних складок.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Виміряйте складки',
            text: 'Виміряйте товщину шкірних складок на грудях, животі та стегні каліпером або лінійкою.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Введіть дані',
            text: 'Додайте три виміри й введіть суму складок, а також вкажіть вік і стать.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Отримайте результат',
            text: 'Калькулятор покаже відсоток жиру в організмі та оцінку вашої фізичної форми.',
          },
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
