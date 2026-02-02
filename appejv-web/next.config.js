/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.appejv.vn/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.appejv.vn/api'}/:path*`,
      },
    ];
  },
  images: {
    domains: ['api.appejv.vn', 'localhost'],
  },
};

module.exports = nextConfig;
