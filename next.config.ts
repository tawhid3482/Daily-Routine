import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongodb", "nodemailer"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "node:dns", "node:dns/promises"];
    }
    return config;
  },
};

export default nextConfig;
