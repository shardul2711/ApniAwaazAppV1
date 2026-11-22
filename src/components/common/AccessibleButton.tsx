import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { HitTargets, Radii } from '../../theme/tokens';

interface AccessibleButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'surface';
  icon?: React.ReactNode;
  disabled?: boolean;
  minHeight?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  minHeight = HitTargets.primaryButton,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors, scaleFont } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceDim;
    switch (variant) {
      case 'primary':
        return colors.primaryContainer;
      case 'secondary':
        return colors.surfaceContainer;
      case 'destructive':
        return colors.errorContainer;
      case 'surface':
        return colors.surfaceContainerLowest;
      default:
        return colors.primaryContainer;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.outline;
    switch (variant) {
      case 'primary':
        return colors.onPrimary;
      case 'secondary':
        return colors.primary;
      case 'destructive':
        return colors.onErrorContainer;
      case 'surface':
        return colors.onSurface;
      default:
        return colors.onPrimary;
    }
  };

  const getBorder = () => {
    if (variant === 'secondary') {
      return { borderWidth: 1, borderColor: colors.outlineVariant };
    }
    if (variant === 'surface') {
      return { borderWidth: 1, borderColor: colors.borderDefault };
    }
    return {};
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          minHeight,
          borderRadius: Radii.md,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          ...getBorder(),
        },
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.label,
          {
            color: getTextColor(),
            fontSize: scaleFont(18),
            fontWeight: '600',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    marginRight: 10,
  },
  label: {
    textAlign: 'center',
  },
});
