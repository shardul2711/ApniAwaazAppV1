import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeContext';
import { useAppStore } from '../src/store/useAppStore';
import { getTranslation } from '../src/i18n';
import { AccessibleButton } from '../src/components/common/AccessibleButton';
import { AccessibleInput } from '../src/components/common/AccessibleInput';
import { StatusBadge } from '../src/components/common/StatusBadge';
import { DemoBanner } from '../src/components/common/DemoBanner';
import { mockRideEstimates } from '../src/services/api/MockApiClient';
import { speechService } from '../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../src/theme/tokens';
import { RideEstimate } from '../src/types';

export default function RidesScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    preferences,
    currentRideBooking,
    setCurrentRideBooking,
    cancelRideBooking,
    addActivity,
  } = useAppStore();

  const [pickup, setPickup] = useState(preferences.homeAddress);
  const [destination, setDestination] = useState(preferences.hospitalAddress);
  const [selectedVehicle, setSelectedVehicle] = useState<RideEstimate>(mockRideEstimates[0]);
  const [isBooked, setIsBooked] = useState(!!currentRideBooking && currentRideBooking.status !== 'cancelled');

  const handleConfirmRide = () => {
    const booking = {
      id: `bk-auto-${Date.now()}`,
      vehicleType: selectedVehicle.vehicleType,
      fare: selectedVehicle.estimatedFare,
      pickup,
      destination,
      driverName: 'Ramesh Kumar',
      vehicleNumber: 'DL 1RN 4482',
      driverPhone: '+91 98765 43210',
      etaMinutes: selectedVehicle.etaMinutes,
      status: 'confirmed' as const,
      bookedAt: 'Just now',
    };

    setCurrentRideBooking(booking);
    setIsBooked(true);

    addActivity({
      title: `${selectedVehicle.vehicleType} Booked`,
      subtitle: `${destination} · ${selectedVehicle.estimatedFare}`,
      category: 'ride',
      status: 'succeeded',
      icon: 'local-taxi',
    });

    const spoken =
      language === 'hi'
        ? `${selectedVehicle.vehicleType} बुक हो गया है! चालक रमेश कुमार 4 मिनट में पहुँच रहे हैं।`
        : language === 'mr'
        ? `रिक्षा बुक झाली आहे! चालक रमेश कुमार ४ मिनिटांत येत आहेत.`
        : `${selectedVehicle.vehicleType} booked! Driver Ramesh Kumar arriving in 4 minutes.`;

    speechService.speak(spoken, language);
  };

  const handleCancelRide = () => {
    if (currentRideBooking) {
      cancelRideBooking(currentRideBooking.id);
      addActivity({
        title: 'Ride Cancelled',
        subtitle: currentRideBooking.destination,
        category: 'ride',
        status: 'cancelled',
        icon: 'cancel',
      });
    }
    setIsBooked(false);
    speechService.speak(
      language === 'hi' ? 'सवारी रद्द कर दी गई है।' : 'Ride has been cancelled.',
      language
    );
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
          {t.bookAnAuto}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
        <DemoBanner />

        {isBooked && currentRideBooking ? (
          /* LIVE TRIP CONFIRMED CARD */
          <View style={[styles.confirmedCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={[styles.checkCircleLarge, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="check-circle" size={54} color={colors.primaryContainer} />
            </View>

            <Text style={[styles.confirmedTitle, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {currentRideBooking.vehicleType} Booked!
            </Text>
            <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(18), fontWeight: '700', marginTop: 4 }}>
              Arriving in {currentRideBooking.etaMinutes} minutes
            </Text>

            {/* Driver Card */}
            <View style={[styles.driverBox, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={[styles.driverAvatar, { backgroundColor: colors.primaryContainer }]}>
                <Text style={{ color: colors.onPrimary, fontSize: 18, fontWeight: '700' }}>RK</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(19), fontWeight: '700' }}>
                  {currentRideBooking.driverName}
                </Text>
                <Text style={{ color: colors.secondary, fontSize: scaleFont(15) }}>
                  {currentRideBooking.vehicleNumber} · Bajaj Auto
                </Text>
              </View>
              <MaterialIcons name="electric-rickshaw" size={32} color={colors.primaryContainer} />
            </View>

            <View style={styles.tripSummaryBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="trip-origin" size={18} color={colors.primaryContainer} />
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(15), marginLeft: 8 }}>
                  Pickup: {currentRideBooking.pickup}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <MaterialIcons name="location-on" size={18} color={colors.error} />
                <Text style={{ color: colors.onSurface, fontSize: scaleFont(15), marginLeft: 8 }}>
                  Destination: {currentRideBooking.destination}
                </Text>
              </View>
            </View>

            <View style={{ width: '100%', marginTop: 20 }}>
              <AccessibleButton
                label={t.callDriver}
                variant="primary"
                icon={<MaterialIcons name="call" size={24} color={colors.onPrimary} />}
                onPress={() => Linking.openURL(`tel:${currentRideBooking.driverPhone.replace(/\s+/g, '')}`)}
              />
              <AccessibleButton
                label="Cancel Ride"
                variant="destructive"
                onPress={handleCancelRide}
              />
            </View>
          </View>
        ) : (
          /* RIDE PLANNING & ESTIMATE FORM */
          <View>
            <Text style={[styles.heading, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {t.tripPreview}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 2, marginBottom: 14 }}>
              {language === 'hi' ? 'स्थान चुनें और किराया देखें' : 'Pick locations and view estimate'}
            </Text>

            {/* Location Inputs */}
            <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
              <AccessibleInput
                label={t.pickupLocation}
                value={pickup}
                onChangeText={setPickup}
                onMicPress={() => setPickup('Home (B-42 Green Park)')}
              />

              <AccessibleInput
                label={t.destination}
                value={destination}
                onChangeText={setDestination}
                onMicPress={() => setDestination('Max Super Speciality Hospital')}
              />
            </View>

            {/* Vehicle Options */}
            <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '700', marginTop: 18, marginBottom: 10 }}>
              {language === 'hi' ? 'सवारी का प्रकार' : 'Vehicle Options'}
            </Text>

            {mockRideEstimates.map((est) => {
              const isSelected = selectedVehicle.id === est.id;
              return (
                <Pressable
                  key={est.id}
                  onPress={() => setSelectedVehicle(est)}
                  style={[
                    styles.vehicleCard,
                    {
                      backgroundColor: isSelected ? colors.listeningHighlight : colors.surfaceContainerLowest,
                      borderColor: isSelected ? colors.primaryContainer : colors.borderDefault,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[styles.vehicleIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                    <MaterialIcons
                      name={est.vehicleType === 'Auto Rickshaw' ? 'electric-rickshaw' : 'local-taxi'}
                      size={32}
                      color={colors.primaryContainer}
                    />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.vehicleName, { color: colors.onSurface, fontSize: scaleFont(18) }]}>
                      {est.vehicleType}
                    </Text>
                    <Text style={{ color: colors.secondary, fontSize: scaleFont(14) }}>
                      Arriving in {est.etaMinutes} mins
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.onSurface, fontSize: scaleFont(19), fontWeight: '700' }}>
                      {est.estimatedFare}
                    </Text>
                    <Text style={{ color: colors.secondary, fontSize: scaleFont(13) }}>
                      Cash / UPI
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            {/* Confirmation CTA */}
            <View style={{ marginTop: 24 }}>
              <AccessibleButton
                label={t.confirmAndBook}
                variant="primary"
                icon={<MaterialIcons name="check-circle" size={24} color={colors.onPrimary} />}
                onPress={handleConfirmRide}
              />
            </View>
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
  card: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.lg,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
  },
  vehicleIconBox: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleName: {
    fontWeight: '700',
  },
  confirmedCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
  },
  checkCircleLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmedTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderRadius: Radii.md,
    marginVertical: 18,
  },
  driverAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripSummaryBox: {
    width: '100%',
    paddingHorizontal: 8,
  },
});
