import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/terms', '/privacy', '/login'],
        disallow: [
          '/dashboard',
          '/library/',
          '/fundamentals/',
          '/resume',
          '/onboarding',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://interviewdump.dev/sitemap.xml',
  }
}
