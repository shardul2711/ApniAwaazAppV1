import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { getTranslation } from '../../src/i18n';
import { Radii } from '../../src/theme/tokens';

export default function TabLayout() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderDefault,
          borderTopWidth: 1,
          height: 72 + (insets.bottom > 0 ? insets.bottom - 4 : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
          ...Platform.select({
            ios: {
              shadowColor: '#075B52',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarActiveTintColor: colors.primaryContainer,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: scaleFont(14),
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabToday,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="calendar-today"
              size={26}
              color={focused ? colors.primaryContainer : colors.onSurfaceVariant}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="medicine"
        options={{
          title: t.tabMedicine,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="medication"
              size={26}
              color={focused ? colors.primaryContainer : colors.onSurfaceVariant}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: t.tabSpeak,
          tabBarIcon: () => null,
          tabBarButton: (props) => {
            const { ref, ...rest } = props as any;
            return (
              <Pressable
                {...rest}
                style={styles.floatingCenterContainer}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${t.speak} - ${t.tapToSpeak}`}
              >
                <View
                  style={[
                    styles.floatingOrb,
                    {
                      backgroundColor: colors.primaryContainer,
                    },
                  ]}
                >
                  <MaterialIcons name="mic" size={36} color={colors.onPrimary} />
                </View>
                <Text
                  style={[
                    styles.floatingLabel,
                    {
                      color: colors.primaryContainer,
                      fontSize: scaleFont(14),
                    },
                  ]}
                >
                  {t.tabSpeak}
                </Text>
              </Pressable>
            );
          },
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: t.tabFamily,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="family-restroom"
              size={26}
              color={focused ? colors.primaryContainer : colors.onSurfaceVariant}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: t.tabHelp,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="settings-accessibility"
              size={26}
              color={focused ? colors.primaryContainer : colors.onSurfaceVariant}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingCenterContainer: {
    top: -24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  floatingOrb: {
    width: 68,
    height: 68,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#075B52',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  floatingLabel: {
    fontWeight: '700',
    marginTop: 4,
  },
});
