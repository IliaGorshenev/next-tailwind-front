import '@/styles/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import Footer from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import './globals.css';
import { Providers } from './providers';
import ScrollingSculptures from '@/components/scrolling-sculpture';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF9F4' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
    //  <html suppressHydrationWarning lang="en">
    //   <head />
    //   <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
    //     <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
    //       <div className="relative flex flex-col h-screen">
    //         <Navbar />
    //         <div className="relative flex-grow">
    //           {/* <ScrollingSculptures /> */}
    //           <main className="container mx-auto max-w-7xl pt-16 px-6 relative z-10">{children}</main>
    //         </div>
    //         <Footer />
    //       </div>
    //     </Providers>
    //   </body>
    // </html>
  );
}
