'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for system preference and saved preference
    const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';

    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} className="theme-toggle" onClick={toggleTheme}>
      <span aria-hidden="true" className="theme-toggle-thumb" />
      <span className="sr-only">{isDarkMode ? 'Dark mode' : 'Light mode'}</span>
    </button>
  );
}
