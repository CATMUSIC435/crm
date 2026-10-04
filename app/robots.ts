import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://novacrm.vn';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/backend-api/',
          '/(auth)/',
          '/settings/',
          '/login',
          '/*?*token=',
          '/*?*session=',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/backend-api/', '/settings/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/public/', '/_next/static/', '/_next/image/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
