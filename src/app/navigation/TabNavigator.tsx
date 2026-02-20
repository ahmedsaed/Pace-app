import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecordsScreen from '../screens/RecordsScreen';
import AccountsStackNavigator from './AccountsStackNavigator';
import { useColors } from '../../hooks/useColors';
import { spacing, fontSize, borderRadius } from '../../styles/theme';

export type TabParamList = {
  Records: undefined;
  Accounts: undefined;
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
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && { ...styles.iconContainerActive, backgroundColor: colors.primaryTransparent || 'rgba(59, 130, 246, 0.15)' }]}>
              <Text style={[styles.iconText, { color }]}>📝</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsStackNavigator}
        options={{
          tabBarLabel: 'Accounts',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && { ...styles.iconContainerActive, backgroundColor: colors.primaryTransparent || 'rgba(59, 130, 246, 0.15)' }]}>
              <Text style={[styles.iconText, { color }]}>💳</Text>
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
    fontSize: fontSize.xs,
    fontWeight: '600' as any,
    marginTop: spacing.xs,
  },
  tabBarIcon: {
    marginBottom: 0,
  },
  iconContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    // Background color set inline with dynamic colors
  },
  iconText: {
    fontSize: 24,
  },
});

export default TabNavigator;
