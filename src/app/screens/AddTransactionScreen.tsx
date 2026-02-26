/**
 * AddTransactionScreen — Ergonomic Layout
 *
 * Fixed height, zero-scroll. Bottom-up ergonomic design:
 *
 * ┌─────────────────────────────────────┐
 * │ [✕]   [Expense] [Income] [Transfer] │  header: close + type toggle
 * ├─────────────────────────────────────┤
 * │  Note field...              [📎][✨] │  flex note area (~22% height)
 * ├─────────────────────────────────────┤
 * │  1 234.56             USD  [⌫]     │  amount: expression | currency | delete
 * ├─────────────────────────────────────┤
 * │  [+][1][2][3]                       │
 * │  [-][4][5][6]                       │  numpad: ops column + digits + Save
 * │  [×][7][8][9]                       │
 * │  [÷][.][0][ ✓ Save ]               │
 * ├─────────────────────────────────────┤
 * │ [🏷 Category] [💳 Account] [📅 Date] │  pickers row
 * └─────────────────────────────────────┘
 *
 * Save key auto-cycles:  amount > 0 → category (if missing) → account (if missing) → save
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Animated,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, subDays, isToday, isYesterday } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

import { TransactionType } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

import { AccountPicker } from '../../components/transaction/AccountPicker';
import { CategoryPicker } from '../../components/transaction/CategoryPicker';
import { TRANSACTION_COLORS } from '../../components/transaction/TransactionCard';

import { useTransactionStore } from '../../store/transactionStore';
import { useAccountStore } from '../../store/accountStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useUIStore } from '../../store/uiStore';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────


/** Evaluate a simple two-operand arithmetic expression: "50 + 25" → 75 */
function evalExpr(expr: string): number {
  const e = expr.trim().replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
  const m = e.match(/^(\d+\.?\d*)([\+\-\*\/])(\d+\.?\d*)$/);
  if (m) {
    const a = parseFloat(m[1]);
    const b = parseFloat(m[3]);
    switch (m[2]) {
      case '+': return a + b;
      case '-': return Math.max(0, a - b);
      case '*': return a * b;
      case '/': return b === 0 ? 0 : a / b;
    }
  }
  return parseFloat(e) || 0;
}

function formatDateLabel(d: Date): string {
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
}

