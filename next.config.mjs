// next.config.mjs

import withPWAInit from 'next-pwa';

// Initialize withPWA using a function call, as it returns a configured function
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  // Other next-pwa options if needed
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  // Other Next.js configurations
};

// Export the nextConfig object wrapped by withPWA
export default withPWA(nextConfig);