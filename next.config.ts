import type { NextConfig } from 'next'

const supabaseDomain = process.env.SUPABASE_DOMAIN
if (!supabaseDomain) {
  throw new Error('SUPABASE_DOMAIN env variable is not set')
}

const securityHeaders = [
  // Prevent the page from being embedded in iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Control referrer information
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // Force HTTPS for 1 year in production
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
    : []),
  // Block XSS via frame-ancestors and restrict sources
  {
    key: 'Content-Security-Policy',
    value: [
      `default-src 'self'`,
      // Next.js inline scripts + Web3 wallet scripts need unsafe-inline/eval
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline'`,
      // Allow images from self, data URIs, and Supabase storage
      `img-src 'self' data: blob: https://${supabaseDomain}`,
      // Web3 providers connect to various RPC endpoints
      `connect-src 'self' https: wss:`,
      `font-src 'self' data:`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      // Block all framing
      `frame-ancestors 'none'`,
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseDomain,
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
