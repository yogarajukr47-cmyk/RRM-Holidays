import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/login', '/signup'],
    },
    sitemap: 'https://rrmholidays.com/sitemap.xml',
  }
}
