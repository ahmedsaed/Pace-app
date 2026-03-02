/**
 * CategoriesStackNavigator
 * Stack navigator for category management screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { AddCategoryScreen } from '../screens/AddCategoryScreen';
import { EditCategoryScreen } from '../screens/EditCategoryScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import { EditTransactionScreen } from '../screens/EditTransactionScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';
import { useColors } from '../../hooks/useColors';
import { fontSize } from '../../styles/theme';

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
          fontSize: fontSize.xxxl,
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
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ headerShown: false, animation: 'fade' }}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
