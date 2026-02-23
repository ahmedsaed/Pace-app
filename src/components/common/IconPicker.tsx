/**
 * IconPicker Component
 * Select an icon from Ionicons library with search functionality
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/useColors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

// Comprehensive list of commonly used icons for categories
const CATEGORY_ICONS = [
  // Food & Dining
  { name: 'restaurant', label: 'Restaurant', keywords: ['food', 'dining', 'eat', 'meal'] },
  { name: 'fast-food', label: 'Fast Food', keywords: ['food', 'burger', 'eat', 'quick'] },
  { name: 'pizza', label: 'Pizza', keywords: ['food', 'dining', 'eat'] },
  { name: 'cafe', label: 'Cafe', keywords: ['coffee', 'drink', 'beverage'] },
  { name: 'beer', label: 'Beer', keywords: ['drink', 'alcohol', 'beverage'] },
  { name: 'wine', label: 'Wine', keywords: ['drink', 'alcohol', 'beverage'] },
  { name: 'ice-cream', label: 'Ice Cream', keywords: ['food', 'dessert', 'sweet'] },
  { name: 'nutrition', label: 'Nutrition', keywords: ['food', 'health', 'diet'] },
  
  // Shopping & Retail
  { name: 'cart', label: 'Shopping Cart', keywords: ['shop', 'buy', 'purchase', 'groceries'] },
  { name: 'bag-handle', label: 'Shopping Bag', keywords: ['shop', 'buy', 'purchase'] },
  { name: 'gift', label: 'Gift', keywords: ['present', 'shop', 'celebration'] },
  { name: 'shirt', label: 'Clothing', keywords: ['clothes', 'fashion', 'shop'] },
  { name: 'body', label: 'Fashion', keywords: ['clothes', 'style', 'shop'] },
  
  // Transportation
  { name: 'car', label: 'Car', keywords: ['vehicle', 'transport', 'drive', 'auto'] },
  { name: 'bus', label: 'Bus', keywords: ['transport', 'public', 'transit'] },
  { name: 'train', label: 'Train', keywords: ['transport', 'public', 'transit', 'metro'] },
  { name: 'airplane', label: 'Airplane', keywords: ['transport', 'travel', 'flight'] },
  { name: 'bicycle', label: 'Bicycle', keywords: ['transport', 'bike', 'cycle'] },
  { name: 'boat', label: 'Boat', keywords: ['transport', 'ship', 'water'] },
  { name: 'walk', label: 'Walk', keywords: ['transport', 'pedestrian'] },
  
  // Entertainment
  { name: 'game-controller', label: 'Gaming', keywords: ['entertainment', 'play', 'games'] },
  { name: 'film', label: 'Movies', keywords: ['entertainment', 'cinema', 'film'] },
  { name: 'musical-notes', label: 'Music', keywords: ['entertainment', 'audio', 'sound'] },
  { name: 'tv', label: 'TV', keywords: ['entertainment', 'watch', 'media'] },
  { name: 'ticket', label: 'Events', keywords: ['entertainment', 'concert', 'show'] },
  { name: 'book', label: 'Books', keywords: ['entertainment', 'reading', 'literature'] },
  
  // Bills & Utilities
  { name: 'water', label: 'Water', keywords: ['utility', 'bill', 'essential'] },
  { name: 'flash', label: 'Electricity', keywords: ['utility', 'bill', 'power', 'energy'] },
  { name: 'wifi', label: 'Internet', keywords: ['utility', 'bill', 'connection'] },
  { name: 'call', label: 'Phone', keywords: ['utility', 'bill', 'mobile', 'communication'] },
  { name: 'home', label: 'Rent/Home', keywords: ['house', 'accommodation', 'housing'] },
  
  // Healthcare & Fitness
  { name: 'fitness', label: 'Fitness', keywords: ['health', 'gym', 'exercise', 'sport'] },
  { name: 'medkit', label: 'Healthcare', keywords: ['health', 'medical', 'doctor'] },
  { name: 'pulse', label: 'Health', keywords: ['fitness', 'medical', 'wellness'] },
  { name: 'barbell', label: 'Gym', keywords: ['fitness', 'exercise', 'workout'] },
  
  // Finance & Money
  { name: 'wallet', label: 'Wallet', keywords: ['money', 'finance', 'cash'] },
  { name: 'card', label: 'Card', keywords: ['money', 'finance', 'payment', 'credit'] },
  { name: 'cash', label: 'Cash', keywords: ['money', 'finance', 'payment'] },
  { name: 'trending-up', label: 'Investment', keywords: ['money', 'finance', 'stocks', 'profit'] },
  { name: 'trending-down', label: 'Loss', keywords: ['money', 'finance', 'decrease'] },
  { name: 'stats-chart', label: 'Savings', keywords: ['money', 'finance', 'growth'] },
  
  // Work & Business
  { name: 'briefcase', label: 'Work', keywords: ['business', 'job', 'career', 'office'] },
  { name: 'business', label: 'Business', keywords: ['work', 'company', 'corporate'] },
  { name: 'desktop', label: 'Computer', keywords: ['work', 'technology', 'office'] },
  { name: 'laptop', label: 'Laptop', keywords: ['work', 'technology', 'computer'] },
  
  // Education
  { name: 'school', label: 'Education', keywords: ['learn', 'study', 'school', 'university'] },
  { name: 'document-text', label: 'Documents', keywords: ['files', 'paper', 'work'] },
  { name: 'pencil', label: 'Study', keywords: ['education', 'write', 'learn'] },
  
  // Communication
  { name: 'mail', label: 'Email', keywords: ['communication', 'message', 'contact'] },
  { name: 'chatbubbles', label: 'Chat', keywords: ['communication', 'message', 'talk'] },
  { name: 'notifications', label: 'Notifications', keywords: ['alert', 'reminder'] },
  
  // Personal Care
  { name: 'cut', label: 'Haircut', keywords: ['personal', 'grooming', 'salon'] },
  { name: 'shirt', label: 'Laundry', keywords: ['personal', 'cleaning', 'clothes'] },
  
  // Pets & Animals
  { name: 'paw', label: 'Pets', keywords: ['animal', 'dog', 'cat'] },
  
  // Miscellaneous
  { name: 'pricetag', label: 'Default', keywords: ['tag', 'label'] },
  { name: 'leaf', label: 'Nature', keywords: ['environment', 'green', 'eco'] },
  { name: 'construct', label: 'Tools', keywords: ['repair', 'maintenance', 'fix'] },
  { name: 'bed', label: 'Accommodation', keywords: ['hotel', 'sleep', 'lodging'] },
  { name: 'storefront', label: 'Store', keywords: ['shop', 'retail', 'business'] },
  { name: 'location', label: 'Location', keywords: ['place', 'map', 'address'] },
  { name: 'shield-checkmark', label: 'Insurance', keywords: ['protection', 'security', 'coverage'] },
  { name: 'finger-print', label: 'Security', keywords: ['protection', 'safety', 'privacy'] },
  { name: 'color-palette', label: 'Art', keywords: ['creative', 'design', 'painting'] },
  { name: 'camera', label: 'Photography', keywords: ['photo', 'picture', 'image'] },
];

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (icon: string) => void;
  label?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onIconSelect,
  label = 'Choose Icon',
}) => {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return CATEGORY_ICONS;
    }
    
    const query = searchQuery.toLowerCase();
    return CATEGORY_ICONS.filter(icon => 
      icon.label.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.keywords.some(keyword => keyword.includes(query))
    );
  }, [searchQuery]);

  const renderIcon = ({ item }: { item: typeof CATEGORY_ICONS[0] }) => (
    <TouchableOpacity
      key={item.name}
      style={[
        styles.iconOption,
        { backgroundColor: colors.surface },
        selectedIcon === item.name && { 
          backgroundColor: colors.primaryLight,
          borderColor: colors.primary,
          borderWidth: 2,
        },
      ]}
      onPress={() => onIconSelect(item.name)}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={item.name as any} 
        size={28} 
        color={selectedIcon === item.name ? colors.primary : colors.text} 
      />
      <Text 
        style={[
          styles.iconLabel, 
          { color: selectedIcon === item.name ? colors.primary : colors.textSecondary }
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search icons..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Icon Grid */}
      <FlatList
        data={filteredIcons}
        renderItem={renderIcon}
        keyExtractor={(item) => item.name}
        numColumns={3}
        columnWrapperStyle={styles.row}
        style={styles.iconList}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No icons found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    padding: 0,
  },
  iconList: {
    flex: 1,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconOption: {
    flex: 1,
    minHeight: 90,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  iconLabel: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.base,
  },
});
