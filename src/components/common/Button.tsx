/**
 * Button Component
 * Reusable button with variants
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles],
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles],
    styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? darkColors.primary : darkColors.background} />
      ) : (
        <Text style={textStyleCombined}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: darkColors.primary,
  },
  buttonSecondary: {
    backgroundColor: darkColors.surface,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: darkColors.primary,
  },
  buttonDanger: {
    backgroundColor: darkColors.expense,
  },
  buttonSmall: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  buttonMedium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonLarge: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: fontWeight.semibold as any,
  },
  textPrimary: {
    color: darkColors.background,
  },
  textSecondary: {
    color: darkColors.text,
  },
  textOutline: {
    color: darkColors.primary,
  },
  textDanger: {
    color: darkColors.background,
  },
  textSmall: {
    fontSize: fontSize.sm,
  },
  textMedium: {
    fontSize: fontSize.base,
  },
  textLarge: {
    fontSize: fontSize.lg,
  },
  textDisabled: {
    opacity: 0.7,
  },
});
