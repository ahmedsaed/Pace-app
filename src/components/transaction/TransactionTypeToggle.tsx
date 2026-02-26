/**
 * TransactionTypeToggle
 * Pill-style toggle between Income / Expense / Transfer
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransactionType } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { TRANSACTION_COLORS } from './TransactionCard';

interface Option {
  type: TransactionType;
  label: string;
  icon: string;
}

const OPTIONS: Option[] = [
  { type: 'expense', label: 'Expense', icon: 'arrow-up-circle' },
  { type: 'income',  label: 'Income',  icon: 'arrow-down-circle' },
  { type: 'transfer', label: 'Transfer', icon: 'swap-horizontal' },
];

interface TransactionTypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

export const TransactionTypeToggle: React.FC<TransactionTypeToggleProps> = ({ value, onChange }) => {
  return (
    <View style={styles.wrapper}>
      {OPTIONS.map(opt => {
        const active = value === opt.type;
        const color = TRANSACTION_COLORS[opt.type];
        return (
          <TouchableOpacity
            key={opt.type}
            style={[
              styles.pill,
              active && { backgroundColor: `${color}22`, borderColor: color },
            ]}
            onPress={() => onChange(opt.type)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={opt.icon as any}
              size={16}
              color={active ? color : darkColors.textSecondary}
            />
            <Text style={[styles.label, { color: active ? color : darkColors.textSecondary }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: darkColors.border,
    backgroundColor: darkColors.surface,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
  },
});
