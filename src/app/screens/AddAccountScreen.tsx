import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { darkColors } from '../../utils/colors';
import { useAccountStore } from '../../store/accountStore';
import { Account } from '../../utils/types';
import { AccountForm } from '../../components/account/AccountForm';

interface AddAccountScreenProps {
  navigation: any;
}

const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ navigation }) => {
  const { createAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await createAccount(accountData);
      Alert.alert('Success', 'Account created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AccountForm
        onSubmit={handleAddAccount}
        onCancel={() => navigation.goBack()}
        isLoading={isSubmitting}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
});

export default AddAccountScreen;
