/**
 * CategoriesStackNavigator
 * Stack navigator for category management screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { AddCategoryScreen } from '../screens/AddCategoryScreen';
import { EditCategoryScreen } from '../screens/EditCategoryScreen';
import { useColors } from '../../hooks/useColors';

const Stack = createNativeStackNavigator();

export const CategoriesStackNavigator = () => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen
        name="CategoriesList"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{ title: 'Add Category' }}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{ title: 'Edit Category' }}
      />
    </Stack.Navigator>
  );
};
