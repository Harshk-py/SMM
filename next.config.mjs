// next.config.mjs
import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,

  // Image optimization defaults — helps next/image serve smaller files to mobile
  images: {
    // ask Next to serve AVIF / WebP when supported by the browser
    formats: ["image/avif", "image/webp"],

    // sensible device widths used to generate srcset (helps mobile choose small image)
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1600],
    // extra imageSizes for <Image width={...} /> calls
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // If you load images from external hosts (CDN/Stripe/etc), add remotePatterns here.
    // remotePatterns: [
    //   { protocol: "https", hostname: "images.example-cdn.com", pathname: "/**" },
    // ],
  },

  // Use SWC minifier (fast, good production minification)
  swcMinify: true,

  // Produce a standalone build (useful for certain deployment targets/containers).
  // Optional, but generally safe and can reduce surprises on some hosts.
  output: "standalone",

  // Helpful for diagnosing production bundle issues; leave false unless you need source maps.
  productionBrowserSourceMaps: false,

  // Optional: set experimental flags only if you want to try them.
  // experimental: {
  //   optimizeCss: true,
  // },
};

// Wrap config with bundle analyzer when ANALYZE=true
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withAnalyzer(baseConfig);

export default nextConfig;
