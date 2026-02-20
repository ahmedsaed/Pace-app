import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RecordsScreen from '../screens/RecordsScreen';
import AccountsStackNavigator from './AccountsStackNavigator';
import { CategoriesStackNavigator } from './CategoriesStackNavigator';
import { useColors } from '../../hooks/useColors';
import { spacing, fontSize } from '../../styles/theme';

export type TabParamList = {
  Records: undefined;
  Accounts: undefined;
  Categories: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Records"
        component={RecordsScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconContainer, 
              focused && { backgroundColor: colors.primaryTransparent }
            ]}>
              <Ionicons name="receipt-outline" size={24} color={colors.primary} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsStackNavigator}
        options={{
          tabBarLabel: 'Accounts',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: colors.primaryTransparent }
            ]}>
              <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesStackNavigator}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: colors.primaryTransparent }
            ]}>
              <Ionicons name="pricetags-outline" size={24} color={colors.primary} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  tabBarLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600' as any,
    marginTop: spacing.xs,
  },
  tabBarIcon: {
    marginBottom: 0,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabNavigator;
