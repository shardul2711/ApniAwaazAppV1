import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Radii } from '../../theme/tokens';

interface TactileSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  accessibilityLabel: string;
}

export const TactileSwitch: React.FC<TactileSwitchProps> = ({
  value,
  onValueChange,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.switchTrack,
        {
          backgroundColor: value ? colors.primaryContainer : colors.surfaceDim,
          justifyContent: value ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <View
        style={[
          styles.switchThumb,
          {
            backgroundColor: colors.surfaceContainerLowest,
          },
        ]}
      >
        <Text
          style={[
            styles.thumbText,
            {
              color: value ? colors.primaryContainer : colors.onSurfaceVariant,
            },
          ]}
        >
          {value ? 'ON' : 'OFF'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchTrack: {
    width: 64,
    height: 38,
    borderRadius: Radii.full,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchThumb: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  thumbText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
