/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Keep the ORM and the MySQL driver out of the server bundle
  serverExternalPackages: ['sequelize', 'mysql2'],
}

export default nextConfig
