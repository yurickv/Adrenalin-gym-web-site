import { describe, it, expect } from 'vitest';
import { canonicalFor } from './canonical';
import { SITE_URL } from './sitemap';
import { routeSitemap } from '@/const/routeSitemap';

describe('canonicalFor', () => {
  it('builds an absolute canonical for a route path', () => {
    expect(canonicalFor('/learn/intro')).toEqual({
      canonical: `${SITE_URL}/learn/intro`,
    });
  });

  it('maps the home route to the bare site url', () => {
    expect(canonicalFor('')).toEqual({ canonical: SITE_URL });
  });

  it('matches the sitemap url for every static route', () => {
    for (const route of routeSitemap) {
      expect(canonicalFor(route).canonical).toBe(`${SITE_URL}${route}`);
    }
  });
});
