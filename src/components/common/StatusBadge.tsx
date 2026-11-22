import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Radii } from '../../theme/tokens';

export type BadgeVariant = 'ready' | 'needsSetup' | 'error' | 'active' | 'completed';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'ready',
  iconName,
}) => {
  const { colors, scaleFont } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'ready':
      case 'active':
      case 'completed':
        return { bg: colors.successPillBg, text: colors.successPillText, defaultIcon: 'check' };
      case 'needsSetup':
        return { bg: colors.warningPillBg, text: colors.warningPillText, defaultIcon: 'warning' };
      case 'error':
        return { bg: colors.errorPillBg, text: colors.errorPillText, defaultIcon: 'error' };
      default:
        return { bg: colors.surfaceContainer, text: colors.onSurface, defaultIcon: 'info' };
    }
  };

  const badgeTheme = getColors();
  const icon = iconName || badgeTheme.defaultIcon;

  return (
    <View style={[styles.badge, { backgroundColor: badgeTheme.bg }]}>
      <MaterialIcons
        name={icon as any}
        size={14}
        color={badgeTheme.text}
        style={styles.icon}
      />
      <Text style={[styles.label, { color: badgeTheme.text, fontSize: scaleFont(13) }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
