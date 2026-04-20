import { useEffect, useState } from 'react';

export type ThemeId = 'classic' | 'midnight' | 'ocean' | 'sepia';

interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
}

const STORAGE_KEY = 'ink_theme';
const DEFAULT_THEME: ThemeId = 'classic';

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'classic', name: 'Ink Classic', description: 'Clean paper-like light theme.' },
  { id: 'midnight', name: 'Ink Midnight', description: 'Dark theme for low-light writing sessions.' },
  { id: 'ocean', name: 'Ink Ocean', description: 'Cool blue palette with calm contrast.' },
  { id: 'sepia', name: 'Ink Sepia', description: 'Warm beige tones inspired by old manuscripts.' },
];

const isValidTheme = (value: string | null): value is ThemeId =>
  Boolean(value && THEME_OPTIONS.some((theme) => theme.id === value));

export const applyTheme = (theme: ThemeId) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', theme);

  if (theme === 'midnight') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const initializeTheme = () => {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  const theme = isValidTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
  applyTheme(theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
  return theme;
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const initialTheme = initializeTheme();
    setThemeState(initialTheme);
  }, []);

  const setTheme = (nextTheme: ThemeId) => {
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    }
  };

  return { theme, setTheme, themeOptions: THEME_OPTIONS };
};
