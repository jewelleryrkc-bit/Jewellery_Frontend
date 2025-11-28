/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";
import { GenerateSW } from "workbox-webpack-plugin";
import type { Configuration } from "webpack";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // REQUIRED for Cloudinary images
  },

  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer && isProd) {
      config.plugins!.push(
        new GenerateSW({
          swDest: "service-worker.js",
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/your-site\.com\/products\/.*/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "products-pages",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24,
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

export default nextConfig;
