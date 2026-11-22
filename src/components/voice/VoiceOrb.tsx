import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { VoiceState } from '../../types';
import { HitTargets, Radii } from '../../theme/tokens';
import { getTranslation } from '../../i18n';

interface VoiceOrbProps {
  state: VoiceState;
  onPress: () => void;
  size?: number;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  onPress,
  size = HitTargets.heroOrb,
}) => {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const outerRingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'listening') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      const outerRing = Animated.loop(
        Animated.sequence([
          Animated.timing(outerRingAnim, {
            toValue: 1.25,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(outerRingAnim, {
            toValue: 1.0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      pulse.start();
      outerRing.start();

      return () => {
        pulse.stop();
        outerRing.stop();
      };
    } else {
      pulseAnim.setValue(1);
      outerRingAnim.setValue(1);
    }
  }, [state]);

  const isListening = state === 'listening';
  const isProcessing = state === 'processing';

  return (
    <View style={[styles.container, { width: size + 40, height: size + 40 }]}>
      {/* Outer Acoustic Ripple Ring 2 */}
      {isListening && (
        <Animated.View
          style={[
            styles.haloRing,
            {
              width: size + 36,
              height: size + 36,
              borderRadius: Radii.full,
              backgroundColor: colors.primaryContainer,
              opacity: 0.12,
              transform: [{ scale: outerRingAnim }],
            },
          ]}
        />
      )}

      {/* Outer Acoustic Ripple Ring 1 */}
      {isListening && (
        <Animated.View
          style={[
            styles.haloRing,
            {
              width: size + 18,
              height: size + 18,
              borderRadius: Radii.full,
              backgroundColor: colors.primaryContainer,
              opacity: 0.22,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Hero Circular Voice Button */}
      <Pressable
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          isListening ? t.stopAndReview : `${t.speak} - ${t.tapToSpeakHint}`
        }
        accessibilityState={{ busy: isProcessing }}
        style={({ pressed }) => [
          styles.orbButton,
          {
            width: size,
            height: size,
            borderRadius: Radii.full,
            backgroundColor: isListening ? '#086054' : colors.primaryContainer,
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <MaterialIcons
          name={
            isListening
              ? 'graphic-eq'
              : isProcessing
              ? 'hourglass-empty'
              : 'mic'
          }
          size={56}
          color={colors.onPrimary}
          style={styles.micIcon}
        />
        <Text
          style={[
            styles.orbLabel,
            {
              color: colors.onPrimary,
              fontSize: scaleFont(24),
            },
          ]}
        >
          {isListening ? t.listening : isProcessing ? '...' : t.speak}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  haloRing: {
    position: 'absolute',
  },
  orbButton: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#075B52',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  micIcon: {
    marginBottom: 4,
  },
  orbLabel: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
