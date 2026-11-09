/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,

  // Keep the ORM and the MySQL driver out of the server bundle
  serverExternalPackages: ['sequelize', 'mysql2'],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Browsers stick to HTTPS for this domain once they have seen it over TLS
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
}

export default nextConfig
