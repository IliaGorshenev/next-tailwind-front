// import {
//   Navbar as HeroUINavbar,
//   NavbarContent,
//   NavbarMenu,
//   NavbarMenuToggle,
//   NavbarBrand,
//   NavbarItem,
//   NavbarMenuItem,
// } from "@heroui/navbar";
// import { Button } from "@heroui/button";
// import { Kbd } from "@heroui/kbd";
// import { Link } from "@heroui/link";
// import { Input } from "@heroui/input";
// import { link as linkStyles } from "@heroui/theme";
// import NextLink from "next/link";
// import clsx from "clsx";

// import { siteConfig } from "@/config/site";
// import { ThemeSwitch } from "@/components/theme-switch";
// import {
//   TwitterIcon,
//   GithubIcon,
//   DiscordIcon,
//   HeartFilledIcon,
//   SearchIcon,
//   Logo,
// } from "@/components/icons";

// export const Navbar = () => {
//   const searchInput = (
//     <Input
//       aria-label="Search"
//       classNames={{
//         inputWrapper: "bg-default-100",
//         input: "text-sm",
//       }}
//       endContent={
//         <Kbd className="hidden lg:inline-block" keys={["command"]}>
//           K
//         </Kbd>
//       }
//       labelPlacement="outside"
//       placeholder="Search..."
//       startContent={
//         <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
//       }
//       type="search"
//     />
//   );

//   return (
//     <HeroUINavbar maxWidth="xl" position="sticky">
//       <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
//         <NavbarBrand as="li" className="gap-3 max-w-fit">
//           <NextLink className="flex justify-start items-center gap-1" href="/">
//             <Logo />
//             <p className="font-bold text-inherit">ACME</p>
//           </NextLink>
//         </NavbarBrand>
//         <ul className="hidden lg:flex gap-4 justify-start ml-2">
//           {siteConfig.navItems.map((item) => (
//             <NavbarItem key={item.href}>
//               <NextLink
//                 className={clsx(
//                   linkStyles({ color: "foreground" }),
//                   "data-[active=true]:text-primary data-[active=true]:font-medium",
//                 )}
//                 color="foreground"
//                 href={item.href}
//               >
//                 {item.label}
//               </NextLink>
//             </NavbarItem>
//           ))}
//         </ul>
//       </NavbarContent>

//       <NavbarContent
//         className="hidden sm:flex basis-1/5 sm:basis-full"
//         justify="end"
//       >
//         <NavbarItem className="hidden sm:flex gap-2">
//           <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
//             <TwitterIcon className="text-default-500" />
//           </Link>
//           <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
//             <DiscordIcon className="text-default-500" />
//           </Link>
//           <Link isExternal aria-label="Github" href={siteConfig.links.github}>
//             <GithubIcon className="text-default-500" />
//           </Link>
//           <ThemeSwitch />
//         </NavbarItem>
//         <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
//         <NavbarItem className="hidden md:flex">
//           <Button
//             isExternal
//             as={Link}
//             className="text-sm font-normal text-default-600 bg-default-100"
//             href={siteConfig.links.sponsor}
//             startContent={<HeartFilledIcon className="text-danger" />}
//             variant="flat"
//           >
//             Sponsor
//           </Button>
//         </NavbarItem>
//       </NavbarContent>

//       <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
//         <Link isExternal aria-label="Github" href={siteConfig.links.github}>
//           <GithubIcon className="text-default-500" />
//         </Link>
//         <ThemeSwitch />
//         <NavbarMenuToggle />
//       </NavbarContent>

//       <NavbarMenu>
//         {searchInput}
//         <div className="mx-4 mt-2 flex flex-col gap-2">
//           {siteConfig.navMenuItems.map((item, index) => (
//             <NavbarMenuItem key={`${item}-${index}`}>
//               <Link
//                 color={
//                   index === 2
//                     ? "primary"
//                     : index === siteConfig.navMenuItems.length - 1
//                       ? "danger"
//                       : "foreground"
//                 }
//                 href="#"
//                 size="lg"
//               >
//                 {item.label}
//               </Link>
//             </NavbarMenuItem>
//           ))}
//         </div>
//       </NavbarMenu>
//     </HeroUINavbar>
//   );
// };

// src/components/navbar.tsx
// This version uses components from the @heroui library

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link'; // Use HeroUI Link
import {
  Navbar as HeroUINavbar,
  NavbarBrand, // Rename imported Navbar to avoid conflict
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import NextLink from 'next/link'; // Use NextLink for internal navigation

// Assuming siteConfig and icons are correctly imported
import { DiscordIcon, GithubIcon, HeartFilledIcon, Logo, SearchIcon, TwitterIcon } from '@/components/icons'; // Assuming these icon components exist
import { ThemeSwitch } from '@/components/theme-switch'; // Assuming this component exists
import { siteConfig } from '@/config/site';

// Define the Navbar component
export const Navbar = () => {
  // Define the search input element using HeroUI Input
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100', // Custom styling for input wrapper
        input: 'text-sm', // Custom styling for input text
      }}
      // Keyboard shortcut display (visible on large screens)
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      // Search icon at the start of the input
      startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
      type="search"
    />
  );

  // Return the Navbar structure using HeroUI components
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Left section: Brand and main navigation links */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Brand Logo and Name */}
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo /> {/* Your Logo component */}
            <p className="font-bold text-inherit">ACME</p> {/* Replace ACME with your site name */}
          </NextLink>
        </NavbarBrand>
        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map(
            (
              item, // Map through navItems from siteConfig
            ) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: 'foreground' }), // Apply link styles
                    'data-[active=true]:text-primary data-[active=true]:font-medium', // Active link styling
                  )}
                  color="foreground"
                  href={item.href}>
                  {item.label}
                </NextLink>
              </NavbarItem>
            ),
          )}
        </ul>
      </NavbarContent>

      {/* Right section: Social links, theme switch, search, sponsor button */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        {/* Social Links and Theme Switch */}
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch /> {/* Your ThemeSwitch component */}
        </NavbarItem>
        {/* Search Input (visible on large screens) */}
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        {/* Sponsor Button (visible on medium screens and up) */}
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link} // Use HeroUI Link component
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />} // Sponsor icon
            variant="flat">
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Right section: Github link, Theme switch, Menu toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle /> {/* Hamburger menu button */}
      </NavbarContent>

      {/* Mobile Menu Content */}
      <NavbarMenu>
        {searchInput} {/* Search input inside mobile menu */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* Map through mobile navigation items from siteConfig */}
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link // Use HeroUI Link
                color={
                  // Dynamically set link color
                  index === 2 // Example: Highlight the 3rd item
                    ? 'primary'
                    : index === siteConfig.navMenuItems.length - 1 // Example: Style the last item differently
                      ? 'danger'
                      : 'foreground'
                }
                href="#" // Replace with actual href if needed
                size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
