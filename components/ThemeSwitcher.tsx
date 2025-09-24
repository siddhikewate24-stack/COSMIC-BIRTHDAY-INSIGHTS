import React from 'react';
import type { Theme } from '../types';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { StarsIcon } from './icons/StarsIcon';
import { DiamondIcon } from './icons/DiamondIcon';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  const themes: Theme[] = ['light', 'dark', 'starry', 'glitter'];
  
  const cycleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
  
  const getIcon = () => {
    switch (currentTheme) {
      case 'light':
        return <SunIcon className="w-6 h-6" />;
      case 'dark':
        return <MoonIcon className="w-6 h-6" />;
      case 'starry':
        return <StarsIcon className="w-6 h-6" />;
      case 'glitter':
        return <DiamondIcon className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={cycleTheme}
        className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 backdrop-blur-sm transition-colors"
        aria-label={`Switch to next theme (current: ${currentTheme})`}
      >
        {getIcon()}
      </button>
    </div>
  );
};

export default ThemeSwitcher;