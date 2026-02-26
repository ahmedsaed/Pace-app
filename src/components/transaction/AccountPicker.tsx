/**
 * AccountPicker
 * Bottom-sheet modal for selecting an account
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Account } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { formatCurrency } from '../../utils/formatting';

interface AccountPickerProps {
  visible: boolean;
  accounts: Account[];
  selectedId?: number | null;
  onSelect: (account: Account) => void;
  onClose: () => void;
  title?: string;
  /** Exclude a specific account from the list (used for "to" account in transfer) */
  excludeId?: number | null;
}

export const AccountPicker: React.FC<AccountPickerProps> = ({
  visible,
  accounts,
  selectedId,
  onSelect,
  onClose,
  title = 'Select Account',
  excludeId,
}) => {
  const filtered = useMemo(
    () => accounts.filter(a => a.id !== excludeId),
    [accounts, excludeId],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        <Text style={styles.title}>{title}</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          bounces={false}
        >
          {filtered.length === 0 ? (
            <Text style={styles.empty}>No accounts found. Create an account first.</Text>
          ) : (
            filtered.map(account => {
              const isSelected = account.id === selectedId;
              return (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => { onSelect(account); onClose(); }}
                  activeOpacity={0.7}
                >
                  {/* Color stripe / icon */}
                  <View style={[styles.iconBubble, { backgroundColor: (account.color ?? darkColors.primary) + '22' }]}>
                    <Ionicons
                      name={(account.icon as any) || 'wallet'}
                      size={22}
                      color={account.color ?? darkColors.primary}
                    />
                  </View>

                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountType}>
                      {account.type.replace('_', ' ')}
                    </Text>
                  </View>

                  <View style={styles.balanceContainer}>
                    <Text style={styles.balance}>
                      {formatCurrency(account.currentBalance, account.currency)}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={darkColors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: darkColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: darkColors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: darkColors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  empty: {
    color: darkColors.textSecondary,
    fontSize: fontSize.base,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
    backgroundColor: darkColors.background,
  },
  rowSelected: {
    borderWidth: 1,
    borderColor: darkColors.primary,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: darkColors.text,
  },
  accountType: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  balance: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: darkColors.textSecondary,
  },
});
