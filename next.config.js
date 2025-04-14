/** @type {import('next').NextConfig} */
const nextConfig = {
  output: undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    // Disable the webpack cache to prevent ENOENT errors
    config.cache = false;
    
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.git', '**/.next'],
    }
    return config
  },
};

module.exports = nextConfig;