/**
 * EditCategoryScreen
 * Screen for editing an existing category
 */

import React from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategoryStore } from '../../store/categoryStore';
import { CategoryForm } from '../../components/category/CategoryForm';
import { useColors } from '../../hooks/useColors';
import { Category } from '../../utils/types';

export const EditCategoryScreen = ({ route, navigation }: any) => {
  const colors = useColors();
  const { categoryId } = route.params;
  const { getCategoryById, updateCategory, deleteCategory } = useCategoryStore();

  const category = getCategoryById(categoryId);

  const handleSubmit = async (updatedCategory: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      await updateCategory(categoryId, updatedCategory);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update category. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              navigation.goBack();
            } catch (error) {
              const errorMessage = (error as Error).message;
              Alert.alert('Error', errorMessage || 'Failed to delete category.');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Set delete button in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleDelete}
          style={{ marginRight: 16 }}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  if (!category) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CategoryForm
        category={category}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
