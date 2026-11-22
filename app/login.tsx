import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeContext';
import { getTranslation } from '../src/i18n';
import { AccessibleButton } from '../src/components/common/AccessibleButton';
import { DemoBanner } from '../src/components/common/DemoBanner';
import { speechService } from '../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../src/theme/tokens';

export default function LoginScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentTab, setCurrentTab] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('98201 45678');
  const [otpDigits, setOtpDigits] = useState(['5', '2', '8', '4', '', '']);
  const [showError, setShowError] = useState(false);
  const [countdown, setCountdown] = useState(24);

  const handleAudioAssist = () => {
    const text =
      currentTab === 'phone'
        ? language === 'hi'
          ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें या बोलकर बताएं।'
          : 'Please enter or speak your 10-digit mobile number.'
        : language === 'hi'
        ? 'आपके मोबाइल नंबर पर भेजा गया 6 अंकों का कोड दर्ज करें।'
        : 'Enter the 6-digit verification code sent to your mobile.';
    speechService.speak(text, language);
  };

  const handleSendCode = () => {
    if (!phoneNumber.trim()) return;
    setCurrentTab('otp');
    speechService.speak(
      language === 'hi' ? 'सत्यापन कोड भेजा गया है।' : 'Verification code sent.',
      language
    );
  };

  const handleVerifyOtp = () => {
    speechService.stopSpeaking();
    // Verification success
    router.replace('/(tabs)');
  };

  const handleVoiceCallCode = () => {
    speechService.speak(
      language === 'hi'
        ? 'फ़ोन कॉल द्वारा कोड भेजा जा रहा है। आपका कोड है: पाँच, दो, आठ, चार, एक, शून्य।'
        : 'Calling with your verification code. Code is: 5, 2, 8, 4, 1, 0.',
      language
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      {/* Top Header Bar */}
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
        <Text style={[styles.headerTitle, { color: colors.primary, fontSize: scaleFont(20) }]}>
          {t.appName}
        </Text>
        <Pressable
          onPress={handleAudioAssist}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Audio assist guide"
          style={[styles.audioAssistBtn, { backgroundColor: colors.surfaceContainer }]}
        >
          <MaterialIcons name="volume-up" size={24} color={colors.primaryContainer} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 }]}>
        <DemoBanner />

        {/* Brand Banner */}
        <View style={styles.brandHero}>
          <View style={[styles.logoBox, { backgroundColor: colors.surfaceContainer }]}>
            <MaterialIcons name="graphic-eq" size={32} color={colors.primaryContainer} />
          </View>
          <View style={{ marginLeft: 14 }}>
            <Text style={[styles.brandName, { color: colors.primary, fontSize: scaleFont(24) }]}>
              {t.appName}
            </Text>
            <View style={[styles.pillTag, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="mic" size={14} color={colors.primaryContainer} />
              <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(13), fontWeight: '700', marginLeft: 4 }}>
                {t.voiceForElders}
              </Text>
            </View>
          </View>
        </View>

        {/* State Tab Switcher Pill */}
        <View style={[styles.tabSwitcher, { backgroundColor: colors.surfaceContainer }]}>
          <Pressable
            onPress={() => setCurrentTab('phone')}
            style={[
              styles.tabBtn,
              {
                backgroundColor: currentTab === 'phone' ? colors.surfaceContainerLowest : 'transparent',
              },
            ]}
          >
            <View style={[styles.stepNum, { backgroundColor: colors.primaryContainer }]}>
              <Text style={{ color: colors.onPrimary, fontSize: 12, fontWeight: '700' }}>1</Text>
            </View>
            <Text
              style={{
                color: currentTab === 'phone' ? colors.primaryContainer : colors.secondary,
                fontWeight: currentTab === 'phone' ? '700' : '500',
                fontSize: scaleFont(15),
              }}
            >
              Enter Number
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setCurrentTab('otp')}
            style={[
              styles.tabBtn,
              {
                backgroundColor: currentTab === 'otp' ? colors.surfaceContainerLowest : 'transparent',
              },
            ]}
          >
            <View style={[styles.stepNum, { backgroundColor: currentTab === 'otp' ? colors.primaryContainer : colors.secondary }]}>
              <Text style={{ color: colors.onPrimary, fontSize: 12, fontWeight: '700' }}>2</Text>
            </View>
            <Text
              style={{
                color: currentTab === 'otp' ? colors.primaryContainer : colors.secondary,
                fontWeight: currentTab === 'otp' ? '700' : '500',
                fontSize: scaleFont(15),
              }}
            >
              Enter OTP
            </Text>
          </Pressable>
        </View>

        {/* Main Card Surface */}
        <View style={[styles.mainCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
          {/* VIEW A: Phone Number */}
          {currentTab === 'phone' && (
            <View>
              <Text style={[styles.cardTitle, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
                {t.welcomeBack}
              </Text>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 4, marginBottom: 18 }}>
                {t.loginSubtitle}
              </Text>

              {/* Number Input with India +91 badge */}
              <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '600', marginBottom: 6 }}>
                {t.mobileNumber} <Text style={{ color: colors.secondary, fontWeight: '400' }}>(+91)</Text>
              </Text>

              <View style={[styles.phoneInputRow, { borderColor: colors.inputBorder, backgroundColor: colors.surfaceContainerLowest }]}>
                <View style={[styles.countryCodeBadge, { backgroundColor: colors.surfaceContainer }]}>
                  <Text style={{ fontSize: 18 }}>🇮🇳</Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '700', marginLeft: 4 }}>
                    +91
                  </Text>
                </View>
                <TextInput
                  style={[styles.phoneInput, { color: colors.onSurface, fontSize: scaleFont(19) }]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="98765 43210"
                  maxLength={12}
                />
                <Pressable
                  onPress={() => setPhoneNumber('98201 45678')}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Speak mobile number"
                  style={styles.micInputBtn}
                >
                  <MaterialIcons name="mic" size={24} color={colors.primaryContainer} />
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
                <MaterialIcons name="sms" size={18} color={colors.secondary} />
                <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14), marginLeft: 6 }}>
                  {t.smsNotice}
                </Text>
              </View>

              {/* Reassurance Callout */}
              <View style={[styles.reassuranceBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <MaterialIcons name="family-restroom" size={22} color={colors.primaryContainer} />
                <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14), flex: 1, marginLeft: 8 }}>
                  Returning family members go directly to elder home screen once verified.
                </Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <AccessibleButton
                  label={t.sendCode}
                  variant="primary"
                  icon={<MaterialIcons name="arrow-forward" size={22} color={colors.onPrimary} />}
                  onPress={handleSendCode}
                />
                <Pressable
                  onPress={() => router.push('/signup')}
                  style={{ alignItems: 'center', paddingVertical: 14 }}
                >
                  <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(16), fontWeight: '700', textDecorationLine: 'underline' }}>
                    {t.newAccountQuestion}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* VIEW B: OTP Verification */}
          {currentTab === 'otp' && (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.cardTitle, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
                  {t.verifyYourNumber}
                </Text>
                <View style={[styles.stepBadge, { backgroundColor: colors.primaryFixed }]}>
                  <Text style={{ color: colors.onPrimaryFixed, fontSize: 12, fontWeight: '700' }}>Step 2 of 2</Text>
                </View>
              </View>

              {/* Masked recipient pill */}
              <View style={[styles.maskedPill, { backgroundColor: colors.surfaceContainerLow }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="smartphone" size={20} color={colors.primaryContainer} />
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '600', marginLeft: 6 }}>
                    +91 {phoneNumber.slice(0, 5)} •••••
                  </Text>
                </View>
                <Pressable onPress={() => setCurrentTab('phone')}>
                  <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(14), fontWeight: '700', textDecorationLine: 'underline' }}>
                    {t.changeDetails}
                  </Text>
                </Pressable>
              </View>

              {/* In-context alert example */}
              {showError && (
                <View style={[styles.errorBanner, { backgroundColor: colors.errorContainer }]}>
                  <MaterialIcons name="error" size={22} color={colors.error} />
                  <Text style={{ color: colors.error, fontSize: scaleFont(14), fontWeight: '600', marginLeft: 8, flex: 1 }}>
                    {t.incorrectCode}
                  </Text>
                </View>
              )}

              {/* 6-box OTP Tactile Input representation */}
              <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '600', marginTop: 16, marginBottom: 8 }}>
                {t.verificationCode}
              </Text>
              <View style={styles.otpGrid}>
                {otpDigits.map((digit, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.otpBox,
                      {
                        backgroundColor: digit ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                        borderColor: digit ? colors.primaryContainer : colors.outlineVariant,
                        borderWidth: digit ? 2 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.otpDigitText, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
                      {digit || '•'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Resend and Voice Assistance options */}
              <View style={styles.resendRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="timer" size={18} color={colors.secondary} />
                  <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14), marginLeft: 4 }}>
                    {t.resendIn} <Text style={{ fontWeight: '700', color: colors.onSurface }}>{countdown}s</Text>
                  </Text>
                </View>
                <Pressable onPress={() => setCountdown(30)}>
                  <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(15), fontWeight: '700', textDecorationLine: 'underline' }}>
                    {t.resendCode}
                  </Text>
                </Pressable>
              </View>

              <View style={{ marginTop: 20 }}>
                <AccessibleButton
                  label={t.verifyAndProceed}
                  variant="primary"
                  icon={<MaterialIcons name="verified-user" size={22} color={colors.onPrimary} />}
                  onPress={handleVerifyOtp}
                />
                <AccessibleButton
                  label={t.callWithCode}
                  variant="secondary"
                  icon={<MaterialIcons name="phone-in-talk" size={20} color={colors.primaryContainer} />}
                  onPress={handleVoiceCallCode}
                />
              </View>
            </View>
          )}
        </View>

        {/* Trust Footer */}
        <View style={styles.trustFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="shield" size={18} color={colors.primaryContainer} />
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14), fontWeight: '600', marginLeft: 6 }}>
              Safe, multigenerational family protection
            </Text>
          </View>
          <Text style={{ color: colors.secondary, fontSize: scaleFont(13), textAlign: 'center', marginTop: 4 }}>
            Apni Awaaz simplifies daily tasks, medication alerts, and calls using natural Indian voices.
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
  audioAssistBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  brandHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontWeight: '700',
  },
  pillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  tabSwitcher: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Radii.md,
    marginVertical: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radii.default,
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  mainCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 20,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: '700',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Radii.md,
    minHeight: HitTargets.primaryButton,
    paddingHorizontal: 6,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.sm,
    marginRight: 6,
  },
  phoneInput: {
    flex: 1,
    minHeight: 48,
    fontWeight: '600',
  },
  micInputBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reassuranceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radii.md,
  },
  stepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  maskedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: Radii.md,
    marginVertical: 10,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: Radii.md,
    marginVertical: 8,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigitText: {
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  trustFooter: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
});
