import type { MetadataRoute } from 'next';
import postHttpService from '@/app/_services/post.service';
import { buildSitemap } from '@/lib/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await postHttpService.getPosts({ limit: 100 });
  return buildSitemap(posts ?? []);
}
