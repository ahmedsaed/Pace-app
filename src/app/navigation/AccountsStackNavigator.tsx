import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountsScreen from '../screens/AccountsScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import EditAccountScreen from '../screens/EditAccountScreen';
import { Account } from '../../utils/types';
import { darkColors } from '../../utils/colors';

export type AccountsStackParamList = {
  AccountsList: undefined;
  AddAccount: undefined;
  EditAccount: { account: Account };
};

const Stack = createNativeStackNavigator<AccountsStackParamList>();

const AccountsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: darkColors.background,
        },
        headerTintColor: darkColors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: darkColors.background,
        },
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
