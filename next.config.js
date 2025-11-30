/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/u/script.js',
        destination: 'https://cloud.umami.is/script.js',
      },
      {
        source: '/u/api/send',
        destination: '/api/u/send',
      },
    ];
  },
};

module.exports = nextConfig;
