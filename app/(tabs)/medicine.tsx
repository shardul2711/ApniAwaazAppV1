import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
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
import { mockMedicines } from '../../src/services/api/MockApiClient';
import { speechService } from '../../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../../src/theme/tokens';
import { Reminder } from '../../src/types';

export default function MedicineScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const insets = useSafeAreaInsets();

  const {
    reminders,
    addReminder,
    toggleReminderComplete,
    snoozeReminder,
    deleteReminder,
    addActivity,
    addMedicineOrder,
  } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'medicine' | 'other'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [selectedMedicine, setSelectedMedicine] = useState<typeof mockMedicines[0] | null>(null);
  const [reorderModalVisible, setReorderModalVisible] = useState(false);

  const filteredReminders = reminders.filter((r: Reminder) => {
    if (activeFilter === 'medicine') return r.category === 'medicine';
    if (activeFilter === 'other') return r.category !== 'medicine';
    return true;
  });

  const handleCreateReminder = () => {
    if (!newTitle.trim()) return;
    addReminder({
      title: newTitle,
      time: newTime,
      category: activeFilter === 'medicine' ? 'medicine' : 'walk',
      repeat: 'daily',
      status: 'pending',
    });
    addActivity({
      title: `Reminder Added: ${newTitle}`,
      subtitle: `Scheduled for ${newTime}`,
      category: 'reminder',
      status: 'succeeded',
      icon: 'notifications-active',
    });
    setNewTitle('');
    setModalVisible(false);
  };

  const handleConfirmReorder = () => {
    if (!selectedMedicine) return;
    addMedicineOrder({
      id: `ord-med-${Date.now()}`,
      medicine: selectedMedicine,
      quantity: 1,
      totalPrice: selectedMedicine.price,
      deliveryAddress: 'Home (B-42 Green Park)',
      pharmacyName: selectedMedicine.pharmacyName,
      prescriptionStatus: selectedMedicine.requiresPrescription ? 'verified' : 'not_required',
      status: 'confirmed',
      orderedAt: 'Just now',
    });
    addActivity({
      title: `Medicine Reordered: ${selectedMedicine.name}`,
      subtitle: `${selectedMedicine.pharmacyName} · ₹${selectedMedicine.price}`,
      category: 'medicine',
      status: 'succeeded',
      icon: 'local-pharmacy',
    });
    const spoken = language === 'hi' ? `${selectedMedicine.name} का ऑर्डर सफल रहा।` : language === 'mr' ? `${selectedMedicine.name} ची ऑर्डर यशस्वी झाली.` : `Order confirmed for ${selectedMedicine.name}.`;
    speechService.speak(spoken, language);
    setReorderModalVisible(false);
    setSelectedMedicine(null);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      <AccessibleHeader title={t.remindersAndMedicine} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]}>
        <DemoBanner />

        {/* Header Section */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={[styles.mainHeading, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {t.remindersAndMedicine}
            </Text>
            <Text style={[styles.subHeading, { color: colors.onSurfaceVariant, fontSize: scaleFont(16) }]}>
              {language === 'hi' ? 'समय पर दवाई और दैनिक कार्य' : language === 'mr' ? 'वेळेवर औषधे आणि रोजचे काम' : 'Timely medicines and daily routines'}
            </Text>
          </View>
          <Pressable
            onPress={() => setModalVisible(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t.addReminder}
            style={[styles.addCircleButton, { backgroundColor: colors.primaryContainer }]}
          >
            <MaterialIcons name="add" size={28} color={colors.onPrimary} />
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setActiveFilter('all')}
            style={[
              styles.filterPill,
              {
                backgroundColor: activeFilter === 'all' ? colors.primaryContainer : colors.surfaceContainer,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: activeFilter === 'all' ? colors.onPrimary : colors.onSurfaceVariant,
                  fontSize: scaleFont(15),
                },
              ]}
            >
              {language === 'hi' ? 'सभी' : language === 'mr' ? 'सर्व' : 'All'} ({reminders.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveFilter('medicine')}
            style={[
              styles.filterPill,
              {
                backgroundColor: activeFilter === 'medicine' ? colors.primaryContainer : colors.surfaceContainer,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: activeFilter === 'medicine' ? colors.onPrimary : colors.onSurfaceVariant,
                  fontSize: scaleFont(15),
                },
              ]}
            >
              {language === 'hi' ? 'दवाइयाँ' : language === 'mr' ? 'औषधे' : 'Medicines'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveFilter('other')}
            style={[
              styles.filterPill,
              {
                backgroundColor: activeFilter === 'other' ? colors.primaryContainer : colors.surfaceContainer,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: activeFilter === 'other' ? colors.onPrimary : colors.onSurfaceVariant,
                  fontSize: scaleFont(15),
                },
              ]}
            >
              {language === 'hi' ? 'दिनचर्या' : language === 'mr' ? 'दिनचर्या' : 'Routines'}
            </Text>
          </Pressable>
        </View>

        {/* Reminders List */}
        <View style={styles.remindersList}>
          {filteredReminders.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
              <MaterialIcons name="done-all" size={48} color={colors.primaryContainer} />
              <Text style={[styles.emptyText, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                {t.noReminders}
              </Text>
            </View>
          ) : (
            filteredReminders.map((reminder: Reminder) => {
              const isCompleted = reminder.status === 'completed';
              return (
                <View
                  key={reminder.id}
                  style={[
                    styles.reminderCard,
                    {
                      backgroundColor: isCompleted ? colors.listeningHighlight : colors.surfaceContainerLowest,
                      borderColor: isCompleted ? colors.primaryContainer : colors.borderDefault,
                      borderWidth: isCompleted ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.reminderTopRow}>
                    <Pressable
                      onPress={() => toggleReminderComplete(reminder.id)}
                      accessible={true}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isCompleted }}
                      accessibilityLabel={`${reminder.title}, ${reminder.time}`}
                      style={[
                        styles.checkCircle,
                        {
                          backgroundColor: isCompleted ? colors.primaryContainer : 'transparent',
                          borderColor: isCompleted ? colors.primaryContainer : colors.outline,
                        },
                      ]}
                    >
                      {isCompleted && (
                        <MaterialIcons name="check" size={20} color={colors.onPrimary} />
                      )}
                    </Pressable>

                    <View style={styles.reminderInfo}>
                      <Text
                        style={[
                          styles.reminderTitle,
                          {
                            color: colors.onSurface,
                            fontSize: scaleFont(19),
                            textDecorationLine: isCompleted ? 'line-through' : 'none',
                          },
                        ]}
                      >
                        {reminder.title}
                      </Text>
                      <View style={styles.timeTagRow}>
                        <MaterialIcons name="schedule" size={16} color={colors.secondary} />
                        <Text style={[styles.reminderTime, { color: colors.secondary, fontSize: scaleFont(15) }]}>
                          {reminder.time} · {reminder.repeat}
                        </Text>
                      </View>
                      {reminder.notes ? (
                        <Text style={[styles.reminderNotes, { color: colors.onSurfaceVariant, fontSize: scaleFont(14) }]}>
                          {reminder.notes}
                        </Text>
                      ) : null}
                    </View>

                    <StatusBadge
                      label={isCompleted ? t.completed : reminder.status === 'snoozed' ? t.snoozed : t.statusReady}
                      variant={isCompleted ? 'completed' : reminder.status === 'snoozed' ? 'needsSetup' : 'ready'}
                    />
                  </View>

                  {/* Actions Row */}
                  <View style={styles.cardActionsRow}>
                    <Pressable
                      onPress={() => snoozeReminder(reminder.id)}
                      style={[styles.smallActionBtn, { backgroundColor: colors.surfaceContainer }]}
                    >
                      <MaterialIcons name="snooze" size={18} color={colors.primaryContainer} />
                      <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(14), fontWeight: '600', marginLeft: 4 }}>
                        {t.snooze}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => deleteReminder(reminder.id)}
                      style={[styles.smallActionBtn, { backgroundColor: colors.errorContainer }]}
                    >
                      <MaterialIcons name="delete" size={18} color={colors.error} />
                      <Text style={{ color: colors.onErrorContainer, fontSize: scaleFont(14), fontWeight: '600', marginLeft: 4 }}>
                        {t.delete}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Section: Saved Medicines & Quick Safe Reorder */}
        <View style={styles.reorderSection}>
          <Text style={[styles.reorderHeading, { color: colors.onSurface, fontSize: scaleFont(20) }]}>
            {language === 'hi' ? 'दवाइयों का सुरक्षित पुनः ऑर्डर' : language === 'mr' ? 'औषधांची सुरक्षित पुनर्नोंदणी' : 'Safe Medicine Reorder'}
          </Text>
          <Text style={{ color: colors.secondary, fontSize: scaleFont(15), marginBottom: 12 }}>
            {language === 'hi' ? 'सत्यापित डॉक्टर के पर्चे के साथ' : language === 'mr' ? 'तपासलेल्या प्रिस्क्रिप्शनसह' : 'Directly from verified pharmacy with prescription'}
          </Text>

          {mockMedicines.map((med) => (
            <View
              key={med.id}
              style={[styles.medCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
            >
              <View style={styles.medCardTop}>
                <View style={[styles.medIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                  <MaterialIcons name="medication" size={32} color={colors.primaryContainer} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.medName, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                    {med.name}
                  </Text>
                  <Text style={{ color: colors.secondary, fontSize: scaleFont(14) }}>
                    {med.packSize} · {med.pharmacyName}
                  </Text>
                  <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(17), fontWeight: '700', marginTop: 2 }}>
                    ₹{med.price}
                  </Text>
                </View>
              </View>

              <View style={[styles.medCardBottom, { borderTopColor: colors.borderDefault }]}>
                <StatusBadge
                  label={med.requiresPrescription ? t.prescriptionVerified : t.inStock}
                  variant="ready"
                />
                <Pressable
                  onPress={() => {
                    setSelectedMedicine(med);
                    setReorderModalVisible(true);
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`${t.reorderMedicine}: ${med.name}`}
                  style={[styles.reorderBtn, { backgroundColor: colors.primaryContainer }]}
                >
                  <MaterialIcons name="repeat" size={18} color={colors.onPrimary} />
                  <Text style={{ color: colors.onPrimary, fontSize: scaleFont(14), fontWeight: '700', marginLeft: 6 }}>
                    {t.reorderMedicine}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal: Add Reminder */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.surfaceContainerLowest }]}>
            <Text style={[styles.modalHeaderTitle, { color: colors.onSurface, fontSize: scaleFont(22) }]}>
              {t.addReminder}
            </Text>

            <AccessibleInput
              label={language === 'hi' ? 'याद दिलाने का नाम' : language === 'mr' ? 'आठवणीचे नाव' : 'Reminder Title'}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder={language === 'hi' ? 'उदा. बीपी की गोली' : 'e.g. BP Medicine'}
              onMicPress={() => setNewTitle('BP Tablet Telmisartan')}
            />

            <AccessibleInput
              label={language === 'hi' ? 'समय' : language === 'mr' ? 'वेळ' : 'Time'}
              value={newTime}
              onChangeText={setNewTime}
              placeholder="08:00 AM"
            />

            <View style={{ marginTop: 16 }}>
              <AccessibleButton
                label={t.saveChanges}
                variant="primary"
                onPress={handleCreateReminder}
              />
              <AccessibleButton
                label={t.cancel}
                variant="secondary"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Safe Medicine Reorder Confirmation */}
      <Modal visible={reorderModalVisible} transparent animationType="fade" onRequestClose={() => setReorderModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.surfaceContainerLowest }]}>
            <View style={[styles.reorderModalBanner, { backgroundColor: colors.surfaceContainerLow }]}>
              <MaterialIcons name="verified" size={28} color={colors.primaryContainer} />
              <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '700', marginLeft: 8 }}>
                {language === 'hi' ? 'ऑर्डर की पुष्टि करें' : language === 'mr' ? 'ऑर्डर नक्की करा' : 'Confirm Reorder'}
              </Text>
            </View>

            {selectedMedicine && (
              <View style={{ marginVertical: 16 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(20), fontWeight: '700' }}>
                  {selectedMedicine.name}
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15), marginTop: 4 }}>
                  {selectedMedicine.dosageForm} · {selectedMedicine.packSize}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(15), marginTop: 8 }}>
                  Pharmacy: {selectedMedicine.pharmacyName}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(15) }}>
                  Delivery to: Home (B-42 Green Park)
                </Text>
                <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(22), fontWeight: '800', marginTop: 12 }}>
                  Total: ₹{selectedMedicine.price}
                </Text>
              </View>
            )}

            <AccessibleButton
              label={t.confirm}
              variant="primary"
              icon={<MaterialIcons name="check" size={24} color={colors.onPrimary} />}
              onPress={handleConfirmReorder}
            />
            <AccessibleButton
              label={t.cancel}
              variant="secondary"
              onPress={() => setReorderModalVisible(false)}
            />
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  mainHeading: {
    fontWeight: '700',
  },
  subHeading: {
    marginTop: 2,
  },
  addCircleButton: {
    width: 52,
    height: 52,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.full,
  },
  filterText: {
    fontWeight: '600',
  },
  remindersList: {
    marginVertical: 8,
    gap: 12,
  },
  reminderCard: {
    borderRadius: Radii.lg,
    padding: 16,
    elevation: 2,
  },
  reminderTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 8,
  },
  reminderTitle: {
    fontWeight: '700',
  },
  timeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reminderTime: {
    marginLeft: 4,
    fontWeight: '500',
  },
  reminderNotes: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.default,
  },
  emptyCard: {
    padding: 28,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  reorderSection: {
    marginTop: 28,
  },
  reorderHeading: {
    fontWeight: '700',
  },
  medCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
  },
  medCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medIconBox: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medName: {
    fontWeight: '700',
  },
  medCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.md,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: Radii.xl,
    padding: 24,
    elevation: 10,
  },
  modalHeaderTitle: {
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  reorderModalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radii.md,
  },
});
