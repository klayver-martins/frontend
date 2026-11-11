import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiTarget =
      process.env.API_PROXY_TARGET ??
      process.env.NEXT_PUBLIC_API_URL ??
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : undefined);

    if (!apiTarget) {
      throw new Error(
        'Configure API_PROXY_TARGET ou NEXT_PUBLIC_API_URL com a URL do backend.',
      );
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
