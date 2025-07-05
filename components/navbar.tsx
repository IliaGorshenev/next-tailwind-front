'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import NextLink from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
// Import Jotai atoms

// Assuming siteConfig and icons are correctly imported
import { searchQueryAtom, searchResultsAtom } from '@/app/state/services';
import { HeartFilledIcon, Logo, SearchIcon } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import { siteConfig } from '@/config/site';
import { TelegramIcon } from './icons/telegram';

// Define the Navbar component
export const Navbar = () => {
  // Use Jotai for search state
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const searchResults = useAtomValue(searchResultsAtom);

  // Local state for UI
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  // Define the search input element using HeroUI Input
  const searchInput = (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit}>
        <Input
          aria-label="Поиск"
          classNames={{
            inputWrapper: 'bg-default-100', // Custom styling for input wrapper
            input: 'text-sm', // Custom styling for input text
          }}
          labelPlacement="outside"
          placeholder="Поиск услуг..."
          startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
          type="search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-auto">
          <ul className="py-1">
            {searchResults.map((service) => (
              <li key={service.id} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <NextLink
                  href={`/services/${service.slug}`}
                  onClick={() => {
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                  className="block">
                  <div className="font-medium">{service.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {typeof service.description === 'string' ? service.description.substring(0, 60) + (service.description.length > 60 ? '...' : '') : 'Подробнее...'}
                  </div>
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && searchQuery.trim() !== '' && searchResults.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 text-center">Ничего не найдено</div>
      )}
    </div>
  );

  // Rest of your component remains the same
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Left section: Brand and main navigation links */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Brand Logo and Name */}
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/* <Logo /> */}
            {/* <Image src="/olga-logo.png" alt="Olga Logo" width={82} height={82} className="rounded-full" /> */}
            {/* <p className="font-bold text-inherit">Olga Cosmetics</p> */}
          </NextLink>
        </NavbarBrand>
        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(linkStyles({ color: 'foreground' }), 'data-[active=true]:text-primary data-[active=true]:font-medium')}
                color="foreground"
                href={item.href}>
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right section: Social links, theme switch, search, sponsor button */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        {/* Social Links and Theme Switch */}
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Telegram" href={siteConfig.links.telegram || 'https://t.me/your_username'}>
            <TelegramIcon className="text-default-500" />
          </Link>
          {/* <ThemeSwitch /> */}
        </NavbarItem>
        {/* Search Input (visible on large screens) */}
        <NavbarItem className="hidden lg:flex w-64">{searchInput}</NavbarItem>
        {/* Sponsor Button (visible on medium screens and up) */}
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={'#contact'}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat">
            Запись
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Right section: Theme switch, Menu toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/* <ThemeSwitch /> */}
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu Content */}
      <NavbarMenu>
        <div className="mx-4 mt-2 mb-4">{searchInput}</div>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color={index === 2 ? 'primary' : index === siteConfig.navMenuItems.length - 1 ? 'danger' : 'foreground'} href="#" size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
