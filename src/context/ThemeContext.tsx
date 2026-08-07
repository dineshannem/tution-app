import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem('ssr_theme_mode') as ThemeMode;
    return saved && ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('ssr_theme_mode', mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme: 'light' | 'dark') => {
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
      document.body.classList.toggle('dark', theme === 'dark');
      document.body.classList.toggle('light', theme === 'light');

      setResolvedTheme(theme);
      root.style.colorScheme = theme;
      document.body.style.colorScheme = theme;
      root.dataset.theme = theme;
      document.body.dataset.theme = theme;
    };

    const updateTheme = () => {
      const activeTheme: 'light' | 'dark' =
        themeMode === 'dark'
          ? 'dark'
          : themeMode === 'light'
          ? 'light'
          : mediaQuery.matches
          ? 'dark'
          : 'light';

      applyTheme(activeTheme);
    };

    // Apply immediately
    updateTheme();

    // Listen to system changes only when in "system" mode
    const handleSystemChange = () => {
      if (themeMode === 'system') {
        updateTheme();
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }

    mediaQuery.addListener(handleSystemChange);
    return () => mediaQuery.removeListener(handleSystemChange);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};