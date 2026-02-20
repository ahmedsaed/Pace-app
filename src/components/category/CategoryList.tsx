/**
 * CategoryList Component
 * Displays a list of categories with optional grouping
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Category } from '../../utils/types';
import { CategoryCard } from './CategoryCard';
import { spacing, fontSize } from '../../styles/theme';
import { useColors } from '../../hooks/useColors';

interface CategoryListProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
  emptyMessage?: string;
  showSubcategoryCounts?: boolean;
  getSubcategoryCount?: (categoryId: number) => number;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoryPress,
  emptyMessage = 'No categories yet',
  showSubcategoryCounts = false,
  getSubcategoryCount,
}) => {
  const colors = useColors();

  if (categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id!.toString()}
      numColumns={3}
      renderItem={({ item }) => (
        <CategoryCard
          category={item}
          onPress={() => onCategoryPress?.(item)}
          showSubcategories={showSubcategoryCounts}
          subcategoryCount={getSubcategoryCount?.(item.id!) || 0}
        />
      )}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing.lg,
  },
  row: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: fontSize.md,
    textAlign: 'center',
  },
});
