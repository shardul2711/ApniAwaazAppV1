import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAppStore } from '../../src/store/useAppStore';
import { getTranslation } from '../../src/i18n';
import { AccessibleHeader } from '../../src/components/common/AccessibleHeader';
import { VoiceOrb } from '../../src/components/voice/VoiceOrb';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { DemoBanner } from '../../src/components/common/DemoBanner';
import { parseVoiceIntent } from '../../src/services/api/MockApiClient';
import { speechService } from '../../src/services/speech/SpeechService';
import { VoiceState } from '../../src/types';
import { HitTargets, Radii } from '../../src/theme/tokens';

export default function HomeScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    preferences,
    voiceState,
    setVoiceState,
    transcript,
    setTranscript,
    assistantResponse,
    setAssistantResponse,
    activeAction,
    setActiveAction,
    addActivity,
    resetVoiceSession,
  } = useAppStore();

  const [typedText, setTypedText] = useState('');

  // Start speech recognition flow simulation
  const handleStartSpeaking = () => {
    setVoiceState('listening');
    setTranscript(language === 'hi' ? 'अस्पताल के लिए ऑटो बुक करें...' : language === 'mr' ? 'हॉस्पिटलसाठी रिक्षा बुक करा...' : 'Book an auto to the hospital...');
    
    // Auto proceed to processing after 2.5 seconds
    setTimeout(() => {
      setVoiceState('processing');
      setTimeout(() => {
        const query = transcript || (language === 'hi' ? 'अस्पताल के लिए ऑटो बुक करें' : 'Book an auto to hospital');
        const parsed = parseVoiceIntent(query, language);
        setActiveAction(parsed.action);
        setAssistantResponse(parsed.spokenResponse);
        setVoiceState('review');
        
        // Speak response aloud using Expo Speech
        speechService.speak(parsed.spokenResponse, language);
      }, 1500);
    }, 2500);
  };

  const handleStopAndReview = () => {
    speechService.stopSpeaking();
    setVoiceState('processing');
    setTimeout(() => {
      const parsed = parseVoiceIntent(transcript, language);
      setActiveAction(parsed.action);
      setAssistantResponse(parsed.spokenResponse);
      setVoiceState('review');
      speechService.speak(parsed.spokenResponse, language);
    }, 1000);
  };

  const handleConfirmAction = () => {
    speechService.stopSpeaking();
    if (activeAction) {
      addActivity({
        title: activeAction.title,
        subtitle: activeAction.summary,
        category: activeAction.type === 'book_ride' ? 'ride' : activeAction.type === 'refill_medicine' ? 'medicine' : 'grocery',
        status: 'succeeded',
        icon: activeAction.type === 'book_ride' ? 'local-taxi' : 'check-circle',
      });
    }
    setVoiceState('result');
    const successMsg = language === 'hi' ? 'ऑटो बुक हो गया है! 4 मिनट में आ रहा है।' : language === 'mr' ? 'रिक्षा बुक झाली आहे! ४ मिनिटांत येत आहे.' : 'Auto is booked! Arriving in 4 minutes.';
    speechService.speak(successMsg, language);
  };

  const handleSendTyped = () => {
    if (!typedText.trim()) return;
    setTranscript(typedText);
    setVoiceState('processing');
    const currentTyped = typedText;
    setTypedText('');
    setTimeout(() => {
      const parsed = parseVoiceIntent(currentTyped, language);
      setActiveAction(parsed.action);
      setAssistantResponse(parsed.spokenResponse);
      setVoiceState('review');
      speechService.speak(parsed.spokenResponse, language);
    }, 1200);
  };

  const stateTabs: { id: VoiceState; label: string }[] = [
    { id: 'ready', label: '1. Ready' },
    { id: 'listening', label: '2. Listening' },
    { id: 'processing', label: '3. Processing' },
    { id: 'review', label: '4. Review' },
    { id: 'result', label: '5. Result' },
    { id: 'recovery', label: '6. Recovery' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      <AccessibleHeader />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <DemoBanner />

        {/* Top Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingTitle, { color: colors.onSurface, fontSize: scaleFont(26) }]}>
            {t.greeting}, {preferences.elderName}
          </Text>
          <Text style={[styles.greetingSubtitle, { color: colors.onSurfaceVariant, fontSize: scaleFont(17) }]}>
            {t.tapToSpeakHint}
          </Text>
        </View>

        {/* Interactive State Switcher Demo Pills (from stitch mockup) */}
        <View style={styles.stateSelectorContainer}>
          <View style={styles.stateSelectorHeader}>
            <Text style={[styles.stateSelectorLabel, { color: colors.secondary, fontSize: scaleFont(14) }]}>
              Interactive state demo:
            </Text>
            <View style={styles.liveBadge}>
              <View style={[styles.liveDot, { backgroundColor: colors.primaryContainer }]} />
              <Text style={[styles.liveText, { color: colors.primaryContainer, fontSize: scaleFont(13) }]}>
                Live
              </Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stateTabsScroll}>
            {stateTabs.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => {
                  speechService.stopSpeaking();
                  setVoiceState(tab.id);
                  if (tab.id === 'review' && !activeAction) {
                    const parsed = parseVoiceIntent('auto', language);
                    setActiveAction(parsed.action);
                  }
                }}
                style={[
                  styles.stateTabPill,
                  {
                    backgroundColor:
                      voiceState === tab.id ? colors.primaryContainer : colors.surfaceContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stateTabText,
                    {
                      color: voiceState === tab.id ? colors.onPrimary : colors.onSurfaceVariant,
                      fontSize: scaleFont(14),
                      fontWeight: voiceState === tab.id ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ======================================================== */}
        {/* DYNAMIC CENTER STAGE AREA FOR THE 6 VOICE STATES */}
        {/* ======================================================== */}

        {/* STATE 1: READY */}
        {voiceState === 'ready' && (
          <View style={styles.centerStage}>
            <Text style={[styles.stagePrompt, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {t.whatCanIHelpWith}
            </Text>

            <VoiceOrb state="ready" onPress={handleStartSpeaking} />

            {/* Prompt Suggestion Card */}
            <View style={[styles.suggestionCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
              <Text style={[styles.suggestionText, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                {t.trySaying}{' '}
                <Text style={{ color: colors.primaryContainer, fontWeight: '700' }}>
                  {t.autoPrompt}
                </Text>
              </Text>
            </View>

            {/* Keyboard fallback toggle */}
            <Pressable
              onPress={() => setVoiceState('recovery')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t.typeFallback}
              style={styles.keyboardFallbackButton}
            >
              <MaterialIcons name="keyboard" size={22} color={colors.primaryContainer} />
              <Text style={[styles.keyboardFallbackText, { color: colors.primaryContainer, fontSize: scaleFont(16) }]}>
                {t.typeFallback}
              </Text>
            </Pressable>
          </View>
        )}

        {/* STATE 2: LISTENING */}
        {voiceState === 'listening' && (
          <View style={styles.centerStage}>
            <View style={styles.listeningHeader}>
              <View style={[styles.pulseDot, { backgroundColor: colors.primaryContainer }]} />
              <Text style={[styles.listeningTitle, { color: colors.primaryContainer, fontSize: scaleFont(24) }]}>
                {t.listening}
              </Text>
            </View>

            <VoiceOrb state="listening" onPress={handleStopAndReview} />

            {/* Live Transcribed Words Card */}
            <View style={[styles.transcriptCard, { backgroundColor: colors.surfaceContainerLow }]}>
              <Text style={[styles.transcriptText, { color: colors.primaryContainer, fontSize: scaleFont(20) }]}>
                “{transcript || '...' }”
              </Text>
            </View>

            {/* Stop Action Button */}
            <AccessibleButton
              label={t.stopAndReview}
              variant="destructive"
              icon={<MaterialIcons name="stop-circle" size={24} color={colors.onErrorContainer} />}
              onPress={handleStopAndReview}
            />
          </View>
        )}

        {/* STATE 3: PROCESSING */}
        {voiceState === 'processing' && (
          <View style={styles.centerStage}>
            <View style={[styles.processingIconContainer, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="hourglass-empty" size={48} color={colors.primaryContainer} />
            </View>

            <Text style={[styles.processingTitle, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {t.checkingRequest}
            </Text>

            <View style={[styles.serviceLookupCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
              <MaterialIcons name="electric-rickshaw" size={32} color={colors.primaryContainer} />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '700' }}>
                  Auto Rickshaw
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15) }}>
                  Checking Green Park area
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                const parsed = parseVoiceIntent('auto', language);
                setActiveAction(parsed.action);
                setVoiceState('review');
              }}
              style={{ marginTop: 24 }}
            >
              <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(16), textDecorationLine: 'underline', fontWeight: '600' }}>
                Skip to review screen →
              </Text>
            </Pressable>
          </View>
        )}

        {/* STATE 4: REVIEW SUMMARY */}
        {voiceState === 'review' && (
          <View style={[styles.reviewCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            {/* Header */}
            <View style={[styles.reviewHeader, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="electric-rickshaw" size={28} color={colors.primaryContainer} />
                <Text style={[styles.reviewTitle, { color: colors.onSurface, fontSize: scaleFont(22) }]}>
                  {activeAction?.title || t.bookAnAuto}
                </Text>
              </View>
              <View style={[styles.pillBadge, { backgroundColor: colors.surfaceContainer }]}>
                <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(13), fontWeight: '700' }}>
                  {t.tripPreview}
                </Text>
              </View>
            </View>

            {/* Audio Reading Indicator */}
            <View style={[styles.audioReadingBar, { backgroundColor: colors.surfaceContainerLow }]}>
              <MaterialIcons name="volume-up" size={22} color={colors.primaryContainer} />
              <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(15), fontWeight: '600', marginLeft: 8 }}>
                {t.readingDetailsAloud}
              </Text>
            </View>

            {/* Detail Breakdown */}
            <View style={styles.reviewDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="trip-origin" size={24} color={colors.primaryContainer} style={styles.detailIcon} />
                <View>
                  <Text style={{ color: colors.secondary, fontSize: scaleFont(14) }}>
                    {t.pickupLocation}
                  </Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '700' }}>
                    {preferences.homeAddress}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons name="location-on" size={24} color={colors.error} style={styles.detailIcon} />
                <View>
                  <Text style={{ color: colors.secondary, fontSize: scaleFont(14) }}>
                    {t.destination}
                  </Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '700' }}>
                    {preferences.hospitalAddress}
                  </Text>
                </View>
              </View>

              <View style={[styles.fareBox, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="payments" size={24} color={colors.tertiaryContainer} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14) }}>
                    {t.estimatedFare}
                  </Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(22), fontWeight: '800' }}>
                    ₹85 - ₹95{' '}
                    <Text style={{ color: colors.secondary, fontSize: scaleFont(15), fontWeight: '400' }}>
                      · {t.cashOrUpi}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Row */}
            <View style={{ marginTop: 16 }}>
              <AccessibleButton
                label={t.confirmAndBook}
                variant="primary"
                icon={<MaterialIcons name="check-circle" size={24} color={colors.onPrimary} />}
                onPress={handleConfirmAction}
              />
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <View style={{ flex: 1 }}>
                  <AccessibleButton
                    label={t.changeDetails}
                    variant="secondary"
                    onPress={() => router.push('/rides')}
                  />
                </View>
                <View style={{ width: 100 }}>
                  <AccessibleButton
                    label={t.cancel}
                    variant="destructive"
                    onPress={resetVoiceSession}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* STATE 5: RESULT / CONFIRMED */}
        {voiceState === 'result' && (
          <View style={[styles.resultCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={[styles.successBadgeCircle, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="check-circle" size={54} color={colors.primaryContainer} />
            </View>

            <Text style={[styles.resultTitle, { color: colors.onSurface, fontSize: scaleFont(26) }]}>
              {t.autoIsBooked}
            </Text>
            <Text style={[styles.resultEta, { color: colors.primaryContainer, fontSize: scaleFont(18) }]}>
              {t.arrivingIn} 4 {t.minutes}
            </Text>

            {/* Driver Info Pill */}
            <View style={[styles.driverPill, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={[styles.driverAvatar, { backgroundColor: colors.primaryContainer }]}>
                <Text style={{ color: colors.onPrimary, fontSize: scaleFont(16), fontWeight: '700' }}>
                  RK
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '700' }}>
                  Ramesh Kumar
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(14) }}>
                  DL 1RN 4482 · Bajaj Auto
                </Text>
              </View>
              <MaterialIcons name="electric-rickshaw" size={32} color={colors.primaryContainer} />
            </View>

            {/* Result Quick Actions */}
            <View style={{ width: '100%', marginTop: 16 }}>
              <AccessibleButton
                label={t.callDriver}
                variant="primary"
                icon={<MaterialIcons name="call" size={24} color={colors.onPrimary} />}
                onPress={() => Linking.openURL('tel:9876543210')}
              />
              <AccessibleButton
                label={t.imReady}
                variant="secondary"
                onPress={resetVoiceSession}
              />
            </View>
          </View>
        )}

        {/* STATE 6: RECOVERY / TYPED FALLBACK */}
        {voiceState === 'recovery' && (
          <View style={[styles.recoveryCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={[styles.recoveryIconCircle, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="hearing-disabled" size={38} color={colors.secondary} />
            </View>

            <Text style={[styles.recoveryTitle, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {t.didntCatchThat}
            </Text>
            <Text style={[styles.recoverySubtitle, { color: colors.onSurfaceVariant, fontSize: scaleFont(16) }]}>
              {t.recoveryPrompt}
            </Text>

            <AccessibleButton
              label={t.retry}
              variant="primary"
              icon={<MaterialIcons name="mic" size={26} color={colors.onPrimary} />}
              onPress={handleStartSpeaking}
            />

            {/* Type Input Box */}
            <View style={styles.typedInputContainer}>
              <View style={[styles.typedInputRow, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.inputBorder }]}>
                <TextInput
                  style={[styles.typedTextInput, { color: colors.onSurface, fontSize: scaleFont(17) }]}
                  placeholder={t.typePlaceholder}
                  placeholderTextColor={colors.outline}
                  value={typedText}
                  onChangeText={setTypedText}
                />
                <Pressable
                  onPress={handleSendTyped}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={t.send}
                  style={[styles.sendButton, { backgroundColor: colors.primaryContainer }]}
                >
                  <MaterialIcons name="send" size={22} color={colors.onPrimary} />
                </Pressable>
              </View>
              <Text style={{ color: colors.secondary, fontSize: scaleFont(13), marginTop: 4, paddingLeft: 4 }}>
                {t.tapSendWhenDone}
              </Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* QUICK ACCESS ACTION CARDS */}
        {/* ======================================================== */}
        <View style={styles.quickAccessSection}>
          <Text style={[styles.quickAccessHeading, { color: colors.onSurface, fontSize: scaleFont(20) }]}>
            {language === 'hi' ? 'त्वरित सेवाएँ' : language === 'mr' ? 'जलद सेवा' : 'Quick Services'}
          </Text>

          <View style={styles.quickCardsGrid}>
            {/* Card: Auto & Cab */}
            <Pressable
              onPress={() => router.push('/rides')}
              style={[styles.quickCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
            >
              <View style={[styles.quickCardIconBox, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="local-taxi" size={28} color={colors.primaryContainer} />
              </View>
              <Text style={[styles.quickCardTitle, { color: colors.onSurface, fontSize: scaleFont(16) }]}>
                {t.capRide}
              </Text>
            </Pressable>

            {/* Card: Medicines */}
            <Pressable
              onPress={() => router.push('/(tabs)/medicine')}
              style={[styles.quickCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
            >
              <View style={[styles.quickCardIconBox, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="medication" size={28} color={colors.primaryContainer} />
              </View>
              <Text style={[styles.quickCardTitle, { color: colors.onSurface, fontSize: scaleFont(16) }]}>
                {t.capMedicine}
              </Text>
            </Pressable>

            {/* Card: Groceries */}
            <Pressable
              onPress={() => router.push('/groceries')}
              style={[styles.quickCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
            >
              <View style={[styles.quickCardIconBox, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="shopping-basket" size={28} color={colors.primaryContainer} />
              </View>
              <Text style={[styles.quickCardTitle, { color: colors.onSurface, fontSize: scaleFont(16) }]}>
                {t.capGroceries}
              </Text>
            </Pressable>

            {/* Card: Caregiver Setup */}
            <Pressable
              onPress={() => router.push('/setup')}
              style={[styles.quickCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
            >
              <View style={[styles.quickCardIconBox, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="settings" size={28} color={colors.primaryContainer} />
              </View>
              <Text style={[styles.quickCardTitle, { color: colors.onSurface, fontSize: scaleFont(16) }]}>
                {language === 'hi' ? 'परिवार साथी' : language === 'mr' ? 'कुटुंब सोबती' : 'Family Setup'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ======================================================== */}
        {/* PERSISTENT EMERGENCY FAMILY DIRECT CALL ANCHOR */}
        {/* ======================================================== */}
        <View style={styles.emergencyFamilySection}>
          <Pressable
            onPress={() => Linking.openURL(`tel:${preferences.primaryCaregiverPhone.replace(/\s+/g, '')}`)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${t.callFamily}: ${preferences.primaryCaregiverName}`}
            style={({ pressed }) => [
              styles.emergencyFamilyButton,
              {
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: colors.primaryContainer,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <MaterialIcons name="phone-in-talk" size={28} color={colors.primaryContainer} />
            <Text style={[styles.emergencyFamilyText, { color: colors.primaryContainer, fontSize: scaleFont(19) }]}>
              {t.callFamily}: {preferences.primaryCaregiverName.split(' ')[0]}
            </Text>
          </Pressable>
          <Text style={[styles.emergencyFamilyHint, { color: colors.secondary, fontSize: scaleFont(14) }]}>
            Direct dial to daughter {preferences.primaryCaregiverName}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  greetingSection: {
    marginVertical: 12,
  },
  greetingTitle: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  greetingSubtitle: {
    marginTop: 4,
  },
  stateSelectorContainer: {
    marginVertical: 12,
  },
  stateSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stateSelectorLabel: {
    fontWeight: '600',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  liveText: {
    fontWeight: '700',
  },
  stateTabsScroll: {
    flexDirection: 'row',
  },
  stateTabPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.full,
    marginRight: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateTabText: {
    textAlign: 'center',
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    minHeight: 360,
  },
  stagePrompt: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  suggestionCard: {
    width: '100%',
    maxWidth: 340,
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginTop: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  suggestionText: {
    textAlign: 'center',
  },
  keyboardFallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 10,
    minHeight: 48,
  },
  keyboardFallbackText: {
    marginLeft: 8,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  listeningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  listeningTitle: {
    fontWeight: '700',
  },
  transcriptCard: {
    width: '100%',
    padding: 18,
    borderRadius: Radii.lg,
    marginVertical: 16,
    alignItems: 'center',
  },
  transcriptText: {
    fontStyle: 'italic',
    fontWeight: '700',
    textAlign: 'center',
  },
  processingIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  processingTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  serviceLookupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: Radii.md,
    borderWidth: 1,
    width: '100%',
    maxWidth: 320,
  },
  reviewCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: Radii.md,
    marginBottom: 12,
  },
  reviewTitle: {
    fontWeight: '700',
    marginLeft: 8,
  },
  pillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  audioReadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: Radii.default,
    marginBottom: 14,
  },
  reviewDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  fareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radii.md,
    marginTop: 4,
  },
  resultCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginVertical: 12,
    elevation: 4,
  },
  successBadgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  resultEta: {
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },
  driverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 14,
    borderRadius: Radii.md,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoveryCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginVertical: 12,
    elevation: 3,
  },
  recoveryIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  recoveryTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  recoverySubtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  typedInputContainer: {
    width: '100%',
    marginTop: 16,
  },
  typedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Radii.md,
    paddingHorizontal: 8,
    minHeight: HitTargets.primaryButton,
  },
  typedTextInput: {
    flex: 1,
    paddingHorizontal: 8,
    minHeight: 48,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: Radii.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  quickAccessHeading: {
    fontWeight: '700',
    marginBottom: 12,
  },
  quickCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    width: '48%',
    padding: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
  },
  quickCardIconBox: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickCardTitle: {
    fontWeight: '600',
    textAlign: 'center',
  },
  emergencyFamilySection: {
    marginTop: 20,
    marginBottom: 10,
  },
  emergencyFamilyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: HitTargets.primaryButton,
    borderRadius: Radii.md,
    borderWidth: 2,
    paddingHorizontal: 16,
    elevation: 3,
  },
  emergencyFamilyText: {
    fontWeight: '700',
    marginLeft: 10,
  },
  emergencyFamilyHint: {
    textAlign: 'center',
    marginTop: 6,
  },
});
