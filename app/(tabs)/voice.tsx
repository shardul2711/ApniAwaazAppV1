import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
import { HitTargets, Radii } from '../../src/theme/tokens';

export default function VoiceScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const insets = useSafeAreaInsets();

  const {
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

  const [typedInput, setTypedInput] = useState('');

  const handleStartVoice = () => {
    setVoiceState('listening');
    setTranscript(language === 'hi' ? 'अस्पताल के लिए ऑटो बुक करें...' : 'Book an auto to hospital...');
    setTimeout(() => {
      setVoiceState('processing');
      setTimeout(() => {
        const parsed = parseVoiceIntent(transcript || 'auto', language);
        setActiveAction(parsed.action);
        setAssistantResponse(parsed.spokenResponse);
        setVoiceState('review');
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
        category: activeAction.type === 'book_ride' ? 'ride' : 'medicine',
        status: 'succeeded',
        icon: 'check-circle',
      });
    }
    setVoiceState('result');
    speechService.speak(language === 'hi' ? 'कार्य पूरा हो गया है!' : 'Action completed successfully!', language);
  };

  const handleSendText = () => {
    if (!typedInput.trim()) return;
    setTranscript(typedInput);
    setVoiceState('processing');
    const text = typedInput;
    setTypedInput('');
    setTimeout(() => {
      const parsed = parseVoiceIntent(text, language);
      setActiveAction(parsed.action);
      setAssistantResponse(parsed.spokenResponse);
      setVoiceState('review');
      speechService.speak(parsed.spokenResponse, language);
    }, 1200);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      <AccessibleHeader title={t.tabSpeak} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]}>
        <DemoBanner />

        <View style={styles.centerContainer}>
          <Text style={[styles.headline, { color: colors.onSurface, fontSize: scaleFont(26) }]}>
            {voiceState === 'listening'
              ? t.listening
              : voiceState === 'processing'
              ? t.checkingRequest
              : voiceState === 'review'
              ? t.tripPreview
              : voiceState === 'result'
              ? t.autoIsBooked
              : t.whatCanIHelpWith}
          </Text>

          {/* Central Voice Orb */}
          <VoiceOrb
            state={voiceState}
            onPress={voiceState === 'listening' ? handleStopAndReview : handleStartVoice}
          />

          {/* Live Transcript / Assistant Response Card */}
          {(transcript || assistantResponse) && (
            <View style={[styles.transcriptBox, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.borderDefault }]}>
              {transcript ? (
                <Text style={[styles.transcriptText, { color: colors.primaryContainer, fontSize: scaleFont(19) }]}>
                  “{transcript}”
                </Text>
              ) : null}
              {assistantResponse ? (
                <Text style={[styles.assistantText, { color: colors.onSurface, fontSize: scaleFont(17) }]}>
                  {assistantResponse}
                </Text>
              ) : null}
            </View>
          )}

          {/* Confirmation Controls during Review State */}
          {voiceState === 'review' && activeAction && (
            <View style={styles.actionReviewContainer}>
              <AccessibleButton
                label={t.confirm}
                variant="primary"
                icon={<MaterialIcons name="check-circle" size={24} color={colors.onPrimary} />}
                onPress={handleConfirmAction}
              />
              <AccessibleButton
                label={t.cancel}
                variant="secondary"
                onPress={resetVoiceSession}
              />
            </View>
          )}

          {/* Result State Return */}
          {voiceState === 'result' && (
            <View style={{ width: '100%', marginTop: 16 }}>
              <AccessibleButton
                label={t.imReady}
                variant="primary"
                onPress={resetVoiceSession}
              />
            </View>
          )}

          {/* Fallback Keyboard Dictation Box */}
          <View style={styles.keyboardFallbackBox}>
            <Text style={[styles.keyboardTitle, { color: colors.secondary, fontSize: scaleFont(15) }]}>
              {t.typeFallback}
            </Text>
            <View style={[styles.inputRow, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.inputBorder }]}>
              <TextInput
                style={[styles.input, { color: colors.onSurface, fontSize: scaleFont(17) }]}
                placeholder={t.typePlaceholder}
                placeholderTextColor={colors.outline}
                value={typedInput}
                onChangeText={setTypedInput}
              />
              <Pressable
                onPress={handleSendText}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={t.send}
                style={[styles.sendBtn, { backgroundColor: colors.primaryContainer }]}
              >
                <MaterialIcons name="send" size={22} color={colors.onPrimary} />
              </Pressable>
            </View>
          </View>
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headline: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  transcriptBox: {
    width: '100%',
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginVertical: 16,
  },
  transcriptText: {
    fontStyle: 'italic',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  assistantText: {
    textAlign: 'center',
    marginTop: 4,
  },
  actionReviewContainer: {
    width: '100%',
    marginVertical: 12,
  },
  keyboardFallbackBox: {
    width: '100%',
    marginTop: 24,
  },
  keyboardTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Radii.md,
    paddingHorizontal: 8,
    minHeight: HitTargets.primaryButton,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    minHeight: 48,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
