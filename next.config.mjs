/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Shopify CDN does the resizing (see lib/image-loader.ts)
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
};
export default nextConfig;
