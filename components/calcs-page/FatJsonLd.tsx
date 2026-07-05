import { fatFaq } from './FatFaq';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/fat-calculator`;

export const FatJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Головна',
            item: SITE_URL,
          },
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
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'UAH',
        },
        description:
          'Безкоштовний онлайн-калькулятор для розрахунку відсотка жиру в організмі за методом каліперометрії (формула Джексона-Поллока) для чоловіків і жінок.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: fatFaq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
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
