/** @type {import('next').NextConfig} */
const nextConfig = {
  // The mongodb driver is a native Node package; keep it server-external so the
  // Turbopack production build doesn't try to bundle it (avoids the
  // "Can't resolve 'mongodb'" failure on Vercel).
  serverExternalPackages: ["mongodb"],
  images: {
    // Ideas and user avatars use arbitrary external image URLs, so allow any https host.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