// ─────────────────────────────────────────────────────────────────────────────
// DatePickerModal
// ─────────────────────────────────────────────────────────────────────────────

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onConfirm: (d: Date) => void;
  onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ visible, date, onConfirm, onClose }) => {
  const [draft, setDraft] = useState(date);

  useEffect(() => {
    if (visible) setDraft(date);
  }, [visible]);

  const shiftDay = (n: number) => setDraft(prev => addDays(prev, n));
  const shiftMonth = (n: number) =>
    setDraft(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + n); return d; });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={dpStyles.overlay} />
      </TouchableWithoutFeedback>
      <View style={dpStyles.sheet}>
        <View style={dpStyles.handle} />
        <Text style={dpStyles.title}>Select Date</Text>

        {/* Quick shortcuts */}
        <View style={dpStyles.shortcuts}>
          <TouchableOpacity style={dpStyles.shortcut} onPress={() => setDraft(new Date())}>
            <Text style={dpStyles.shortcutText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dpStyles.shortcut} onPress={() => setDraft(subDays(new Date(), 1))}>
            <Text style={dpStyles.shortcutText}>Yesterday</Text>
          </TouchableOpacity>
        </View>

        {/* Day row */}
        <View style={dpStyles.spinRow}>
          <Text style={dpStyles.spinLabel}>Day</Text>
          <View style={dpStyles.spinner}>
            <TouchableOpacity onPress={() => shiftDay(-1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-back" size={20} color={darkColors.text} />
            </TouchableOpacity>
            <Text style={dpStyles.spinValue}>{format(draft, 'EEEE, d')}</Text>
            <TouchableOpacity onPress={() => shiftDay(1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-forward" size={20} color={darkColors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Month row */}
        <View style={dpStyles.spinRow}>
          <Text style={dpStyles.spinLabel}>Month</Text>
          <View style={dpStyles.spinner}>
            <TouchableOpacity onPress={() => shiftMonth(-1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-back" size={20} color={darkColors.text} />
            </TouchableOpacity>
            <Text style={dpStyles.spinValue}>{format(draft, 'MMMM yyyy')}</Text>
            <TouchableOpacity onPress={() => shiftMonth(1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-forward" size={20} color={darkColors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={dpStyles.confirm} onPress={() => { onConfirm(draft); onClose(); }}>
          <Text style={dpStyles.confirmText}>Set Date</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const dpStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'transparent' },
  sheet: {
    backgroundColor: darkColors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: darkColors.border,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg, fontWeight: fontWeight.semibold as any,
    color: darkColors.text, textAlign: 'center', marginBottom: spacing.lg,
  },
  shortcuts: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  shortcut: {
    flex: 1, paddingVertical: spacing.sm,
    backgroundColor: darkColors.surfaceHighlight,
    borderRadius: borderRadius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: darkColors.border,
  },
  shortcutText: { fontSize: fontSize.sm, color: darkColors.text, fontWeight: fontWeight.medium as any },
  spinRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  spinLabel: { width: 58, fontSize: fontSize.sm, color: darkColors.textSecondary, fontWeight: fontWeight.medium as any },
  spinner: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: darkColors.surfaceHighlight,
    borderRadius: borderRadius.lg, paddingHorizontal: spacing.sm,
    height: 46, borderWidth: 1, borderColor: darkColors.border,
  },
  spinValue: { flex: 1, textAlign: 'center', fontSize: fontSize.base, color: darkColors.text, fontWeight: fontWeight.medium as any },
  confirm: {
    marginTop: spacing.md,
    backgroundColor: darkColors.primary,
    borderRadius: borderRadius.lg, height: 52,
    justifyContent: 'center', alignItems: 'center',
  },
  confirmText: { fontSize: fontSize.base, fontWeight: fontWeight.bold as any, color: darkColors.background },
});

// ─────────────────────────────────────────────────────────────────────────────
// NumPad
// ─────────────────────────────────────────────────────────────────────────────

// Row layout:  col-0 = math op  |  col-1..3 = digits / save
const PAD_ROWS = [
  ['+', '1', '2', '3'],
  ['-', '4', '5', '6'],
  ['×', '7', '8', '9'],
  ['÷', '.', '0', 'SAVE'],
] as const;

interface NumPadProps {
  onKey: (key: string) => void;
  typeColor: string;
  isLoading: boolean;
}

const NumPad: React.FC<NumPadProps> = ({ onKey, typeColor, isLoading }) => (
  <View style={padStyles.grid}>
    {PAD_ROWS.map((row, ri) => (
      <View key={ri} style={padStyles.row}>
        {row.map(key => {
          const isOp = ['+', '-', '×', '÷'].includes(key);
          const isSave = key === 'SAVE';
          return (
            <TouchableOpacity
              key={key}
              style={[
                padStyles.key,
                isOp && padStyles.keyOp,
                isSave && [padStyles.keySave, { backgroundColor: typeColor }],
              ]}
              onPress={() => onKey(key)}
              activeOpacity={isSave ? 0.75 : 0.45}
              disabled={isSave && isLoading}
            >
              {isSave ? (
                <Ionicons name="checkmark" size={24} color="#fff" />
              ) : (
                <Text style={[padStyles.keyText, isOp && padStyles.keyTextOp]}>
                  {key}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    ))}
  </View>
);

const padStyles = StyleSheet.create({
  grid: { gap: 2 },
  row: { flexDirection: 'row', gap: 2 },
  key: {
    flex: 1, height: 60,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  keyOp: { backgroundColor: darkColors.surfaceHighlight },
  keySave: { borderRadius: borderRadius.lg },
  keyText: { fontSize: 22, fontWeight: fontWeight.medium as any, color: darkColors.text },
  keyTextOp: { fontSize: 22, color: darkColors.textSecondary, fontWeight: fontWeight.regular as any },
});

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

const TYPES: { key: TransactionType; label: string }[] = [
  { key: 'expense',  label: 'Expense'  },
  { key: 'income',   label: 'Income'   },
  { key: 'transfer', label: 'Transfer' },
];

export const AddTransactionScreen = ({ navigation }: any) => {
  // ── Form state ───────────────────────────────────────────────────────────
  const [type, setType] = useState<TransactionType>('expense');
  const [expression, setExpression] = useState('0');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [selectedToAccountId, setSelectedToAccountId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // ── Picker visibility ────────────────────────────────────────────────────
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showToAccountPicker, setShowToAccountPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ── Animation ────────────────────────────────────────────────────────────
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Type swipe gesture ───────────────────────────────────────────────────
  const typePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_, gs) =>
        Math.abs(gs.dx) > 12 && Math.abs(gs.dx) > Math.abs(gs.dy) * 2.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -40) {
          setType(prev => {
            const i = TYPES.findIndex(t => t.key === prev);
            return TYPES[(i + 1) % TYPES.length].key;
          });
        } else if (gs.dx > 40) {
          setType(prev => {
            const i = TYPES.findIndex(t => t.key === prev);
            return TYPES[(i - 1 + TYPES.length) % TYPES.length].key;
          });
        }
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  // ── Tab bar ────────────────────────────────────────────────────────────
  const { setTabBarVisible } = useUIStore();
  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      return () => setTabBarVisible(true);
    }, [setTabBarVisible])
  );

  // ── Stores ───────────────────────────────────────────────────────────────
  const { createTransaction, isLoading } = useTransactionStore();
  const { accounts, fetchAccounts } = useAccountStore();
  const { categories, fetchCategories, seedDefaults } = useCategoryStore();

  useEffect(() => {
    (async () => {
      await fetchAccounts();
      await seedDefaults();
      await fetchCategories();
    })();
  }, []);

  // Reset category when type changes
  useEffect(() => { setSelectedCategoryId(null); }, [type]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const typeColor = TRANSACTION_COLORS[type];
  const selectedAccount   = accounts.find(a => a.id === selectedAccountId);
  const selectedToAccount = accounts.find(a => a.id === selectedToAccountId);
  const selectedCategory  = categories.find(c => c.id === selectedCategoryId);
  const categoryType = type === 'income' ? 'income' : 'expense';

  // ── Save / auto-cycle ────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    const amount = evalExpr(expression);

    if (amount <= 0) {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
      ]).start();
      return;
    }

    // Auto-cycle to next missing required field
    if (type !== 'transfer' && !selectedCategoryId) { setShowCategoryPicker(true); return; }
    if (type !== 'transfer' && !selectedAccountId)  { setShowAccountPicker(true);  return; }
    if (type === 'transfer' && !selectedAccountId)   { setShowAccountPicker(true);  return; }
    if (type === 'transfer' && !selectedToAccountId) { setShowToAccountPicker(true); return; }
    if (type === 'transfer' && selectedAccountId === selectedToAccountId) {
      Alert.alert('Same Account', 'From and To accounts must be different.');
      return;
    }

    try {
      await createTransaction({
        type,
        amount,
        date: date.toISOString(),
        accountId: selectedAccountId!,
        categoryId: type !== 'transfer' ? selectedCategoryId : null,
        toAccountId: type === 'transfer' ? selectedToAccountId : null,
        note: note.trim() || null,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
    }
  }, [expression, type, selectedCategoryId, selectedAccountId, selectedToAccountId, date, note]);

  // ── Key handler ──────────────────────────────────────────────────────────
  const handleKey = (key: string) => {
    if (key === 'SAVE') { handleSave(); return; }

    setExpression(prev => {
      if (key === '⌫') {
        // Remove whole operator segment "50 + " → "50"
        if (/\s[+\-×÷]\s$/.test(prev)) return prev.replace(/\s[+\-×÷]\s$/, '') || '0';
        const next = prev.slice(0, -1);
        return next || '0';
      }
      if (['+', '-', '×', '÷'].includes(key)) {
        if (prev === '0') return prev;
        if (/[+\-×÷]\s$/.test(prev)) return prev; // already ends with op
        return prev + ' ' + key + ' ';
      }
      if (key === '.') {
        const lastNum = prev.split(/\s[+\-×÷]\s/).pop() ?? '';
        if (lastNum.includes('.')) return prev;
        if (prev === '0') return '0.';
        return prev + '.';
      }
      // Digit
      if (prev === '0') return key;
      if (prev.replace(/[^\d]/g, '').length >= 11) return prev;
      return prev + key;
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={darkColors.background} />

      {/* ── Header: cancel + save ── */}
      <View style={styles.closeRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={18} color={darkColors.textSecondary} />
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveHeaderBtn, { backgroundColor: typeColor + '22', borderColor: typeColor + '44' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.saveHeaderBtnText, { color: typeColor }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* ── Segmented type control (swipeable) ── */}
      <View style={styles.segmentContainer} {...typePanResponder.panHandlers}>
        {TYPES.map(({ key, label }) => {
          const active = type === key;
          const color = TRANSACTION_COLORS[key];
          return (
            <TouchableOpacity
              key={key}
              style={[styles.segment, active && { backgroundColor: color + '28' }]}
              onPress={() => setType(key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, { color: active ? color : darkColors.textSecondary }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Note field (flex area) ── */}
      <View style={styles.noteContainer}>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note..."
          placeholderTextColor={darkColors.textTertiary}
          multiline
          textAlignVertical="top"
          blurOnSubmit
          returnKeyType="done"
        />
        {/* Placeholder buttons for Feature 9 (camera) and Feature 10 (AI) */}
        <View style={styles.noteFutureRow}>
          <Ionicons name="camera-outline" size={18} color={darkColors.textTertiary} style={{ opacity: 0.35 }} />
          <Ionicons name="sparkles-outline" size={18} color={darkColors.textTertiary} style={{ opacity: 0.35 }} />
        </View>
      </View>

      {/* ── Amount row: currency | expression | ⌫ ── */}
      <Animated.View style={[styles.amountRow, { transform: [{ translateX: shakeAnim }] }]}>
        <Text style={styles.amountCurrency}>{selectedAccount?.currency ?? 'USD'}</Text>
        <Text
          style={[styles.amountExpr, { color: typeColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.45}
        >
          {expression}
        </Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleKey('⌫')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.5}
        >
          <Ionicons name="backspace-outline" size={22} color={darkColors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Numpad ── */}
      <View style={styles.padWrapper}>
        <NumPad onKey={handleKey} typeColor={typeColor} isLoading={isLoading} />
      </View>

      {/* ── Pickers row ── */}
      <View style={styles.pickersRow}>
        {/* Category pill  (or From Account for transfer) */}
        {type !== 'transfer' ? (
          <TouchableOpacity
            style={[styles.pickerPill, !!selectedCategory && styles.pickerPillFilled]}
            onPress={() => setShowCategoryPicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(selectedCategory?.icon as any) ?? 'pricetag-outline'}
              size={20}
              color={selectedCategory ? typeColor : darkColors.textSecondary}
            />
            <Text style={[styles.pickerPillText, selectedCategory && styles.pickerPillTextFilled]} numberOfLines={1}>
              {selectedCategory ? selectedCategory.name : 'Category'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.pickerPill, !!selectedAccount && styles.pickerPillFilled]}
            onPress={() => setShowAccountPicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(selectedAccount?.icon as any) ?? 'wallet-outline'}
              size={20}
              color={selectedAccount ? (selectedAccount.color ?? darkColors.text) : darkColors.textSecondary}
            />
            <Text style={[styles.pickerPillText, selectedAccount && styles.pickerPillTextFilled]} numberOfLines={1}>
              {selectedAccount ? selectedAccount.name : 'From'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Account pill  (or To Account for transfer) */}
        {type !== 'transfer' ? (
          <TouchableOpacity
            style={[styles.pickerPill, !!selectedAccount && styles.pickerPillFilled]}
            onPress={() => setShowAccountPicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(selectedAccount?.icon as any) ?? 'wallet-outline'}
              size={20}
              color={selectedAccount ? (selectedAccount.color ?? darkColors.text) : darkColors.textSecondary}
            />
            <Text style={[styles.pickerPillText, selectedAccount && styles.pickerPillTextFilled]} numberOfLines={1}>
              {selectedAccount ? selectedAccount.name : 'Account'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.pickerPill, !!selectedToAccount && styles.pickerPillFilled]}
            onPress={() => setShowToAccountPicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(selectedToAccount?.icon as any) ?? 'wallet-outline'}
              size={20}
              color={selectedToAccount ? (selectedToAccount.color ?? darkColors.text) : darkColors.textSecondary}
            />
            <Text style={[styles.pickerPillText, selectedToAccount && styles.pickerPillTextFilled]} numberOfLines={1}>
              {selectedToAccount ? selectedToAccount.name : 'To'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Date pill */}
        <TouchableOpacity
          style={[styles.pickerPill, styles.pickerPillFilled]}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={20} color={darkColors.textSecondary} />
          <Text style={[styles.pickerPillText, styles.pickerPillTextFilled]}>
            {formatDateLabel(date)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom-sheet pickers ── */}
      <AccountPicker
        visible={showAccountPicker}
        accounts={accounts}
        selectedId={selectedAccountId}
        onSelect={acc => setSelectedAccountId(acc.id)}
        onClose={() => setShowAccountPicker(false)}
        title={type === 'transfer' ? 'From Account' : 'Account'}
      />
      <AccountPicker
        visible={showToAccountPicker}
        accounts={accounts}
        selectedId={selectedToAccountId}
        onSelect={acc => setSelectedToAccountId(acc.id)}
        onClose={() => setShowToAccountPicker(false)}
        title="To Account"
        excludeId={selectedAccountId}
      />
      <CategoryPicker
        visible={showCategoryPicker}
        categories={categories}
        selectedId={selectedCategoryId}
        type={categoryType}
        onSelect={cat => setSelectedCategoryId(cat.id)}
        onClose={() => setShowCategoryPicker(false)}
      />
      <DatePickerModal
        visible={showDatePicker}
        date={date}
        onConfirm={setDate}
        onClose={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: darkColors.background },

  // ── Header row ──
  closeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: darkColors.border,
    backgroundColor: darkColors.surface,
  },
  cancelBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: darkColors.textSecondary,
  },
  saveHeaderBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  saveHeaderBtnText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold as any },

  // ── Segmented type control ──
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: darkColors.border,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
  },
  segmentText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold as any },

  // ── Note field ──
  noteContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: darkColors.border,
    padding: spacing.md,
  },
  noteInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: darkColors.text,
    padding: 0,
    textAlignVertical: 'top',
  },
  noteFutureRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'flex-end',
    paddingTop: spacing.xs,
  },

  // ── Amount row: currency | expression | ⌫ ──
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: darkColors.border,
  },
  amountCurrency: {
    flex: 1,
    fontSize: 20,
    fontWeight: fontWeight.semibold as any,
    color: darkColors.textSecondary,
    textAlign: 'center',
  },
  amountExpr: {
    flex: 3,
    fontSize: 40,
    fontWeight: fontWeight.bold as any,
    textAlign: 'right',
    letterSpacing: -1,
  },
  deleteBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },

  // ── Numpad wrapper ──
  padWrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: darkColors.border,
  },

  // ── Pickers row ──
  pickersRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkColors.border,
  },
  pickerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    backgroundColor: darkColors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: darkColors.border,
    minHeight: 52,
  },
  pickerPillFilled: { borderColor: darkColors.borderFocus },
  pickerPillText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium as any, color: darkColors.textSecondary },
  pickerPillTextFilled: { color: darkColors.text },
});

export default AddTransactionScreen;
