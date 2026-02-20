/**
 * useColors Hook
 * Returns the appropriate color palette based on current theme
 */

import { useThemeStore } from '../store/themeStore';
import { darkColors, lightColors } from './colors';

export const useColors = () => {
  const mode = useThemeStore((state) => state.mode);
  return mode === 'dark' ? darkColors : lightColors;
};
