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
import { useAppStore } from '../src/store/useAppStore';
import { getTranslation } from '../src/i18n';
import { AccessibleButton } from '../src/components/common/AccessibleButton';
import { DemoBanner } from '../src/components/common/DemoBanner';
import { mockFoodItems } from '../src/services/api/MockApiClient';
import { speechService } from '../src/services/speech/SpeechService';
import { HitTargets, Radii } from '../src/theme/tokens';
import { FoodItem } from '../src/types';

export default function GroceriesScreen() {
  const { colors, language, scaleFont } = useTheme();
  const t = getTranslation(language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    cart,
    addToCart,
    updateCartQuantity,
    clearCart,
    addFoodOrder,
    addActivity,
  } = useAppStore();

  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = cartSubtotal > 0 ? 15 : 0;
  const totalAmount = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = {
      id: `ord-food-${Date.now()}`,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      total: totalAmount,
      deliveryAddress: 'Home (B-42 Green Park)',
      estimatedDeliveryMinutes: 25,
      status: 'confirmed' as const,
      placedAt: 'Just now',
      partnerName: 'Blinkit Store Green Park',
    };

    addFoodOrder(order);
    addActivity({
      title: 'Groceries Ordered',
      subtitle: `${cart.length} items · Total ₹${totalAmount}`,
      category: 'grocery',
      status: 'succeeded',
      icon: 'shopping-basket',
    });

    setOrderConfirmed(true);
    clearCart();

    const spoken =
      language === 'hi'
        ? 'किराने का सामान सफलतापूर्वक ऑर्डर हो गया है! 25 मिनट में आ रहा है।'
        : language === 'mr'
        ? 'किराणा ऑर्डर यशस्वी झाली आहे! २५ मिनिटांत येत आहे.'
        : 'Groceries ordered successfully! Arriving in 25 minutes.';

    speechService.speak(spoken, language);
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
          {t.capGroceries}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]}>
        <DemoBanner />

        {orderConfirmed ? (
          /* ORDER CONFIRMATION SCREEN */
          <View style={[styles.confirmedCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}>
            <View style={[styles.checkCircleLarge, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="check-circle" size={54} color={colors.primaryContainer} />
            </View>

            <Text style={[styles.confirmedTitle, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {t.orderConfirmed}
            </Text>
            <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(18), fontWeight: '700', marginTop: 4 }}>
              Delivery in 25 minutes
            </Text>
            <Text style={{ color: colors.secondary, fontSize: scaleFont(15), marginTop: 8, textAlign: 'center' }}>
              Delivering to Home (B-42 Green Park) from Blinkit Store
            </Text>

            <View style={{ width: '100%', marginTop: 24 }}>
              <AccessibleButton
                label={t.imReady}
                variant="primary"
                onPress={() => {
                  setOrderConfirmed(false);
                  router.replace('/(tabs)');
                }}
              />
            </View>
          </View>
        ) : (
          /* CATALOG & CART REVIEW FLOW */
          <View>
            <Text style={[styles.heading, { color: colors.onSurface, fontSize: scaleFont(24) }]}>
              {language === 'hi' ? 'दैनिक किराना और फल' : language === 'mr' ? 'दैनिक किराणा आणि फळे' : 'Daily Groceries'}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: scaleFont(16), marginTop: 2, marginBottom: 14 }}>
              {language === 'hi' ? 'ताज़ा दूध, आटा और फल जोड़ें' : 'Staples, dairy and fresh items'}
            </Text>

            {/* Catalog Items */}
            <View style={{ gap: 10 }}>
              {mockFoodItems.map((item) => {
                const cartEntry = cart.find((c) => c.item.id === item.id);
                const quantity = cartEntry ? cartEntry.quantity : 0;

                return (
                  <View
                    key={item.id}
                    style={[styles.itemCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.borderDefault }]}
                  >
                    <View style={[styles.itemIconBox, { backgroundColor: colors.surfaceContainerLow }]}>
                      <MaterialIcons name="shopping-bag" size={28} color={colors.primaryContainer} />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.itemName, { color: colors.onSurface, fontSize: scaleFont(17) }]}>
                        {language === 'hi' && item.hindiName ? item.hindiName : language === 'mr' && item.marathiName ? item.marathiName : item.name}
                      </Text>
                      <Text style={{ color: colors.secondary, fontSize: scaleFont(14) }}>
                        {item.unit}
                      </Text>
                      <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(18), fontWeight: '700', marginTop: 2 }}>
                        ₹{item.price}
                      </Text>
                    </View>

                    {/* Quantity Selector */}
                    {quantity > 0 ? (
                      <View style={[styles.quantityBox, { backgroundColor: colors.surfaceContainer }]}>
                        <Pressable
                          onPress={() => updateCartQuantity(item.id, quantity - 1)}
                          style={styles.qtyBtn}
                        >
                          <MaterialIcons name="remove" size={20} color={colors.primaryContainer} />
                        </Pressable>
                        <Text style={[styles.qtyText, { color: colors.onSurface, fontSize: scaleFont(17) }]}>
                          {quantity}
                        </Text>
                        <Pressable
                          onPress={() => updateCartQuantity(item.id, quantity + 1)}
                          style={styles.qtyBtn}
                        >
                          <MaterialIcons name="add" size={20} color={colors.primaryContainer} />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => addToCart(item)}
                        style={[styles.addBtn, { backgroundColor: colors.primaryContainer }]}
                      >
                        <MaterialIcons name="add" size={20} color={colors.onPrimary} />
                        <Text style={{ color: colors.onPrimary, fontSize: scaleFont(15), fontWeight: '700', marginLeft: 4 }}>
                          Add
                        </Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Cart Summary & Confirmation */}
            {cart.length > 0 && (
              <View style={[styles.cartSummaryCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.primaryContainer }]}>
                <Text style={[styles.cartHeading, { color: colors.onSurface, fontSize: scaleFont(20) }]}>
                  {t.cartTotal} ({cart.length} items)
                </Text>

                <View style={styles.breakdownRow}>
                  <Text style={{ color: colors.secondary, fontSize: scaleFont(15) }}>Items Subtotal</Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '600' }}>₹{cartSubtotal}</Text>
                </View>

                <View style={styles.breakdownRow}>
                  <Text style={{ color: colors.secondary, fontSize: scaleFont(15) }}>Delivery Charge</Text>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(17), fontWeight: '600' }}>₹{deliveryFee}</Text>
                </View>

                <View style={[styles.breakdownRow, { borderTopWidth: 1, borderTopColor: colors.borderDefault, paddingTop: 8, marginTop: 4 }]}>
                  <Text style={{ color: colors.onSurface, fontSize: scaleFont(18), fontWeight: '700' }}>Total Amount</Text>
                  <Text style={{ color: colors.primaryContainer, fontSize: scaleFont(22), fontWeight: '800' }}>₹{totalAmount}</Text>
                </View>

                <View style={{ marginTop: 16 }}>
                  <AccessibleButton
                    label={t.placeOrder}
                    variant="primary"
                    icon={<MaterialIcons name="check" size={24} color={colors.onPrimary} />}
                    onPress={handleCheckout}
                  />
                </View>
              </View>
            )}
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    elevation: 2,
  },
  itemIconBox: {
    width: 50,
    height: 50,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.md,
    minHeight: 44,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  cartSummaryCard: {
    borderRadius: Radii.lg,
    borderWidth: 2,
    padding: 18,
    marginTop: 20,
    elevation: 3,
  },
  cartHeading: {
    fontWeight: '700',
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  confirmedCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    marginTop: 20,
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
});
