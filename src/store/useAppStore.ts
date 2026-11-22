import { create } from 'zustand';
import {
  UserPreferences,
  Contact,
  Reminder,
  ConversationMessage,
  VoiceState,
  AssistantAction,
  CartItem,
  FoodOrder,
  MedicineOrder,
  RideBooking,
  ActivityItem,
  LanguageCode,
  TextScale,
  SpeechSpeed,
} from '../types';

interface AppState {
  // Preferences
  preferences: UserPreferences;
  setLanguage: (lang: LanguageCode) => void;
  setTextScale: (scale: TextScale) => void;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  setHighContrast: (highContrast: boolean) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;

  // Voice Interaction
  voiceState: VoiceState;
  transcript: string;
  assistantResponse: string;
  activeAction: AssistantAction | null;
  conversationHistory: ConversationMessage[];
  setVoiceState: (state: VoiceState) => void;
  setTranscript: (text: string) => void;
  setAssistantResponse: (resp: string) => void;
  setActiveAction: (action: AssistantAction | null) => void;
  addMessage: (msg: ConversationMessage) => void;
  resetVoiceSession: () => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  removeContact: (id: string) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminderComplete: (id: string) => void;
  snoozeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Cart & Food Orders
  cart: CartItem[];
  addToCart: (item: CartItem['item']) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  foodOrders: FoodOrder[];
  addFoodOrder: (order: FoodOrder) => void;

  // Medicine Orders
  medicineOrders: MedicineOrder[];
  addMedicineOrder: (order: MedicineOrder) => void;

  // Ride Bookings
  currentRideBooking: RideBooking | null;
  setCurrentRideBooking: (booking: RideBooking | null) => void;
  cancelRideBooking: (id: string) => void;

  // Activity Log
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
}

const initialPreferences: UserPreferences = {
  elderName: 'Meera',
  preferredLanguage: 'hi',
  textScale: 'standard',
  speechSpeed: 'normal',
  highContrast: false,
  voiceAssistActive: true,
  primaryCaregiverName: 'Ananya Sharma',
  primaryCaregiverPhone: '+91 98712 34560',
  homeAddress: 'Home (B-42 Green Park)',
  hospitalAddress: 'Max Super Speciality Hospital',
  pharmacyName: 'Apollo Pharmacy Green Park',
  enabledCapabilities: {
    rideBooking: true,
    groceryOrdering: true,
    medicineRefill: true,
    contactSaving: true,
    familyCalling: true,
  },
};

const initialContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Ananya Sharma',
    relationship: 'Daughter (बेटी)',
    phone: '+91 98712 34560',
    isPrimaryCaregiver: true,
    quickDialEnabled: true,
  },
  {
    id: 'c2',
    name: 'Dr. Mehta',
    relationship: 'Family Doctor',
    phone: '+91 98110 12345',
    quickDialEnabled: true,
  },
  {
    id: 'c3',
    name: 'Rohan Sharma',
    relationship: 'Son (बेटा)',
    phone: '+91 98200 54321',
    quickDialEnabled: true,
  },
];

const initialReminders: Reminder[] = [
  {
    id: 'r1',
    title: 'BP Medicine (Telmisartan 40mg)',
    time: '08:00 AM',
    category: 'medicine',
    repeat: 'daily',
    status: 'completed',
    notes: 'Take after morning tea',
  },
  {
    id: 'r2',
    title: 'Evening Walk in Garden',
    time: '05:30 PM',
    category: 'walk',
    repeat: 'daily',
    status: 'pending',
    notes: 'Wear comfortable shoes',
  },
  {
    id: 'r3',
    title: 'Calcium Tablet',
    time: '08:30 PM',
    category: 'medicine',
    repeat: 'daily',
    status: 'pending',
    notes: 'After dinner with water',
  },
];

const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Auto Booked to Max Hospital',
    subtitle: 'DL 1RN 4482 · Ramesh Kumar',
    category: 'ride',
    status: 'succeeded',
    timestamp: 'Today, 9:45 AM',
    icon: 'local-taxi',
  },
  {
    id: 'act-2',
    title: 'BP Tablet Reminder Confirmed',
    subtitle: 'Taken at 8:05 AM',
    category: 'reminder',
    status: 'succeeded',
    timestamp: 'Today, 8:05 AM',
    icon: 'medication',
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  preferences: initialPreferences,
  setLanguage: (lang) =>
    set((state) => ({ preferences: { ...state.preferences, preferredLanguage: lang } })),
  setTextScale: (scale) =>
    set((state) => ({ preferences: { ...state.preferences, textScale: scale } })),
  setSpeechSpeed: (speed) =>
    set((state) => ({ preferences: { ...state.preferences, speechSpeed: speed } })),
  setHighContrast: (highContrast) =>
    set((state) => ({ preferences: { ...state.preferences, highContrast } })),
  updatePreferences: (prefs) =>
    set((state) => ({ preferences: { ...state.preferences, ...prefs } })),

  voiceState: 'ready',
  transcript: '',
  assistantResponse: '',
  activeAction: null,
  conversationHistory: [],
  setVoiceState: (state) => set({ voiceState: state }),
  setTranscript: (text) => set({ transcript: text }),
  setAssistantResponse: (resp) => set({ assistantResponse: resp }),
  setActiveAction: (action) => set({ activeAction: action }),
  addMessage: (msg) =>
    set((state) => ({ conversationHistory: [...state.conversationHistory, msg] })),
  resetVoiceSession: () =>
    set({
      voiceState: 'ready',
      transcript: '',
      assistantResponse: '',
      activeAction: null,
    }),

  contacts: initialContacts,
  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, { ...contact, id: `c-${Date.now()}` }],
    })),
  updateContact: (id, contact) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...contact } : c)),
    })),
  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  reminders: initialReminders,
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [
        { ...reminder, id: `r-${Date.now()}`, status: 'pending' },
        ...state.reminders,
      ],
    })),
  toggleReminderComplete: (id) =>
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'completed' ? 'pending' : 'completed' }
          : r
      ),
    })),
  snoozeReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, status: 'snoozed' } : r
      ),
    })),
  deleteReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id),
    })),

  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.item.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { cart: [...state.cart, { item, quantity: 1 }] };
    }),
  updateCartQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((c) => c.item.id !== itemId) };
      }
      return {
        cart: state.cart.map((c) =>
          c.item.id === itemId ? { ...c, quantity } : c
        ),
      };
    }),
  clearCart: () => set({ cart: [] }),
  foodOrders: [],
  addFoodOrder: (order) =>
    set((state) => ({ foodOrders: [order, ...state.foodOrders] })),

  medicineOrders: [],
  addMedicineOrder: (order) =>
    set((state) => ({ medicineOrders: [order, ...state.medicineOrders] })),

  currentRideBooking: null,
  setCurrentRideBooking: (booking) => set({ currentRideBooking: booking }),
  cancelRideBooking: (id) =>
    set((state) => ({
      currentRideBooking:
        state.currentRideBooking?.id === id
          ? { ...state.currentRideBooking, status: 'cancelled' }
          : state.currentRideBooking,
    })),

  activities: initialActivities,
  addActivity: (act) =>
    set((state) => ({
      activities: [
        {
          ...act,
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
        },
        ...state.activities,
      ],
    })),
}));
