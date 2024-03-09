"use client"
import React from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from './Icons';

const ThemesSwitch = () => {
  const { theme, setTheme } = useTheme();

  // Directly determine the appropriate label based on the current theme
  const buttonLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  // Render the switch button directly without checking for mounted state
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
