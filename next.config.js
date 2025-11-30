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
        destination: 'https://cloud.umami.is/api/send',
      },
    ];
  },
};

module.exports = nextConfig;
