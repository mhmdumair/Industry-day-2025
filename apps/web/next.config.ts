import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ['via.placeholder.com','placehold.co'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*',
            },
        ];
    },
};

export default nextConfig;
