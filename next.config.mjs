/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  serverActions:true,
  mdxRs:true,
  serverComponentsExternalPackages:["mongoose"],
  },
  instrumentationHook: true,
  reactStrictMode: false,
  eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*"
            },
            {
                protocol: "http",
                hostname: "*"
            }
        ]
    }
};

export default nextConfig;
