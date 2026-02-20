/**
 * AccountForm Component
 * Form for creating or editing an account
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Account, AccountType } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight } from '../../styles/theme';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { CustomSwitch } from '../common/CustomSwitch';
import { IconPicker } from '../common/IconPicker';
import { ACCOUNT_TYPES, DEFAULT_CURRENCY } from '../../utils/constants';
import { TouchableOpacity } from 'react-native';

interface AccountFormProps {
  account?: Account;
  onSubmit: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  account,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(account?.name || '');
  const [type, setType] = useState<AccountType>(account?.type || 'bank_account');
  const [initialBalance, setInitialBalance] = useState(
    account?.initialBalance?.toString() || '0'
  );
  const [currentBalance, setCurrentBalance] = useState(
    account?.currentBalance?.toString() || '0'
  );
  const [currency, setCurrency] = useState(account?.currency || DEFAULT_CURRENCY);
  const [includeInTotal, setIncludeInTotal] = useState(account?.includeInTotal !== false);
  const [color, setColor] = useState(account?.color || '#3B82F6');
  const [icon, setIcon] = useState(account?.icon || 'bank');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // If editing existing account, sync currentBalance with initialBalance for new accounts
  useEffect(() => {
    if (!account) {
      setCurrentBalance(initialBalance);
    }
  }, [initialBalance, account]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Account name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const initialBalanceNum = parseFloat(initialBalance);
    if (isNaN(initialBalanceNum)) {
      newErrors.initialBalance = 'Invalid amount';
    }

    const currentBalanceNum = parseFloat(currentBalance);
    if (isNaN(currentBalanceNum)) {
      newErrors.currentBalance = 'Invalid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      type,
      initialBalance: parseFloat(initialBalance),
      currentBalance: parseFloat(currentBalance),
      currency,
      includeInTotal,
      color,
      icon,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Input
        label="Account Name *"
        value={name}
        onChangeText={setName}
        placeholder="e.g., Chase Checking"
        error={errors.name}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Account Type *</Text>
        <View style={styles.typeGrid}>
          {ACCOUNT_TYPES.map((accountType) => (
            <TouchableOpacity
              key={accountType.value}
              style={[
                styles.typeOption,
                type === accountType.value && styles.typeOptionSelected,
              ]}
              onPress={() => setType(accountType.value)}
            >
              <Text
                style={[
                  styles.typeText,
                  type === accountType.value && styles.typeTextSelected,
                ]}
              >
                {accountType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Initial Balance *"
        value={initialBalance}
        onChangeText={setInitialBalance}
        placeholder="0.00"
        keyboardType="decimal-pad"
        error={errors.initialBalance}
      />

      {account && (
        <Input
          label="Current Balance *"
          value={currentBalance}
          onChangeText={setCurrentBalance}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.currentBalance}
        />
      )}

      <IconPicker
        label="Icon"
        selectedIcon={icon}
        onIconSelect={setIcon}
      />

      <View style={styles.switchContainer}>
        <View style={styles.switchLabel}>
          <Text style={styles.label}>Include in Total Balance</Text>
          <Text style={styles.switchDescription}>
            Include this account when calculating total balance
          </Text>
        </View>
        <CustomSwitch
          value={includeInTotal}
          onValueChange={setIncludeInTotal}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title={account ? 'Update Account' : 'Create Account'}
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: darkColors.text,
    marginBottom: spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: darkColors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeOptionSelected: {
    borderColor: darkColors.primary,
    backgroundColor: darkColors.surfaceHover,
  },
  typeText: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
  },
  typeTextSelected: {
    color: darkColors.primary,
    fontWeight: fontWeight.semibold as any,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchDescription: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
