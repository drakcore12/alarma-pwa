import { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'light-aurora',
    name: 'Aurora',
    mode: 'light',
    colors: {
      background: '#E4EBF5',
      surface: '#E4EBF5',
      primary: '#4F46E5',
      accent: '#22C55E',
      textMain: '#111827',
      textSoft: '#6B7280',
      shadowLight: '#FFFFFF',
      shadowDark: '#C5CEDF',
    },
  },
  {
    id: 'dark-midnight',
    name: 'Midnight',
    mode: 'dark',
    colors: {
      background: '#0B1220',
      surface: '#111827',
      primary: '#6366F1',
      accent: '#F97316',
      textMain: '#E5E7EB',
      textSoft: '#9CA3AF',
      shadowLight: '#1F2937',
      shadowDark: '#020617',
    },
  },
  {
    id: 'cyber-mint',
    name: 'Cyber Mint',
    mode: 'dark',
    colors: {
      background: '#050816',
      surface: '#0F172A',
      primary: '#22C55E',
      accent: '#14B8A6',
      textMain: '#E5E7EB',
      textSoft: '#9CA3AF',
      shadowLight: '#1E293B',
      shadowDark: '#020617',
    },
  },
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getDefaultTheme = (): Theme => {
  return themes[0];
};

