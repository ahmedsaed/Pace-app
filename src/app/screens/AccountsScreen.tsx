import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { formatCurrency } from '../../utils/formatting';
import { useAccountStore } from '../../store/accountStore';
import { Account } from '../../utils/types';
import { AccountList } from '../../components/account/AccountList';
import { initializeDatabase } from '../../db/database';

interface AccountsScreenProps {
  navigation: any;
}

const AccountsScreen: React.FC<AccountsScreenProps> = ({ navigation }) => {
  const { accounts, isLoading, fetchAccounts, deleteAccount, getTotalBalance } = useAccountStore();

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      await initializeDatabase();
      await fetchAccounts();
    } catch (error) {
      console.error('Error initializing:', error);
      Alert.alert('Error', 'Failed to initialize database');
    }
  };

  const handleDeleteAccount = (account: Account) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(account.id!);
              Alert.alert('Success', 'Account deleted successfully');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const totalBalance = getTotalBalance();
  
  // Calculate total income and expenses from balance changes
  const { totalIncome, totalExpense } = accounts
    .filter(acc => acc.includeInTotal)
    .reduce((acc, account) => {
      const change = account.currentBalance - account.initialBalance;
      if (change > 0) {
        acc.totalIncome += change;
      } else if (change < 0) {
        acc.totalExpense += Math.abs(change);
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={darkColors.background} />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Accounts</Text>
            <Text style={styles.subtitle}>Manage your financial accounts</Text>
          </View>
        </View>

        {/* Total Balance Card */}
        <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Balance</Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalBalance, 'USD')}</Text>
        <Text style={styles.totalAccounts}>{accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}</Text>
        
        {/* Income and Expense Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, styles.incomeText]}>
              {formatCurrency(totalIncome, 'USD')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryValue, styles.expenseText]}>
              {formatCurrency(totalExpense, 'USD')}
            </Text>
          </View>
        </View>
      </View>

      {isLoading && accounts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={darkColors.primary} />
        </View>
      ) : (
        <AccountList
          accounts={accounts}
          onAccountPress={(account) => navigation.navigate('EditAccount', { account })}
          onAccountLongPress={handleDeleteAccount}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAccount')}
      >
        <Text style={styles.addButtonText}>+ Add Account</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: darkColors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: darkColors.textSecondary,
  },
  totalCard: {
    backgroundColor: darkColors.surface,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold as any,
    color: darkColors.text,
    marginBottom: spacing.xs,
  },
  totalAccounts: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkColors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: darkColors.border,
    marginHorizontal: spacing.md,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: darkColors.primary,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: darkColors.background,
  },
});

export default AccountsScreen;
