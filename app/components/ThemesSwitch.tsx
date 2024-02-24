'use client'
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from './Icons';

const ThemesSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Immediately mount component on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the button, but conditionally render its children based on the mounted state
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {mounted && (theme === 'dark' ? <SunIcon /> : <MoonIcon />)}
    </button>
  );
};

export default ThemesSwitch;
