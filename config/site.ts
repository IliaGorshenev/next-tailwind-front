export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Ольга Марченко',
  description: 'Профессиональный косметолог в Санкт-Петербурге. Персональный сайт.',
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
