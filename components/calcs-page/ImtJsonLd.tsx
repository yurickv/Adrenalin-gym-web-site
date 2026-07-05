import { imtFaq } from './ImtFaq';

const SITE_URL = 'https://gym-adrenalin.com.ua';
const PAGE_URL = `${SITE_URL}/calcs/imt-calculator`;

export const ImtJsonLd = () => {
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
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'UAH',
        },
        description:
          'Безкоштовний онлайн-калькулятор для розрахунку індексу маси тіла (ІМТ) за вагою та зростом з оцінкою, чи вага в нормі.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: imtFaq.map(item => ({
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
