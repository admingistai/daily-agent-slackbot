/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@daily-agent/shared"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
