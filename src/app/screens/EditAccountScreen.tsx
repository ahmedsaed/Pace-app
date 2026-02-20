import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { darkColors } from '../../utils/colors';
import { useAccountStore } from '../../store/accountStore';
import { Account } from '../../utils/types';
import { AccountForm } from '../../components/account/AccountForm';

interface EditAccountScreenProps {
  navigation: any;
  route: {
    params: {
      account: Account;
    };
  };
}

const EditAccountScreen: React.FC<EditAccountScreenProps> = ({ navigation, route }) => {
  const { updateAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const account = route.params?.account;

  useEffect(() => {
    if (!account) {
      navigation.goBack();
    }
  }, [account, navigation]);

  const handleUpdateAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!account?.id) return;
    
    setIsSubmitting(true);
    try {
      await updateAccount(account.id, accountData);
      Alert.alert('Success', 'Account updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating account:', error);
      Alert.alert('Error', 'Failed to update account');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AccountForm
        account={account}
        onSubmit={handleUpdateAccount}
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

export default EditAccountScreen;
