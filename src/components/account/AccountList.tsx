/**
 * AccountList Component
 * List of account cards with empty state
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Account } from '../../utils/types';
import { AccountCard } from './AccountCard';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize } from '../../styles/theme';

interface AccountListProps {
  accounts: Account[];
  onAccountPress?: (account: Account) => void;
  onAccountLongPress?: (account: Account) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement;
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  onAccountPress,
  onAccountLongPress,
  ListHeaderComponent,
  ListFooterComponent,
}) => {
  if (accounts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>💳</Text>
        <Text style={styles.emptyTitle}>No Accounts Yet</Text>
        <Text style={styles.emptyText}>
          Create your first account to start tracking your finances
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item) => item.id!.toString()}
      renderItem={({ item }) => (
        <AccountCard
          account={item}
          onPress={() => onAccountPress?.(item)}
          onLongPress={() => onAccountLongPress?.(item)}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    color: darkColors.text,
    marginBottom: spacing.sm,
    fontWeight: '600' as any,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
