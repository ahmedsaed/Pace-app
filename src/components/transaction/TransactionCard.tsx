/**
 * TransactionCard Component
 * Displays a single transaction row in a list
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction, Account, Category } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { formatCurrency } from '../../utils/formatting';
import { format } from 'date-fns';

// ── Semantic colors (consistent across the whole app) ──────────────────────────
export const TRANSACTION_COLORS = {
  income: '#10B981',
  expense: '#EF4444',
  transfer: '#6366F1',
};

interface TransactionCardProps {
  transaction: Transaction;
  account?: Account;
  category?: Category;
  toAccount?: Account;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  account,
  category,
  toAccount,
  onPress,
  onLongPress,
}) => {
  const typeColor = TRANSACTION_COLORS[transaction.type];
  const isExpense = transaction.type === 'expense';
  const isTransfer = transaction.type === 'transfer';

  const amountPrefix = transaction.type === 'income' ? '+' : isTransfer ? '' : '-';

  const iconName = category?.icon
    ? (category.icon as any)
    : isTransfer
    ? 'swap-horizontal'
    : transaction.type === 'income'
    ? 'arrow-down-circle'
    : 'arrow-up-circle';

  const label = isTransfer
    ? `${account?.name ?? 'Account'} → ${toAccount?.name ?? 'Account'}`
    : category?.name ?? (transaction.type === 'income' ? 'Income' : 'Expense');

  const subtitle = isTransfer
    ? 'Transfer'
    : account?.name ?? '';

  const dateStr = (() => {
    try {
      return format(new Date(transaction.date), 'h:mm a');
    } catch {
      return '';
    }
  })();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Icon bubble */}
      <View style={[styles.iconBubble, { backgroundColor: `${typeColor}18` }]}>
        <Ionicons name={iconName} size={22} color={typeColor} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
          {subtitle && dateStr ? '  ·  ' : ''}
          {dateStr}
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: typeColor }]}>
          {amountPrefix}{formatCurrency(transaction.amount, account?.currency ?? 'USD')}
        </Text>
        {transaction.note ? (
          <Ionicons name="document-text-outline" size={12} color={darkColors.textTertiary} style={styles.noteIcon} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs + 2,
    gap: spacing.md,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: darkColors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
  },
  noteIcon: {
    opacity: 0.6,
  },
});
