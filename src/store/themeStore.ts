/**
 * Theme Store
 * Manages theme state (light/dark mode) using Zustand
 */

import { create } from 'zustand';
import { ThemeMode } from '../utils/types';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark', // Default to dark theme
  toggleTheme: () =>
    set((state) => ({
      mode: state.mode === 'dark' ? 'light' : 'dark',
    })),
  setTheme: (mode: ThemeMode) => set({ mode }),
}));
