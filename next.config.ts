import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'websocketapichat.onrender.com',
        pathname: '/uploads/**', 
      },
    ],
  },
};

export default nextConfig;
