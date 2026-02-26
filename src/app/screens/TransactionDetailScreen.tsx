/**
 * TransactionDetailScreen
 * Full detail view for a single transaction
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { Transaction } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';
import { formatCurrency } from '../../utils/formatting';
import { TRANSACTION_COLORS } from '../../components/transaction/TransactionCard';
import { useTransactionStore } from '../../store/transactionStore';
import { useAccountStore } from '../../store/accountStore';
import { useCategoryStore } from '../../store/categoryStore';

export const TransactionDetailScreen = ({ navigation, route }: any) => {
  const { transaction }: { transaction: Transaction } = route.params;
  const { deleteTransaction } = useTransactionStore();
  const { accounts } = useAccountStore();
  const { categories } = useCategoryStore();

  const typeColor = TRANSACTION_COLORS[transaction.type];
  const account = accounts.find(a => a.id === transaction.accountId);
  const toAccount = accounts.find(a => a.id === transaction.toAccountId);
  const category = categories.find(c => c.id === transaction.categoryId);

  const amountPrefix = transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : '';

  const typeLabel =
    transaction.type === 'income' ? 'Income' :
    transaction.type === 'expense' ? 'Expense' : 'Transfer';

  const typeIcon =
    transaction.type === 'income' ? 'arrow-down-circle' :
    transaction.type === 'expense' ? 'arrow-up-circle' : 'swap-horizontal';

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure? This will reverse the effect on account balances.',
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
          <Ionicons name="arrow-back" size={24} color={darkColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTransaction', { transaction })}
          style={styles.headerBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="create-outline" size={22} color={darkColors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Hero amount ── */}
        <View style={[styles.heroCard, { borderColor: `${typeColor}44` }]}>
          <View style={[styles.heroBubble, { backgroundColor: `${typeColor}18` }]}>
            <Ionicons name={category?.icon ? (category.icon as any) : typeIcon as any} size={32} color={typeColor} />
          </View>

          <Text style={[styles.heroAmount, { color: typeColor }]}>
            {amountPrefix}{formatCurrency(transaction.amount, account?.currency ?? 'USD')}
          </Text>

          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}18` }]}>
            <Ionicons name={typeIcon as any} size={14} color={typeColor} />
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>{typeLabel}</Text>
          </View>

          <Text style={styles.heroDate}>
            {format(new Date(transaction.date), 'EEEE, MMMM d, yyyy  ·  h:mm a')}
          </Text>
        </View>

        {/* ── Detail rows ── */}
        <View style={styles.detailCard}>
          {category && (
            <DetailRow icon="pricetag-outline" label="Category" value={category.name} />
          )}
          {account && (
            <>
              {category && <View style={styles.rowDivider} />}
              <DetailRow
                icon={(account.icon as any) || 'wallet-outline'}
                iconColor={account.color}
                label={transaction.type === 'transfer' ? 'From Account' : 'Account'}
                value={account.name}
              />
            </>
          )}
          {toAccount && (
            <>
              <View style={styles.rowDivider} />
              <DetailRow
                icon={(toAccount.icon as any) || 'wallet-outline'}
                iconColor={toAccount.color}
                label="To Account"
                value={toAccount.name}
              />
            </>
          )}
          {transaction.note && (
            <>
              <View style={styles.rowDivider} />
              <DetailRow icon="document-text-outline" label="Note" value={transaction.note} />
            </>
          )}
          <View style={styles.rowDivider} />
          <DetailRow
            icon="time-outline"
            label="Created"
            value={format(new Date(transaction.createdAt), 'MMM d, yyyy  ·  h:mm a')}
          />
        </View>

        {/* ── Delete button ── */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={styles.deleteBtnText}>Delete Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Detail row helper ─────────────────────────────────────────────────────────
interface DetailRowProps {
  icon: string;
  iconColor?: string | null;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, iconColor, label, value }) => (
  <View style={rowStyles.row}>
    <View style={[rowStyles.iconBubble, { backgroundColor: (iconColor ?? darkColors.primary) + '22' }]}>
      <Ionicons name={icon as any} size={18} color={iconColor ?? darkColors.primary} />
    </View>
    <View style={rowStyles.info}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  </View>
);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: fontWeight.medium as any,
  },
  value: {
    fontSize: fontSize.base,
    color: darkColors.text,
    fontWeight: fontWeight.medium as any,
  },
});

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: darkColors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold as any, color: darkColors.text },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  heroCard: {
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroAmount: {
    fontSize: 44,
    fontWeight: fontWeight.bold as any,
    letterSpacing: -1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  typeBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
  },
  heroDate: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
    marginTop: spacing.xs,
  },
  detailCard: {
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: darkColors.border,
    overflow: 'hidden',
  },
  rowDivider: {
    height: 1,
    backgroundColor: darkColors.border,
    marginLeft: 38 + spacing.md + spacing.md,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#EF444440',
    backgroundColor: '#EF444412',
    marginTop: spacing.md,
  },
  deleteBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: '#EF4444',
  },
});

export default TransactionDetailScreen;
