/**
 * Color Definitions
 * Defines color palettes for light and dark themes
 */

// ============================================================================
// Dark Theme Colors (Primary)
// ============================================================================

export const darkColors = {
  // Base colors
  background: '#000000',        // Pure black
  backgroundSecondary: '#0A0A0A', // Slightly lighter black
  surface: '#202020',           // Dark gray surface (blurred off-white feel)
  surfaceHighlight: '#1A1A1A',  // Slightly lighter gray for highlights
  
  // Text colors
  text: '#E5E5E5',              // Darker off-white primary text
  textSecondary: '#999999',     // Medium gray secondary text
  textTertiary: '#666666',      // Dark gray disabled/placeholder text
  textOnBright: '#0A0A0A',      // Dark text for bright buttons
  
  // Border colors
  border: 'rgba(229, 229, 229, 0.2)',  // Brighter off-white border
  borderLight: 'rgba(229, 229, 229, 0.1)', // Subtle borders
  borderFocus: 'rgba(229, 229, 229, 0.3)',  // Focused input borders
  
  // Transaction type colors
  income: '#E5E5E5',            // Darker off-white for income
  incomeLight: 'rgba(229, 229, 229, 0.05)', // Subtle background
  incomeDark: '#CCCCCC',        // Slightly darker off-white
  
  expense: '#E5E5E5',           // Darker off-white for expenses
  expenseLight: 'rgba(229, 229, 229, 0.05)', // Subtle background
  expenseDark: '#CCCCCC',       // Slightly darker off-white
  
  transfer: '#E5E5E5',          // Darker off-white for transfers
  transferLight: 'rgba(229, 229, 229, 0.05)', // Subtle background
  transferDark: '#CCCCCC',      // Slightly darker off-white
  
  // Status colors
  success: '#E5E5E5',           // Darker off-white
  error: '#E5E5E5',             // Darker off-white
  warning: '#E5E5E5',           // Darker off-white
  info: '#E5E5E5',              // Darker off-white
  
  // Primary brand colors
  primary: '#E5E5E5',           // Darker off-white primary
  primaryHover: '#F5F5F5',      // Lighter off-white hover
  primaryPressed: '#D4D4D4',    // Medium gray pressed
  primaryLight: 'rgba(229, 229, 229, 0.1)', // Transparent with darker off-white tint
  
  // Secondary colors (transparent with off-white edges)
  secondary: 'transparent',     // Transparent
  secondaryHover: 'rgba(229, 229, 229, 0.05)',
  secondaryPressed: 'rgba(229, 229, 229, 0.1)',
  
  // Utility colors
  overlay: 'rgba(0, 0, 0, 0.8)', // Modal overlay
  shadow: 'rgba(0, 0, 0, 0)',    // No shadow
  divider: 'rgba(229, 229, 229, 0.1)', // Subtle divider
  
  // Chart colors - minimal darker off-white variations
  chart1: '#E5E5E5',
  chart2: '#D4D4D4',
  chart3: '#C2C2C2',
  chart4: '#B0B0B0',
  chart5: '#9E9E9E',
  chart6: '#8C8C8C',
  chart7: '#7A7A7A',
  chart8: '#686868',
};

// ============================================================================
// Light Theme Colors
// ============================================================================

export const lightColors = {
  // Base colors
  background: '#FAFAFA',        // Off-white gray
  backgroundSecondary: '#F5F5F5', // Slightly darker off-white
  surface: '#FFFFFF',           // Pure white for cards
  surfaceHighlight: '#F8F8F8',  // Hover/pressed states
  
  // Text colors
  text: '#0A0A0A',              // Primary text (near black)
  textSecondary: '#525252',     // Secondary text
  textTertiary: '#A3A3A3',      // Disabled/placeholder text
  
  // Border colors
  border: '#E5E5E5',            // Default border
  borderLight: '#F5F5F5',       // Subtle borders
  borderFocus: '#3B82F6',       // Focused input borders
  
  // Transaction type colors
  income: '#059669',            // Darker green for visibility
  incomeLight: '#D1FAE5',       // Light green for backgrounds
  incomeDark: '#047857',        // Dark green for emphasis
  
  expense: '#DC2626',           // Darker red for visibility
  expenseLight: '#FEE2E2',      // Light red for backgrounds
  expenseDark: '#991B1B',       // Dark red for emphasis
  
  transfer: '#4F46E5',          // Darker indigo for visibility
  transferLight: '#E0E7FF',     // Light indigo for backgrounds
  transferDark: '#3730A3',      // Dark indigo for emphasis
  
  // Status colors
  success: '#059669',           // Success messages
  error: '#DC2626',             // Error messages
  warning: '#D97706',           // Warning messages
  info: '#2563EB',              // Info messages
  
  // Primary brand colors
  primary: '#3B82F6',           // Main brand color (blue)
  primaryHover: '#2563EB',      // Hover state
  primaryPressed: '#1D4ED8',    // Pressed state
  primaryLight: '#DBEAFE',      // Light variant
  
  // Secondary colors
  secondary: '#8B5CF6',         // Purple accent
  secondaryHover: '#7C3AED',
  secondaryPressed: '#6D28D9',
  
  // Utility colors
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  shadow: 'rgba(0, 0, 0, 0.1)',  // Drop shadows
  divider: '#E5E5E5',            // Divider lines
  
  // Chart colors
  chart1: '#3B82F6',
  chart2: '#10B981',
  chart3: '#F59E0B',
  chart4: '#EF4444',
  chart5: '#8B5CF6',
  chart6: '#EC4899',
  chart7: '#14B8A6',
  chart8: '#F97316',
};

// ============================================================================
// Semantic Color Mappings
// ============================================================================

export const semanticColors = {
  // Transaction types
  transactionIncome: darkColors.income,
  transactionExpense: darkColors.expense,
  transactionTransfer: darkColors.transfer,
  
  // Account types
  accountBankAccount: '#3B82F6',  // Blue
  accountCreditCard: '#EF4444',    // Red
  accountCash: '#10B981',          // Green
  accountSavings: '#8B5CF6',       // Purple
  accountInvestment: '#F59E0B',    // Amber
  accountOther: '#6B7280',         // Gray
};

// ============================================================================
// Opacity Values
// ============================================================================

export const opacity = {
  none: 0,
  subtle: 0.05,
  light: 0.1,
  medium: 0.25,
  heavy: 0.5,
  strong: 0.75,
  full: 1,
};

// ============================================================================
// Color Utility Functions
// ============================================================================

/**
 * Adds opacity to a hex color
 */
export const withOpacity = (color: string, opacityValue: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
};

/**
 * Get color for transaction type
 */
export const getTransactionTypeColor = (type: 'income' | 'expense' | 'transfer', isDark = true): string => {
  const colors = isDark ? darkColors : lightColors;
  switch (type) {
    case 'income':
      return colors.income;
    case 'expense':
      return colors.expense;
    case 'transfer':
      return colors.transfer;
    default:
      return colors.text;
  }
};

/**
 * Get color for account type
 */
export const getAccountTypeColor = (type: string): string => {
  switch (type) {
    case 'bank_account':
      return semanticColors.accountBankAccount;
    case 'credit_card':
      return semanticColors.accountCreditCard;
    case 'cash':
      return semanticColors.accountCash;
    case 'savings':
      return semanticColors.accountSavings;
    case 'investment':
      return semanticColors.accountInvestment;
    default:
      return semanticColors.accountOther;
  }
};
