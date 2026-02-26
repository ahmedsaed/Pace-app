import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  format, isToday, isYesterday,
} from 'date-fns';

import { Transaction } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { formatCurrency } from '../../utils/formatting';
import { TRANSACTION_COLORS, TransactionCard } from '../../components/transaction/TransactionCard';

import { useTransactionStore } from '../../store/transactionStore';
import { useAccountStore } from '../../store/accountStore';
import { useCategoryStore } from '../../store/categoryStore';
import { initializeDatabase } from '../../db/database';

// ── Types ─────────────────────────────────────────────────────────────────────
type Period = 'today' | 'week' | 'month' | 'all';

interface DateGroup {
  dateKey: string;
  label: string;
  transactions: Transaction[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const getPeriodRange = (period: Period): { startDate: string; endDate: string } | null => {
  const now = new Date();
  if (period === 'today') return { startDate: startOfDay(now).toISOString(), endDate: endOfDay(now).toISOString() };
  if (period === 'week') return { startDate: startOfWeek(now, { weekStartsOn: 1 }).toISOString(), endDate: endOfWeek(now, { weekStartsOn: 1 }).toISOString() };
  if (period === 'month') return { startDate: startOfMonth(now).toISOString(), endDate: endOfMonth(now).toISOString() };
  return null;
};

const groupByDate = (transactions: Transaction[]): DateGroup[] => {
  const map = new Map<string, Transaction[]>();
  transactions.forEach(t => {
    const key = format(new Date(t.date), 'yyyy-MM-dd');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, txns]) => {
      const date = new Date(key);
      const label = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'EEE, MMM d');
      return { dateKey: key, label, transactions: txns };
    });
};

// ── Summary Cards ─────────────────────────────────────────────────────────────
interface SummaryCardsProps { income: number; expense: number; net: number; currency: string; }

const SummaryCards: React.FC<SummaryCardsProps> = ({ income, expense, net, currency }) => (
  <View style={summaryStyles.row}>
    <View style={summaryStyles.card}>
      <View style={[summaryStyles.dot, { backgroundColor: TRANSACTION_COLORS.income }]} />
      <Text style={summaryStyles.label}>Income</Text>
      <Text style={[summaryStyles.value, { color: TRANSACTION_COLORS.income }]}>{formatCurrency(income, currency)}</Text>
    </View>
    <View style={[summaryStyles.card, summaryStyles.cardMiddle]}>
      <View style={[summaryStyles.dot, { backgroundColor: TRANSACTION_COLORS.expense }]} />
      <Text style={summaryStyles.label}>Expense</Text>
      <Text style={[summaryStyles.value, { color: TRANSACTION_COLORS.expense }]}>{formatCurrency(expense, currency)}</Text>
    </View>
    <View style={summaryStyles.card}>
      <View style={[summaryStyles.dot, { backgroundColor: net >= 0 ? TRANSACTION_COLORS.income : TRANSACTION_COLORS.expense }]} />
      <Text style={summaryStyles.label}>Net</Text>
      <Text style={[summaryStyles.value, { color: net >= 0 ? TRANSACTION_COLORS.income : TRANSACTION_COLORS.expense }]}>
        {net >= 0 ? '+' : ''}{formatCurrency(net, currency)}
      </Text>
    </View>
  </View>
);

