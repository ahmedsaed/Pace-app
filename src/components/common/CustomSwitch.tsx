/**
 * CustomSwitch Component
 * Android-style pill switch with primary color when active
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { darkColors } from '../../utils/colors';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.track,
        value ? styles.trackActive : styles.trackInactive,
        disabled && styles.trackDisabled,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          value ? styles.thumbActive : styles.thumbInactive,
          { transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 2,
  },
  trackActive: {
    backgroundColor: darkColors.primary,
    borderColor: darkColors.primary,
  },
  trackInactive: {
    backgroundColor: 'transparent',
    borderColor: darkColors.border,
  },
  trackDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  thumbActive: {
    backgroundColor: darkColors.background,
  },
  thumbInactive: {
    backgroundColor: darkColors.textSecondary,
  },
});
