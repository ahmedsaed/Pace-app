/**
 * IconPickerSheet
 * Bottom-sheet icon picker — same sliding-sheet pattern as CategoryPicker.
 * Used by AccountForm and CategoryForm.
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Icon catalogues — curated, distinct, no duplicates
// ─────────────────────────────────────────────────────────────────────────────
type IconEntry = { name: string; label: string; keywords: string[] };

/** Icons tailored for account types (financial containers & purposes) */
export const ACCOUNT_ICONS: IconEntry[] = [
  { name: 'wallet',            label: 'Wallet',      keywords: ['money', 'cash', 'general'] },
  { name: 'card',              label: 'Card',        keywords: ['credit', 'debit', 'bank', 'payment'] },
  { name: 'cash',              label: 'Cash',        keywords: ['money', 'bills', 'physical'] },
  { name: 'briefcase',         label: 'Business',    keywords: ['business', 'work', 'corporate'] },
  { name: 'trending-up',       label: 'Investment',  keywords: ['invest', 'stocks', 'growth', 'portfolio'] },
  { name: 'diamond',           label: 'Savings',     keywords: ['savings', 'premium', 'wealth'] },
  { name: 'home',              label: 'Home',        keywords: ['mortgage', 'house', 'property', 'rent'] },
  { name: 'business',          label: 'Bank',        keywords: ['bank', 'institution', 'building'] },
  { name: 'phone-portrait',    label: 'Digital',     keywords: ['digital', 'mobile', 'online', 'fintech'] },
  { name: 'globe',             label: 'Foreign',     keywords: ['foreign', 'currency', 'international', 'travel'] },
  { name: 'lock-closed',       label: 'Locked',      keywords: ['locked', 'fixed', 'term', 'secure'] },
  { name: 'repeat',            label: 'Recurring',   keywords: ['recurring', 'auto', 'regular'] },
  { name: 'bar-chart',         label: 'Portfolio',   keywords: ['portfolio', 'finance', 'chart', 'data'] },
  { name: 'pie-chart',         label: 'Budget',      keywords: ['budget', 'allocation', 'split'] },
  { name: 'layers',            label: 'Multi',       keywords: ['multiple', 'joint', 'combined'] },
  { name: 'archive',           label: 'Reserve',     keywords: ['reserve', 'emergency', 'rainy day'] },
  { name: 'car',               label: 'Car Fund',    keywords: ['car', 'vehicle', 'transport', 'auto'] },
  { name: 'airplane',          label: 'Travel Fund', keywords: ['travel', 'vacation', 'flight', 'trip'] },
  { name: 'school',            label: 'Education',   keywords: ['education', 'tuition', 'college', 'fund'] },
  { name: 'medkit',            label: 'Medical',     keywords: ['medical', 'health', 'emergency', 'fund'] },
  { name: 'gift',              label: 'Gift Fund',   keywords: ['gift', 'present', 'celebration'] },
  { name: 'storefront',        label: 'Business',    keywords: ['store', 'shop', 'retail', 'business'] },
  { name: 'shield-checkmark',  label: 'Insurance',   keywords: ['insurance', 'protection', 'coverage'] },
  { name: 'star',              label: 'Primary',     keywords: ['primary', 'main', 'favourite', 'default'] },
];

