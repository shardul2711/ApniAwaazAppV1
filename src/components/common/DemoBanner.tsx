import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Radii } from '../../theme/tokens';

export const DemoBanner: React.FC = () => {
  const { colors, scaleFont } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
      <MaterialIcons name="shield" size={16} color={colors.primaryContainer} style={styles.icon} />
      <Text style={[styles.text, { color: colors.onSurfaceVariant, fontSize: scaleFont(13) }]}>
        Safe Demo Mode · No real payments or bookings are made
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: Radii.full,
    marginVertical: 4,
    alignSelf: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
});
