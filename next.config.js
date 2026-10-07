/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/post-photos/**',
      },
    ],
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
  async redirects() {
    return [
      // Old blog slug with an apostrophe; Google indexed both the raw and the
      // percent-encoded form, so redirect both to the renamed post.
      {
        source: "/blog/specifics-of-women's-training",
        destination: '/blog/specifics-of-womens-training',
        statusCode: 301,
      },
      {
        source: '/blog/specifics-of-women%27s-training',
        destination: '/blog/specifics-of-womens-training',
        statusCode: 301,
      },
    ];
  },
  preview: {
    enabled: false,
  },
};

module.exports = nextConfig;
