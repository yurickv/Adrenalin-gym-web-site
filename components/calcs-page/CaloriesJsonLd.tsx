import { caloriesFaq } from './CaloriesFaq';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/calories-calculator`;

export const CaloriesJsonLd = () => {
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
            name: 'Калькулятор калорій',
            item: PAGE_URL,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'Калькулятор калорій',
        url: PAGE_URL,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'UAH',
        },
        description:
          'Безкоштовний онлайн-калькулятор для розрахунку денної норми калорій за формулою Міффліна-Сан Жеора для схуднення, набору чи утримання ваги.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: caloriesFaq.map(item => ({
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
