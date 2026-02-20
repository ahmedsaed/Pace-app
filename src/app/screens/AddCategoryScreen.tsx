/**
 * AddCategoryScreen
 * Screen for creating a new category
 */

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CategoryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
