/**
 * CategoryDetailScreen
 * Shows all transactions for a specific category, grouped by month.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, isSameMonth } from 'date-fns';

import { Transaction, Category, Account } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { formatCurrency } from '../../utils/formatting';
import { TRANSACTION_COLORS } from '../../components/transaction/TransactionCard';

import { useTransactionStore } from '../../store/transactionStore';
import { useAccountStore } from '../../store/accountStore';
import { useCategoryStore } from '../../store/categoryStore';

// ── Types ─────────────────────────────────────────────────────────────────────
interface MonthGroup {
  monthKey: string;
  label: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const groupByMonth = (transactions: Transaction[]): MonthGroup[] => {
  const map = new Map<string, Transaction[]>();
  transactions.forEach(t => {
    const key = format(new Date(t.date), 'yyyy-MM');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, txns]) => {
      const date = new Date(key + '-01');
      const label = isSameMonth(date, new Date())
        ? `This Month · ${format(date, 'MMM yyyy')}`
        : format(date, 'MMMM yyyy');
      let totalIncome = 0;
      let totalExpense = 0;
      txns.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        else if (t.type === 'expense') totalExpense += t.amount;
      });
      return { monthKey: key, label, transactions: txns, totalIncome, totalExpense };
    });
};

// ── Compact Transaction Row ────────────────────────────────────────────────────
interface CompactTransactionRowProps {
  transaction: Transaction;
  account?: Account;
  onPress?: () => void;
  onLongPress?: () => void;
}

const CompactTransactionRow: React.FC<CompactTransactionRowProps> = ({
  transaction,
  account,
  onPress,
  onLongPress,
}) => {
  const typeColor = TRANSACTION_COLORS[transaction.type];
  const amountPrefix = transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : '';
  const dateStr = (() => {
    try {
      return format(new Date(transaction.date), 'd MMM');
    } catch {
      return '';
    }
  })();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Text style={styles.rowDate}>{dateStr}</Text>
      <Text style={styles.rowNote} numberOfLines={1}>
        {transaction.note || (account?.name ?? '—')}
      </Text>
      <Text style={[styles.rowAmount, { color: typeColor }]}>
        {amountPrefix}{formatCurrency(transaction.amount, account?.currency ?? 'USD')}
      </Text>
    </TouchableOpacity>
  );
};

// ── Month Section Header ───────────────────────────────────────────────────────
interface MonthSectionHeaderProps {
  label: string;
  totalIncome: number;
  totalExpense: number;
  currency: string;
}

const MonthSectionHeader: React.FC<MonthSectionHeaderProps> = ({
  label,
  totalIncome,
  totalExpense,
  currency,
}) => (
  <View style={styles.monthHeader}>
    <Text style={styles.monthLabel}>{label}</Text>
    <View style={styles.monthTotals}>
      {totalIncome > 0 && (
        <Text style={[styles.monthTotal, { color: TRANSACTION_COLORS.income }]}>
          +{formatCurrency(totalIncome, currency)}
        </Text>
      )}
      {totalExpense > 0 && (
        <Text style={[styles.monthTotal, { color: TRANSACTION_COLORS.expense }]}>
          -{formatCurrency(totalExpense, currency)}
        </Text>
      )}
    </View>
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────
const CategoryDetailScreen = ({ route, navigation }: any) => {
  const { categoryId } = route.params as { categoryId: number };
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchTransactionsByCategory, deleteTransaction } = useTransactionStore();
  const { accounts } = useAccountStore();
  const { categories } = useCategoryStore();

  const category = useMemo(
    () => categories.find(c => c.id === categoryId),
    [categories, categoryId],
  );

  const defaultCurrency = accounts[0]?.currency ?? 'USD';

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTransactionsByCategory(categoryId);
      setTransactions(data);
    } catch (err) {
      console.error('CategoryDetailScreen load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { load(); }, [load]);

  const grouped = useMemo(() => groupByMonth(transactions), [transactions]);

  // Total across all time
  const { totalIncome, totalExpense } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else if (t.type === 'expense') exp += t.amount;
    });
    return { totalIncome: inc, totalExpense: exp };
  }, [transactions]);

  type ListItem =
    | { kind: 'month'; group: MonthGroup }
    | { kind: 'transaction'; transaction: Transaction };

  const flatData: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];
    grouped.forEach(group => {
      items.push({ kind: 'month', group });
      group.transactions.forEach(t => items.push({ kind: 'transaction', transaction: t }));
    });
    return items;
  }, [grouped]);

  const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              setTransactions(prev => prev.filter(t => t.id !== transaction.id));
            } catch {
              Alert.alert('Error', 'Failed to delete transaction.');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === 'month') {
      return (
        <MonthSectionHeader
          label={item.group.label}
          totalIncome={item.group.totalIncome}
          totalExpense={item.group.totalExpense}
          currency={defaultCurrency}
        />
      );
    }
    const { transaction } = item;
    const account = accounts.find(a => a.id === transaction.accountId);
    return (
      <CompactTransactionRow
        transaction={transaction}
        account={account}
        onPress={() => navigation.navigate('TransactionDetail', { transaction })}
        onLongPress={() =>
          Alert.alert('Transaction', 'What would you like to do?', [
            { text: 'Edit', onPress: () => navigation.navigate('EditTransaction', { transaction }) },
            { text: 'Delete', style: 'destructive', onPress: () => handleDelete(transaction) },
            { text: 'Cancel', style: 'cancel' },
          ])
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={darkColors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={darkColors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {category && (
            <View style={[styles.categoryIcon, { backgroundColor: darkColors.primary + '22' }]}>
              <Ionicons name={(category.icon as any) || 'pricetag'} size={20} color={darkColors.primary} />
            </View>
          )}
          <Text style={styles.headerTitle} numberOfLines={1}>
            {category?.name ?? 'Category'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditCategory', { categoryId })}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={darkColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Summary row */}
      {!isLoading && transactions.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryValue}>{transactions.length}</Text>
          </View>
          {totalIncome > 0 && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: TRANSACTION_COLORS.income }]}>
                +{formatCurrency(totalIncome, defaultCurrency)}
              </Text>
            </View>
          )}
          {totalExpense > 0 && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={[styles.summaryValue, { color: TRANSACTION_COLORS.expense }]}>
                -{formatCurrency(totalExpense, defaultCurrency)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={darkColors.primary} />
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={item =>
            item.kind === 'month' ? `m-${item.group.monthKey}` : `t-${item.transaction.id}`
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={darkColors.textTertiary} />
              <Text style={styles.emptyTitle}>No transactions</Text>
              <Text style={styles.emptySubtitle}>
                No transactions recorded for this category yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: darkColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: darkColors.text,
    flex: 1,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold as any,
    color: darkColors.text,
  },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
  },
  monthLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: darkColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  monthTotals: { flexDirection: 'row', gap: spacing.sm },
  monthTotal: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold as any },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: darkColors.border,
    gap: spacing.sm,
  },
  rowDate: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    width: 44,
  },
  rowNote: {
    flex: 1,
    fontSize: fontSize.sm,
    color: darkColors.text,
  },
  rowAmount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: darkColors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.base,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CategoryDetailScreen;
