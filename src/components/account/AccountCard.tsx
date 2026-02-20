/**
 * AccountCard Component
 * Display account information in a card
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Account } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { formatCurrency } from '../../utils/formatting';
import { getIconEmoji } from '../common/IconPicker';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onPress,
  onLongPress,
}) => {
  const isNegative = account.currentBalance < 0;
  
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: account.color || darkColors.primary }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      disabled={!onPress && !onLongPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getIconEmoji(account.icon)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{account.name}</Text>
          <Text style={styles.type}>{account.type.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={[styles.balance, isNegative && styles.balanceNegative]}>
          {formatCurrency(account.currentBalance, account.currency)}
        </Text>
        {!account.includeInTotal && (
          <Text style={styles.excludedText}>Not in total</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: darkColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: darkColors.text,
    marginBottom: spacing.xs,
  },
  type: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    textTransform: 'capitalize',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: darkColors.text,
  },
  balanceNegative: {
    color: darkColors.expense,
  },
  excludedText: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    marginTop: spacing.xs,
  },
});
