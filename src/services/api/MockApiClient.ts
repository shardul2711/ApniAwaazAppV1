import {
  AssistantAction,
  FoodItem,
  Medicine,
  RideEstimate,
  RideBooking,
  LanguageCode,
} from '../../types';

export const mockFoodItems: FoodItem[] = [
  {
    id: 'f1',
    name: 'Toned Fresh Milk (1L)',
    hindiName: 'ताज़ा दूध (१ लीटर)',
    marathiName: 'ताजे दूध (१ लिटर)',
    category: 'dairy',
    price: 36,
    unit: '1 Packet',
    inStock: true,
  },
  {
    id: 'f2',
    name: 'Aashirvaad Shudh Chakki Atta (5kg)',
    hindiName: 'आशीर्वाद चक्की आटा (५ किग्रा)',
    marathiName: 'आशीर्वाद चक्की पीठ (५ किलो)',
    category: 'staples',
    price: 245,
    unit: '5 kg Bag',
    inStock: true,
  },
  {
    id: 'f3',
    name: 'Tata Salt (1kg)',
    hindiName: 'टाटा नमक (१ किग्रा)',
    marathiName: 'टाटा मीठ (१ किलो)',
    category: 'staples',
    price: 28,
    unit: '1 kg Packet',
    inStock: true,
  },
  {
    id: 'f4',
    name: 'Fresh Ripe Bananas (1 Dozen)',
    hindiName: 'ताज़े केले (१ दर्जन)',
    marathiName: 'ताजी केळी (१ डझन)',
    category: 'fruits',
    price: 60,
    unit: '12 pcs',
    inStock: true,
  },
];

export const mockMedicines: Medicine[] = [
  {
    id: 'm1',
    name: 'Telmisartan Tablets IP 40mg',
    genericName: 'Telmisartan',
    strength: '40 mg',
    dosageForm: 'Tablet',
    packSize: 'Strip of 15 tablets',
    price: 110,
    requiresPrescription: true,
    instructions: '1 tablet once daily in morning after breakfast',
    inStock: true,
    pharmacyName: 'Apollo Pharmacy Green Park',
  },
  {
    id: 'm2',
    name: 'Shelcal 500 Calcium with Vitamin D3',
    genericName: 'Calcium + Cholecalciferol',
    strength: '500 mg',
    dosageForm: 'Tablet',
    packSize: 'Strip of 15 tablets',
    price: 135,
    requiresPrescription: false,
    instructions: '1 tablet daily at night after dinner',
    inStock: true,
    pharmacyName: 'Apollo Pharmacy Green Park',
  },
  {
    id: 'm3',
    name: 'Paracetamol 650mg (Dolo)',
    genericName: 'Paracetamol',
    strength: '650 mg',
    dosageForm: 'Tablet',
    packSize: 'Strip of 15 tablets',
    price: 32,
    requiresPrescription: false,
    instructions: 'As advised by doctor for fever or body ache',
    inStock: true,
    pharmacyName: 'Apollo Pharmacy Green Park',
  },
];

export const mockRideEstimates: RideEstimate[] = [
  {
    id: 'r-auto',
    vehicleType: 'Auto Rickshaw',
    estimatedFare: '₹85 - ₹95',
    numericMinFare: 85,
    numericMaxFare: 95,
    etaMinutes: 4,
    pickup: 'Home (B-42 Green Park)',
    destination: 'Max Super Speciality Hospital',
  },
  {
    id: 'r-cab',
    vehicleType: 'Sedan Cab',
    estimatedFare: '₹140 - ₹160',
    numericMinFare: 140,
    numericMaxFare: 160,
    etaMinutes: 6,
    pickup: 'Home (B-42 Green Park)',
    destination: 'Max Super Speciality Hospital',
  },
];

/**
 * Natural language intent parser for elderly voice queries
 */
