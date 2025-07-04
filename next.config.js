// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // или другие ваши настройки
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Укажите http или https
        hostname: '91.197.98.34', // Ваш IP-адрес или домен
        port: '8000', // Укажите порт, если он есть в URL
        pathname: '/uploads/**', // Можно указать путь, например, чтобы разрешить только папку /uploads/**
      },
      {
        protocol: 'https',
        hostname: 'startrixbot.ru',
        port: '', // Пусто, если стандартный порт (80 или 443)
        pathname: '/uploads/**',
      },
        {
        protocol: 'https',
        hostname: 'admin.spb-cosmetologist.ru',
        port: '', // Пусто, если стандартный порт (80 или 443)
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'admin.spb-cosmetologist.ru',
        port: '', // Пусто, если стандартный порт (80 или 443)
        pathname: '/uploads/**',
      },

    ],
  },
};

module.exports = nextConfig;
