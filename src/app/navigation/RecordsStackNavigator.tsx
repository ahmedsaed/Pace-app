/**
 * RecordsStackNavigator
 * Stack navigator for the Records (home) tab
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColors } from '../../hooks/useColors';
import { fontSize } from '../../styles/theme';

import RecordsScreen from '../screens/RecordsScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { EditTransactionScreen } from '../screens/EditTransactionScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';
import { Transaction } from '../../utils/types';

export type RecordsStackParamList = {
  RecordsList: undefined;
  AddTransaction: undefined;
  EditTransaction: { transaction: Transaction };
  TransactionDetail: { transaction: Transaction };
};

const Stack = createNativeStackNavigator<RecordsStackParamList>();

const RecordsStackNavigator = () => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontSize: fontSize.lg },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="RecordsList"
        component={RecordsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
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
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ headerShown: false, animation: 'fade' }}
      />
    </Stack.Navigator>
  );
};

export default RecordsStackNavigator;
