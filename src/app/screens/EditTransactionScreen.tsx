/**
 * EditTransactionScreen
 * Pre-filled form for editing an existing transaction
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { Transaction, TransactionType } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

import { TransactionTypeToggle } from '../../components/transaction/TransactionTypeToggle';
import { AccountPicker } from '../../components/transaction/AccountPicker';
import { CategoryPicker } from '../../components/transaction/CategoryPicker';
import { TRANSACTION_COLORS } from '../../components/transaction/TransactionCard';

import { useTransactionStore } from '../../store/transactionStore';
import { useAccountStore } from '../../store/accountStore';
import { useCategoryStore } from '../../store/categoryStore';

// ── Compact number pad ───────────────────────────────────────────────────────
const PAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

const NumberPad: React.FC<{ onKey: (k: string) => void }> = ({ onKey }) => (
  <View style={padStyles.grid}>
    {PAD_KEYS.map(k => (
      <TouchableOpacity key={k} style={padStyles.key} onPress={() => onKey(k)} activeOpacity={0.6}>
        {k === '⌫' ? (
          <Ionicons name="backspace-outline" size={22} color={darkColors.text} />
        ) : (
          <Text style={padStyles.keyText}>{k}</Text>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

const padStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  key: { width: '33.33%', height: 60, justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 24, fontWeight: fontWeight.medium as any, color: darkColors.text },
});

// ── Screen ───────────────────────────────────────────────────────────────────

export const EditTransactionScreen = ({ navigation, route }: any) => {
  const { transaction }: { transaction: Transaction } = route.params;

  const [type, setType] = useState<TransactionType>(transaction.type);
  const [amountStr, setAmountStr] = useState(String(transaction.amount));
  const [note, setNote] = useState(transaction.note ?? '');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(transaction.accountId);
  const [selectedToAccountId, setSelectedToAccountId] = useState<number | null>(transaction.toAccountId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(transaction.categoryId);

  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showToAccountPicker, setShowToAccountPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const { updateTransaction, deleteTransaction, isLoading } = useTransactionStore();
  const { accounts } = useAccountStore();
  const { categories } = useCategoryStore();

  const typeColor = TRANSACTION_COLORS[type];
  const amount = parseFloat(amountStr) || 0;

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const selectedToAccount = accounts.find(a => a.id === selectedToAccountId);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const categoryType = type === 'income' ? 'income' : 'expense';

  const handleKey = useCallback((key: string) => {
    setAmountStr(prev => {
      if (key === '⌫') {
        const next = prev.slice(0, -1);
        return next === '' || next === '-' ? '0' : next;
      }
      if (key === '.' && prev.includes('.')) return prev;
      if (prev.includes('.')) {
        const decimals = prev.split('.')[1] ?? '';
        if (decimals.length >= 2) return prev;
      }
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  }, []);

  const handleSave = async () => {
    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than 0.');
      return;
    }
    if (!selectedAccountId) {
      Alert.alert('No Account', 'Please select an account.');
      return;
    }
    if (type === 'transfer' && !selectedToAccountId) {
      Alert.alert('No Destination', 'Please select a destination account.');
      return;
    }

    try {
      await updateTransaction(transaction.id, {
        type,
        amount,
        accountId: selectedAccountId,
        categoryId: type !== 'transfer' ? selectedCategoryId : null,
        toAccountId: type === 'transfer' ? selectedToAccountId : null,
        note: note.trim() || null,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update transaction. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This will reverse its effect on account balances.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to delete transaction.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={darkColors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-down" size={26} color={darkColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Transaction</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Type toggle */}
        <View style={styles.section}>
          <TransactionTypeToggle value={type} onChange={setType} />
        </View>

        {/* Amount display */}
        <View style={styles.amountDisplay}>
          <Text style={styles.amountCurrency}>{selectedAccount?.currency ?? 'USD'} </Text>
          <Text style={[styles.amountValue, { color: typeColor }]}>
            {amountStr === '0' ? '0.00' : amountStr}
          </Text>
        </View>

        {/* Date */}
        <TouchableOpacity style={styles.datePill} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={16} color={darkColors.textSecondary} />
          <Text style={styles.dateText}>{format(new Date(transaction.date), 'EEE, MMM d, yyyy')}</Text>
        </TouchableOpacity>

        {/* Selectors card */}
        <View style={styles.selectorsCard}>
          {type !== 'transfer' && (
            <TouchableOpacity style={styles.selectorRow} onPress={() => setShowCategoryPicker(true)} activeOpacity={0.7}>
              <View style={[styles.selectorIcon, { backgroundColor: darkColors.primaryTransparent }]}>
                <Ionicons name={selectedCategory ? (selectedCategory.icon as any) : 'pricetag-outline'} size={20} color={darkColors.primary} />
              </View>
              <Text style={[styles.selectorText, !selectedCategory && styles.selectorPlaceholder]}>
                {selectedCategory ? selectedCategory.name : 'Select Category'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={darkColors.textTertiary} />
            </TouchableOpacity>
          )}
          {type !== 'transfer' && <View style={styles.divider} />}

          <TouchableOpacity style={styles.selectorRow} onPress={() => setShowAccountPicker(true)} activeOpacity={0.7}>
            <View style={[styles.selectorIcon, { backgroundColor: (selectedAccount?.color ?? darkColors.primary) + '22' }]}>
              <Ionicons name={(selectedAccount?.icon as any) || 'wallet-outline'} size={20} color={selectedAccount?.color ?? darkColors.primary} />
            </View>
            <View style={styles.selectorTextContainer}>
              {type === 'transfer' && <Text style={styles.selectorLabel}>From</Text>}
              <Text style={[styles.selectorText, !selectedAccount && styles.selectorPlaceholder]}>
                {selectedAccount ? selectedAccount.name : 'Select Account'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={darkColors.textTertiary} />
          </TouchableOpacity>

          {type === 'transfer' && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.selectorRow} onPress={() => setShowToAccountPicker(true)} activeOpacity={0.7}>
                <View style={[styles.selectorIcon, { backgroundColor: (selectedToAccount?.color ?? darkColors.primary) + '22' }]}>
                  <Ionicons name={(selectedToAccount?.icon as any) || 'wallet-outline'} size={20} color={selectedToAccount?.color ?? darkColors.primary} />
                </View>
                <View style={styles.selectorTextContainer}>
                  <Text style={styles.selectorLabel}>To</Text>
                  <Text style={[styles.selectorText, !selectedToAccount && styles.selectorPlaceholder]}>
                    {selectedToAccount ? selectedToAccount.name : 'Select Account'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={darkColors.textTertiary} />
              </TouchableOpacity>
            </>
          )}

          <View style={styles.divider} />
          <View style={styles.selectorRow}>
            <View style={[styles.selectorIcon, { backgroundColor: darkColors.primaryTransparent }]}>
              <Ionicons name="create-outline" size={20} color={darkColors.textSecondary} />
            </View>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note (optional)"
              placeholderTextColor={darkColors.textTertiary}
              returnKeyType="done"
            />
          </View>
        </View>
      </ScrollView>

      {/* Number pad */}
      <View style={styles.padContainer}>
        <NumberPad onKey={handleKey} />
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: typeColor }, isLoading && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>{isLoading ? 'Saving…' : 'Update'}</Text>
        </TouchableOpacity>
      </View>

      <AccountPicker visible={showAccountPicker} accounts={accounts} selectedId={selectedAccountId} onSelect={a => setSelectedAccountId(a.id)} onClose={() => setShowAccountPicker(false)} title={type === 'transfer' ? 'From Account' : 'Account'} />
      <AccountPicker visible={showToAccountPicker} accounts={accounts} selectedId={selectedToAccountId} onSelect={a => setSelectedToAccountId(a.id)} onClose={() => setShowToAccountPicker(false)} title="To Account" excludeId={selectedAccountId} />
      <CategoryPicker visible={showCategoryPicker} categories={categories} selectedId={selectedCategoryId} type={categoryType} onSelect={c => setSelectedCategoryId(c.id)} onClose={() => setShowCategoryPicker(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: darkColors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold as any, color: darkColors.text },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  section: { marginBottom: spacing.lg },
  amountDisplay: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: spacing.md, paddingVertical: spacing.lg },
  amountCurrency: { fontSize: fontSize.xl, fontWeight: fontWeight.regular as any, color: darkColors.textSecondary, paddingBottom: 6 },
  amountValue: { fontSize: 56, fontWeight: fontWeight.bold as any, letterSpacing: -1 },
  datePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: spacing.xs, backgroundColor: darkColors.surface, borderRadius: borderRadius.full, paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: darkColors.border },
  dateText: { fontSize: fontSize.sm, color: darkColors.textSecondary, fontWeight: fontWeight.medium as any },
  selectorsCard: { backgroundColor: darkColors.surface, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: darkColors.border, overflow: 'hidden' },
  selectorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md, minHeight: 56 },
  selectorIcon: { width: 38, height: 38, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  selectorTextContainer: { flex: 1, gap: 2 },
  selectorLabel: { fontSize: fontSize.xs, color: darkColors.textSecondary, fontWeight: fontWeight.medium as any, textTransform: 'uppercase', letterSpacing: 0.5 },
  selectorText: { flex: 1, fontSize: fontSize.base, fontWeight: fontWeight.medium as any, color: darkColors.text },
  selectorPlaceholder: { color: darkColors.textTertiary, fontWeight: fontWeight.regular as any },
  divider: { height: 1, backgroundColor: darkColors.border, marginLeft: 56 + spacing.md },
  noteInput: { flex: 1, fontSize: fontSize.base, color: darkColors.text, padding: 0 },
  padContainer: { borderTopWidth: 1, borderTopColor: darkColors.border, paddingTop: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: darkColors.background },
  saveBtn: { marginTop: spacing.sm, borderRadius: borderRadius.lg, height: 52, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold as any, color: '#FFFFFF' },
});

export default EditTransactionScreen;
