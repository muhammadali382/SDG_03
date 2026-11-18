/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["tesseract.js"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
