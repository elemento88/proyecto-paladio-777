/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Fix for multiple lockfiles warning
  outputFileTracingRoot: __dirname,
  
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
  // Optimize for development to prevent worker issues
  experimental: {
    workerThreads: false
  }
};

module.exports = nextConfig;