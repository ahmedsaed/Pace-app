/**
 * AddCategoryScreen
 * Screen for creating a new category
 */

import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategoryStore } from '../../store/categoryStore';
import { CategoryForm } from '../../components/category/CategoryForm';
import { useColors } from '../../hooks/useColors';
import { Category } from '../../utils/types';

export const AddCategoryScreen = ({ navigation }: any) => {
  const colors = useColors();
  const { createCategory } = useCategoryStore();

  const handleSubmit = async (category: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      await createCategory(category);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create category. Please try again.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <CategoryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
