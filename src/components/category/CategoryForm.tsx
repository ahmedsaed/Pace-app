/**
 * CategoryForm Component
 * Form for creating/editing categories
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../utils/types';
import { spacing, fontSize, fontWeight } from '../../styles/theme';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { IconPicker } from '../common/IconPicker';
import { Modal } from '../common/Modal';
import { useColors } from '../../hooks/useColors';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const colors = useColors();
  const [name, setName] = useState(category?.name || '');
  const [type, setType] = useState<'income' | 'expense'>(category?.type || 'expense');
  const [icon, setIcon] = useState(category?.icon || 'pricetag');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      icon,
      parentId: category?.parentId || null,
      isDefault: category?.isDefault || false,
    });
  };

  return (
    <ScrollView style={[styles.container, { padding: spacing.lg, marginTop: spacing.xl }]}>
      {/* Category Name */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Name</Text>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="e.g., Groceries, Salary"
        />
      </View>

      {/* Category Type */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.typeButtonActive,
              { 
                backgroundColor: type === 'expense' ? colors.primary : colors.surface,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setType('expense')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-down-circle" 
              size={24} 
              color={type === 'expense' ? colors.background : colors.textSecondary} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: type === 'expense' ? colors.background : colors.textSecondary }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.typeButtonActive,
              { 
                backgroundColor: type === 'income' ? colors.primary : colors.surface,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setType('income')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-up-circle" 
              size={24} 
              color={type === 'income' ? colors.background : colors.textSecondary} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: type === 'income' ? colors.background : colors.textSecondary }
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Icon Selection */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
          onPress={() => setShowIconPicker(true)}
          activeOpacity={0.7}
        >
          <Ionicons name={icon as any} size={32} color={colors.primary} />
          <Text style={[styles.iconButtonText, { color: colors.text }]}>
            Tap to change icon
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {category && onDelete ? (
          <View style={styles.buttonRow}>
            <Button
              title="Delete"
              variant="danger"
              onPress={onDelete}
              style={styles.halfButton}
            />
            <Button
              title="Update"
              onPress={handleSubmit}
              disabled={!name.trim()}
              style={styles.halfButton}
            />
          </View>
        ) : (
          <Button
            title="Create"
            onPress={handleSubmit}
            disabled={!name.trim()}
          />
        )}
      </View>

      {/* Icon Picker Modal */}
      <Modal
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        title="Choose Icon"
      >
        <IconPicker
          selectedIcon={icon}
          onIconSelect={(selectedIcon: string) => {
            setIcon(selectedIcon);
            setShowIconPicker(false);
          }}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    marginBottom: spacing.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.sm,
  },
  typeButtonActive: {
    borderWidth: 0,
  },
  typeButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
  },
  iconButton: {
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfButton: {
    flex: 1,
    height: 52,
  },
});
