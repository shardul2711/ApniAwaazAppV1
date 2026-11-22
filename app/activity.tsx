import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeContext';
import { useAppStore } from '../src/store/useAppStore';
import { getTranslation } from '../src/i18n';
import { StatusBadge } from '../src/components/common/StatusBadge';
import { DemoBanner } from '../src/components/common/DemoBanner';
import { Radii } from '../src/theme/tokens';

export default function ActivityScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { activities } = useAppStore();

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.borderDefault }]}>
        <Pressable
          onPress={() => router.back()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t.back}
          style={styles.backBtn}
        >
          <MaterialIcons name="arrow-back" size={28} color={colors.onSurface} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.onSurface, fontSize: scaleFont(20) }]}>
          {language === 'hi' ? 'हाल की गतिविधियाँ' : language === 'mr' ? 'अलीकडील हालचाली' : 'Recent Activity'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 }]}>
        <DemoBanner />

        <View style={{ marginVertical: 8 }}>
          <Text style={[styles.heading, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
            {language === 'hi' ? 'गतिविधि इतिहास' : language === 'mr' ? 'इतिहास' : 'Activity Audit'}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 2, marginBottom: 14 }}>
            Past bookings, reminders, and confirmations
          </Text>
        </View>

        {activities.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <MaterialIcons name="history" size={48} color={colors.outline} />
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '600', marginTop: 12 }}>
              No recent activity yet.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {activities.map((act) => (
              <View
                key={act.id}
                style={[styles.activityCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
              >
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                  <MaterialIcons name={(act.icon || 'check-circle') as any} size={28} color={colors.primaryContainer} />
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.actTitle, { color: colors.onSurface, fontSize: scaleFont(17) }]}>
                    {act.title}
                  </Text>
                  <Text style={{ color: colors.secondary, fontSize: scaleFont(14), marginTop: 2 }}>
                    {act.subtitle}
                  </Text>
                  <Text style={{ color: colors.outline, fontSize: scaleFont(12), marginTop: 4 }}>
                    {act.timestamp}
                  </Text>
                </View>

                <StatusBadge
                  label={act.status === 'succeeded' ? 'Completed' : act.status}
                  variant={act.status === 'succeeded' ? 'completed' : 'ready'}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  heading: {
    fontWeight: '700',
  },
  emptyBox: {
    padding: 32,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actTitle: {
    fontWeight: '700',
  },
});
