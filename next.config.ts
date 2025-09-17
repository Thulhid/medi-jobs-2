import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'medi-jobs-bucket.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/recruiter-:hospitalName',
        destination: '/recruiter-dashboard',
      },
      {
        source: '/recruiter-:hospitalName/:path*',
        destination: '/recruiter-dashboard/:path*',
      },
    ];
  },

};

export default nextConfig;