/** Icons tailored for transaction categories */
export const CATEGORY_ICONS: IconEntry[] = [
  // Food & Drink
  { name: 'restaurant',        label: 'Dining',      keywords: ['food', 'restaurant', 'eat', 'meal', 'dinner'] },
  { name: 'fast-food',         label: 'Fast Food',   keywords: ['food', 'burger', 'takeout', 'quick'] },
  { name: 'cafe',              label: 'Coffee',      keywords: ['coffee', 'cafe', 'drink', 'beverage'] },
  { name: 'beer',              label: 'Drinks',      keywords: ['alcohol', 'bar', 'drink', 'beer', 'wine'] },
  { name: 'nutrition',         label: 'Groceries',   keywords: ['groceries', 'supermarket', 'food', 'health'] },
  // Shopping
  { name: 'cart',              label: 'Shopping',    keywords: ['shop', 'buy', 'purchase', 'groceries', 'retail'] },
  { name: 'bag-handle',        label: 'Bags',        keywords: ['shop', 'fashion', 'purchase', 'bag'] },
  { name: 'shirt',             label: 'Clothing',    keywords: ['clothes', 'fashion', 'apparel', 'wardrobe'] },
  { name: 'gift',              label: 'Gifts',       keywords: ['gift', 'present', 'celebration'] },
  // Transport
  { name: 'car',               label: 'Car',         keywords: ['car', 'drive', 'fuel', 'auto', 'parking'] },
  { name: 'bus',               label: 'Transit',     keywords: ['bus', 'metro', 'public', 'transit', 'commute'] },
  { name: 'airplane',          label: 'Flight',      keywords: ['flight', 'travel', 'airplane', 'trip'] },
  { name: 'bicycle',           label: 'Bicycle',     keywords: ['bike', 'cycle', 'ride'] },
  // Home & Bills
  { name: 'home',              label: 'Housing',     keywords: ['rent', 'mortgage', 'house', 'home', 'accommodation'] },
  { name: 'flash',             label: 'Electricity', keywords: ['electricity', 'power', 'utility', 'bill'] },
  { name: 'water',             label: 'Water',       keywords: ['water', 'utility', 'bill'] },
  { name: 'wifi',              label: 'Internet',    keywords: ['internet', 'wifi', 'broadband', 'utility'] },
  { name: 'call',              label: 'Phone',       keywords: ['phone', 'mobile', 'bill', 'telecom'] },
  // Entertainment
  { name: 'game-controller',   label: 'Gaming',      keywords: ['gaming', 'games', 'entertainment', 'play'] },
  { name: 'film',              label: 'Movies',      keywords: ['movies', 'cinema', 'film', 'streaming'] },
  { name: 'musical-notes',     label: 'Music',       keywords: ['music', 'spotify', 'audio', 'streaming'] },
  { name: 'tv',                label: 'TV',          keywords: ['tv', 'netflix', 'streaming', 'subscription'] },
  { name: 'book',              label: 'Books',       keywords: ['books', 'reading', 'kindle', 'education'] },
  { name: 'ticket',            label: 'Events',      keywords: ['events', 'concert', 'show', 'ticket'] },
  // Health & Fitness
  { name: 'fitness',           label: 'Gym',         keywords: ['gym', 'fitness', 'workout', 'exercise', 'sport'] },
  { name: 'medkit',            label: 'Medical',     keywords: ['medical', 'doctor', 'pharmacy', 'health'] },
  { name: 'pulse',             label: 'Wellness',    keywords: ['wellness', 'health', 'fitness', 'spa'] },
  // Work & Income
  { name: 'briefcase',         label: 'Work',        keywords: ['work', 'salary', 'job', 'income', 'career'] },
  { name: 'desktop',           label: 'Tech',        keywords: ['tech', 'computer', 'software', 'subscription'] },
  { name: 'trending-up',       label: 'Income',      keywords: ['income', 'investment', 'profit', 'revenue'] },
  { name: 'cash',              label: 'Cash',        keywords: ['cash', 'atm', 'withdrawal', 'money'] },
  // Education
  { name: 'school',            label: 'Education',   keywords: ['school', 'tuition', 'study', 'university'] },
  { name: 'pencil',            label: 'Stationery',  keywords: ['stationery', 'supplies', 'writing', 'study'] },
  // Personal
  { name: 'cut',               label: 'Grooming',    keywords: ['haircut', 'salon', 'grooming', 'personal'] },
  { name: 'heart',             label: 'Self-care',   keywords: ['self-care', 'beauty', 'personal', 'wellness'] },
  { name: 'paw',               label: 'Pets',        keywords: ['pets', 'dog', 'cat', 'vet', 'animal'] },
  // Misc
  { name: 'pricetag',          label: 'General',     keywords: ['general', 'other', 'misc', 'default'] },
  { name: 'location',          label: 'Travel',      keywords: ['travel', 'trip', 'vacation', 'maps'] },
  { name: 'shield-checkmark',  label: 'Insurance',   keywords: ['insurance', 'protection', 'security'] },
  { name: 'construct',         label: 'Repairs',     keywords: ['repairs', 'maintenance', 'tools', 'fix'] },
  { name: 'color-palette',     label: 'Creative',    keywords: ['art', 'creative', 'design', 'hobby'] },
];

// Default fallback list (used when no `icons` prop is passed)
const DEFAULT_ICONS = CATEGORY_ICONS;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface IconPickerSheetProps {
  visible: boolean;
  selectedIcon?: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
  title?: string;
  /** Curated icon list to display. Defaults to CATEGORY_ICONS. */
  icons?: IconEntry[];
  /** Highlight colour for the selected icon border/background */
  accentColor?: string;
}

export const IconPickerSheet: React.FC<IconPickerSheetProps> = ({
  visible,
  selectedIcon,
  onSelect,
  onClose,
  title = 'Choose Icon',
  icons = DEFAULT_ICONS,
  accentColor = darkColors.primary,
}) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return icons;
    const q = search.trim().toLowerCase();
    return icons.filter(
      ic =>
        ic.name.toLowerCase().includes(q) ||
        ic.label.toLowerCase().includes(q) ||
        ic.keywords.some(k => k.includes(q)),
    );
  }, [search, icons]);

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const renderItem = ({ item }: { item: IconEntry }) => {
    const isSelected = item.name === selectedIcon;
    return (
      <TouchableOpacity
        style={[
          styles.iconCell,
          isSelected && { borderColor: accentColor, backgroundColor: accentColor + '20' },
        ]}
        onPress={() => { onSelect(item.name); handleClose(); }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.name as any}
          size={26}
          color={isSelected ? accentColor : darkColors.primary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        <Text style={styles.title}>{title}</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={darkColors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search icons…"
            placeholderTextColor={darkColors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={darkColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.name}
          renderItem={renderItem}
          numColumns={5}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No icons match your search.</Text>
          }
        />
      </View>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

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
    maxHeight: '75%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: darkColors.background,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: darkColors.text,
    padding: 0,
  },
  gridContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  iconCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkColors.surfaceHighlight,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  empty: {
    color: darkColors.textSecondary,
    fontSize: fontSize.base,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
