import { CALC_SITE_URL, ORGANIZATION_ID } from '@/const/calcSeo';
import { HUB_CARDS, HUB_DESCRIPTION } from './calcHubContent';

const PAGE_URL = `${CALC_SITE_URL}/calcs`;

export const CalcsHubJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Головна', item: CALC_SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Калькулятори', item: PAGE_URL },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Фітнес-калькулятори онлайн',
        url: PAGE_URL,
        description: HUB_DESCRIPTION,
        inLanguage: 'uk',
        publisher: { '@id': ORGANIZATION_ID },
        hasPart: HUB_CARDS.map(card => ({
          '@type': 'WebApplication',
          name: card.appName,
          url: `${CALC_SITE_URL}${card.href}`,
          applicationCategory: 'HealthApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'UAH' },
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
