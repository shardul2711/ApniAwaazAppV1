import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardTypeOptions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { HitTargets, Radii } from '../../theme/tokens';

interface AccessibleInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hint?: string;
  prefix?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  onMicPress?: () => void;
  accessibilityLabel?: string;
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  prefix,
  keyboardType = 'default',
  maxLength,
  onMicPress,
  accessibilityLabel,
}) => {
  const { colors, scaleFont } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.onSurface, fontSize: scaleFont(17) }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderColor: colors.inputBorder,
          },
        ]}
      >
        {prefix ? (
          <View style={[styles.prefixBadge, { backgroundColor: colors.surfaceContainer }]}>
            <Text style={[styles.prefixText, { color: colors.onSurface, fontSize: scaleFont(17) }]}>
              {prefix}
            </Text>
          </View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.onSurface,
              fontSize: scaleFont(18),
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.outline}
          keyboardType={keyboardType}
          maxLength={maxLength}
          accessible={true}
          accessibilityLabel={accessibilityLabel || label}
        />

        {onMicPress && (
          <Pressable
            onPress={onMicPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Speak value for ${label}`}
            style={({ pressed }) => [
              styles.micButton,
              { backgroundColor: pressed ? colors.surfaceContainerHigh : 'transparent' },
            ]}
          >
            <MaterialIcons name="mic" size={24} color={colors.primaryContainer} />
          </Pressable>
        )}
      </View>
      {hint ? (
        <Text style={[styles.hint, { color: colors.onSurfaceVariant, fontSize: scaleFont(14) }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: HitTargets.primaryButton,
    borderWidth: 2,
    borderRadius: Radii.md,
    paddingHorizontal: 8,
  },
  prefixBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.sm,
    marginRight: 8,
  },
  prefixText: {
    fontWeight: '700',
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 8,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
