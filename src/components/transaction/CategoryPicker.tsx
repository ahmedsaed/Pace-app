/**
 * CategoryPicker
 * Bottom-sheet modal for selecting a transaction category — 3-column grid
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
import { Category, CategoryType } from '../../utils/types';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

const TYPE_COLOR: Record<CategoryType, string> = {
  expense: '#EF4444',
  income:  '#10B981',
};

interface CategoryPickerProps {
  visible: boolean;
  categories: Category[];
  selectedId?: number | null;
  type: CategoryType;
  onSelect: (category: Category) => void;
  onClose: () => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  visible,
  categories,
  selectedId,
  type,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const typeColor = TYPE_COLOR[type];

  const filtered = useMemo(() => {
    const base = categories.filter(c => c.type === type && c.parentId === null);
    if (!search.trim()) return base;
    const q = search.trim().toLowerCase();
    return base.filter(c => c.name.toLowerCase().includes(q));
  }, [categories, type, search]);

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && { borderColor: typeColor, backgroundColor: typeColor + '18' },
        ]}
        onPress={() => { onSelect(item); handleClose(); }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconBubble,
          { backgroundColor: isSelected ? typeColor + '30' : darkColors.background },
        ]}>
          <Ionicons
            name={(item.icon as any) || 'pricetag'}
            size={26}
            color={isSelected ? typeColor : darkColors.primary}
          />
        </View>
        <Text
          style={[styles.cardName, isSelected && { color: typeColor }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={14}
            color={typeColor}
            style={styles.checkmark}
          />
        )}
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

        <Text style={styles.title}>
          {type === 'income' ? 'Income' : 'Expense'} Category
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={darkColors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search categories…"
            placeholderTextColor={darkColors.textSecondary}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={darkColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {search ? 'No categories match your search.' : 'No categories found.'}
            </Text>
          }
        />
      </View>
    </Modal>
  );
};

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
  // ── Grid ──
  gridContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    backgroundColor: darkColors.surfaceHighlight,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: darkColors.border,
    gap: spacing.xs,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    color: darkColors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  empty: {
    color: darkColors.textSecondary,
    fontSize: fontSize.base,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
