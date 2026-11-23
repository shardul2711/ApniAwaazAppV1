import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAppStore } from '../../src/store/useAppStore';
import { getTranslation } from '../../src/i18n';
import { AccessibleHeader } from '../../src/components/common/AccessibleHeader';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { TactileSwitch } from '../../src/components/common/TactileSwitch';
import { DemoBanner } from '../../src/components/common/DemoBanner';
import { speechService } from '../../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../../src/theme/tokens';
import { TextScale, SpeechSpeed, LanguageCode } from '../../src/types';

export default function HelpSettingsScreen() {
  const {
    colors,
    language,
    setLanguage,
    textScale,
    setTextScale,
    speechSpeed,
    setSpeechSpeed,
    highContrast,
    setHighContrast,
    scaleFont,
  } = useTheme();

  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleTestVoice = () => {
    const rate = speechSpeed === 'slow' ? 0.75 : speechSpeed === 'fast' ? 1.1 : 0.9;
    const sampleText =
      language === 'hi'
        ? 'नमस्ते! यह अपनी आवाज़ की बोलने की गति का नमूना है।'
        : language === 'mr'
        ? 'नमस्कार! हा आपली आवाजच्या बोलण्याचा वेग आहे.'
        : 'Hello! This is a voice sample from Apni Awaaz.';
    speechService.speak(sampleText, language, rate);
  };

  const textScales: { id: TextScale; label: string }[] = [
    { id: 'standard', label: t.standardText },
    { id: 'large', label: t.largeText },
    { id: 'xlarge', label: t.extraLargeText },
  ];

  const speechSpeeds: { id: SpeechSpeed; label: string }[] = [
    { id: 'slow', label: t.slowSpeed },
    { id: 'normal', label: t.normalSpeed },
    { id: 'fast', label: t.fastSpeed },
  ];

  const languages: { id: LanguageCode; label: string; native: string }[] = [
    { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { id: 'mr', label: 'Marathi', native: 'मराठी' },
    { id: 'en', label: 'English', native: 'English' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      <AccessibleHeader title={t.settingsAndHelp} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]}>
        <DemoBanner />

        <View style={styles.headingSection}>
          <Text style={[styles.title, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
            {t.settingsAndHelp}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 2 }}>
            {language === 'hi' ? 'अपनी सुविधा के अनुसार अक्षरों और आवाज़ को बदलें' : language === 'mr' ? 'आपल्या सोयीनुसार अक्षरे आणि आवाज बदला' : 'Customize text readability and voice speed'}
          </Text>
        </View>

        {/* 1. Dynamic Text Sizing */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          <View style={styles.cardHeaderRow}>
            <MaterialIcons name="format-size" size={24} color={colors.primaryContainer} />
            <Text style={[styles.cardTitle, { color: colors.onSurface, fontSize: scaleFont(19) }]}>
              {t.textSize}
            </Text>
          </View>
          <Text style={{ color: colors.secondary, fontSize: scaleFont(14), marginBottom: 12 }}>
            {language === 'hi' ? 'अक्षरों को छोटा या बड़ा करें' : 'Change font scaling across all screens'}
          </Text>

          <View style={styles.optionButtonGroup}>
            {textScales.map((opt) => (
              <Pressable
                key={opt.id}
                onPress={() => setTextScale(opt.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: textScale === opt.id ? colors.primaryContainer : colors.surfaceContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: textScale === opt.id ? colors.onPrimary : colors.onSurface,
                      fontSize: scaleFont(16),
                      fontWeight: textScale === opt.id ? '700' : '500',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Live Preview Box */}
          <View style={[styles.previewBox, { backgroundColor: colors.surfaceContainerLow }]}>
            <Text style={[styles.previewSample, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
              {language === 'hi' ? 'नमूना: यह पढ़ने में आरामदायक है।' : language === 'mr' ? 'नमुना: हे वाचायला सोपे आहे.' : 'Sample: This text is clear and readable.'}
            </Text>
          </View>
        </View>

        {/* 2. Speech Speed & Voice Test */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          <View style={styles.cardHeaderRow}>
            <MaterialIcons name="speed" size={24} color={colors.primaryContainer} />
            <Text style={[styles.cardTitle, { color: colors.onSurface, fontSize: scaleFont(19) }]}>
              {t.speechSpeed}
            </Text>
          </View>
          <Text style={{ color: colors.secondary, fontSize: scaleFont(14), marginBottom: 12 }}>
            {language === 'hi' ? 'सहायक के बोलने की गति' : 'Pacing of spoken voice readouts'}
          </Text>

          <View style={styles.optionButtonGroup}>
            {speechSpeeds.map((opt) => (
              <Pressable
                key={opt.id}
                onPress={() => setSpeechSpeed(opt.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: speechSpeed === opt.id ? colors.primaryContainer : colors.surfaceContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: speechSpeed === opt.id ? colors.onPrimary : colors.onSurface,
                      fontSize: scaleFont(16),
                      fontWeight: speechSpeed === opt.id ? '700' : '500',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleTestVoice}
            style={[styles.testVoiceBtn, { backgroundColor: colors.surfaceContainer }]}
          >
            <MaterialIcons name="volume-up" size={22} color={colors.primaryContainer} />
            <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(16), fontWeight: '700', marginLeft: 8 }}>
              {language === 'hi' ? 'आवाज़ सुनकर जाँचें (Test Voice)' : language === 'mr' ? 'आवाज ऐकून तपासा' : 'Test Speech Speed'}
            </Text>
          </Pressable>
        </View>

        {/* 3. High Contrast Mode Toggle */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="contrast" size={24} color={colors.primaryContainer} />
                <Text style={[styles.cardTitle, { color: colors.onSurface, fontSize: scaleFont(19) }]}>
                  {t.highContrast}
                </Text>
              </View>
              <Text style={{ color: colors.secondary, fontSize: scaleFont(14), marginTop: 4 }}>
                {language === 'hi' ? 'उच्च दृश्यता और शुद्ध काले अक्षरों के लिए' : 'Pure black/white maximum contrast for low-vision eyes'}
              </Text>
            </View>

            <TactileSwitch
              value={highContrast}
              onValueChange={setHighContrast}
              accessibilityLabel={t.highContrast}
            />
          </View>
        </View>

        {/* 4. Language Selection */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          <View style={styles.cardHeaderRow}>
            <MaterialIcons name="language" size={24} color={colors.primaryContainer} />
            <Text style={[styles.cardTitle, { color: colors.onSurface, fontSize: scaleFont(19) }]}>
              {language === 'hi' ? 'भाषा (Language)' : 'Language (भाषा)'}
            </Text>
          </View>

          <View style={styles.optionButtonGroup}>
            {languages.map((l) => (
              <Pressable
                key={l.id}
                onPress={() => setLanguage(l.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: language === l.id ? colors.primaryContainer : colors.surfaceContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: language === l.id ? colors.onPrimary : colors.onSurface,
                      fontSize: scaleFont(16),
                      fontWeight: language === l.id ? '700' : '500',
                    },
                  ]}
                >
                  {l.native}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 5. Wispr Flow Voice Dictation Setup Guide */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          <View style={styles.cardHeaderRow}>
            <MaterialIcons name="graphic-eq" size={24} color={colors.primaryContainer} />
            <Text style={[styles.cardTitle, { color: colors.onSurface, fontSize: scaleFont(19) }]}>
              {t.wisprFlowTitle}
            </Text>
          </View>
          <Text style={{ color: colors.secondary, fontSize: scaleFont(14), marginTop: 2, marginBottom: 10 }}>
            {t.wisprFlowSubtitle}
          </Text>

          <View style={[styles.previewBox, { backgroundColor: colors.surfaceContainerLow }]}>
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), lineHeight: 22, marginBottom: 4 }}>
              {t.wisprFlowStep1}
            </Text>
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), lineHeight: 22, marginBottom: 4 }}>
              {t.wisprFlowStep2}
            </Text>
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), lineHeight: 22, marginBottom: 4 }}>
              {t.wisprFlowStep3}
            </Text>
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), lineHeight: 22, marginBottom: 4 }}>
              {t.wisprFlowStep4}
            </Text>
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), lineHeight: 22, marginBottom: 4 }}>
              {t.wisprFlowStep5}
            </Text>
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), lineHeight: 22 }}>
              {t.wisprFlowStep6}
            </Text>
          </View>

          <Pressable
            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.wispr.flowapp')}
            style={[styles.testVoiceBtn, { backgroundColor: colors.primaryContainer, marginTop: 12 }]}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={t.wisprFlowInstallBtn}
          >
            <MaterialIcons name="open-in-new" size={20} color={colors.onPrimary} />
            <Text style={{ color: colors.onPrimary, fontSize: scaleFont(15), fontWeight: '700', marginLeft: 8 }}>
              {t.wisprFlowInstallBtn}
            </Text>
          </Pressable>
        </View>

        {/* 5. Navigation Links: Family Setup Portal & Activity Log */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          <Pressable
            onPress={() => router.push('/setup')}
            style={styles.navRowItem}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="family-restroom" size={26} color={colors.primaryContainer} />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '700' }}>
                  {language === 'hi' ? 'परिवार साथी पोर्टल' : language === 'mr' ? 'कुटुंब सोबती पोर्टल' : 'Family Companion Setup'}
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(13) }}>
                  Configure what Apni Awaaz can do
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={colors.outline} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/activity')}
            style={[styles.navRowItem, { borderTopWidth: 1, borderTopColor: colors.borderDefault }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="history" size={26} color={colors.primaryContainer} />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '700' }}>
                  {language === 'hi' ? 'हाल की गतिविधियाँ (Activity Log)' : 'Recent Activity Log'}
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(13) }}>
                  Past bookings, reminders, and orders
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={colors.outline} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/login')}
            style={[styles.navRowItem, { borderTopWidth: 1, borderTopColor: colors.borderDefault }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="lock" size={26} color={colors.primaryContainer} />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '700' }}>
                  {language === 'hi' ? 'लॉगिन / सत्यापन स्क्रीन देखें' : 'View Login & OTP Screen'}
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(13) }}>
                  Screen 1 interactive verification flow
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={colors.outline} />
          </Pressable>
        </View>

        {/* 6. About App & Trust Information */}
        <View style={styles.aboutFooter}>
          <Text style={{ color: colors.primary, fontSize: scaleFont(16), fontWeight: '700' }}>
            {t.appName}
          </Text>
          <Text style={{ color: colors.secondary, fontSize: scaleFont(14), marginTop: 2 }}>
            {t.tagline}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(13), marginTop: 4 }}>
            {t.appVersion}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headingSection: {
    marginVertical: 12,
  },
  title: {
    fontWeight: '700',
  },
  settingsCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: '700',
    marginLeft: 8,
  },
  optionButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  optionText: {
    textAlign: 'center',
  },
  previewBox: {
    padding: 14,
    borderRadius: Radii.default,
    marginTop: 10,
  },
  previewSample: {
    fontWeight: '500',
    textAlign: 'center',
  },
  testVoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radii.md,
    marginTop: 8,
    minHeight: 48,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  aboutFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
});
