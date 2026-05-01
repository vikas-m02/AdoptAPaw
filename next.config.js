/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.petmd.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lhasahappyhomes.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.britannica.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dccwebsiteimages.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'apupabove.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a-us.storyblok.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dogster.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pet-health-content-media.chewy.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.toiimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-be.chewy.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;