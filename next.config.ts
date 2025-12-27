import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Allow optimized images from Cloudinary & Supabase storage
    domains: [
      "res.cloudinary.com",
      "fakkzdfwpucpgndofgcu.supabase.co",
    ],
  },
};

export default nextConfig;
