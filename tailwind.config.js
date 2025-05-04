// tailwind.config.js
import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // Ensure these paths are correct for your project
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Keep your base font families if needed
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // Base color extensions (optional)
      colors: {
        // You can keep or remove these base extensions if not used directly
        'brand-peach-primary': '#F8B4B4',
        'brand-block-bg': '#FFFDF8',
        'brand-text-warm': '#4B423B',
        'brand-border-soft': '#F5EAE6',
        'brand-warm-default': '#FBF8F6',
      },
    },
  },
  darkMode: 'class', // Keep this as 'class'
  plugins: [
    heroui({
      // --- Themes Updated Based on Your VERY LATEST JSON ---
      themes: {
        // --- Light Theme from your NEWEST JSON ---
        light: {
          colors: {
            // Copied directly from your NEWEST 'light.colors' JSON
            default: {
              // Updated default shades
              50: '#fffaf9',
              100: '#fff3f1',
              200: '#ffece9',
              300: '#ffe4e1',
              400: '#ffddd9',
              500: '#ffd6d1',
              600: '#d2b1ac',
              700: '#a68b88',
              800: '#796663',
              900: '#4d403f',
              foreground: '#000',
              DEFAULT: '#ffd6d1',
            },
            primary: {
              // Updated primary shades
              50: '#fff9f8',
              100: '#fff0ee',
              200: '#ffe7e3',
              300: '#ffded9',
              400: '#ffd5cf',
              500: '#ffccc5',
              600: '#d2a8a3',
              700: '#a68580',
              800: '#79615e',
              900: '#4d3d3b',
              foreground: '#000',
              DEFAULT: '#ffccc5',
            },
            secondary: {
              // Kept secondary shades from previous JSON
              50: '#eefbfd',
              100: '#d7f5fa',
              200: '#c0eef7',
              300: '#a9e8f4',
              400: '#91e2f1',
              500: '#7adcee',
              600: '#65b6c4',
              700: '#4f8f9b',
              800: '#3a6971',
              900: '#254247',
              foreground: '#000',
              DEFAULT: '#7adcee',
            },
            success: {
              // Kept success shades from previous JSON
              50: '#f2fdf7',
              100: '#e0faec',
              200: '#cff7e0',
              300: '#bdf4d5',
              400: '#abf1c9',
              500: '#99eebe',
              600: '#7ec49d',
              700: '#639b7c',
              800: '#49715a',
              900: '#2e4739',
              foreground: '#000',
              DEFAULT: '#99eebe',
            },
            warning: {
              // Kept warning shades from previous JSON
              50: '#fffbf4',
              100: '#fff5e6',
              200: '#ffefd7',
              300: '#ffeac8',
              400: '#ffe4b9',
              500: '#ffdeaa',
              600: '#d2b78c',
              700: '#a6906f',
              800: '#796951',
              900: '#4d4333',
              foreground: '#000',
              DEFAULT: '#ffdeaa',
            },
            danger: {
              // Kept danger shades from previous JSON
              50: '#ffecec',
              100: '#ffd2d2',
              200: '#ffb7b7',
              300: '#ff9d9d',
              400: '#ff8282',
              500: '#ff6868',
              600: '#d25656',
              700: '#a64444',
              800: '#793131',
              900: '#4d1f1f',
              foreground: '#000',
              DEFAULT: '#ff6868',
            },
            background: '#ffffff',
            foreground: '#000000',
            content1: { DEFAULT: '#fffefa', foreground: '#000' }, // Updated content colors
            content2: { DEFAULT: '#ffffff', foreground: '#000' },
            content3: { DEFAULT: '#ffffff', foreground: '#000' }, // Light pink content bg
            content4: { DEFAULT: '#ffffff', foreground: '#000' },
            card: {
              // Added/Ensured Card definition
              DEFAULT: '#ffffff', // MODIFIED: White card background
              foreground: '#000000', // MODIFIED: Black text on cards
            },
            focus: '#ffc8c1', // Focus color from JSON
            overlay: '#000000', // Overlay from JSON
          },
          layout: {
            disabledOpacity: '0.5', // From JSON
            radius: { small: '4px', medium: '8px', large: '12px' },
            borderWidth: { small: '1px', medium: '1px', large: '1px' },
          },
        },

        // --- Dark Theme from your NEWEST JSON, with Black BG / White Text Overrides RE-APPLIED ---
        dark: {
          colors: {
            // --- Overrides Applied Below ---
            default: {
              // Default scale from NEWEST JSON, foreground override applied
              50: '#0d0d0e',
              100: '#19191c',
              200: '#26262a',
              300: '#323238',
              400: '#3f3f46',
              500: '#65656b',
              600: '#8c8c90',
              700: '#b2b2b5',
              800: '#d9d9da',
              900: '#ffffff',
              foreground: '#FFFFFF', // MODIFIED: White text
              DEFAULT: '#3f3f46',
            },
            primary: {
              // Primary scale from NEWEST JSON, foreground override applied
              50: '#4d3d3b',
              100: '#79615e',
              200: '#a68580',
              300: '#d2a8a3',
              400: '#ffccc5',
              500: '#ffd5cf',
              600: '#ffded9',
              700: '#ffe7e3',
              800: '#fff0ee',
              900: '#fff9f8',
              foreground: '#FFFFFF', // MODIFIED: White text (check contrast visually!)
              DEFAULT: '#ffccc5',
            },
            secondary: {
              // Secondary scale from NEWEST JSON, foreground override applied
              50: '#254247',
              100: '#3a6971',
              200: '#4f8f9b',
              300: '#65b6c4',
              400: '#7adcee',
              500: '#91e2f1',
              600: '#a9e8f4',
              700: '#c0eef7',
              800: '#d7f5fa',
              900: '#eefbfd',
              foreground: '#FFFFFF', // MODIFIED: White text (check contrast visually!)
              DEFAULT: '#7adcee',
            },
            success: {
              // Success scale from NEWEST JSON, foreground override applied
              50: '#2e4739',
              100: '#49715a',
              200: '#639b7c',
              300: '#7ec49d',
              400: '#99eebe',
              500: '#abf1c9',
              600: '#bdf4d5',
              700: '#cff7e0',
              800: '#e0faec',
              900: '#f2fdf7',
              foreground: '#FFFFFF', // MODIFIED: White text (check contrast visually!)
              DEFAULT: '#99eebe',
            },
            warning: {
              // Warning scale from NEWEST JSON, foreground override applied
              50: '#4d4333',
              100: '#796951',
              200: '#a6906f',
              300: '#d2b78c',
              400: '#ffdeaa',
              500: '#ffe4b9',
              600: '#ffeac8',
              700: '#ffefd7',
              800: '#fff5e6',
              900: '#fffbf4',
              foreground: '#FFFFFF', // MODIFIED: White text (check contrast visually!)
              DEFAULT: '#ffdeaa',
            },
            danger: {
              // Danger scale from NEWEST JSON, foreground override applied
              50: '#4d1f1f',
              100: '#793131',
              200: '#a64444',
              300: '#d25656',
              400: '#ff6868',
              500: '#ff8282',
              600: '#ff9d9d',
              700: '#ffb7b7',
              800: '#ffd2d2',
              900: '#ffecec',
              foreground: '#FFFFFF', // MODIFIED: White text (check contrast visually!)
              DEFAULT: '#ff6868',
            },
            // --- Background and Content Overrides ---
            background: '#000000', // MODIFIED: Pure black background
            foreground: '#FFFFFF', // MODIFIED: Pure white main text
            content1: {
              // Content scale from NEWEST JSON, overrides applied
              DEFAULT: '#000000', // MODIFIED: Pure black content area
              foreground: '#FFFFFF', // MODIFIED: White text
            },
            content2: {
              // Content scale from NEWEST JSON, overrides applied
              DEFAULT: '#111111', // MODIFIED: Very dark grey (slightly off-black)
              foreground: '#FFFFFF', // MODIFIED: White text
            },
            content3: {
              // Content scale from NEWEST JSON, overrides applied
              DEFAULT: '#1C1C1C', // MODIFIED: Dark grey
              foreground: '#FFFFFF', // MODIFIED: White text
            },
            content4: {
              // Content scale from NEWEST JSON, overrides applied
              DEFAULT: '#27272A', // MODIFIED: Medium dark grey
              foreground: '#FFFFFF', // MODIFIED: White text
            },
            // --- Focus and Overlay from JSON ---
            focus: '#ffc8c1', // Focus color from JSON
            overlay: '#ffffff', // Overlay from JSON (still white, unusual for dark)
          },
          layout: {
            disabledOpacity: '0.8', // From JSON
            radius: { small: '4px', medium: '8px', large: '12px' },
            borderWidth: { small: '1px', medium: '1px', large: '1px' },
          },
        },
      },
    }),
  ],
};

export default config;
