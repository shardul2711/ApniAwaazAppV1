import React, { useState } from 'react';
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
import { getTranslation } from '../src/i18n';
import { AccessibleButton } from '../src/components/common/AccessibleButton';
import { AccessibleInput } from '../src/components/common/AccessibleInput';
import { DemoBanner } from '../src/components/common/DemoBanner';
import { speechService } from '../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../src/theme/tokens';

export default function SignUpScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [caregiverName, setCaregiverName] = useState('Ananya Sharma');
  const [caregiverPhone, setCaregiverPhone] = useState('98712 34560');

  const handleVoiceFillName = () => {
    speechService.speak(
      language === 'hi' ? 'बोलकर अपना नाम दर्ज करें।' : 'Speak your full name.',
      language
    );
    setCaregiverName('Ananya Sharma');
  };

  const handleProceed = () => {
    router.push('/setup');
  };

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
          Aawaz Se Jodein
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 }]}>
        <DemoBanner />

        {/* Brand Sub-Header */}
        <View style={styles.brandHero}>
          <View style={[styles.logoBox, { backgroundColor: colors.surfaceContainer }]}>
            <MaterialIcons name="family-restroom" size={28} color={colors.primaryContainer} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(16), fontWeight: '700' }}>
              {t.appName}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14) }}>
              {t.parivaarPortal}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={{ marginVertical: 8 }}>
          <Text style={[styles.title, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
            Create your account
          </Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 2 }}>
            You’ll choose what Apni Awaaz can help your family member do.
          </Text>
        </View>

        {/* Step Banner */}
        <View style={[styles.stepBanner, { backgroundColor: colors.surfaceContainerHigh }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="elderly" size={22} color={colors.primaryContainer} />
            <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(14), fontWeight: '700', marginLeft: 6 }}>
              Step 1 of 2: Family / Caregiver
            </Text>
          </View>
          <View style={[styles.percentBadge, { backgroundColor: colors.surfaceContainerLowest }]}>
            <Text style={{ color: colors.onSurface, fontSize: 12, fontWeight: '700' }}>50%</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          <AccessibleInput
            label="Your full name"
            value={caregiverName}
            onChangeText={setCaregiverName}
            placeholder="e.g. Ananya Sharma"
            hint="As the account manager, you can update voice shortcuts anytime."
            onMicPress={handleVoiceFillName}
          />

          <AccessibleInput
            label="Mobile number"
            value={caregiverPhone}
            onChangeText={setCaregiverPhone}
            placeholder="98712 34560"
            prefix="+91"
            keyboardType="phone-pad"
          />

          <View style={[styles.infoBox, { backgroundColor: colors.surfaceContainerLow }]}>
            <MaterialIcons name="info" size={22} color={colors.primaryContainer} />
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14), marginLeft: 8, flex: 1 }}>
              Keep account holder details separate from your elder's details (you will configure their profile in the next step).
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <AccessibleButton
              label={t.continue}
              variant="primary"
              icon={<MaterialIcons name="arrow-forward" size={22} color={colors.onPrimary} />}
              onPress={handleProceed}
            />
          </View>
        </View>

        {/* Next Step Preview */}
        <Pressable
          onPress={handleProceed}
          style={[styles.nextPreview, { backgroundColor: colors.surfaceContainer }]}
        >
          <View style={[styles.previewIconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
            <MaterialIcons name="tune" size={24} color={colors.primaryContainer} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '700' }}>
              Next step: Family Setup
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(13) }}>
              Preferred language & elder voice profile
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.primaryContainer} />
        </Pressable>
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
  brandHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
  },
  stepBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.md,
    marginVertical: 10,
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  formCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 20,
    marginVertical: 8,
    elevation: 3,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radii.md,
    marginTop: 8,
  },
  nextPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radii.lg,
    marginTop: 16,
  },
  previewIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
