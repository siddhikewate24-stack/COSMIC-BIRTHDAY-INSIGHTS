import type { SavedBirthday, Theme } from '../types';

const BIRTHDAY_STORAGE_KEY = 'nakshatraPathBirthdays';
const THEME_STORAGE_KEY = 'nakshatraPathTheme';

export const getSavedBirthdays = (): SavedBirthday[] => {
  try {
    const saved = localStorage.getItem(BIRTHDAY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to parse saved birthdays from localStorage', error);
    return [];
  }
};

export const saveBirthdays = (birthdays: SavedBirthday[]): void => {
  try {
    localStorage.setItem(BIRTHDAY_STORAGE_KEY, JSON.stringify(birthdays));
  } catch (error) {
    console.error('Failed to save birthdays to localStorage', error);
  }
};

export const getTheme = (): Theme => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'starry' || savedTheme === 'glitter') {
    return savedTheme;
  }
  // Default to glitter theme
  return 'glitter';
};

export const saveTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};