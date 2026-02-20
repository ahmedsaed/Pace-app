/**
 * ColorPicker Component
 * Select a color from predefined options
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLOR_OPTIONS } from '../../utils/constants';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

interface ColorPickerProps {
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  label = 'Choose Color',
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.colorList}
      >
        {COLOR_OPTIONS.map((color) => (
          <TouchableOpacity
            key={color.value}
            style={[
              styles.colorOption,
              { backgroundColor: color.value },
              selectedColor === color.value ? styles.selectedColorOption : null,
            ]}
            onPress={() => onColorSelect(color.value)}
            activeOpacity={0.7}
          >
            {selectedColor === color.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
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
  colorList: {
    gap: spacing.sm,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: darkColors.text,
    borderWidth: 3,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
  },
});
