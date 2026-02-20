/**
 * Theme Configuration
 * Centralized theme system for the app with spacing, typography, and more
 * 
 * LAYOUT GUIDELINES:
 * - All screens should use spacing.lg (24px) for horizontal padding/margins
 * - ScrollViews: Use paddingHorizontal: spacing.lg in contentContainerStyle
 * - Regular Views: Wrap content in a View with paddingHorizontal: spacing.lg
 * - Forms: Use paddingHorizontal: spacing.lg directly on the container
 * - This ensures consistent margins across all pages
 */

import { darkColors, lightColors } from '../utils/colors';
import { Theme, ThemeMode } from '../utils/types';

// ============================================================================
// Spacing System (8pt grid)
// ============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ============================================================================
// Border Radius (Slight Rounding)
// ============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 12,
  xxl: 16,
  full: 9999,
};

// ============================================================================
// Typography
// ============================================================================

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

export const fontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// ============================================================================
// Shadows (Disabled - No shadows)
// ============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  md: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  lg: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xl: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// ============================================================================
// Animation Durations
// ============================================================================

export const duration = {
  fastest: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slowest: 800,
};

// ============================================================================
// Z-Index Layers
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  toast: 700,
  tooltip: 800,
};

// ============================================================================
// Dark Theme Configuration
// ============================================================================

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: darkColors.primary,
    background: darkColors.background,
    surface: darkColors.surface,
    text: darkColors.text,
    textSecondary: darkColors.textSecondary,
    border: darkColors.border,
    income: darkColors.income,
    expense: darkColors.expense,
    transfer: darkColors.transfer,
    error: darkColors.error,
    success: darkColors.success,
    warning: darkColors.warning,
  },
  spacing: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },
  borderRadius: {
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    full: borderRadius.full,
  },
  fontSize: {
    xs: fontSize.xs,
    sm: fontSize.sm,
    md: fontSize.md,
    lg: fontSize.lg,
    xl: fontSize.xl,
    xxl: fontSize.xxl,
  },
};

// ============================================================================
// Light Theme Configuration
// ============================================================================

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: lightColors.primary,
    background: lightColors.background,
    surface: lightColors.surface,
    text: lightColors.text,
    textSecondary: lightColors.textSecondary,
    border: lightColors.border,
    income: lightColors.income,
    expense: lightColors.expense,
    transfer: lightColors.transfer,
    error: lightColors.error,
    success: lightColors.success,
    warning: lightColors.warning,
  },
  spacing: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },
  borderRadius: {
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    full: borderRadius.full,
  },
  fontSize: {
    xs: fontSize.xs,
    sm: fontSize.sm,
    md: fontSize.md,
    lg: fontSize.lg,
    xl: fontSize.xl,
    xxl: fontSize.xxl,
  },
};

// ============================================================================
// Theme Selector
// ============================================================================

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// ============================================================================
// Common Component Styles
// ============================================================================

export const commonStyles = {
  // Container styles
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  
  // Card styles (dark gray background with border)
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: 'rgba(229, 229, 229, 0.3)',
  },
  
  // Button styles
  button: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  // Input styles
  input: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.base,
    borderWidth: 1,
  },
  
  // Text styles
  textHeading: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  textTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  textBody: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
  },
  textCaption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  
  // Layout helpers
  flexRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  flexColumn: {
    flexDirection: 'column' as const,
  },
  flexCenter: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  flexBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
};

// ============================================================================
// Responsive Breakpoints
// ============================================================================

export const breakpoints = {
  small: 320,   // Small phones
  medium: 375,  // Standard phones
  large: 414,   // Large phones
  tablet: 768,  // Tablets
};

// ============================================================================
// Hit Slop (Touch Target Sizes)
// ============================================================================

export const hitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
};
