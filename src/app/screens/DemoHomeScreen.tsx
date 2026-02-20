import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../../styles/theme';
import { formatCurrency, formatDate } from '../../utils/formatting';

const DemoHomeScreen = () => {
  const currentDate = new Date();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkColors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Ahmed! 👋</Text>
          <Text style={styles.date}>{formatDate(currentDate, 'EEEE, MMMM dd')}</Text>
        </View>

        {/* Balance Card */}
        <View style={[styles.card, styles.balanceCard]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(12547.89, 'USD')}</Text>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Income</Text>
              <Text style={[styles.balanceStatValue, { color: darkColors.income }]}>
                {formatCurrency(8500, 'USD')}
              </Text>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Expenses</Text>
              <Text style={[styles.balanceStatValue, { color: darkColors.expense }]}>
                {formatCurrency(3247.50, 'USD')}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: darkColors.income }]}>
              <Text style={styles.actionEmoji}>💰</Text>
              <Text style={styles.actionLabel}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: darkColors.expense }]}>
              <Text style={styles.actionEmoji}>💸</Text>
              <Text style={styles.actionLabel}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: darkColors.transfer }]}>
              <Text style={styles.actionEmoji}>🔄</Text>
              <Text style={styles.actionLabel}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction Items */}
          <View style={styles.transactionList}>
            {/* Income Transaction */}
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: darkColors.incomeLight }]}>
                <Text style={styles.transactionEmoji}>💼</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Salary</Text>
                <Text style={styles.transactionDate}>Today, 9:00 AM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: darkColors.income }]}>
                +{formatCurrency(5000, 'USD')}
              </Text>
            </View>

            {/* Expense Transaction */}
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: darkColors.expenseLight }]}>
                <Text style={styles.transactionEmoji}>🍔</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Restaurant</Text>
                <Text style={styles.transactionDate}>Yesterday, 7:30 PM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: darkColors.expense }]}>
                -{formatCurrency(45.50, 'USD')}
              </Text>
            </View>

            {/* Transfer Transaction */}
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: darkColors.transferLight }]}>
                <Text style={styles.transactionEmoji}>🔄</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>To Savings</Text>
                <Text style={styles.transactionDate}>Feb 17, 2:15 PM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: darkColors.transfer }]}>
                {formatCurrency(500, 'USD')}
              </Text>
            </View>

            {/* More Expenses */}
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: darkColors.expenseLight }]}>
                <Text style={styles.transactionEmoji}>🛒</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Groceries</Text>
                <Text style={styles.transactionDate}>Feb 16, 3:45 PM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: darkColors.expense }]}>
                -{formatCurrency(127.89, 'USD')}
              </Text>
            </View>
          </View>
        </View>

        {/* Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <View style={styles.accountsList}>
            <View style={[styles.accountCard, { borderLeftColor: darkColors.chart1 }]}>
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>Chase Checking</Text>
                <Text style={styles.accountType}>Bank Account</Text>
              </View>
              <Text style={styles.accountBalance}>{formatCurrency(8547.89, 'USD')}</Text>
            </View>

            <View style={[styles.accountCard, { borderLeftColor: darkColors.chart2 }]}>
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>Savings</Text>
                <Text style={styles.accountType}>Savings</Text>
              </View>
              <Text style={styles.accountBalance}>{formatCurrency(4000, 'USD')}</Text>
            </View>
          </View>
        </View>

        {/* Categories Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Spending</Text>
          <View style={styles.categoriesList}>
            <View style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: darkColors.chart3 }]} />
                <Text style={styles.categoryName}>Food & Dining</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{formatCurrency(456.78, 'USD')}</Text>
                <Text style={styles.categoryPercent}>32%</Text>
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: darkColors.chart4 }]} />
                <Text style={styles.categoryName}>Transportation</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{formatCurrency(234.50, 'USD')}</Text>
                <Text style={styles.categoryPercent}>18%</Text>
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: darkColors.chart5 }]} />
                <Text style={styles.categoryName}>Shopping</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{formatCurrency(189.99, 'USD')}</Text>
                <Text style={styles.categoryPercent}>14%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: darkColors.text,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: fontSize.md,
    color: darkColors.textSecondary,
  },
  card: {
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: darkColors.border,
    ...shadows.sm,
  },
  balanceCard: {
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    fontSize: fontSize.sm,
    color: darkColors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
    color: darkColors.text,
    marginBottom: spacing.lg,
  },
  balanceStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceStatItem: {
    flex: 1,
  },
  balanceStatLabel: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceStatValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  balanceStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: darkColors.border,
    marginHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: darkColors.text,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: darkColors.primary,
    fontWeight: fontWeight.medium,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: darkColors.textOnBright,
  },
  transactionList: {
    gap: spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: darkColors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
  },
  transactionAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  accountsList: {
    gap: spacing.sm,
  },
  accountCard: {
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  accountHeader: {
    marginBottom: spacing.sm,
  },
  accountName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: darkColors.text,
    marginBottom: 2,
  },
  accountType: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
  },
  accountBalance: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: darkColors.text,
  },
  categoriesList: {
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.md,
    color: darkColors.text,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: darkColors.text,
    marginBottom: 2,
  },
  categoryPercent: {
    fontSize: fontSize.xs,
    color: darkColors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: 32,
    color: darkColors.textOnBright,
    fontWeight: fontWeight.light,
  },
});

export default DemoHomeScreen;
