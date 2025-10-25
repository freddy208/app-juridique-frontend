/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: true,
  images: {
    // ✅ NOUVELLE SYNTAXE (recommandée) - Plus sécurisée et flexible
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // ⚠️ ANCIENNE SYNTAXE (deprecated mais toujours fonctionnelle)
    // Gardez-la pour la compatibilité avec localhost
    domains: ['localhost', 'res.cloudinary.com', 'api.dicebear.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;