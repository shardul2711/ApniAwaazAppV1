import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, Language } from '../../theme/ThemeContext';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../i18n';
import { HitTargets, Radii } from '../../theme/tokens';

interface AccessibleHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showLanguageToggle?: boolean;
  showCaregiverPill?: boolean;
}

export const AccessibleHeader: React.FC<AccessibleHeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  showLanguageToggle = true,
  showCaregiverPill = true,
}) => {
  const { colors, language, setLanguage, scaleFont } = useTheme();
  const { preferences } = useAppStore();
  const t = getTranslation(language);

  const [langModalVisible, setLangModalVisible] = useState(false);
  const [caregiverModalVisible, setCaregiverModalVisible] = useState(false);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'en', label: 'English', native: 'English' },
  ];

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.borderDefault }]}>
      <View style={styles.contentRow}>
        {/* Left: Back button or App Logo + Title */}
        <View style={styles.leftSection}>
          {showBack && onBackPress ? (
            <Pressable
              onPress={onBackPress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t.back}
              style={({ pressed }) => [
                styles.backButton,
                { backgroundColor: pressed ? colors.surfaceContainer : 'transparent' },
              ]}
            >
              <MaterialIcons name="arrow-back" size={28} color={colors.onSurface} />
            </Pressable>
          ) : (
            <View style={styles.brandContainer}>
              <View style={[styles.logoBadge, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="graphic-eq" size={24} color={colors.primaryContainer} />
              </View>
              <View>
                <Text style={[styles.appName, { color: colors.primary, fontSize: scaleFont(18) }]}>
                  {t.appName}
                </Text>
                <Text style={[styles.screenTitle, { color: colors.onSurface, fontSize: scaleFont(16) }]}>
                  {title || (language === 'hi' ? 'आज की दिनचर्या' : language === 'mr' ? 'आजची दिनचर्या' : 'Today')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Right Section: Language Toggle & Family Pill */}
        <View style={styles.rightSection}>
          {showLanguageToggle && (
            <Pressable
              onPress={() => setLangModalVisible(true)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Bhasha badlein (Change language)"
              accessibilityHint="Opens language selection menu"
              style={({ pressed }) => [
                styles.iconButton,
                { backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainer },
              ]}
            >
              <MaterialIcons name="translate" size={22} color={colors.primaryContainer} />
            </Pressable>
          )}

          {showCaregiverPill && (
            <Pressable
              onPress={() => setCaregiverModalVisible(true)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Parivaar sadasya (Family caregiver options)"
              style={({ pressed }) => [
                styles.caregiverPill,
                {
                  backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainer,
                  borderColor: colors.borderDefault,
                },
              ]}
            >
              <View style={[styles.caregiverDot, { backgroundColor: colors.primaryContainer }]}>
                <MaterialIcons name="person" size={14} color={colors.onPrimary} />
              </View>
              <Text style={[styles.caregiverText, { color: colors.primaryContainer, fontSize: scaleFont(14) }]}>
                {preferences.primaryCaregiverName.split(' ')[0]}
              </Text>
              <MaterialIcons name="expand-more" size={18} color={colors.primaryContainer} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLangModalVisible(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceContainerLowest }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface, fontSize: scaleFont(20) }]}>
              भाषा चुनें / Select Language
            </Text>
            {languages.map((l) => (
              <Pressable
                key={l.code}
                onPress={() => {
                  setLanguage(l.code);
                  setLangModalVisible(false);
                }}
                style={({ pressed }) => [
                  styles.languageOption,
                  {
                    backgroundColor:
                      language === l.code ? colors.listeningHighlight : pressed ? colors.surfaceContainerLow : 'transparent',
                    borderColor: language === l.code ? colors.primaryContainer : colors.borderDefault,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageNative,
                    {
                      color: language === l.code ? colors.primaryContainer : colors.onSurface,
                      fontSize: scaleFont(20),
                      fontWeight: language === l.code ? '700' : '500',
                    },
                  ]}
                >
                  {l.native}
                </Text>
                <Text style={[styles.languageLabel, { color: colors.onSurfaceVariant, fontSize: scaleFont(15) }]}>
                  {l.label}
                </Text>
                {language === l.code && (
                  <MaterialIcons name="check-circle" size={24} color={colors.primaryContainer} style={styles.checkIcon} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Caregiver Settings Modal */}
      <Modal
        visible={caregiverModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCaregiverModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCaregiverModalVisible(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceContainerLowest }]}>
            <View style={[styles.caregiverCardHeader, { backgroundColor: colors.surfaceContainerLow }]}>
              <MaterialIcons name="family-restroom" size={28} color={colors.primaryContainer} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.modalTitle, { color: colors.onSurface, fontSize: scaleFont(18), marginBottom: 0 }]}>
                  {preferences.primaryCaregiverName}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14) }}>
                  Primary Caregiver (बेटी) · {preferences.primaryCaregiverPhone}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setCaregiverModalVisible(false)}
              style={[styles.modalAction, { borderBottomColor: colors.borderDefault }]}
            >
              <MaterialIcons name="tune" size={24} color={colors.primaryContainer} />
              <Text style={{ color: colors.onSurface, fontSize: scaleFont(16), fontWeight: '600', marginLeft: 12 }}>
                {language === 'hi' ? 'फ़्लो कस्टमाइज़ करें' : language === 'mr' ? 'फ्लो कस्टमाइझ करा' : 'Customize flows'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCaregiverModalVisible(false)}
              style={[styles.modalAction, { backgroundColor: colors.errorContainer, borderRadius: Radii.md, marginTop: 8 }]}
            >
              <MaterialIcons name="close" size={24} color={colors.error} />
              <Text style={{ color: colors.onErrorContainer, fontSize: scaleFont(16), fontWeight: '700', marginLeft: 12 }}>
                {t.cancel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HitTargets.min,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  appName: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  screenTitle: {
    fontWeight: '500',
    marginTop: -2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caregiverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  caregiverDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  caregiverText: {
    fontWeight: '600',
    marginRight: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radii.lg,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 2,
    marginVertical: 6,
  },
  languageNative: {
    marginRight: 8,
  },
  languageLabel: {
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  caregiverCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radii.md,
    marginBottom: 12,
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
});
