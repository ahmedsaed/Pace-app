/**
 * BottomSheetModal Component
 * Reusable bottom sheet with swipe-to-dismiss using @gorhom/bottom-sheet
 */

import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { darkColors } from '../../utils/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../styles/theme';

export interface BottomSheetModalRef {
  present: () => void;
  dismiss: () => void;
}

interface BottomSheetModalProps {
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  snapPoints?: string[];
  onClose?: () => void;
}

export const BottomSheetModalComponent = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(
  ({ title, children, showCloseButton = true, snapPoints, onClose }, ref) => {
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    
    // Default snap points
    const defaultSnapPoints = useMemo(() => snapPoints || ['75%', '90%'], [snapPoints]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      present: () => bottomSheetRef.current?.expand(),
      dismiss: () => bottomSheetRef.current?.close(),
    }));

    // Backdrop component
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.7}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1 && onClose) {
        onClose();
      }
    }, [onClose]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={defaultSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={styles.contentContainer}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity 
                  onPress={() => bottomSheetRef.current?.close()} 
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <BottomSheetScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

BottomSheetModalComponent.displayName = 'BottomSheetModal';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: darkColors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  handleIndicator: {
    backgroundColor: darkColors.border,
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
