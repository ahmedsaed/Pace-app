/**
 * Modal Component
 * Reusable modal/bottom sheet
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  fullScreen = false,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.centeredContainer}>
        <View style={[styles.modalContainer, fullScreen && styles.modalFullScreen]}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: darkColors.background,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalFullScreen: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: darkColors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeText: {
    fontSize: fontSize.xxl,
    color: darkColors.textSecondary,
    fontWeight: '300' as any,
  },
  content: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    flexGrow: 1,
  },
});
