import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import AccountsScreen from '../screens/AccountsScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import EditAccountScreen from '../screens/EditAccountScreen';
import { Account } from '../../utils/types';
import { useColors } from '../../hooks/useColors';
import { fontSize } from '../../styles/theme';

export type AccountsStackParamList = {
  AccountsList: undefined;
  AddAccount: undefined;
  EditAccount: { account: Account };
};

const Stack = createNativeStackNavigator<AccountsStackParamList>();

const AccountsStackNavigator = () => {
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
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen
        name="AccountsList"
        component={AccountsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddAccount"
        component={AddAccountScreen}
        options={{ title: 'Add Account' }}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{ title: 'Edit Account' }}
      />
    </Stack.Navigator>
  );
};

export default AccountsStackNavigator;
