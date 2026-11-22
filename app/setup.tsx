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
import { useAppStore } from '../src/store/useAppStore';
import { getTranslation } from '../src/i18n';
import { AccessibleButton } from '../src/components/common/AccessibleButton';
import { AccessibleInput } from '../src/components/common/AccessibleInput';
import { TactileSwitch } from '../src/components/common/TactileSwitch';
import { StatusBadge } from '../src/components/common/StatusBadge';
import { DemoBanner } from '../src/components/common/DemoBanner';
import { speechService } from '../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../src/theme/tokens';
import { LanguageCode } from '../src/types';

export default function FamilySetupScreen() {
  const { colors, language, setLanguage, scaleFont } = useTheme();
  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { preferences, updatePreferences, addActivity } = useAppStore();

  const [elderName, setElderName] = useState(preferences.elderName);
  const [trustedContact, setTrustedContact] = useState('Ananya Sharma (Daughter) · +91 98712 34560');

  // Capability switches state
  const [rideEnabled, setRideEnabled] = useState(preferences.enabledCapabilities.rideBooking);
  const [groceryEnabled, setGroceryEnabled] = useState(preferences.enabledCapabilities.groceryOrdering);
  const [medEnabled, setMedEnabled] = useState(preferences.enabledCapabilities.medicineRefill);
  const [contactEnabled, setContactEnabled] = useState(preferences.enabledCapabilities.contactSaving);
  const [familyEnabled, setFamilyEnabled] = useState(preferences.enabledCapabilities.familyCalling);

  // Custom Wispr Flow Routine Generator State
  const [flowDescription, setFlowDescription] = useState("When Dad says 'I need groceries', ask what to add and save it to his shopping list.");
  const [draftGenerated, setDraftGenerated] = useState(true);
  const [customFlowEnabled, setCustomFlowEnabled] = useState(true);

  const activeCount = [rideEnabled, groceryEnabled, medEnabled, contactEnabled, familyEnabled].filter(Boolean).length;

  const handleGenerateFlow = () => {
    setDraftGenerated(true);
    speechService.speak(
      language === 'hi' ? 'कस्टम फ़्लो तैयार कर दिया गया है।' : 'Custom routine drafted with Wispr Flow.',
      language
    );
  };

  const handleSaveSetup = () => {
    updatePreferences({
      elderName,
      enabledCapabilities: {
        rideBooking: rideEnabled,
        groceryOrdering: groceryEnabled,
        medicineRefill: medEnabled,
        contactSaving: contactEnabled,
        familyCalling: familyEnabled,
      },
    });

    addActivity({
      title: 'Family Companion Setup Saved',
      subtitle: `${activeCount} capabilities configured for ${elderName}`,
      category: 'reminder',
      status: 'succeeded',
      icon: 'settings',
    });

    speechService.speak(
      language === 'hi' ? 'सेटिंग्स सफलतापूर्वक सहेज ली गई हैं।' : 'Settings saved successfully.',
      language
    );

    router.replace('/(tabs)');
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

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]}>
        <DemoBanner />

        {/* Sub-header pill */}
        <View style={styles.subHeaderPillRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="family-restroom" size={18} color={colors.primaryContainer} />
            </View>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(15), marginLeft: 8 }}>
              {t.setupCompanionMode}
            </Text>
          </View>
        </View>

        {/* SECTION 1: Elder's Profile */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
            {t.setUpForFamilyMember}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 2, marginBottom: 12 }}>
            {t.personalizeSubtitle}
          </Text>

          <View style={[styles.sectionCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <AccessibleInput
              label={t.preferredName}
              value={elderName}
              onChangeText={setElderName}
              placeholder="e.g. Meera / Maa / Dad"
              hint={t.howAppAddressesThem}
              onMicPress={() => setElderName('Meera')}
            />

            {/* Language Selection */}
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '600', marginTop: 8, marginBottom: 8 }}>
              {t.spokenLanguage}
            </Text>
            <View style={styles.langGrid}>
              <Pressable
                onPress={() => setLanguage('en')}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: language === 'en' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                    borderColor: language === 'en' ? colors.primaryContainer : colors.borderDefault,
                  },
                ]}
              >
                <MaterialIcons
                  name={language === 'en' ? 'check-circle' : 'radio-button-unchecked'}
                  size={20}
                  color={language === 'en' ? colors.primaryContainer : colors.outline}
                />
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '600', marginLeft: 8 }}>
                  English
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setLanguage('hi')}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: language === 'hi' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                    borderColor: language === 'hi' ? colors.primaryContainer : colors.borderDefault,
                  },
                ]}
              >
                <MaterialIcons
                  name={language === 'hi' ? 'check-circle' : 'radio-button-unchecked'}
                  size={20}
                  color={language === 'hi' ? colors.primaryContainer : colors.outline}
                />
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '600', marginLeft: 8 }}>
                  हिन्दी
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setLanguage('mr')}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: language === 'mr' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                    borderColor: language === 'mr' ? colors.primaryContainer : colors.borderDefault,
                  },
                ]}
              >
                <MaterialIcons
                  name={language === 'mr' ? 'check-circle' : 'radio-button-unchecked'}
                  size={20}
                  color={language === 'mr' ? colors.primaryContainer : colors.outline}
                />
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '600', marginLeft: 8 }}>
                  मराठी
                </Text>
              </Pressable>
            </View>

            {/* Trusted Contact Field */}
            <View style={{ marginTop: 12 }}>
              <AccessibleInput
                label={t.trustedContact}
                value={trustedContact}
                onChangeText={setTrustedContact}
                placeholder="Name & Phone"
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: Action Capabilities List */}
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionHeading, { color: colors.onSurface, fontSize: scaleFont(22) }]}>
                {t.chooseWhatAppCanDo}
              </Text>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(15) }}>
                {t.tapTogglesSubtitle}
              </Text>
            </View>
            <View style={[styles.activePill, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(14), fontWeight: '700' }}>
                {activeCount} {t.activeCount}
              </Text>
            </View>
          </View>

          {/* Capability Card 1: Book a ride */}
          <View style={[styles.capCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={styles.capHeader}>
              <View style={[styles.capIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <MaterialIcons name="local-taxi" size={28} color={colors.primaryContainer} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.capTitle, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                    {t.capRide}
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <StatusBadge label={t.statusReady} variant="ready" />
                  </View>
                </View>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15), fontStyle: 'italic', marginTop: 2 }}>
                  “Book an auto to the hospital.”
                </Text>
              </View>
              <TactileSwitch
                value={rideEnabled}
                onValueChange={setRideEnabled}
                accessibilityLabel="Toggle ride booking"
              />
            </View>
            {rideEnabled && (
              <View style={[styles.capExpandedBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  <MaterialIcons name="home" size={18} color={colors.primaryContainer} />
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), marginLeft: 6 }}>
                    Home: B-42 Green Park
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  <MaterialIcons name="local-hospital" size={18} color={colors.primaryContainer} />
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), marginLeft: 6 }}>
                    Hospital: Max Super Speciality Hospital
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Capability Card 2: Order groceries */}
          <View style={[styles.capCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={styles.capHeader}>
              <View style={[styles.capIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <MaterialIcons name="shopping-basket" size={28} color={colors.primaryContainer} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.capTitle, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                    {t.capGroceries}
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <StatusBadge label={t.statusNeedsSetup} variant="needsSetup" />
                  </View>
                </View>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15), fontStyle: 'italic', marginTop: 2 }}>
                  “Order my usual milk and atta.”
                </Text>
              </View>
              <TactileSwitch
                value={groceryEnabled}
                onValueChange={setGroceryEnabled}
                accessibilityLabel="Toggle groceries"
              />
            </View>
          </View>

          {/* Capability Card 3: Medicine refill */}
          <View style={[styles.capCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={styles.capHeader}>
              <View style={[styles.capIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <MaterialIcons name="medication" size={28} color={colors.primaryContainer} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.capTitle, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                    {t.capMedicine}
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <StatusBadge label={t.statusReady} variant="ready" />
                  </View>
                </View>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15), fontStyle: 'italic', marginTop: 2 }}>
                  “Refill my saved medicine.”
                </Text>
              </View>
              <TactileSwitch
                value={medEnabled}
                onValueChange={setMedEnabled}
                accessibilityLabel="Toggle medicine refill"
              />
            </View>
          </View>

          {/* Capability Card 4: Save contact */}
          <View style={[styles.capCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={styles.capHeader}>
              <View style={[styles.capIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <MaterialIcons name="person-add" size={28} color={colors.primaryContainer} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.capTitle, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                    {t.capSaveContact}
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <StatusBadge label={t.statusReady} variant="ready" />
                  </View>
                </View>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15), fontStyle: 'italic', marginTop: 2 }}>
                  “Save this number as Dr. Mehta.”
                </Text>
              </View>
              <TactileSwitch
                value={contactEnabled}
                onValueChange={setContactEnabled}
                accessibilityLabel="Toggle save contact"
              />
            </View>
          </View>

          {/* Capability Card 5: Call family */}
          <View style={[styles.capCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={styles.capHeader}>
              <View style={[styles.capIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <MaterialIcons name="call" size={28} color={colors.primaryContainer} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.capTitle, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                    {t.capCallFamily}
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <StatusBadge label={t.statusReady} variant="ready" />
                  </View>
                </View>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15), fontStyle: 'italic', marginTop: 2 }}>
                  “Call my daughter.”
                </Text>
              </View>
              <TactileSwitch
                value={familyEnabled}
                onValueChange={setFamilyEnabled}
                accessibilityLabel="Toggle call family"
              />
            </View>
          </View>
        </View>

        {/* SECTION 3: Create a Custom Flow (Wispr Flow Voice Generator) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.onSurface, fontSize: scaleFont(22) }]}>
            {t.createCustomFlow}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(15), marginBottom: 12 }}>
            {t.teachRoutinesSubtitle}
          </Text>

          <View style={[styles.sectionCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '600' }}>
                {t.describeWhatAppDoes}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="graphic-eq" size={16} color={colors.primaryContainer} />
                <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(13), fontWeight: '700', marginLeft: 4 }}>
                  Wispr Flow
                </Text>
              </View>
            </View>

            <View style={[styles.textAreaBox, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.inputBorder }]}>
              <TextInput
                style={[styles.textArea, { color: colors.onSurface, fontSize: scaleFont(16) }]}
                multiline
                numberOfLines={3}
                value={flowDescription}
                onChangeText={setFlowDescription}
              />
              <Pressable
                onPress={() => setFlowDescription("When Dad says 'I need groceries', ask what to add and save it to his shopping list.")}
                style={styles.micDictateBtn}
              >
                <MaterialIcons name="mic" size={24} color={colors.primaryContainer} />
              </Pressable>
            </View>

            <View style={{ marginTop: 12 }}>
              <AccessibleButton
                label={t.generateFlow}
                variant="secondary"
                icon={<MaterialIcons name="auto-awesome" size={20} color={colors.primaryContainer} />}
                onPress={handleGenerateFlow}
              />
            </View>

            {/* Flow Draft Preview */}
            {draftGenerated && (
              <View style={[styles.draftPreviewCard, { backgroundColor: colors.surfaceContainerLow }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(13), fontWeight: '800', textTransform: 'uppercase' }}>
                    {t.draftedFlowPreview}
                  </Text>
                  <StatusBadge label="Ready to test" variant="ready" />
                </View>

                <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '700' }}>
                  Grocery Checklist Reminder
                </Text>

                <View style={{ gap: 6, marginVertical: 8 }}>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), fontWeight: '600' }}>
                    What they say: <Text style={{ color: colors.onSurfaceVariant, fontWeight: '400' }}>“I need groceries” / “मेरा सामान लिख दो”</Text>
                  </Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), fontWeight: '600' }}>
                    Questions to ask: <Text style={{ color: colors.onSurfaceVariant, fontWeight: '400' }}>“What would you like to add to your list today?”</Text>
                  </Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), fontWeight: '600' }}>
                    Outcome: <Text style={{ color: colors.onSurfaceVariant, fontWeight: '400' }}>Saves items to WhatsApp list & sends to Ananya</Text>
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <Pressable
                    onPress={() => speechService.speak('Testing routine: What would you like to add to your grocery list today?', language)}
                    style={[styles.previewFlowBtn, { backgroundColor: colors.surfaceContainerLowest }]}
                  >
                    <MaterialIcons name="play-circle" size={18} color={colors.primaryContainer} />
                    <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(14), fontWeight: '700', marginLeft: 6 }}>
                      {t.previewFlow}
                    </Text>
                  </Pressable>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: colors.onSurface, fontSize: scaleFont(14), marginRight: 6 }}>
                      Enable
                    </Text>
                    <TactileSwitch
                      value={customFlowEnabled}
                      onValueChange={setCustomFlowEnabled}
                      accessibilityLabel="Enable custom flow"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* SECTION 4: Save & Continue Button */}
        <View style={{ marginVertical: 20 }}>
          <AccessibleButton
            label={t.saveAndContinue}
            variant="primary"
            icon={<MaterialIcons name="verified" size={24} color={colors.onPrimary} />}
            onPress={handleSaveSetup}
          />
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  subHeaderPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginVertical: 14,
  },
  sectionHeading: {
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 18,
    elevation: 2,
  },
  langGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  langBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  activePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  capCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
  },
  capHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capIconBox: {
    width: 50,
    height: 50,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capTitle: {
    fontWeight: '700',
  },
  capExpandedBox: {
    padding: 12,
    borderRadius: Radii.default,
    marginTop: 10,
  },
  textAreaBox: {
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: 10,
    position: 'relative',
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
    paddingRight: 40,
  },
  micDictateBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftPreviewCard: {
    borderRadius: Radii.md,
    padding: 16,
    marginTop: 14,
  },
  previewFlowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.default,
    elevation: 1,
  },
});
