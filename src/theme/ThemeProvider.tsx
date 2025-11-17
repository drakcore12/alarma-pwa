import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '../types';
import { themes, getThemeById, getDefaultTheme } from './themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    const saved = localStorage.getItem('themeId');
    return saved || getDefaultTheme().id;
  });

  const currentTheme = getThemeById(currentThemeId) || getDefaultTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme.id);
    
    // Aplicar variables CSS
    const colors = currentTheme.colors;
    root.style.setProperty('--bg', colors.background);
    root.style.setProperty('--surface', colors.surface);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--text-main', colors.textMain);
    root.style.setProperty('--text-soft', colors.textSoft);
    root.style.setProperty('--shadow-light', colors.shadowLight);
    root.style.setProperty('--shadow-dark', colors.shadowDark);
    
    // Aplicar clase de modo
    root.classList.remove('light-mode', 'dark-mode');
    root.classList.add(`${currentTheme.mode}-mode`);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('themeId', themeId);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

