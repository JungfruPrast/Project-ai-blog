"use client"
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from './Icons';

const ThemesSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Determine the appropriate label based on the current theme
  const buttonLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={buttonLabel}
    >
      {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
    </button>
  );
};

export default ThemesSwitch;
