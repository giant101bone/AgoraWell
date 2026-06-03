import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh", // 👈 This catches 9z7kv0j9xb.ufs.sh and any others!
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
