import type { MetadataRoute } from 'next';
import { CALC_MODIFIED, CALCS_HUB_DATE_MODIFIED } from '@/const/calcSeo';
import { routeSitemap, SITE_CONTENT_LASTMOD } from '@/const/routeSitemap';
import { isCalcId } from '@/lib/calcRating';

export const SITE_URL = 'https://gym-adrenalin.com.ua';

export type SitemapPost = {
  id: string;
  createdAt?: string;
};

export function lastModifiedForRoute(route: string): string {
  if (route === '/calcs') return CALCS_HUB_DATE_MODIFIED;
  const calcId = route.startsWith('/calcs/') ? route.slice('/calcs/'.length) : '';
  if (isCalcId(calcId)) return CALC_MODIFIED[calcId].iso;
  return SITE_CONTENT_LASTMOD;
}

export function buildSitemap(posts: SitemapPost[]): MetadataRoute.Sitemap {
  const staticEntries = routeSitemap.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: lastModifiedForRoute(route),
  }));

  const postEntries = posts
    .filter(post => typeof post.id === 'string' && post.id.length > 0)
    .map(post => ({
      url: `${SITE_URL}/blog/${post.id}`,
      ...(post.createdAt ? { lastModified: post.createdAt.slice(0, 10) } : {}),
    }));

  return [...staticEntries, ...postEntries];
}
