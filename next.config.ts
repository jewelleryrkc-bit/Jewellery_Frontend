/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";
import { GenerateSW } from 'workbox-webpack-plugin';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  webpack: (config: { plugins: GenerateSW[]; }, { isServer }: any) => {
    if (!isServer && isProd) {
      config.plugins.push(
        new GenerateSW({
          swDest: '/service-worker.js',
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/your-site\.com\/products\/.*/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'products-pages',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
              },
            },
          ],
        })
      );
    }

    return config;
  },
};
