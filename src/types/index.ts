/**
 * Domain Models for Apni Awaaz
 */

export type LanguageCode = 'mr' | 'hi' | 'en';
export type TextScale = 'standard' | 'large' | 'xlarge';
export type SpeechSpeed = 'slow' | 'normal' | 'fast';

export type ActionLifecycle =
  | 'draft'
  | 'awaiting_confirmation'
  | 'submitting'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export interface UserPreferences {
  elderName: string;
  preferredLanguage: LanguageCode;
  textScale: TextScale;
  speechSpeed: SpeechSpeed;
  highContrast: boolean;
  voiceAssistActive: boolean;
  primaryCaregiverName: string;
  primaryCaregiverPhone: string;
  homeAddress: string;
  hospitalAddress: string;
  pharmacyName: string;
  enabledCapabilities: {
    rideBooking: boolean;
    groceryOrdering: boolean;
    medicineRefill: boolean;
    contactSaving: boolean;
    familyCalling: boolean;
  };
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimaryCaregiver?: boolean;
  avatarUrl?: string;
  quickDialEnabled?: boolean;
}

export type ReminderCategory = 'medicine' | 'prayer' | 'food' | 'family' | 'walk' | 'other';
export type ReminderStatus = 'pending' | 'completed' | 'snoozed' | 'dismissed';

export interface Reminder {
  id: string;
  title: string;
  time: string; // e.g., "08:30 AM"
  date?: string; // e.g., "2026-11-22"
  category: ReminderCategory;
  repeat: 'daily' | 'weekdays' | 'once';
  status: ReminderStatus;
  notes?: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioUrl?: string;
}

export type VoiceState =
  | 'ready'
  | 'listening'
  | 'processing'
  | 'review'
  | 'result'
  | 'recovery';

export interface AssistantAction {
  id: string;
  type: 'book_ride' | 'order_grocery' | 'refill_medicine' | 'call_contact' | 'set_reminder';
  lifecycle: ActionLifecycle;
  title: string;
  summary: string;
  spokenSummary: string;
  details: Record<string, any>;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  marathiName?: string;
  category: 'staples' | 'dairy' | 'vegetables' | 'fruits' | 'snacks';
  price: number;
  unit: string;
  imageUrl?: string;
  inStock: boolean;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export interface FoodOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  estimatedDeliveryMinutes: number;
  status: 'draft' | 'awaiting_confirmation' | 'confirmed' | 'packing' | 'dispatched' | 'delivered' | 'cancelled';
  placedAt?: string;
  partnerName: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  strength: string; // e.g., "500 mg"
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Drops' | 'Ointment';
  packSize: string; // e.g., "Strip of 10 tablets"
  price: number;
  requiresPrescription: boolean;
  instructions: string;
  inStock: boolean;
  pharmacyName: string;
}

export interface MedicineOrder {
  id: string;
  medicine: Medicine;
  quantity: number;
  totalPrice: number;
  deliveryAddress: string;
  pharmacyName: string;
  prescriptionStatus: 'verified' | 'pending_verification' | 'not_required';
  status: 'draft' | 'awaiting_confirmation' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  orderedAt?: string;
}

export interface RideEstimate {
  id: string;
  vehicleType: 'Auto Rickshaw' | 'Sedan Cab' | 'Mini Cab';
  estimatedFare: string; // e.g., "₹85 - ₹95"
  numericMinFare: number;
  numericMaxFare: number;
  etaMinutes: number;
  pickup: string;
  destination: string;
}

export interface RideBooking {
  id: string;
  vehicleType: string;
  fare: string;
  pickup: string;
  destination: string;
  driverName: string;
  vehicleNumber: string;
  driverPhone: string;
  etaMinutes: number;
  status: 'draft' | 'awaiting_confirmation' | 'confirmed' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
  bookedAt?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'ride' | 'medicine' | 'grocery' | 'call' | 'reminder';
  status: ActionLifecycle;
  timestamp: string;
  icon: string;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
