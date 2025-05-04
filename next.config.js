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
      // Можете добавить сюда другие домены, если нужно
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '', // Пусто, если стандартный порт (80 или 443)
      //   pathname: '/images/**',
      // },
    ],
  },
};

module.exports = nextConfig;
