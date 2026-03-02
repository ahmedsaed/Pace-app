/**
 * CategoriesScreen
 * Main screen for managing categories with income/expense tabs
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCategoryStore } from '../../store/categoryStore';
import { CategoryList } from '../../components/category/CategoryList';
import { spacing, fontSize, fontWeight } from '../../styles/theme';
import { useColors } from '../../hooks/useColors';
import { Category } from '../../utils/types';
import { initializeDatabase } from '../../db/database';

type TabType = 'expense' | 'income';

export const CategoriesScreen = ({ navigation }: any) => {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  
  const {
    categories,
    loading,
    fetchCategories,
    getRootCategories,
    getSubcategoriesById,
    seedDefaults,
  } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // Initialize database first
      await initializeDatabase();
      
      // Seed default categories if database is empty
      await seedDefaults();
      
      // Fetch all categories
      await fetchCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryDetail', { categoryId: category.id });
  };

  const handleCategoryLongPress = (category: Category) => {
    navigation.navigate('EditCategory', { categoryId: category.id });
  };

  const handleAddCategory = () => {
    navigation.navigate('AddCategory');
  };

  const rootCategories = getRootCategories(activeTab);

  const getSubcategoryCount = (categoryId: number): number => {
    return getSubcategoriesById(categoryId).length;
  };

  if (loading && categories.length === 0) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddCategory}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      {/* Income/Expense Segmented Control */}
      <View style={[styles.segmentedControl, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.segment,
            activeTab === 'expense' && [styles.segmentActive, { backgroundColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('expense')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-down-circle"
            size={20}
            color={activeTab === 'expense' ? colors.background : colors.textSecondary}
          />
          <Text style={[
            styles.segmentText,
            { color: activeTab === 'expense' ? colors.background : colors.textSecondary }
          ]}>
            Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segment,
            activeTab === 'income' && [styles.segmentActive, { backgroundColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('income')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-up-circle"
            size={20}
            color={activeTab === 'income' ? colors.background : colors.textSecondary}
          />
          <Text style={[
            styles.segmentText,
            { color: activeTab === 'income' ? colors.background : colors.textSecondary }
          ]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category List */}
      <View style={styles.content}>
        <CategoryList
          categories={rootCategories}
          onCategoryPress={handleCategoryPress}
          onCategoryLongPress={handleCategoryLongPress}
          emptyMessage={`No ${activeTab} categories yet. Tap + to add one.`}
          showSubcategoryCounts={true}
          getSubcategoryCount={getSubcategoryCount}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  segmentActive: {
  },
  segmentText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
