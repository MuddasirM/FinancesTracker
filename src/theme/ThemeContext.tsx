import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from './index';

const THEME_KEY = '@coffer_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  mode: ThemeMode;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  toggleTheme: () => {},
  setThemeMode: () => {},
  mode: 'system',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setMode(saved);
      }
      setLoaded(true);
    });
  }, []);

  const resolvedTheme =
    mode === 'system'
      ? systemScheme === 'dark'
        ? darkTheme
        : lightTheme
      : mode === 'dark'
      ? darkTheme
      : lightTheme;

  const toggleTheme = () => {
    const next = resolvedTheme.isDark ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem(THEME_KEY, next);
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    AsyncStorage.setItem(THEME_KEY, newMode);
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme: resolvedTheme, toggleTheme, setThemeMode, mode }}>
      {children}
    </ThemeContext.Provider>
  );
}
