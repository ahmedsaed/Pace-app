/**
 * IconPicker Component
 * Select an icon using emojis for simplicity
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

// Simple emoji icons for accounts
const ACCOUNT_EMOJI_ICONS = [
  { id: 'bank', emoji: '🏦', label: 'Bank' },
  { id: 'credit-card', emoji: '💳', label: 'Credit Card' },
  { id: 'wallet', emoji: '👛', label: 'Wallet' },
  { id: 'money', emoji: '💰', label: 'Money' },
  { id: 'cash', emoji: '💵', label: 'Cash' },
  { id: 'piggy-bank', emoji: '🐷', label: 'Piggy Bank' },
  { id: 'safe', emoji: '🔒', label: 'Safe' },
  { id: 'chart', emoji: '📈', label: 'Investments' },
  { id: 'briefcase', emoji: '💼', label: 'Business' },
  { id: 'home', emoji: '🏠', label: 'Home' },
  { id: 'car', emoji: '🚗', label: 'Car' },
  { id: 'gift', emoji: '🎁', label: 'Gift' },
];

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (icon: string) => void;
  label?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onIconSelect,
  label = 'Choose Icon',
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.iconList}
      >
        {ACCOUNT_EMOJI_ICONS.map((icon) => (
          <TouchableOpacity
            key={icon.id}
            style={[
              styles.iconOption,
              selectedIcon === icon.id && styles.selectedIconOption,
            ]}
            onPress={() => onIconSelect(icon.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{icon.emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper to get emoji from icon id
export const getIconEmoji = (iconId: string): string => {
  const icon = ACCOUNT_EMOJI_ICONS.find(i => i.id === iconId);
  return icon?.emoji || '💳';
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: darkColors.text,
    marginBottom: spacing.sm,
  },
  iconList: {
    gap: spacing.sm,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkColors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconOption: {
    borderColor: darkColors.primary,
    backgroundColor: darkColors.surfaceHover,
  },
  emoji: {
    fontSize: 28,
  },
});
