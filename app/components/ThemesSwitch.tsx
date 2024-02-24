'use client'

import React from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from './Icons';

const ThemesSwitch = () => {
  const { theme, setTheme } = useTheme();

  // Directly return the button with icons, without waiting for the component to mount.
  // This assumes that your icons can render without needing to know the theme or the mounted state.
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemesSwitch;
