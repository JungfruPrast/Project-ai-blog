/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdn.sanity.io",
        },
      ],
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=3600",
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  