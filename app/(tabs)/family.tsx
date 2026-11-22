import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAppStore } from '../../src/store/useAppStore';
import { getTranslation } from '../../src/i18n';
import { AccessibleHeader } from '../../src/components/common/AccessibleHeader';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { AccessibleInput } from '../../src/components/common/AccessibleInput';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { DemoBanner } from '../../src/components/common/DemoBanner';
import { speechService } from '../../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../../src/theme/tokens';
import { Contact } from '../../src/types';

export default function FamilyScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const insets = useSafeAreaInsets();

  const { contacts, addContact, removeContact, addActivity } = useAppStore();

  const [callModalVisible, setCallModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const initiateCall = (contact: Contact) => {
    setSelectedContact(contact);
    setCallModalVisible(true);
    const spoken = language === 'hi' ? `${contact.name} को कॉल मिला रहे हैं। क्या मिला दूँ?` : language === 'mr' ? `${contact.name} ला फोन लावत आहे. फोन करू का?` : `Preparing to call ${contact.name}. Shall I dial?`;
    speechService.speak(spoken, language);
  };

  const handleConfirmCall = () => {
    if (!selectedContact) return;
    speechService.stopSpeaking();
    addActivity({
      title: `Call to ${selectedContact.name}`,
      subtitle: `${selectedContact.relationship} · ${selectedContact.phone}`,
      category: 'call',
      status: 'succeeded',
      icon: 'phone',
    });
    setCallModalVisible(false);
    Linking.openURL(`tel:${selectedContact.phone.replace(/\s+/g, '')}`);
  };

  const handleSaveContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    addContact({
      name: newName,
      relationship: newRelationship || 'Family',
      phone: newPhone,
      quickDialEnabled: true,
    });
    addActivity({
      title: `Contact Saved: ${newName}`,
      subtitle: `${newRelationship} · ${newPhone}`,
      category: 'call',
      status: 'succeeded',
      icon: 'person-add',
    });
    setNewName('');
    setNewRelationship('');
    setNewPhone('');
    setAddModalVisible(false);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      <AccessibleHeader title={t.tabFamily} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]}>
        <DemoBanner />

        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {language === 'hi' ? 'परिवार और विश्वासू संपर्क' : language === 'mr' ? 'कुटुंब आणि विश्वासू संपर्क' : 'Family & Trusted Contacts'}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 2 }}>
              {language === 'hi' ? 'एक टैप में पुष्टि के साथ कॉल करें' : language === 'mr' ? 'एका दाबात पुष्टीसह फोन करा' : 'Confirmed calling with safe one-tap audio confirmation'}
            </Text>
          </View>
          <Pressable
            onPress={() => setAddModalVisible(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Add trusted contact"
            style={[styles.addBtn, { backgroundColor: colors.primaryContainer }]}
          >
            <MaterialIcons name="person-add" size={26} color={colors.onPrimary} />
          </Pressable>
        </View>

        {/* Contacts List */}
        <View style={styles.contactsList}>
          {contacts.map((contact: Contact) => (
            <View
              key={contact.id}
              style={[styles.contactCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
            >
              <View style={[styles.avatarCircle, { backgroundColor: contact.isPrimaryCaregiver ? colors.primaryContainer : colors.surfaceContainer }]}>
                <Text
                  style={{
                    color: contact.isPrimaryCaregiver ? colors.onPrimary : colors.primaryContainer,
                    fontSize: scaleFont(20),
                    fontWeight: '700',
                  }}
                >
                  {contact.name.charAt(0)}
                </Text>
              </View>

              <View style={styles.contactDetails}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.contactName, { color: colors.onSurface, fontSize: scaleFont(19) }]}>
                    {contact.name}
                  </Text>
                  {contact.isPrimaryCaregiver && (
                    <View style={{ marginLeft: 8 }}>
                      <StatusBadge label="Caregiver" variant="ready" iconName="favorite" />
                    </View>
                  )}
                </View>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15), marginTop: 2 }}>
                  {contact.relationship}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(14), marginTop: 1 }}>
                  {contact.phone}
                </Text>
              </View>

              <Pressable
                onPress={() => initiateCall(contact)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Call ${contact.name}`}
                style={({ pressed }) => [
                  styles.callButton,
                  {
                    backgroundColor: colors.primaryContainer,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <MaterialIcons name="call" size={26} color={colors.onPrimary} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal: Call Confirmation Dialog (Strict Safety Requirement) */}
      <Modal visible={callModalVisible} transparent animationType="fade" onRequestClose={() => setCallModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceContainerLowest }]}>
            <View style={[styles.callIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
              <MaterialIcons name="phone-in-talk" size={48} color={colors.primaryContainer} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {language === 'hi' ? 'कॉल की पुष्टि करें' : language === 'mr' ? 'फोन नक्की करा' : 'Confirm Call'}
            </Text>

            {selectedContact && (
              <View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(22), fontWeight: '700' }}>
                  {selectedContact.name}
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(16), marginTop: 4 }}>
                  {selectedContact.relationship} · {selectedContact.phone}
                </Text>
                <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(15), fontStyle: 'italic', marginTop: 12, textAlign: 'center' }}>
                  “{language === 'hi' ? 'क्या आप अभी कॉल करना चाहते हैं?' : language === 'mr' ? 'तुम्ही आता फोन करू इच्छिता का?' : 'Would you like to dial now?'}”
                </Text>
              </View>
            )}

            <AccessibleButton
              label={language === 'hi' ? 'हाँ, कॉल करें' : language === 'mr' ? 'हो, फोन करा' : 'Yes, Make Call'}
              variant="primary"
              icon={<MaterialIcons name="call" size={24} color={colors.onPrimary} />}
              onPress={handleConfirmCall}
            />

            <AccessibleButton
              label={t.cancel}
              variant="secondary"
              onPress={() => {
                speechService.stopSpeaking();
                setCallModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal: Add New Contact */}
      <Modal visible={addModalVisible} transparent animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceContainerLowest }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface, fontSize: scaleFont(22) }]}>
              {language === 'hi' ? 'नया संपर्क जोड़ें' : language === 'mr' ? 'नवीन नंबर जोडा' : 'Add Trusted Contact'}
            </Text>

            <AccessibleInput
              label={language === 'hi' ? 'पूरा नाम' : 'Full Name'}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Ramesh Patel"
              onMicPress={() => setNewName('Ramesh Patel')}
            />

            <AccessibleInput
              label={language === 'hi' ? 'रिश्ता / संबंध' : 'Relationship'}
              value={newRelationship}
              onChangeText={setNewRelationship}
              placeholder="e.g. Brother / भाई"
            />

            <AccessibleInput
              label={language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
              value={newPhone}
              onChangeText={setNewPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
            />

            <View style={{ marginTop: 16 }}>
              <AccessibleButton
                label={t.saveChanges}
                variant="primary"
                onPress={handleSaveContact}
              />
              <AccessibleButton
                label={t.cancel}
                variant="secondary"
                onPress={() => setAddModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  title: {
    fontWeight: '700',
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  contactsList: {
    marginVertical: 12,
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
    elevation: 2,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDetails: {
    flex: 1,
    marginLeft: 14,
  },
  contactName: {
    fontWeight: '700',
  },
  callButton: {
    width: 52,
    height: 52,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: Radii.xl,
    padding: 24,
    elevation: 10,
  },
  callIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
