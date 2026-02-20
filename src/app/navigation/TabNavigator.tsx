import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecordsScreen from '../screens/RecordsScreen';
import AccountsStackNavigator from './AccountsStackNavigator';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, borderRadius } from '../../styles/theme';

export type TabParamList = {
  Records: undefined;
  Accounts: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: darkColors.background }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: darkColors.primary,
        tabBarInactiveTintColor: darkColors.textSecondary,
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
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
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
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
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
    backgroundColor: darkColors.surface,
    borderTopWidth: 1,
    borderTopColor: darkColors.border,
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
    backgroundColor: darkColors.primaryTransparent || 'rgba(59, 130, 246, 0.15)',
  },
  iconText: {
    fontSize: 24,
  },
});

export default TabNavigator;
