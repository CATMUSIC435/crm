import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://novacrm.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Core public & business routes
  const routes: {
    path: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/projects', priority: 0.9, changeFrequency: 'daily' },
    { path: '/inventory', priority: 0.9, changeFrequency: 'hourly' },
    { path: '/auction', priority: 0.9, changeFrequency: 'daily' },
    { path: '/marketplace', priority: 0.85, changeFrequency: 'daily' },
    { path: '/resale', priority: 0.85, changeFrequency: 'daily' },
    { path: '/mortgage', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/panorama', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/gis', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/cms', priority: 0.8, changeFrequency: 'daily' },
    { path: '/loyalty', priority: 0.75, changeFrequency: 'weekly' },
    { path: '/marketing', priority: 0.75, changeFrequency: 'daily' },
    { path: '/gamification', priority: 0.75, changeFrequency: 'daily' },
    { path: '/portfolio', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/handover', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/operations', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/surveys', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/bi', priority: 0.7, changeFrequency: 'daily' },
    { path: '/ai-knowledge', priority: 0.65, changeFrequency: 'weekly' },
    { path: '/document-ai', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/integrations', priority: 0.6, changeFrequency: 'monthly' },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: currentDate,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
