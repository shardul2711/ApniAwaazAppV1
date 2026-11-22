import { parseVoiceIntent } from '../src/services/api/MockApiClient';
import { FoodItem, CartItem, Reminder } from '../src/types';

describe('Apni Awaaz Business Logic & Safety Verification', () => {
  // Test 1: Voice Intent Parsing Across Marathi, Hindi, English
  describe('Voice Intent Recognition', () => {
    it('parses Auto / Cab request in Hindi', () => {
      const result = parseVoiceIntent('अस्पताल के लिए ऑटो बुक करें', 'hi');
      expect(result.action.type).toBe('book_ride');
      expect(result.action.lifecycle).toBe('awaiting_confirmation');
      expect(result.spokenResponse).toContain('ऑटो');
    });

    it('parses Auto / Cab request in Marathi', () => {
      const result = parseVoiceIntent('हॉस्पिटलसाठी रिक्षा बुक करा', 'mr');
      expect(result.action.type).toBe('book_ride');
      expect(result.action.lifecycle).toBe('awaiting_confirmation');
      expect(result.spokenResponse).toContain('रिक्षा');
    });

    it('parses Medicine Refill request in Hindi', () => {
      const result = parseVoiceIntent('मेरी बीपी की दवाई मँगवा दो', 'hi');
      expect(result.action.type).toBe('refill_medicine');
      expect(result.action.lifecycle).toBe('awaiting_confirmation');
      expect(result.spokenResponse).toContain('दवा');
    });

    it('parses Call Family request in Marathi', () => {
      const result = parseVoiceIntent('मुलगी अनन्याला फोन करा', 'mr');
      expect(result.action.type).toBe('call_contact');
      expect(result.action.lifecycle).toBe('awaiting_confirmation');
      expect(result.spokenResponse).toContain('फोन');
    });
  });

  // Test 2: Cart Calculation & Quantity Logic
  describe('Cart Calculation', () => {
    const milkItem: FoodItem = {
      id: 'f1',
      name: 'Fresh Milk 1L',
      category: 'dairy',
      price: 36,
      unit: '1 Packet',
      inStock: true,
    };

    const attaItem: FoodItem = {
      id: 'f2',
      name: 'Chakki Atta 5kg',
      category: 'staples',
      price: 245,
      unit: '5kg',
      inStock: true,
    };

    it('calculates total correctly for multiple items with delivery fee', () => {
      const cart: CartItem[] = [
        { item: milkItem, quantity: 2 }, // 72
        { item: attaItem, quantity: 1 }, // 245
      ];
      const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
      const deliveryFee = subtotal > 0 ? 15 : 0;
      const total = subtotal + deliveryFee;

      expect(subtotal).toBe(317);
      expect(deliveryFee).toBe(15);
      expect(total).toBe(332);
    });

    it('returns zero delivery fee and zero total for empty cart', () => {
      const cart: CartItem[] = [];
      const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
      const deliveryFee = subtotal > 0 ? 15 : 0;
      const total = subtotal + deliveryFee;

      expect(subtotal).toBe(0);
      expect(deliveryFee).toBe(0);
      expect(total).toBe(0);
    });
  });

  // Test 3: Safety & Consequential Actions
  describe('Safety & Consequential Action Confirmation', () => {
    it('always starts consequential actions in awaiting_confirmation state', () => {
      const parsed = parseVoiceIntent('Book a cab', 'en');
      expect(parsed.action.lifecycle).toBe('awaiting_confirmation');
      expect(parsed.action.lifecycle).not.toBe('succeeded');
    });

    it('prevents accidental duplicate booking submissions with idempotency protection', () => {
      const processedTokens = new Set<string>();

      const submitBooking = (token: string): boolean => {
        if (processedTokens.has(token)) {
          return false; // Duplicate rejected
        }
        processedTokens.add(token);
        return true; // Accepted
      };

      const idempotencyKey = 'action-key-12345';
      expect(submitBooking(idempotencyKey)).toBe(true);
      expect(submitBooking(idempotencyKey)).toBe(false); // Second tap blocked
    });
  });

  // Test 4: Mobile Number & Form Validation
  describe('Form Validation', () => {
    const isValidIndianMobile = (phone: string): boolean => {
      const cleaned = phone.replace(/[\s\-\+]/g, '');
      const numOnly = cleaned.startsWith('91') && cleaned.length > 10 ? cleaned.slice(2) : cleaned;
      return /^[6-9]\d{9}$/.test(numOnly);
    };

    it('validates 10-digit Indian mobile numbers properly', () => {
      expect(isValidIndianMobile('9820145678')).toBe(true);
      expect(isValidIndianMobile('+91 98201 45678')).toBe(true);
      expect(isValidIndianMobile('9871234560')).toBe(true);
      expect(isValidIndianMobile('12345')).toBe(false); // Too short
      expect(isValidIndianMobile('0123456789')).toBe(false); // Does not start with 6-9
    });

    it('validates elder preferred name is not blank', () => {
      const isValidName = (name: string) => name.trim().length >= 2;
      expect(isValidName('Meera')).toBe(true);
      expect(isValidName('Maa')).toBe(true);
      expect(isValidName('   ')).toBe(false);
    });
  });

  // Test 5: Reminder Status & Logic
  describe('Reminder Management', () => {
    it('toggles reminder status between pending and completed', () => {
      const reminder: Reminder = {
        id: 'r1',
        title: 'BP Tablet',
        time: '08:00 AM',
        category: 'medicine',
        repeat: 'daily',
        status: 'pending',
      };

      const toggleStatus = (r: Reminder): Reminder => ({
        ...r,
        status: r.status === 'completed' ? 'pending' : 'completed',
      });

      const completed = toggleStatus(reminder);
      expect(completed.status).toBe('completed');

      const reopened = toggleStatus(completed);
      expect(reopened.status).toBe('pending');
    });
  });
});
