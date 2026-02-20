import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/useColors';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../../styles/theme';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { useThemeStore } from '../../store/themeStore';

const DemoHomeScreen = () => {
  const currentDate = new Date();
  const { mode, toggleTheme } = useThemeStore();
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar 
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Hello, Ahmed! 👋</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(currentDate, 'EEEE, MMMM dd')}</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons 
              name={mode === 'dark' ? 'moon' : 'sunny'} 
              size={22} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={[styles.card, styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Total Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>{formatCurrency(12547.89, 'USD')}</Text>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <Text style={[styles.balanceStatLabel, { color: colors.textSecondary }]}>Income</Text>
              <Text style={[styles.balanceStatValue, { color: '#10B981' }]}>
                {formatCurrency(8500, 'USD')}
              </Text>
            </View>
            <View style={[styles.balanceStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.balanceStatItem}>
              <Text style={[styles.balanceStatLabel, { color: colors.textSecondary }]}>Expenses</Text>
              <Text style={[styles.balanceStatValue, { color: '#EF4444' }]}>
                {formatCurrency(3247.50, 'USD')}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction Items */}
          <View style={styles.transactionList}>
            {/* Income Transaction */}
            <View style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.transactionIcon, { backgroundColor: colors.surfaceHighlight }]}>
                <Ionicons name="briefcase" size={20} color="#10B981" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>Salary</Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>Today, 9:00 AM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: '#10B981' }]}>
                +{formatCurrency(5000, 'USD')}
              </Text>
            </View>

            {/* Expense Transaction */}
            <View style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.transactionIcon, { backgroundColor: colors.surfaceHighlight }]}>
                <Ionicons name="restaurant" size={20} color="#EF4444" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>Restaurant</Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>Yesterday, 7:30 PM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: '#EF4444' }]}>
                -{formatCurrency(45.50, 'USD')}
              </Text>
            </View>

            {/* Transfer Transaction */}
            <View style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.transactionIcon, { backgroundColor: colors.surfaceHighlight }]}>
                <Ionicons name="swap-horizontal" size={20} color={colors.text} />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>To Savings</Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>Feb 17, 2:15 PM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: colors.text }]}>
                {formatCurrency(500, 'USD')}
              </Text>
            </View>

            {/* More Expenses */}
            <View style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.transactionIcon, { backgroundColor: colors.surfaceHighlight }]}>
                <Ionicons name="cart" size={20} color="#EF4444" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>Groceries</Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>Feb 16, 3:45 PM</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: '#EF4444' }]}>
                -{formatCurrency(127.89, 'USD')}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
        <Ionicons name="add" size={32} color={colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: fontSize.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  balanceCard: {
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
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
    marginBottom: spacing.xs,
  },
  balanceStatValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  balanceStatDivider: {
    width: 1,
    height: 32,
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
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  transactionList: {
    gap: spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: fontSize.xs,
  },
  transactionAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});

export default DemoHomeScreen;
