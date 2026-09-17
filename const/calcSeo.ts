export const CALC_SITE_URL = 'https://gym-adrenalin.com.ua';
export const ORGANIZATION_ID = `${CALC_SITE_URL}/#organization`;

export const CALC_AUTHOR = {
  '@type': 'Person',
  name: 'Теслюк Юрій',
  jobTitle: 'Тренер',
  url: `${CALC_SITE_URL}/contacts`,
  worksFor: { '@id': ORGANIZATION_ID },
  sameAs: ['https://www.instagram.com/gym.adrenalin/'],
};

export const CALC_PUBLISHER = { '@id': ORGANIZATION_ID };

export const CALC_DATE_PUBLISHED = '2023-08-12';
export const CALC_DATE_MODIFIED = '2026-09-17';
export const CALC_DATE_MODIFIED_LABEL = '17 вересня 2026';
