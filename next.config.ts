import type {NextConfig} from 'next';
import path from 'path';
import {InjectManifest} from 'workbox-webpack-plugin';


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new InjectManifest({
          swSrc: path.resolve(__dirname, 'src/lib/sw.js'),
          swDest: path.resolve(__dirname, 'public/sw.js'),
          // In dev, we want to see the changes immediately.
          // In prod, we want to have the SW be precached.
          // mode: process.env.NODE_ENV || 'development',
          exclude: [
            /^build-manifest\.json$/,
            /^react-loadable-manifest\.json$/,
            /pages\/_app\.js$/,
            /pages\/_document\.js$/,
            /\/swagger-doc\//,
            /\/_error\.js$/,
            /\.next\/static\/chunks\/webpack-.*\.js$/,
          ],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