export function parseVoiceIntent(query: string, language: LanguageCode): {
  spokenResponse: string;
  action: AssistantAction;
} {
  const lower = query.toLowerCase();

  // Intent 1: Ride Booking (Auto / Cab)
  if (
    lower.includes('auto') ||
    lower.includes('cab') ||
    lower.includes('hospital') ||
    lower.includes('ऑटो') ||
    lower.includes('रिक्षा') ||
    lower.includes('गाड़ी') ||
    lower.includes('ride')
  ) {
    const spoken =
      language === 'mr'
        ? 'मी हॉस्पिटलसाठी रिक्षाचा अंदाज तयार केला आहे. अंदाजे भाडे ८५ ते ९५ रुपये आहे. काय मी नक्की करू?'
        : language === 'hi'
        ? 'मैंने मैक्स अस्पताल के लिए ऑटो का विवरण तैयार कर दिया है। अनुमानित किराया ₹85 से ₹95 है। क्या मैं बुक कर दूँ?'
        : 'I have prepared trip details for an auto to Max Hospital. Estimated fare is ₹85 to ₹95. Shall I confirm and book?';

    return {
      spokenResponse: spoken,
      action: {
        id: `act-ride-${Date.now()}`,
        type: 'book_ride',
        lifecycle: 'awaiting_confirmation',
        title: 'Book an Auto',
        summary: 'Auto to Max Super Speciality Hospital',
        spokenSummary: spoken,
        details: {
          pickup: 'Home (B-42 Green Park)',
          destination: 'Max Super Speciality Hospital',
          fare: '₹85 - ₹95',
          etaMinutes: 4,
          driverName: 'Ramesh Kumar',
          vehicleNumber: 'DL 1RN 4482',
          driverPhone: '+91 98765 43210',
        },
        createdAt: new Date().toISOString(),
      },
    };
  }

  // Intent 2: Medicine Refill
  if (
    lower.includes('medicine') ||
    lower.includes('dawa') ||
    lower.includes('dawai') ||
    lower.includes('दवा') ||
    lower.includes('औषध') ||
    lower.includes('refill')
  ) {
    const spoken =
      language === 'mr'
        ? 'मी आपल्या अपोलो फार्मसीमधून बीपीचे औषध पुन्हा मागवण्यासाठी तयार केले आहे. नक्की करू का?'
        : language === 'hi'
        ? 'मैंने अपोलो फार्मेसी से आपकी बीपी की दवा मँगवाने का पर्चा तैयार कर दिया है। कुल ₹110 है। क्या ऑर्डर कर दूँ?'
        : 'I have prepared your BP medicine refill from Apollo Pharmacy for ₹110. Shall I place the order?';

    return {
      spokenResponse: spoken,
      action: {
        id: `act-med-${Date.now()}`,
        type: 'refill_medicine',
        lifecycle: 'awaiting_confirmation',
        title: 'Refill BP Medicine',
        summary: 'Telmisartan 40mg (Strip of 15)',
        spokenSummary: spoken,
        details: {
          medicineName: 'Telmisartan 40mg',
          pharmacy: 'Apollo Pharmacy Green Park',
          price: 110,
          prescriptionVerified: true,
        },
        createdAt: new Date().toISOString(),
      },
    };
  }

  // Intent 3: Call Family
  if (
    lower.includes('call') ||
    lower.includes('phone') ||
    lower.includes('beti') ||
    lower.includes('daughter') ||
    lower.includes('ananya') ||
    lower.includes('कॉल') ||
    lower.includes('फोन')
  ) {
    const spoken =
      language === 'mr'
        ? 'मी मुलगी अनन्याला फोन लावत आहे. फोन करू का?'
        : language === 'hi'
        ? 'मैं आपकी बेटी अनन्या को कॉल मिला रही हूँ। क्या मैं मिला दूँ?'
        : 'I am preparing to call your daughter Ananya. Shall I dial?';

    return {
      spokenResponse: spoken,
      action: {
        id: `act-call-${Date.now()}`,
        type: 'call_contact',
        lifecycle: 'awaiting_confirmation',
        title: 'Call Daughter Ananya',
        summary: 'Direct dial to Ananya Sharma (+91 98712 34560)',
        spokenSummary: spoken,
        details: {
          contactName: 'Ananya Sharma',
          phone: '+91 98712 34560',
          relationship: 'Daughter',
        },
        createdAt: new Date().toISOString(),
      },
    };
  }

  // Default Fallback: Groceries or General
  const spoken =
    language === 'mr'
      ? 'मी ताज्या दुधाची ऑर्डर तयार केली आहे. किंमत ३६ रुपये आहे. नक्की करू का?'
      : language === 'hi'
      ? 'मैंने ताज़ा दूध का ऑर्डर तैयार किया है। कुल ₹36 है। क्या मैं मँगवा दूँ?'
      : 'I have prepared an order for 1L fresh milk for ₹36. Shall I place the order?';

  return {
    spokenResponse: spoken,
    action: {
      id: `act-grocery-${Date.now()}`,
      type: 'order_grocery',
      lifecycle: 'awaiting_confirmation',
      title: 'Order Fresh Milk',
      summary: 'Toned Fresh Milk 1L from Blinkit Store',
      spokenSummary: spoken,
      details: {
        itemName: 'Toned Fresh Milk (1L)',
        price: 36,
        partner: 'Blinkit Green Park',
      },
      createdAt: new Date().toISOString(),
    },
  };
}
