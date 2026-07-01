/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the dev server to be reached from any host (LAN IP, tunnels, etc.).
  // Dev-only; has no effect on production builds.
  allowedDevOrigins: ['*', '192.168.0.170', '192.168.*.*', '10.*.*.*'],
  images: {
    // Ideas and user avatars use arbitrary external image URLs, so allow any https host.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
