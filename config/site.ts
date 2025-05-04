export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Главная',
      href: '/',
    },
    {
      label: 'Обо мне',
      href: '/blog',
    },
    {
      label: 'Услуги',
      href: '/services',
    },
    {
      label: 'Цены',
      href: '/pricing',
    },
  ],
  navMenuItems: [
    {
      label: 'Главная',
      href: '/',
    },
    {
      label: 'Обо мне',
      href: '/blog',
    },
    {
      label: 'Услуги',
      href: '/services',
    },
    {
      label: 'Цены',
      href: '/pricing',
    },
  ],
  links: {
    telegram: 'https://t.me/marchenko_cosmetology',
  },
};
