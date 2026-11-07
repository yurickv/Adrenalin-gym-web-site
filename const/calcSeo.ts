import type { CalcId } from '@/lib/calcRating';

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
// Дата змістовного оновлення кожного калькулятора; змінювати лише разом із його текстом.
export const CALC_MODIFIED: Record<CalcId, { iso: string; label: string }> = {
  'calories-calculator': { iso: '2026-11-07', label: '7 листопада 2026' },
  'imt-calculator': { iso: '2026-09-17', label: '17 вересня 2026' },
  'fat-calculator': { iso: '2026-09-17', label: '17 вересня 2026' },
};

export const CALCS_HUB_DATE_MODIFIED = '2026-09-17';

export interface CalcSource {
  label: string;
  url: string;
  type: 'ScholarlyArticle' | 'CreativeWork';
}