const summaryStyles = StyleSheet.create({
  row: { flexDirection: 'row', marginHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  card: { flex: 1, backgroundColor: darkColors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: darkColors.border },
  cardMiddle: {},
  dot: { width: 6, height: 6, borderRadius: 3, marginBottom: spacing.xs },
  label: { fontSize: fontSize.xs, color: darkColors.textSecondary, marginBottom: 4 },
  value: { fontSize: fontSize.sm, fontWeight: fontWeight.bold as any },
});

// ── Screen ────────────────────────────────────────────────────────────────────
const RecordsScreen = ({ navigation }: any) => {
  const [period, setPeriod] = useState<Period>('month');
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, isLoading, fetchTransactionsByDateRange, fetchTransactions, deleteTransaction } = useTransactionStore();
  const { accounts, fetchAccounts } = useAccountStore();
  const { categories, fetchCategories, seedDefaults } = useCategoryStore();

  useEffect(() => { bootstrap(); }, []);
  useEffect(() => { loadTransactions(); }, [period]);

  const bootstrap = async () => {
    try {
      await initializeDatabase();
      await fetchAccounts();
      await seedDefaults();
      await fetchCategories();
      await loadTransactions();
    } catch (err) { console.error('RecordsScreen bootstrap error:', err); }
  };

  const loadTransactions = useCallback(async () => {
    try {
      const range = getPeriodRange(period);
      if (range) await fetchTransactionsByDateRange(range.startDate, range.endDate);
      else await fetchTransactions();
    } catch (err) { console.error('Error loading transactions:', err); }
  }, [period]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await bootstrap();
    setRefreshing(false);
  }, [period]);

  const defaultCurrency = accounts[0]?.currency ?? 'USD';

  const { totalIncome, totalExpense } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => { if (t.type === 'income') inc += t.amount; else if (t.type === 'expense') exp += t.amount; });
    return { totalIncome: inc, totalExpense: exp };
  }, [transactions]);

  const grouped = useMemo(() => groupByDate(transactions), [transactions]);

  type ListItem =
    | { kind: 'header'; dateKey: string; label: string; dayTotal: number }
    | { kind: 'transaction'; transaction: Transaction };

  const flatData: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];
    grouped.forEach(group => {
      const dayTotal = group.transactions.reduce((sum, t) => {
        if (t.type === 'income') return sum + t.amount;
        if (t.type === 'expense') return sum - t.amount;
        return sum;
      }, 0);
      items.push({ kind: 'header', dateKey: group.dateKey, label: group.label, dayTotal });
      group.transactions.forEach(t => items.push({ kind: 'transaction', transaction: t }));
    });
    return items;
  }, [grouped]);

  const handleDelete = async (transaction: Transaction) => {
    try {
      await deleteTransaction(transaction.id);
    } catch { Alert.alert('Error', 'Failed to delete transaction.'); }
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === 'header') {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderLabel}>{item.label}</Text>
          <Text style={[styles.dateHeaderTotal, { color: item.dayTotal >= 0 ? TRANSACTION_COLORS.income : TRANSACTION_COLORS.expense }]}>
            {item.dayTotal >= 0 ? '+' : ''}{formatCurrency(item.dayTotal, defaultCurrency)}
          </Text>
        </View>
      );
    }
    const { transaction } = item;
    const account = accounts.find(a => a.id === transaction.accountId);
    const category = categories.find(c => c.id === transaction.categoryId);
    const toAccount = accounts.find(a => a.id === transaction.toAccountId);
    return (
      <TransactionCard
        transaction={transaction}
        account={account}
        category={category}
        toAccount={toAccount}
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

  const PERIOD_LABELS: { key: Period; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'all', label: 'All' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={darkColors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Records</Text>
        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={22} color={darkColors.text} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <SummaryCards income={totalIncome} expense={totalExpense} net={totalIncome - totalExpense} currency={defaultCurrency} />

      {/* Period filter */}
      <View style={styles.periodBar}>
        {PERIOD_LABELS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.periodPill, period === key && styles.periodPillActive]}
            onPress={() => setPeriod(key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodPillText, period === key && styles.periodPillTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {isLoading && transactions.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={darkColors.primary} />
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item) => item.kind === 'header' ? `h-${item.dateKey}` : `t-${item.transaction.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkColors.primary} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={56} color={darkColors.textTertiary} />
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the <Text style={{ color: darkColors.primary }}>+</Text> button to record your first transaction.
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransaction')} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color={darkColors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: darkColors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  headerTitle: { fontSize: fontSize.xxxl, fontWeight: fontWeight.bold as any, color: darkColors.text },
  headerIconBtn: { width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: darkColors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: darkColors.border },
  periodBar: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  periodPill: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: borderRadius.full, backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border },
  periodPillActive: { backgroundColor: darkColors.primary, borderColor: darkColors.primary },
  periodPillText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium as any, color: darkColors.textSecondary },
  periodPillTextActive: { color: darkColors.background, fontWeight: fontWeight.semibold as any },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  dateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.xs },
  dateHeaderLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold as any, color: darkColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateHeaderTotal: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold as any },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 80, gap: spacing.sm, paddingHorizontal: spacing.xl },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold as any, color: darkColors.text, marginTop: spacing.md },
  emptySubtitle: { fontSize: fontSize.base, color: darkColors.textSecondary, textAlign: 'center', lineHeight: 22 },
  fab: { position: 'absolute', bottom: spacing.xl, right: spacing.lg, width: 58, height: 58, borderRadius: 29, backgroundColor: darkColors.primary, justifyContent: 'center', alignItems: 'center' },
});

export default RecordsScreen;
