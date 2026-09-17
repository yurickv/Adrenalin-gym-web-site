import { describe, it, expect } from 'vitest';
import { buildSitemap, lastModifiedForRoute, SITE_URL } from './sitemap';
import { CALC_DATE_MODIFIED } from '@/const/calcSeo';
import { SITE_CONTENT_LASTMOD, routeSitemap } from '@/const/routeSitemap';

describe('lastModifiedForRoute', () => {
  it('uses the calculators date for /calcs routes', () => {
    expect(lastModifiedForRoute('/calcs')).toBe(CALC_DATE_MODIFIED);
    expect(lastModifiedForRoute('/calcs/calories-calculator')).toBe(
      CALC_DATE_MODIFIED
    );
  });

  it('uses the site content date for every other route', () => {
    expect(lastModifiedForRoute('')).toBe(SITE_CONTENT_LASTMOD);
    expect(lastModifiedForRoute('/learn/intro')).toBe(SITE_CONTENT_LASTMOD);
  });
});

describe('buildSitemap', () => {
  it('lists every static route with an absolute url and lastModified', () => {
    const entries = buildSitemap([]);

    expect(entries).toHaveLength(routeSitemap.length);
    expect(entries[0]).toEqual({
      url: SITE_URL,
      lastModified: SITE_CONTENT_LASTMOD,
    });
    expect(
      entries.find(entry => entry.url === `${SITE_URL}/calcs/calories-calculator`)
    ).toEqual({
      url: `${SITE_URL}/calcs/calories-calculator`,
      lastModified: CALC_DATE_MODIFIED,
    });
  });

  it('adds blog posts after static routes with createdAt as a date', () => {
    const entries = buildSitemap([
      { id: 'veteran-sport', createdAt: '2026-05-01T10:20:30.000Z' },
    ]);

    expect(entries.at(-1)).toEqual({
      url: `${SITE_URL}/blog/veteran-sport`,
      lastModified: '2026-05-01',
    });
  });

  it('omits lastModified for posts without createdAt', () => {
    const entries = buildSitemap([{ id: 'old-post' }]);

    expect(entries.at(-1)).toEqual({ url: `${SITE_URL}/blog/old-post` });
  });

  it('never emits changeFrequency or priority', () => {
    const entries = buildSitemap([
      { id: 'x', createdAt: '2026-01-01T00:00:00.000Z' },
    ]);

    for (const entry of entries) {
      expect(entry).not.toHaveProperty('changeFrequency');
      expect(entry).not.toHaveProperty('priority');
    }
  });

  it('skips posts without a valid id', () => {
    const entries = buildSitemap([{ id: '' }, { id: 'ok', createdAt: '2026-02-03T00:00:00.000Z' }]);
    const postEntries = entries.slice(routeSitemap.length);
    expect(postEntries).toEqual([{ url: `${SITE_URL}/blog/ok`, lastModified: '2026-02-03' }]);
  });
});
