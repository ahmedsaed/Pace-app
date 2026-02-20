/**
 * CategoryCard Component
 * Displays a category with icon, name, and color
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../utils/types';
import { spacing, fontSize, fontWeight } from '../../styles/theme';
import { useColors } from '../../hooks/useColors';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  showSubcategories?: boolean;
  subcategoryCount?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  showSubcategories = false,
  subcategoryCount = 0,
}) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color || colors.primary }]}>
        <Ionicons 
          name={category.icon as any || 'pricetag'} 
          size={28} 
          color={colors.background} 
        />
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
        {category.name}
      </Text>
      {showSubcategories && subcategoryCount > 0 && (
        <Text style={[styles.subcategoryText, { color: colors.textSecondary }]} numberOfLines={1}>
          {subcategoryCount} sub
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    minHeight: 110,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    marginBottom: 2,
  },
  subcategoryText: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: 2,
  },
});