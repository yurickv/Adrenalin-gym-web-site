import { SITE_URL } from '@/lib/sitemap';

/**
 * Absolute canonical URL for a static route, for `metadata.alternates`.
 * Pass the same path that `routeSitemap` uses ('' for the home page).
 */
export function canonicalFor(path: string): { canonical: string } {
  return { canonical: `${SITE_URL}${path}` };
}
