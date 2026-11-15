import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Legacy "Fitness Police" / "Food Police" paths from before the ERICONET rebrand.
    return [
      { source: "/client/food-police", destination: "/client/nutrition", permanent: true },
      { source: "/client/fitness-police", destination: "/client/training", permanent: true },
      { source: "/admin/food-police", destination: "/admin/nutrition-review", permanent: true },
      { source: "/admin/fitness-police", destination: "/admin/training", permanent: true },
      { source: "/api/food-police/:path*", destination: "/api/nutrition/:path*", permanent: true },
      { source: "/api/fitness-police/:path*", destination: "/api/training/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
