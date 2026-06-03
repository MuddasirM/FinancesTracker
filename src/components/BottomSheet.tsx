import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/useTheme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  snapHeight?: number;
  style?: ViewStyle;
  scrollable?: boolean;
}

export function BottomSheet({ visible, onDismiss, children, snapHeight = SCREEN_HEIGHT * 0.75, style, scrollable = false }: BottomSheetProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const translateY = useRef(new Animated.Value(snapHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 14 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: snapHeight, duration: 220, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, snapHeight, translateY, backdropOpacity]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onDismiss} statusBarTranslucent>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', opacity: backdropOpacity }}>
          <TouchableWithoutFeedback onPress={onDismiss}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: snapHeight,
              backgroundColor: colors.background.card,
              borderTopWidth: 2,
              borderTopColor: colors.accent.primary,  // retro accent top border
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: colors.border,
              transform: [{ translateY }],
              overflow: 'hidden',
            },
            style,
          ]}>
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs }}>
            <View style={{ width: 32, height: 2, backgroundColor: colors.accent.primary + '60' }} />
          </View>
          {scrollable ? (
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
          ) : children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
